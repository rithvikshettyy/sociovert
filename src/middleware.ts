import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Determine if Upstash REST environment variables are configured
const hasCredentials =
  !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);

let ratelimit: Ratelimit | null = null;

if (hasCredentials) {
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });

  ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '1 h'),
    analytics: true,
  });
}

// In-memory sliding window rate limiter for local development/fallback
const memoryLimit = new Map<string, number[]>();

function checkInMemoryLimit(ip: string): { success: boolean } {
  const now = Date.now();
  const oneHourAgo = now - 60 * 60 * 1000;
  
  // Clean up all expired keys from the Map to prevent memory leaks
  memoryLimit.forEach((times, key) => {
    const validTimes = times.filter(time => time > oneHourAgo);
    if (validTimes.length === 0) {
      memoryLimit.delete(key);
    } else {
      memoryLimit.set(key, validTimes);
    }
  });
  
  const requests = memoryLimit.get(ip) || [];
  if (requests.length >= 10) {
    return { success: false };
  }
  
  requests.push(now);
  memoryLimit.set(ip, requests);
  return { success: true };
}

export async function middleware(request: NextRequest) {
  // Apply only to all /api/convert routes
  if (request.nextUrl.pathname.startsWith('/api/convert')) {
    // Extract IP address from request headers/metadata
    const ip = request.ip || request.headers.get('x-forwarded-for') || '127.0.0.1';
    
    let success = true;
    
    if (ratelimit) {
      try {
        const result = await ratelimit.limit(ip);
        success = result.success;
      } catch (err) {
        console.error('Upstash rate limit error, using in-memory check:', err);
        success = checkInMemoryLimit(ip).success;
      }
    } else {
      success = checkInMemoryLimit(ip).success;
    }
    
    if (!success) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          error: 'You have reached your hourly limit. Please try again later.'
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }
  }
  
  return NextResponse.next();
}

// Next.js middleware configuration matcher
export const config = {
  matcher: '/api/convert/:path*',
};
