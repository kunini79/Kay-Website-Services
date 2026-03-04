import { NextRequest, NextResponse } from 'next/server';
import Pusher from 'pusher';
import { createRequestLogger, withRequestId } from '@/lib/logger';

/**
 * Build a Pusher client on demand, validating that all required
 * environment variables are present. Throws if any are missing.
 */
function getPusherClient(): Pusher {
  const appId = process.env.PUSHER_APP_ID;
  const key = process.env.PUSHER_KEY;
  const secret = process.env.PUSHER_SECRET;

  if (!appId || !key || !secret) {
    throw new Error(
      'Missing required Pusher environment variables (PUSHER_APP_ID, PUSHER_KEY, PUSHER_SECRET).'
    );
  }

  return new Pusher({
    appId,
    key,
    secret,
    cluster: process.env.PUSHER_CLUSTER || 'ap2',
    useTLS: true,
  });
}

export async function POST(req: NextRequest) {
  const log = createRequestLogger('POST /api/pusher', req);
  try {
    const { sessionId, event, data } = await req.json();
    const pusher = getPusherClient();
    await pusher.trigger(`session-${sessionId}`, event, data);
    log.info('pusher event triggered', { sessionId, event });
    return withRequestId(NextResponse.json({ success: true }), log.requestId);
  } catch (error) {
    log.error('pusher trigger failed', error);
    return withRequestId(
      NextResponse.json(
        {
          success: false,
          error: error instanceof Error ? error.message : 'Pusher trigger failed',
        },
        { status: 500 }
      ),
      log.requestId
    );
  }
}
