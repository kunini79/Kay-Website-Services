import { NextRequest, NextResponse } from 'next/server';
import { createAdminToken } from '@/lib/auth';
import { rateLimit, getClientIp } from '@/utils/rateLimit';
import { createRequestLogger, withRequestId } from '@/lib/logger';

export async function POST(request: NextRequest) {
  const log = createRequestLogger('POST /api/admin/login', request);
  const clientIp = getClientIp(request);

  // Rate limit: 5 attempts per 15 minutes per IP
  const rateLimitResult = rateLimit(`admin-login:${clientIp}`, 5, 900_000);

  if (!rateLimitResult.success) {
    log.warn('rate limited', { clientIp, retryAfter: rateLimitResult.retryAfter });
    return withRequestId(
      NextResponse.json(
        { message: 'Too many login attempts. Please try again later.' },
        {
          status: 429,
          headers: { 'Retry-After': String(rateLimitResult.retryAfter) },
        }
      ),
      log.requestId
    );
  }

  try {
    const { password } = await request.json();

    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
      log.error('ADMIN_PASSWORD env var not set');
      return withRequestId(
        NextResponse.json(
          { message: 'Admin authentication is not configured' },
          { status: 500 }
        ),
        log.requestId
      );
    }

    if (!password || password !== adminPassword) {
      log.warn('invalid admin password attempt', { clientIp });
      return withRequestId(
        NextResponse.json(
          { message: 'Invalid password' },
          { status: 401 }
        ),
        log.requestId
      );
    }

    const token = createAdminToken();

    const response = NextResponse.json(
      { message: 'Admin login successful' },
      { status: 200 }
    );

    response.cookies.set({
      name: 'admin_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 4 * 60 * 60, // 4 hours
      path: '/',
    });

    log.info('admin login successful');
    return withRequestId(response, log.requestId);
  } catch (error) {
    log.error('admin login failed', error);
    return withRequestId(
      NextResponse.json(
        { message: 'Login failed' },
        { status: 500 }
      ),
      log.requestId
    );
  }
}
