import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAuth();

    if (!auth) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        message: 'Authenticated',
        user: {
          userId: auth.userId,
          email: auth.email,
          name: auth.name,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Auth verification error:', error);
    return NextResponse.json(
      { message: 'Auth verification failed' },
      { status: 500 }
    );
  }
}
