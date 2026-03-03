import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { DemoRequest } from '@/lib/models/DemoRequest';
import { verifyAdminSession } from '@/lib/auth';
import { rateLimit, getClientIp } from '@/utils/rateLimit';

export async function GET(request: NextRequest) {
  // Rate limit: 30 requests per 15 minutes per IP
  const clientIp = getClientIp(request);
  const rateLimitResult = rateLimit(`admin-requests:${clientIp}`, 30, 900_000);

  if (!rateLimitResult.success) {
    return NextResponse.json(
      { message: 'Too many requests. Please try again later.' },
      {
        status: 429,
        headers: { 'Retry-After': String(rateLimitResult.retryAfter) },
      }
    );
  }

  // Verify signed admin session cookie
  if (!(await verifyAdminSession())) {
    return NextResponse.json(
      { message: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    await connectDB();

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'pending';

    const demoRequests = await DemoRequest.find({
      status: status || undefined,
    })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(
      {
        message: 'Demo requests retrieved',
        count: demoRequests.length,
        requests: demoRequests,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching demo requests:', error);
    return NextResponse.json(
      { message: 'Failed to fetch demo requests' },
      { status: 500 }
    );
  }
}
