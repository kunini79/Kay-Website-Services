import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { DemoUser } from '@/lib/models/DemoUser';
import { rateLimit, getClientIp } from '@/utils/rateLimit';

export async function POST(request: NextRequest) {
  // Rate limit: 5 attempts per hour per IP
  const clientIp = getClientIp(request);
  const rateLimitResult = rateLimit(`setup-pwd:${clientIp}`, 5, 3_600_000);

  if (!rateLimitResult.success) {
    return NextResponse.json(
      { message: 'Too many attempts. Please try again later.' },
      {
        status: 429,
        headers: { 'Retry-After': String(rateLimitResult.retryAfter) },
      }
    );
  }

  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { message: 'Token and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await DemoUser.findOne({
      setupToken: token,
      setupTokenExpiry: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'Invalid or expired setup token' },
        { status: 400 }
      );
    }

    // Set user-chosen password (hashed by pre-save hook) and clear the token
    user.password = password;
    user.setupToken = undefined;
    user.setupTokenExpiry = undefined;
    await user.save();

    return NextResponse.json(
      { message: 'Password set successfully. You can now log in.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Setup password error:', error);
    return NextResponse.json(
      { message: 'Failed to set password' },
      { status: 500 }
    );
  }
}
