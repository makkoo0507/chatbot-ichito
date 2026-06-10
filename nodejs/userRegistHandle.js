'use strict';
const { google } = require('googleapis');
const line = require('@line/bot-sdk');

const SPREADSHEET_ID = '1UOmGtPvdFLK75Jc1cuOfiWj6MTsfm5C0IQwfT_Tiwn8';
const SHEET_NAME = 'Sheet1';

const credentials = process.env.GOOGLE_CREDENTIALS_JSON
    ? JSON.parse(process.env.GOOGLE_CREDENTIALS_JSON)
    : require(__dirname + '/line-bot-498911-6947bbf3145d.json');

const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const client = new line.Client({
    channelSecret: process.env.LINE_CHANNEL_SECRET,
    channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
});

// B列(LINE ID)を読んで登録済みか確認
async function getRegisteredIds() {
    const sheets = google.sheets({ version: 'v4', auth });
    const res = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!B:B`,
    });
    const rows = res.data.values || [];
    return rows.map(row => row[0]);
}

async function appendUser(displayName, userId, pictureUrl) {
    const sheets = google.sheets({ version: 'v4', auth });
    const now = new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });
    await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!A:D`,
        valueInputOption: 'RAW',
        resource: {
            values: [[displayName, userId, pictureUrl || '', now]],
        },
    });
}

async function userRegistHandle(event) {
    if (event.type !== 'follow' && event.type !== 'message') return;

    const userId = event.source.userId;
    if (!userId) return;

    try {
        const registeredIds = await getRegisteredIds();
        if (registeredIds.includes(userId)) return; // 登録済みはスキップ

        const profile = await client.getProfile(userId);
        await appendUser(profile.displayName, userId, profile.pictureUrl);
        console.log(`ユーザー登録: ${profile.displayName} (${userId})`);
    } catch (err) {
        console.error('スプレッドシート書き込みエラー:', err);
    }
}

module.exports = userRegistHandle;
