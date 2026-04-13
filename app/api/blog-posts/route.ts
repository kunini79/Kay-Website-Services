import { NextRequest, NextResponse } from 'next/server';
import { createRequestLogger, withRequestId } from '@/lib/logger';
import { getPublishedBlogPosts } from '@/lib/blog';

export async function GET(request: NextRequest) {
  const log = createRequestLogger('GET /api/blog-posts', request);

  try {
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? Number(limitParam) : null;

    const posts = await getPublishedBlogPosts();
    const result =
      limit && Number.isFinite(limit) && limit > 0
        ? posts.slice(0, limit)
        : posts;

    log.info('public blog posts retrieved', { count: result.length });
    return withRequestId(
      NextResponse.json(
        {
          message: 'Blog posts retrieved',
          count: result.length,
          posts: result,
        },
        { status: 200 }
      ),
      log.requestId
    );
  } catch (error) {
    log.error('failed to retrieve public blog posts', error);
    return withRequestId(
      NextResponse.json(
        { message: 'Failed to load blog posts' },
        { status: 500 }
      ),
      log.requestId
    );
  }
}
