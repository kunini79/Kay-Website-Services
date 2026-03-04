import { NextResponse } from 'next/server';
import { createRequestLogger, withRequestId } from '@/lib/logger';

export async function POST() {
  const log = createRequestLogger('POST /api/admin/logout');

  const response = NextResponse.json(
    { message: 'Admin logged out' },
    { status: 200 }
  );

  response.cookies.set({
    name: 'admin_token',
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: new Date(0),
    path: '/',
  });

  log.info('admin logged out');
  return withRequestId(response, log.requestId);
}
