'use strict';
const express = require('express');
const axios = require('axios');
const line = require('@line/bot-sdk');
const PORT = process.env.PORT || 3000;
const config = {
    channelSecret: '7ac5ecae58d3541c88f2a39e540b72bc',
    channelAccessToken: 'W6NMZ4g7uTa0NqXViFC60Y2HhRe1F99poDBEEMNEMtZB0lsTXYIwjngDzRVjQ4nskULyEwxvs22JaZ1FXvqO9Pnq4mYzigfw0INXijKjvBS2wqRyvhIfoCEe8vamC73CVkyCIJOjKSfZ+Sz2kxhGsQdB04t89/1O/w1cDnyilFU='
};
const app = express();
const lists = require(__dirname+'/lists');

// ユーザー名
let userName = "ゲストさん"

app.get('/', (req, res) => {res.send('Hello LINE BOT!(!GET!)'); console.log("konn")}); //ブラウザ確認用(無くても問題ない)
app.post('/webhook', line.middleware(config), (req, res) => {
    console.log(req.body.events);
    Promise
      .all(req.body.events.map(handleEvent))
      .then((result) => {res.json(result)});
});

const client = new line.Client(config);

// グーグルマップから移動時間を算出
　　//初期値の設定
let myhouse={lat:26.272215,lng:127.737299};
let destination={lat:0,lng:0};
let Url =``;
let configGoogle = {
    method: 'get',
    url: Url,
    headers: { }
  };
let time = 0 ;
// 　関数　lat,lngからURL作成、そしてconfig作成
const createUrl = function(Lat,Lng){
    destination={lat:Lat,lng:Lng}
    Url=`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${myhouse.lat}%2C${myhouse.lng}&destinations=${destination.lat}%2C${destination.lng}&key=AIzaSyBBRU8hHgjyCd3D6oX1uaIUSbUQXpJ5wiM`
    return Url ;
};

const createConfigGoogle = function(Lat,Lng){
    configGoogle = {
        method: 'get',
        url: createUrl(Lat,Lng),
        headers: { }
      };
    return configGoogle;
}


async function handleEvent(event) {
  // ユーザー情報の取得
  lists.users.forEach((user)=>{
    if(event.source.userId==user.id){
        userName=user.name;
    };
  });
  // テキストメッセージが来た時のルーティング
  if (event.type == 'message' && event.message.type == 'text') {
    // 写真というワードが入った時の返信
    if(event.message.text.includes("写真")){
      const imgnumber=Math.floor(Math.random()*18)
      return client.replyMessage(event.replyToken, {
        type: 'image',
        originalContentUrl: `https://ichi-img-site.herokuapp.com/images/ichito${imgnumber}.jpg`,
        previewImageUrl:    `https://ichi-img-site.herokuapp.com/images/ichito${imgnumber}.jpg`
          });
    }
    // 配列QAsかQSs内の質問が来た時の返事を定義
    let replyText=""
    lists.QAs.forEach((QA)=>{
      if(event.message.text.includes(QA.question) && event.message.text.includes("？") ){
        replyText=QA.answer
      }
    });
    lists.QSs.forEach((QS)=>{
      if(event.message.text.includes(QS.question)){
        replyText=QS.answer
      }
    });
    // 返事のルーティング
    if(replyText===""){
      replyText="んー？まだ分かんない^^"
    }
    return client.replyMessage(event.replyToken, {
      type: 'text',
      text: replyText //event.message.text //実際に返信の言葉を入れる箇所
    });
  }
  // 位置情報が来た時のルーティング
  if (event.type == 'message' && event.message.type == 'location') {
    // 位置情報を取得しGoogleAPIで時間の算出
    configGoogle=createConfigGoogle(event.message.latitude,event.message.longitude);
    axios(configGoogle)
    .then((response)=>{
        time =JSON.stringify(response.data.rows[0].elements[0].duration.value);
        console.log(time+'秒');
        return client.replyMessage(event.replyToken, {
            type: 'text',
            text: `${userName}は${Math.round(time/60)}分ぐらいで帰ってくるよ^^`
        });
    })
    .catch((error)=> {
        console.log(error);
    });
  };
}
app.listen(PORT);
console.log(`Server running at ${PORT}`);
