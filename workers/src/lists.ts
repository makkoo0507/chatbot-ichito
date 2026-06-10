export const users = [
  { id: 'U6b34d79b700fc5a36ad3ab6e93042425', name: 'まっこー' },
  { id: 'U4dfbf80f04dafc01c70e7147c655d363', name: '愛' },
];

const birthday = new Date(2021, 3, 26);

function calcAge(): { years: number; months: number } {
  const today = new Date();
  let years = today.getFullYear() - birthday.getFullYear();
  let months = today.getMonth() - birthday.getMonth();
  if (today.getDate() < 26) months--;
  if (months < 0) { years--; months += 12; }
  return { years, months };
}

const { years, months } = calcAge();

export const QAs = [
  { question: '名前', answer: 'いちとだよ!^^' },
  { question: '何歳', answer: `${years}歳と${months}ヶ月になりました!^^` },
  { question: '歳', answer: `${years}歳と${months}ヶ月になりました!^^` },
  { question: '誕生日', answer: 'ジェット・リーと一緒だよ🎂' },
  { question: '血液型', answer: '❤️(ハート型)' },
  { question: '身長', answer: 'もう少しで2m' },
  { question: '歌', answer: 'あんあんアンパンマーん♪ 愛と勇気だけがとーもだちさ〜♪' },
  { question: '元気', answer: '今日も元気！' },
  { question: '好きな人', answer: 'お母ちゃん💕' },
  { question: '特技', answer: '歩け歩け🚶‍♂️' },
  { question: '動物', answer: 'わんわん🐶' },
  { question: '趣味', answer: '何でも口に入れちゃう🐻' },
  { question: 'お母ちゃんの名前', answer: '愛だよ' },
  { question: '腹', answer: 'ミルク飲みたいよ~' },
  { question: '食べ物', answer: 'お芋大好き！' },
  { question: '夢', answer: 'マッチョです💪' },
  { question: 'おいしい', answer: 'うまい！🐻' },
];

export const QSs = [
  { question: '帰る', answer: 'はーい！気をつけてね🚘' },
  { question: 'ジャンプ', answer: 'ぴょん👟' },
  { question: 'キック', answer: 'パンチ🥊' },
  { question: '歌', answer: 'あんあんアンパンマーん♪\n 愛と勇気だけがとーもだちさ〜♪' },
  { question: '可愛い', answer: '恐縮です！(￣^￣)ゞ' },
  { question: 'パンチ', answer: 'ジィキシ！' },
  { question: '今日は', answer: 'こんにちは😊\n今日もごきげん^^' },
  { question: 'おはよう', answer: 'おはよう😊\n今日も元気に頑張ろう！' },
  { question: 'こん', answer: 'おっす！' },
  { question: 'おやすみ', answer: '今日もよく頑張りました^^\nおやすみ💤' },
];
