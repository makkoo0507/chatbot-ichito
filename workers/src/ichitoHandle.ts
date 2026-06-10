import { replyMessage } from './lineUtils';
import { users, QAs, QSs } from './lists';
import type { Env, LineEvent } from './types';

const myhouse = { lat: 26.272215, lng: 127.737299 };

export async function ichitoHandle(event: LineEvent, env: Env): Promise<void> {
  if (!event.replyToken) return;

  let userName = 'ゲストさん';
  for (const user of users) {
    if (event.source.userId === user.id) { userName = user.name; break; }
  }

  if (event.type === 'message' && event.message?.type === 'text') {
    const text = event.message.text ?? '';

    if (text.includes('写真')) {
      const n = Math.floor(Math.random() * 18);
      await replyMessage(event.replyToken, [{
        type: 'image',
        originalContentUrl: `https://ichi-img-site.herokuapp.com/images/ichito${n}.jpg`,
        previewImageUrl: `https://ichi-img-site.herokuapp.com/images/ichito${n}.jpg`,
      }], env.LINE_CHANNEL_ACCESS_TOKEN);
      return;
    }

    let replyText = '';
    for (const qa of QAs) {
      if (text.includes(qa.question) && text.includes('？')) { replyText = qa.answer; break; }
    }
    if (!replyText) {
      for (const qs of QSs) {
        if (text.includes(qs.question)) { replyText = qs.answer; break; }
      }
    }
    if (!replyText) replyText = 'んー？まだ分かんない^^';

    await replyMessage(event.replyToken, [{ type: 'text', text: replyText }], env.LINE_CHANNEL_ACCESS_TOKEN);
    return;
  }

  if (event.type === 'message' && event.message?.type === 'location') {
    const { latitude, longitude } = event.message;
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${myhouse.lat}%2C${myhouse.lng}&destinations=${latitude}%2C${longitude}&key=${env.GOOGLE_MAPS_API_KEY}`;
    const res = await fetch(url);
    const data = await res.json() as { rows: { elements: { duration: { value: number } }[] }[] };
    const seconds = data.rows[0].elements[0].duration.value;
    await replyMessage(event.replyToken, [{
      type: 'text',
      text: `${userName}は${Math.round(seconds / 60)}分ぐらいで帰ってくるよ^^`,
    }], env.LINE_CHANNEL_ACCESS_TOKEN);
  }
}
