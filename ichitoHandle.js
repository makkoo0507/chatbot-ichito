'use strict';
const axios = require('axios');
const line = require('@line/bot-sdk');
const lists = require(__dirname+'/lists');

const config = {
    channelSecret: process.env.LINE_CHANNEL_SECRET,
    channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN
};
const client = new line.Client(config);

// ユーザー名
let userName = "ゲストさん"

// グーグルマップから移動時間を算出
let myhouse={lat:26.272215,lng:127.737299};
let destination={lat:0,lng:0};
let Url =``;
let configGoogle = {
    method: 'get',
    url: Url,
    headers: { }
  };
let time = 0 ;

const createUrl = function(Lat,Lng){
    destination={lat:Lat,lng:Lng}
    Url=`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${myhouse.lat}%2C${myhouse.lng}&destinations=${destination.lat}%2C${destination.lng}&key=${process.env.GOOGLE_MAPS_API_KEY}`
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

async function ichitoHandle(event) {
  // ユーザー情報の取得
  lists.users.forEach((user)=>{
    if(event.source.userId==user.id){
        userName=user.name;
    };
  });
  // テキストメッセージが来た時のルーティング
  if (event.type == 'message' && event.message.type == 'text') {
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
      text: replyText
    });
  }
  // 位置情報が来た時のルーティング
  if (event.type == 'message' && event.message.type == 'location') {
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

module.exports = ichitoHandle;
