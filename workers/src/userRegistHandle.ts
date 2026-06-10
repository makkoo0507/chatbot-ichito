import { getProfile } from './lineUtils';
import { getRegisteredIds, appendUser } from './sheetsUtils';
import type { Env, LineEvent, ServiceAccount } from './types';

export async function userRegistHandle(event: LineEvent, env: Env): Promise<void> {
  if (event.type !== 'follow' && event.type !== 'message') return;

  const userId = event.source.userId;
  if (!userId) return;

  try {
    const credentials: ServiceAccount = JSON.parse(env.GOOGLE_CREDENTIALS_JSON);
    const registeredIds = await getRegisteredIds(credentials);
    if (registeredIds.includes(userId)) return;

    const profile = await getProfile(userId, env.LINE_CHANNEL_ACCESS_TOKEN);
    await appendUser(credentials, profile.displayName, userId, profile.pictureUrl ?? '');
    console.log(`ユーザー登録: ${profile.displayName} (${userId})`);
  } catch (err) {
    console.error('スプレッドシート書き込みエラー:', err);
  }
}
