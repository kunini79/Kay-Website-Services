/**
 * Simple In-Memory Rate Limiting
 * For production, use Redis or a dedicated service
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const store = new Map<string, RateLimitEntry>();

export function rateLimit(
  identifier: string,
  maxRequests: number = 5,
  windowMs: number = 3600000 // 1 hour
): { success: boolean; remaining: number; retryAfter?: number } {
  const now = Date.now();
  const entry = store.get(identifier);

  if (!entry || now > entry.resetTime) {
    // New window or expired
    store.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    });
    return { success: true, remaining: maxRequests - 1 };
  }

  // Window still active
  if (entry.count < maxRequests) {
    entry.count++;
    return {
      success: true,
      remaining: maxRequests - entry.count,
    };
  }

  // Rate limit exceeded
  const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
  return {
    success: false,
    remaining: 0,
    retryAfter,
  };
}

/**
 * Get client IP address from request
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : request.headers.get('x-real-ip') || 'unknown';
  return ip;
}
