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

// Local in-memory database fallback for development/testing
interface IPInfo {
  conversionCount: number;
  lastSeen: string;
  banned: boolean;
  violationsCount: number;
  banExpiresAt?: number;
}

const memoryTracker = new Map<string, IPInfo>();

/**
 * Checks if the given IP address is currently banned.
 */
export async function checkIPStatus(ip: string): Promise<{ banned: boolean }> {
  if (redis) {
    try {
      const data = await redis.hgetall(`iptracker:${ip}`);
      if (data && data.banned === 'true') {
        return { banned: true };
      }
      return { banned: false };
    } catch (err) {
      console.error('Redis checkIPStatus error, falling back to memory:', err);
    }
  }

  // Memory fallback check
  const info = memoryTracker.get(ip);
  if (info) {
    const now = Date.now();
    if (info.banned && info.banExpiresAt && info.banExpiresAt > now) {
      return { banned: true };
    }
    // Auto-unban in memory if the 24-hour window has expired
    if (info.banned && info.banExpiresAt && info.banExpiresAt <= now) {
      info.banned = false;
      info.violationsCount = 0;
      memoryTracker.set(ip, info);
    }
  }
  return { banned: false };
}

/**
 * Tracks a request from an IP address, updating counts and triggering auto-bans.
 */
export async function trackRequest(ip: string, isRateLimited: boolean): Promise<void> {
  const nowStr = new Date().toISOString();

  if (redis) {
    try {
      const trackerKey = `iptracker:${ip}`;
      const violationsKey = `violations:${ip}`;

      // Get existing values or default them to ensure all fields exist on every request
      const existing = await redis.hgetall(trackerKey) as Record<string, string> | null;
      const conversionCount = existing?.conversionCount ? parseInt(existing.conversionCount, 10) : 0;
      const banned = existing?.banned || 'false';

      if (isRateLimited) {
        // Increment consecutive violations
        const violations = await redis.incr(violationsKey);
        
        // If the user hits the rate limit 3 times in a row, auto-ban for 24 hours (86400 seconds)
        if (violations >= 3) {
          await redis.hset(trackerKey, {
            conversionCount: String(conversionCount),
            lastSeen: nowStr,
            banned: 'true',
          });
          await redis.expire(trackerKey, 86400); // 24-hour TTL
          await redis.del(violationsKey); // Reset violations counter
        } else {
          await redis.hset(trackerKey, {
            conversionCount: String(conversionCount),
            lastSeen: nowStr,
            banned: banned,
          });
        }
      } else {
        // Successful conversion: reset violations counter and increment conversionCount
        await redis.del(violationsKey);

        await redis.hset(trackerKey, {
          conversionCount: String(conversionCount + 1),
          lastSeen: nowStr,
          banned: 'false',
        });
      }
      return;
    } catch (err) {
      console.error('Redis trackRequest error, falling back to memory:', err);
    }
  }

  // Memory fallback logic
  const now = Date.now();
  const info = memoryTracker.get(ip) || {
    conversionCount: 0,
    lastSeen: nowStr,
    banned: false,
    violationsCount: 0,
  };

  info.lastSeen = nowStr;

  if (isRateLimited) {
    info.violationsCount += 1;
    if (info.violationsCount >= 3) {
      info.banned = true;
      info.banExpiresAt = now + 24 * 60 * 60 * 1000; // 24 hours
      info.violationsCount = 0;
    }
  } else {
    info.violationsCount = 0;
    info.conversionCount += 1;
    info.banned = false;
  }

  memoryTracker.set(ip, info);
}
