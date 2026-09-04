import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { createRequestLogger, ValidationError, withRequestId } from '@/lib/logger';
import { ThinkBoxArticleModel } from '@/lib/models/ThinkBoxArticle';
import { getThinkBoxArticleById } from '@/lib/thinkbox';
import { getClientIp, rateLimit } from '@/utils/rateLimit';
import { parseArticle } from '@/app/api/admin/thinkbox-articles/route';

async function admin(request: NextRequest, route: string) {
  const log = createRequestLogger(route, request);
  const clientIp = getClientIp(request);
  const limit = rateLimit(`admin-thinkbox:${clientIp}`, 60, 900_000);
  if (!limit.success) return withRequestId(NextResponse.json({ message: 'Too many requests' }, { status: 429 }), log.requestId);
  if (!(await verifyAdminSession())) return withRequestId(NextResponse.json({ message: 'Unauthorized' }, { status: 401 }), log.requestId);
  return { log };
}

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const auth = await admin(request, 'GET /api/admin/thinkbox-articles/[id]');
  if (auth instanceof Response) return auth;
  try {
    const article = await getThinkBoxArticleById((await context.params).id);
    if (!article) return withRequestId(NextResponse.json({ message: 'Article not found' }, { status: 404 }), auth.log.requestId);
    return withRequestId(NextResponse.json({ article }, { status: 200 }), auth.log.requestId);
  } catch (error) {
    auth.log.error('failed to retrieve ThinkBox article', error);
    return withRequestId(NextResponse.json({ message: 'Failed to load article' }, { status: 500 }), auth.log.requestId);
  }
}

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const auth = await admin(request, 'PUT /api/admin/thinkbox-articles/[id]');
  if (auth instanceof Response) return auth;
  try {
    await connectDB();
    const id = (await context.params).id;
    const body = (await request.json()) as Record<string, unknown>;
    const payload = parseArticle(body);
    const topicId = payload.topicId;
    const duplicate = await ThinkBoxArticleModel.exists({ topicId, _id: { $ne: id } });
    if (duplicate) throw new ValidationError('Another article uses this topicId');
    const article = await ThinkBoxArticleModel.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
    if (!article) return withRequestId(NextResponse.json({ message: 'Article not found' }, { status: 404 }), auth.log.requestId);
    return withRequestId(NextResponse.json({ message: 'Article updated' }, { status: 200 }), auth.log.requestId);
  } catch (error) {
    if (error instanceof ValidationError) return withRequestId(NextResponse.json({ message: error.message }, { status: 400 }), auth.log.requestId);
    auth.log.error('failed to update ThinkBox article', error);
    return withRequestId(NextResponse.json({ message: 'Failed to update article' }, { status: 500 }), auth.log.requestId);
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const auth = await admin(request, 'DELETE /api/admin/thinkbox-articles/[id]');
  if (auth instanceof Response) return auth;
  try {
    await connectDB();
    const article = await ThinkBoxArticleModel.findByIdAndDelete((await context.params).id);
    if (!article) return withRequestId(NextResponse.json({ message: 'Article not found' }, { status: 404 }), auth.log.requestId);
    return withRequestId(NextResponse.json({ message: 'Article deleted' }, { status: 200 }), auth.log.requestId);
  } catch (error) {
    auth.log.error('failed to delete ThinkBox article', error);
    return withRequestId(NextResponse.json({ message: 'Failed to delete article' }, { status: 500 }), auth.log.requestId);
  }
}