import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/db';
import { DemoUser } from '@/lib/models/DemoUser';
import { Teacher } from '@/lib/models/Teacher';
import { School } from '@/lib/models/School';
import { createToken } from '@/lib/auth';
import { rateLimit, getClientIp } from '@/utils/rateLimit';
import { createRequestLogger, withRequestId } from '@/lib/logger';
import bcryptjs from 'bcryptjs';

export async function POST(request: NextRequest) {
  const log = createRequestLogger('POST /api/login', request);
  const clientIp = getClientIp(request);

  // Rate limit: 10 attempts per 15 minutes per IP
  const rateLimitResult = rateLimit(`login:${clientIp}`, 10, 900_000);

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
    await connectDB();

    const isSchoolLogin = body.loginMethod === 'school';
    let user;
    let isCredentialValid = false;
    let accountRole: 'user' | 'teacher' = 'user';
    const invalidCredentialsMessage = isSchoolLogin
      ? 'Invalid school, User ID, or PIN'
      : 'Invalid email or password';

    if (isSchoolLogin) {
      const schoolId = typeof body.schoolId === 'string' ? body.schoolId : '';
      const studentId = typeof body.studentId === 'string' ? body.studentId.trim().toUpperCase() : '';
      const pin = typeof body.pin === 'string' ? body.pin : '';

      if (!mongoose.isValidObjectId(schoolId) || !/^[A-Z0-9-]{2,40}$/.test(studentId) || !/^\d{4,8}$/.test(pin)) {
        return NextResponse.json({ message: 'Enter your school, User ID, and 4 to 8 digit PIN.' }, { status: 400 });
      }

      const school = await School.exists({ _id: schoolId, isActive: true });
      if (!school) {
        return NextResponse.json({ message: invalidCredentialsMessage }, { status: 401 });
      }

      user = await DemoUser.findOne({ school: schoolId, studentId }).select('+pin');
      if (user) isCredentialValid = await user.comparePin(pin);
    } else {
      const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
      const password = typeof body.password === 'string' ? body.password : '';

      if (!email || !password) {
        return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
      }

      user = await DemoUser.findOne({ email }).select('+password');
      if (user) isCredentialValid = await user.comparePassword(password);
      if (!user) {
        const teacher = await Teacher.findOne({ email, isActive: true }).select('+password');
        if (teacher) {
          user = teacher;
          accountRole = 'teacher';
          isCredentialValid = await bcryptjs.compare(password, teacher.password);
        }
      }
    }

    if (!user) {
      return NextResponse.json(
        { message: invalidCredentialsMessage },
        { status: 401 }
      );
    }

    // Check if user account is active
    if (!user.isActive) {
      return NextResponse.json(
        { message: 'Your ThinkBox access has been revoked' },
        { status: 403 }
      );
    }

    if (!isCredentialValid) {
      return NextResponse.json(
        { message: invalidCredentialsMessage },
        { status: 401 }
      );
    }

    // Update last login
    user.lastLoginAt = new Date();
    await user.save();

    // Create JWT token via shared auth module (fails hard if JWT_SECRET is missing)
    const token = createToken(
      user._id.toString(),
      user.email || '',
      user.name,
      accountRole,
      user.school?.toString()
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
          schoolId: user.school?.toString(),
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

    return withRequestId(response, log.requestId);
  } catch (error) {
    log.error('login failed', error);
    return withRequestId(
      NextResponse.json(
        {
          message: error instanceof Error ? error.message : 'Login failed',
        },
        { status: 500 }
      ),
      log.requestId
    );
  }
}
