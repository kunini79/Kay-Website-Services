import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { DemoRequest } from '@/lib/models/DemoRequest';

// Basic admin authentication
function verifyAdminAuth(request: NextRequest): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return false;

  const authHeader = request.headers.get('authorization');
  if (!authHeader) return false;

  const password = authHeader.replace('Bearer ', '');
  return password === adminPassword;
}

export async function GET(request: NextRequest) {
  // Verify admin authentication
  if (!verifyAdminAuth(request)) {
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
