import { NextRequest, NextResponse } from 'next/server';
import { createAdminToken } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { AdminAccount } from '@/lib/models/AdminAccount';
import bcryptjs from 'bcryptjs';
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
    const body = await request.json();
    const password = typeof body.password === 'string' ? body.password : '';

    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminEmail = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    let validCredentials = Boolean(password && adminPassword && password === adminPassword);
    try {
      await connectDB();
      const account = adminEmail
        ? await AdminAccount.findOne({ email: adminEmail, isActive: true }).select('+password')
        : null;
      if (account) validCredentials = await bcryptjs.compare(password, account.password);
    } catch {
      // Environment credentials remain available if the database is unavailable.
    }

    if (!validCredentials) {
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
