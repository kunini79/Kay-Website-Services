import { NextRequest, NextResponse } from 'next/server';
import { createAdminToken } from '@/lib/auth';
import { rateLimit, getClientIp } from '@/utils/rateLimit';

export async function POST(request: NextRequest) {
  // Rate limit: 5 attempts per 15 minutes per IP
  const clientIp = getClientIp(request);
  const rateLimitResult = rateLimit(`admin-login:${clientIp}`, 5, 900_000);

  if (!rateLimitResult.success) {
    return NextResponse.json(
      { message: 'Too many login attempts. Please try again later.' },
      {
        status: 429,
        headers: { 'Retry-After': String(rateLimitResult.retryAfter) },
      }
    );
  }

  try {
    const { password } = await request.json();

    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
      console.error('ADMIN_PASSWORD environment variable is not set');
      return NextResponse.json(
        { message: 'Admin authentication is not configured' },
        { status: 500 }
      );
    }

    if (!password || password !== adminPassword) {
      return NextResponse.json(
        { message: 'Invalid password' },
        { status: 401 }
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

    return response;
  } catch {
    return NextResponse.json(
      { message: 'Login failed' },
      { status: 500 }
    );
  }
}
