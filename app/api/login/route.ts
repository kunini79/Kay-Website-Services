import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { DemoUser } from '@/lib/models/DemoUser';
import { createToken } from '@/lib/auth';
import { rateLimit, getClientIp } from '@/utils/rateLimit';

export async function POST(request: NextRequest) {
  // Rate limit: 10 attempts per 15 minutes per IP
  const clientIp = getClientIp(request);
  const rateLimitResult = rateLimit(`login:${clientIp}`, 10, 900_000);

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
    const body = await request.json();
    const { email, password } = body;

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Find user and select password (normalise email to lowercase so it matches stored value)
    const user = await DemoUser.findOne({ email: email.toLowerCase().trim() }).select('+password');

    if (!user) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check if user account is active
    if (!user.isActive) {
      return NextResponse.json(
        { message: 'Your demo access has been revoked' },
        { status: 403 }
      );
    }

    // Compare passwords
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Update last login
    user.lastLoginAt = new Date();
    await user.save();

    // Create JWT token via shared auth module (fails hard if JWT_SECRET is missing)
    const token = createToken(
      user._id.toString(),
      user.email,
      user.name
    );

    // Create response with cookie
    const response = NextResponse.json(
      {
        message: 'Login successful',
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          company: user.company,
        },
      },
      { status: 200 }
    );

    // Set JWT as httpOnly cookie
    response.cookies.set({
      name: 'thinkbox_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : 'Login failed',
      },
      { status: 500 }
    );
  }
}
