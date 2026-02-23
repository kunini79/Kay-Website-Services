import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { ActivityLog } from '@/lib/models/ActivityLog';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    await connectDB();
    const log = await ActivityLog.create({
      userId: body.userId,
      email: body.email,
      event: body.event,
      details: body.details,
    });
    return NextResponse.json({ success: true, log });
  } catch (err) {
    return NextResponse.json({ success: false, error: typeof err === 'object' && err !== null ? (err as any).message : String(err) }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    const event = url.searchParams.get('event');
    const query: any = {};
    if (userId) query.userId = userId;
    if (event) query.event = event;
    const logs = await ActivityLog.find(query).sort({ createdAt: -1 }).limit(100);
    return NextResponse.json({ success: true, logs });
  } catch (err) {
    return NextResponse.json({ success: false, error: typeof err === 'object' && err !== null ? (err as any).message : String(err) }, { status: 500 });
  }
}
