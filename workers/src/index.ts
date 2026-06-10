import { Hono } from 'hono';
import { verifySignature } from './lineUtils';
import { ichitoHandle } from './ichitoHandle';
import { userRegistHandle } from './userRegistHandle';
import type { Env, LineEvent } from './types';

const app = new Hono<{ Bindings: Env }>();

app.get('/', (c) => c.text('Hello LINE BOT!'));

app.post('/webhook', async (c) => {
  const body = await c.req.text();
  const signature = c.req.header('x-line-signature') ?? '';

  const valid = await verifySignature(body, signature, c.env.LINE_CHANNEL_SECRET);
  if (!valid) return c.json({ error: 'Invalid signature' }, 400);

  const { events } = JSON.parse(body) as { events: LineEvent[] };

  c.executionCtx.waitUntil(
    Promise.all(events.map(async (event) => {
      await userRegistHandle(event, c.env);
      await ichitoHandle(event, c.env);
    }))
  );

  return c.json({ status: 'ok' });
});

export default app;
