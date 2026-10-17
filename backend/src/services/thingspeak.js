import axios from 'axios';

const channelId = process.env.TS_CHANNEL_ID;
const readApiKey = process.env.TS_READ_API_KEY; // optional if channel is public

export async function fetchLatestFromThingSpeak() {
  if (!channelId) {
    throw new Error('TS_CHANNEL_ID not set');
  }

  const params = new URLSearchParams();
  params.set('results', '1');
  if (readApiKey) params.set('api_key', readApiKey);

  const url = `https://api.thingspeak.com/channels/${channelId}/feeds.json?${params.toString()}`;
  const response = await axios.get(url, { timeout: 10000 });

  const feed = response.data?.feeds?.[0] || {};
  const fields = {
    rain: safeNumber(feed.field1),
    moisture: safeNumber(feed.field2),
    createdAt: feed.created_at,
  };

  return fields;
}

function safeNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}



