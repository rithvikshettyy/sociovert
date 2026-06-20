import { Redis } from '@upstash/redis';
import { HistoryEntry } from '@/types';

const hasCredentials =
  !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);

let redis: Redis | null = null;
if (hasCredentials) {
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });
}

const MAX_ENTRIES = 50;

function historyKey(email: string) {
  return `user:${email}:history`;
}

export async function getConversionHistory(email: string): Promise<HistoryEntry[]> {
  if (!redis) return [];
  try {
    const data = await redis.lrange(historyKey(email), 0, MAX_ENTRIES - 1);
    return data.map((item) => (typeof item === 'string' ? JSON.parse(item) : item) as HistoryEntry);
  } catch (err) {
    console.error('Redis getConversionHistory error:', err);
    return [];
  }
}

export async function addConversionHistory(email: string, entry: HistoryEntry): Promise<void> {
  if (!redis) return;
  try {
    await redis.lpush(historyKey(email), JSON.stringify(entry));
    await redis.ltrim(historyKey(email), 0, MAX_ENTRIES - 1);
  } catch (err) {
    console.error('Redis addConversionHistory error:', err);
  }
}

export async function clearConversionHistory(email: string): Promise<void> {
  if (!redis) return;
  try {
    await redis.del(historyKey(email));
  } catch (err) {
    console.error('Redis clearConversionHistory error:', err);
  }
}
