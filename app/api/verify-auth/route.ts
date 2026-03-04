import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { createRequestLogger, withRequestId } from '@/lib/logger';

export async function GET(request: NextRequest) {
  const log = createRequestLogger('GET /api/verify-auth', request);
  try {
    const auth = await verifyAuth();

    if (!auth) {
      log.info('unauthenticated check');
      return withRequestId(
        NextResponse.json(
          { message: 'Not authenticated' },
          { status: 401 }
        ),
        log.requestId
      );
    }

    log.info('authenticated', { userId: auth.userId });
    return withRequestId(
      NextResponse.json(
        {
          message: 'Authenticated',
          user: {
            userId: auth.userId,
            email: auth.email,
            name: auth.name,
          },
        },
        { status: 200 }
      ),
      log.requestId
    );
  } catch (error) {
    log.error('auth verification failed', error);
    return withRequestId(
      NextResponse.json(
        { message: 'Auth verification failed' },
        { status: 500 }
      ),
      log.requestId
    );
  }
}
