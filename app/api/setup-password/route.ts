import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { DemoUser } from '@/lib/models/DemoUser';
import { rateLimit, getClientIp } from '@/utils/rateLimit';
import { createRequestLogger, withRequestId } from '@/lib/logger';

export async function POST(request: NextRequest) {
  const log = createRequestLogger('POST /api/setup-password', request);
  const clientIp = getClientIp(request);

  // Rate limit: 5 attempts per hour per IP
  const rateLimitResult = rateLimit(`setup-pwd:${clientIp}`, 5, 3_600_000);

  if (!rateLimitResult.success) {
    log.warn('rate limited', { clientIp });
    return withRequestId(
      NextResponse.json(
        { message: 'Too many attempts. Please try again later.' },
        {
          status: 429,
          headers: { 'Retry-After': String(rateLimitResult.retryAfter) },
        }
      ),
      log.requestId
    );
  }

  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return withRequestId(
        NextResponse.json(
          { message: 'Token and password are required' },
          { status: 400 }
        ),
        log.requestId
      );
    }

    if (password.length < 6) {
      return withRequestId(
        NextResponse.json(
          { message: 'Password must be at least 6 characters' },
          { status: 400 }
        ),
        log.requestId
      );
    }

    await connectDB();

    const user = await DemoUser.findOne({
      setupToken: token,
      setupTokenExpiry: { $gt: new Date() },
    });

    if (!user) {
      log.warn('invalid or expired setup token', { clientIp });
      return withRequestId(
        NextResponse.json(
          { message: 'Invalid or expired setup token' },
          { status: 400 }
        ),
        log.requestId
      );
    }

    // Set user-chosen password (hashed by pre-save hook) and clear the token
    user.password = password;
    user.setupToken = undefined;
    user.setupTokenExpiry = undefined;
    await user.save();

    log.info('password set successfully', { userId: user._id.toString() });
    return withRequestId(
      NextResponse.json(
        { message: 'Password set successfully. You can now log in.' },
        { status: 200 }
      ),
      log.requestId
    );
  } catch (error) {
    log.error('setup password failed', error);
    return withRequestId(
      NextResponse.json(
        { message: 'Failed to set password' },
        { status: 500 }
      ),
      log.requestId
    );
  }
}
