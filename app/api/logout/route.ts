import { NextRequest, NextResponse } from 'next/server';
import { createRequestLogger, withRequestId } from '@/lib/logger';

export async function POST(request: NextRequest) {
  const log = createRequestLogger('POST /api/logout', request);
  try {
    const response = NextResponse.json(
      { message: 'Logout successful' },
      { status: 200 }
    );

    // Clear the JWT cookie
    response.cookies.set({
      name: 'thinkbox_token',
      value: '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: new Date(0),
      path: '/',
    });

    log.info('user logged out');
    return withRequestId(response, log.requestId);
  } catch (error) {
    log.error('logout failed', error);
    return withRequestId(
      NextResponse.json(
        { message: 'Logout failed' },
        { status: 500 }
      ),
      log.requestId
    );
  }
}
