import { NextRequest, NextResponse } from 'next/server';
import Pusher from 'pusher';

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
  try {
    const { sessionId, event, data } = await req.json();
    const pusher = getPusherClient();
    await pusher.trigger(`session-${sessionId}`, event, data);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Pusher error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Pusher trigger failed',
      },
      { status: 500 }
    );
  }
}
