import { Redis } from '@upstash/redis';

const hasCredentials =
  !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);

let redis: Redis | null = null;
if (hasCredentials) {
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });
}

function todayKey() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

export async function trackToolUsage(category: string, action: string): Promise<void> {
  if (!redis) return;
  const day = todayKey();
  const toolKey = `${category}:${action}`;
  try {
    await Promise.all([
      redis.hincrby('stats:total', toolKey, 1),
      redis.hincrby('stats:total', '_all', 1),
      redis.hincrby(`stats:daily:${day}`, toolKey, 1),
      redis.hincrby(`stats:daily:${day}`, '_all', 1),
    ]);
  } catch (err) {
    console.error('Redis trackToolUsage error:', err);
  }
}

export async function getUsageStats(): Promise<{
  total: Record<string, number>;
  today: Record<string, number>;
  last7days: Record<string, Record<string, number>>;
}> {
  if (!redis) return { total: {}, today: {}, last7days: {} };
  try {
    const day = todayKey();
    const [total, today] = await Promise.all([
      redis.hgetall('stats:total') as Promise<Record<string, number>>,
      redis.hgetall(`stats:daily:${day}`) as Promise<Record<string, number>>,
    ]);

    const last7days: Record<string, Record<string, number>> = {};
    const days: string[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d.toISOString().slice(0, 10));
    }

    const dailyResults = await Promise.all(
      days.map((d) => redis!.hgetall(`stats:daily:${d}`) as Promise<Record<string, number>>)
    );
    days.forEach((d, i) => {
      if (dailyResults[i] && Object.keys(dailyResults[i]).length > 0) {
        last7days[d] = dailyResults[i];
      }
    });

    return {
      total: total || {},
      today: today || {},
      last7days,
    };
  } catch (err) {
    console.error('Redis getUsageStats error:', err);
    return { total: {}, today: {}, last7days: {} };
  }
}
