export interface Env {
  LINE_CHANNEL_SECRET: string;
  LINE_CHANNEL_ACCESS_TOKEN: string;
  GOOGLE_CREDENTIALS_JSON: string;
  GOOGLE_MAPS_API_KEY: string;
}

export interface LineEvent {
  type: string;
  source: { type: string; userId: string };
  replyToken?: string;
  message?: {
    type: string;
    text?: string;
    latitude?: number;
    longitude?: number;
  };
  timestamp: number;
}

export interface ServiceAccount {
  client_email: string;
  private_key: string;
}
