import type { ServiceAccount } from './types';

const SPREADSHEET_ID = '1UOmGtPvdFLK75Jc1cuOfiWj6MTsfm5C0IQwfT_Tiwn8';
const SHEET_NAME = 'シート1';

function b64url(data: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(data)))
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

async function getAccessToken(credentials: ServiceAccount): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const enc = new TextEncoder();

  const header = { alg: 'RS256', typ: 'JWT' };
  const payload = {
    iss: credentials.client_email,
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  };

  const encodeObj = (obj: object) =>
    btoa(JSON.stringify(obj)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

  const signingInput = `${encodeObj(header)}.${encodeObj(payload)}`;

  // PEM形式の秘密鍵をDERに変換
  const pemBody = credentials.private_key.replace(/-----.*?-----/g, '').replace(/\s/g, '');
  const keyData = Uint8Array.from(atob(pemBody), c => c.charCodeAt(0));

  const key = await crypto.subtle.importKey(
    'pkcs8', keyData,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false, ['sign']
  );

  const signature = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, enc.encode(signingInput));
  const jwt = `${signingInput}.${b64url(signature)}`;

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`,
  });
  const data = await res.json() as { access_token: string };
  return data.access_token;
}

export async function getRegisteredIds(credentials: ServiceAccount): Promise<string[]> {
  const token = await getAccessToken(credentials);
  const range = encodeURIComponent(`${SHEET_NAME}!B:B`);
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const data = await res.json() as { values?: string[][] };
  return (data.values || []).map(row => row[0]);
}

export async function appendUser(
  credentials: ServiceAccount,
  displayName: string,
  userId: string,
  pictureUrl: string
): Promise<void> {
  const token = await getAccessToken(credentials);
  const now = new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });
  const range = encodeURIComponent(`${SHEET_NAME}!A:D`);
  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}:append?valueInputOption=RAW`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ values: [[displayName, userId, pictureUrl, now]] }),
    }
  );
}
