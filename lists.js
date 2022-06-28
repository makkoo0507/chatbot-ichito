
// ユーザー情報
const users = [
    {id:'U6b34d79b700fc5a36ad3ab6e93042425',name:'まっこー'},
    {id:'U4dfbf80f04dafc01c70e7147c655d363',name:'愛'}
]


// 壱門年齢自動計算
// タイマー
const birthday = new Date(2021,3,26)
const today = new Date()
// 何歳の部分
let pasYear = 0
if(today.getMonth()==3){
    if(today.getDate()>=26){
        pasYear = today.getFullYear() - birthday.getFullYear()
    }else{
        pasYear = today.getFullYear() - birthday.getFullYear()-1
    }
}else if(today.getMonth()>=4){
    pasYear = today.getFullYear() - birthday.getFullYear()
}else{
    pasYear = today.getFullYear() - birthday.getFullYear()-1
}
// 何ヶ月かの部分
let pasMonth = 0
if(today.getDate()>=26){
    pasMonth = today.getMonth() - birthday.getMonth()
}else{
    pasMonth = today.getMonth() - birthday.getMonth()-1
}
if(pasMonth < 0){
    pasMonth +=12
}
//質問リスト
const QAs = [
  {question:"名前",answer:`いちとだよ!^^`},
  {question:"何歳",answer:`${pasYear}歳と${pasMonth}ヶ月になりました!^^`},
  {question:"歳",answer:`${pasYear}歳と${pasMonth}ヶ月になりました!^^`},
  {question:"誕生日",answer:"ジェット・リーと一緒だよ🎂"},
  {question:"血液型",answer:"❤️(ハート型)"},
  {question:"身長",answer:"もう少しで2m"},
  {question:"歌",answer:"あんあんアンパンマーん♪ 愛と勇気だけがとーもだちさ〜♪"},
  {question:"元気",answer:"今日も元気！"},
  {question:"好きな人",answer:"お母ちゃん💕"},
  {question:"特技",answer:"歩け歩け🚶‍♂️"},
  {question:"動物",answer:"わんわん🐶"},
  {question:"趣味",answer:"何でも口に入れちゃう🐻"},
  {question:"お母ちゃんの名前",answer:"愛だよ"},
  {question:"腹",answer:"ミルク飲みたいよ~"},
  {question:"食べ物",answer:"お芋大好き！"},
  {question:"夢",answer:"マッチョです💪"},
  {question:"おいしい",answer:"うまい！🐻"},
  {question:"ああああああ",answer:"大好き！！"},
  {question:"1111111",answer:""},
  {question:"4444444",answer:""},
  {question:"abofinbaoi",answer:""},
  {question:"テスト",answer:"けけ"}
]
// 言って欲しいことリスト
const QSs = [
  {question:"帰る",answer:"はーい！気をつけてね🚘"},
  {question:"ジャンプ",answer:"ぴょん👟"},
  {question:"計算",answer:"いちとの１🕐"},
  {question:"キック",answer:"パンチ🥊"},
  {question:"歌",answer:"あんあんアンパンマーん♪\n 愛と勇気だけがとーもだちさ〜♪"},
  {question:"可愛い",answer:"恐縮です！(￣^￣)ゞ"},
  {question:"おコアkソアkフォア",answer:"お母ちゃん💕"},
  {question:"パンチ",answer:"ジィキシ！"},
  {question:"今日は",answer:"こんにちは😊\n今日もごきげん^^"},
  {question:"おはよう",answer:"おはよう😊\n今日も元気に頑張ろう！"},
  {question:"こん",answer:"おっす！"},
  {question:"おやすみ",answer:"今日もよく頑張りました^^\nおやすみ💤"}
]

exports.users=users;
exports.QAs = QAs;
exports.QSs = QSs;
