import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { DemoRequest } from '@/lib/models/DemoRequest';
import { verifyAdminSession } from '@/lib/auth';
import { rateLimit, getClientIp } from '@/utils/rateLimit';
import { createRequestLogger, withRequestId } from '@/lib/logger';

export async function GET(request: NextRequest) {
  const log = createRequestLogger('GET /api/admin/demo-requests', request);
  const clientIp = getClientIp(request);

  // Rate limit: 30 requests per 15 minutes per IP
  const rateLimitResult = rateLimit(`admin-requests:${clientIp}`, 30, 900_000);

  if (!rateLimitResult.success) {
    log.warn('rate limited', { clientIp });
    return withRequestId(
      NextResponse.json(
        { message: 'Too many requests. Please try again later.' },
        {
          status: 429,
          headers: { 'Retry-After': String(rateLimitResult.retryAfter) },
        }
      ),
      log.requestId
    );
  }

  // Verify signed admin session cookie
  if (!(await verifyAdminSession())) {
    log.warn('unauthorized admin access attempt', { clientIp });
    return withRequestId(
      NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      ),
      log.requestId
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

    log.info('demo requests retrieved', { count: demoRequests.length, status });
    return withRequestId(
      NextResponse.json(
        {
          message: 'Demo requests retrieved',
          count: demoRequests.length,
          requests: demoRequests,
        },
        { status: 200 }
      ),
      log.requestId
    );
  } catch (error) {
    log.error('failed to fetch demo requests', error);
    return withRequestId(
      NextResponse.json(
        { message: 'Failed to fetch demo requests' },
        { status: 500 }
      ),
      log.requestId
    );
  }
}
