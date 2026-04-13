import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { createRequestLogger, ValidationError, withRequestId } from '@/lib/logger';
import { BlogPostModel } from '@/lib/models/BlogPost';
import { getAdminBlogPosts, seedDefaultBlogPosts, slugify } from '@/lib/blog';
import { getClientIp, rateLimit } from '@/utils/rateLimit';

type BlogInputSection = {
  heading?: unknown;
  body?: unknown;
};

function normalizeStringArray(values: unknown): string[] {
  if (!Array.isArray(values)) return [];
  return values
    .filter((value): value is string => typeof value === 'string')
    .map((value) => value.trim())
    .filter(Boolean);
}

function normalizeSections(values: unknown) {
  if (!Array.isArray(values)) return [];
  return values
    .map((value) => {
      const section = value as BlogInputSection;
      const heading =
        typeof section.heading === 'string' ? section.heading.trim() : '';
      const body = normalizeStringArray(section.body);
      if (!heading || body.length === 0) return null;
      return { heading, body };
    })
    .filter((value): value is { heading: string; body: string[] } => value !== null);
}

function parsePayload(body: Record<string, unknown>) {
  const title = typeof body.title === 'string' ? body.title.trim() : '';
  const slugSource = typeof body.slug === 'string' ? body.slug : title;
  const slug = slugify(slugSource);
  const excerpt = typeof body.excerpt === 'string' ? body.excerpt.trim() : '';
  const category = typeof body.category === 'string' ? body.category.trim() : '';
  const readTime =
    typeof body.readTime === 'string' && body.readTime.trim()
      ? body.readTime.trim()
      : '5 min read';
  const closingCta =
    typeof body.closingCta === 'string' ? body.closingCta.trim() : '';
  const status = body.status === 'draft' ? 'draft' : 'published';
  const featured = Boolean(body.featured);
  const tags = normalizeStringArray(body.tags);
  const intro = normalizeStringArray(body.intro);
  const sections = normalizeSections(body.sections);
  const publishedAtInput =
    typeof body.publishedAt === 'string' && body.publishedAt
      ? body.publishedAt
      : new Date().toISOString().slice(0, 10);
  const publishedAt = new Date(publishedAtInput);

  if (!title) throw new ValidationError('Title is required');
  if (!slug) throw new ValidationError('Slug is required');
  if (!excerpt) throw new ValidationError('Excerpt is required');
  if (!category) throw new ValidationError('Category is required');
  if (!Number.isFinite(publishedAt.getTime())) {
    throw new ValidationError('Published date is invalid');
  }
  if (intro.length === 0) {
    throw new ValidationError('Add at least one intro paragraph');
  }
  if (sections.length === 0) {
    throw new ValidationError('Add at least one content section');
  }

  return {
    title,
    slug,
    excerpt,
    category,
    readTime,
    closingCta,
    status,
    featured,
    tags,
    intro,
    sections,
    publishedAt,
  };
}

async function requireAdminSession(
  request: NextRequest,
  route: string
): Promise<{ log: ReturnType<typeof createRequestLogger>; clientIp: string } | Response> {
  const log = createRequestLogger(route, request);
  const clientIp = getClientIp(request);
  const rateLimitResult = rateLimit(`admin-blog:${clientIp}`, 60, 900_000);

  if (!rateLimitResult.success) {
    log.warn('rate limited', { clientIp, retryAfter: rateLimitResult.retryAfter });
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

  if (!(await verifyAdminSession())) {
    log.warn('unauthorized admin blog access attempt', { clientIp });
    return withRequestId(
      NextResponse.json({ message: 'Unauthorized' }, { status: 401 }),
      log.requestId
    );
  }

  return { log, clientIp };
}

export async function GET(request: NextRequest) {
  const auth = await requireAdminSession(request, 'GET /api/admin/blog-posts');
  if (auth instanceof Response) return auth;
  const { log } = auth;

  try {
    const posts = await getAdminBlogPosts();
    log.info('admin blog posts retrieved', { count: posts.length });
    return withRequestId(
      NextResponse.json(
        { message: 'Blog posts retrieved', count: posts.length, posts },
        { status: 200 }
      ),
      log.requestId
    );
  } catch (error) {
    log.error('failed to retrieve admin blog posts', error);
    return withRequestId(
      NextResponse.json(
        { message: 'Failed to load blog posts' },
        { status: 500 }
      ),
      log.requestId
    );
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminSession(request, 'POST /api/admin/blog-posts');
  if (auth instanceof Response) return auth;
  const { log } = auth;

  try {
    await seedDefaultBlogPosts();
    await connectDB();
    const body = (await request.json()) as Record<string, unknown>;
    const payload = parsePayload(body);

    const existingSlug = await BlogPostModel.findOne({ slug: payload.slug }).lean();
    if (existingSlug) {
      throw new ValidationError('Another post already uses this slug');
    }

    if (payload.featured) {
      await BlogPostModel.updateMany({}, { $set: { featured: false } });
    }

    const post = await BlogPostModel.create(payload);
    log.info('admin blog post created', { blogPostId: String(post._id), slug: post.slug });

    return withRequestId(
      NextResponse.json(
        { message: 'Blog post created', postId: String(post._id) },
        { status: 201 }
      ),
      log.requestId
    );
  } catch (error) {
    if (error instanceof ValidationError) {
      log.warn('admin blog post validation failed', { error: error.message });
      return withRequestId(
        NextResponse.json({ message: error.message }, { status: 400 }),
        log.requestId
      );
    }

    log.error('failed to create blog post', error);
    return withRequestId(
      NextResponse.json(
        { message: 'Failed to create blog post' },
        { status: 500 }
      ),
      log.requestId
    );
  }
}
