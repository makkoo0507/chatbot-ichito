'use strict';
const express = require('express');
const line = require('@line/bot-sdk');
const PORT = process.env.PORT || 3000;
const config = {
    channelSecret: process.env.LINE_CHANNEL_SECRET,
    channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN
};
const app = express();
const ichitoHandle = require('./ichitoHandle');
const userRegistHandle = require('./userRegistHandle');

app.get('/', (req, res) => {res.send('Hello LINE BOT!(!GET!)'); console.log("konn")}); //ブラウザ確認用(無くても問題ない)
app.post('/webhook', line.middleware(config), (req, res) => {
    console.log(req.body.events);
    req.body.events.forEach(event => userRegistHandle(event));
    Promise
      .all(req.body.events.map(ichitoHandle))
      .then((result) => {res.json(result)});
});

app.listen(PORT);
console.log(`Server running at ${PORT}`);
