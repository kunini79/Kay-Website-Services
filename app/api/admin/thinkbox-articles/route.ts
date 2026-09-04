import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { createRequestLogger, ValidationError, withRequestId } from '@/lib/logger';
import { ThinkBoxArticleModel } from '@/lib/models/ThinkBoxArticle';
import { getThinkBoxArticles } from '@/lib/thinkbox';
import { getClientIp, rateLimit } from '@/utils/rateLimit';

function strings(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string').map((item) => item.trim()).filter(Boolean)
    : [];
}

export function parseArticle(body: Record<string, unknown>) {
  const topicId = typeof body.topicId === 'string' ? body.topicId.trim().toLowerCase() : '';
  const title = typeof body.title === 'string' ? body.title.trim() : '';
  const intro = typeof body.intro === 'string' ? body.intro.trim() : '';
  const category = typeof body.category === 'string' ? body.category.trim() : '';
  const imageSeed = typeof body.imageSeed === 'string' ? body.imageSeed.trim() : '';
  const funFact = typeof body.funFact === 'string' ? body.funFact.trim() : '';
  const relatedTopics = strings(body.relatedTopics);
  const sections = Array.isArray(body.sections)
    ? body.sections.map((section) => {
        const value = section as { subtitle?: unknown; content?: unknown };
        return {
          subtitle: typeof value.subtitle === 'string' ? value.subtitle.trim() : '',
          content: typeof value.content === 'string' ? value.content.trim() : '',
        };
      }).filter((section) => section.subtitle && section.content)
    : [];
  const reviewStatus = ['ai-draft', 'review', 'published', 'needs-update'].includes(String(body.reviewStatus))
    ? body.reviewStatus
    : 'review';
  const ageRange = Array.isArray(body.ageRange) && body.ageRange.length === 2
    ? body.ageRange.map(Number)
    : [8, 12];
  const quiz = Array.isArray(body.quiz)
    ? body.quiz.map((item) => {
        const value = item as { question?: unknown; options?: unknown; correctAnswer?: unknown; explanation?: unknown };
        const options = strings(value.options);
        return {
          question: typeof value.question === 'string' ? value.question.trim() : '',
          options,
          correctAnswer: Number(value.correctAnswer),
          explanation: typeof value.explanation === 'string' ? value.explanation.trim() : '',
        };
      }).filter((item) => item.question && item.options.length === 4 && Number.isInteger(item.correctAnswer) && item.correctAnswer >= 0 && item.correctAnswer < 4 && item.explanation)
    : [];

  if (!topicId || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(topicId)) throw new ValidationError('Valid topicId is required');
  if (!title || !intro || !category || !imageSeed) throw new ValidationError('Title, intro, category, and imageSeed are required');
  if (sections.length === 0) throw new ValidationError('Add at least one valid section');
  if (ageRange.length !== 2 || ageRange.some((age) => !Number.isFinite(age) || age < 5 || age > 18)) {
    throw new ValidationError('ageRange must contain ages between 5 and 18');
  }

  return { topicId, title, intro, funFact, sections, relatedTopics, category, imageSeed, ageRange, reviewStatus, quiz };
}

async function admin(request: NextRequest, route: string) {
  const log = createRequestLogger(route, request);
  const clientIp = getClientIp(request);
  const limit = rateLimit(`admin-thinkbox:${clientIp}`, 60, 900_000);
  if (!limit.success) return withRequestId(NextResponse.json({ message: 'Too many requests' }, { status: 429 }), log.requestId);
  if (!(await verifyAdminSession())) return withRequestId(NextResponse.json({ message: 'Unauthorized' }, { status: 401 }), log.requestId);
  return { log };
}

export async function GET(request: NextRequest) {
  const auth = await admin(request, 'GET /api/admin/thinkbox-articles');
  if (auth instanceof Response) return auth;
  try {
    const articles = await getThinkBoxArticles();
    return withRequestId(NextResponse.json({ articles }, { status: 200 }), auth.log.requestId);
  } catch (error) {
    auth.log.error('failed to retrieve ThinkBox articles', error);
    return withRequestId(NextResponse.json({ message: 'Failed to load articles' }, { status: 500 }), auth.log.requestId);
  }
}

export async function POST(request: NextRequest) {
  const auth = await admin(request, 'POST /api/admin/thinkbox-articles');
  if (auth instanceof Response) return auth;
  try {
    await connectDB();
    const payload = parseArticle((await request.json()) as Record<string, unknown>);
    const existing = await ThinkBoxArticleModel.exists({ topicId: payload.topicId });
    if (existing) throw new ValidationError('An article already uses this topicId');
    const article = await ThinkBoxArticleModel.create(payload);
    return withRequestId(NextResponse.json({ articleId: String(article._id) }, { status: 201 }), auth.log.requestId);
  } catch (error) {
    if (error instanceof ValidationError) return withRequestId(NextResponse.json({ message: error.message }, { status: 400 }), auth.log.requestId);
    auth.log.error('failed to create ThinkBox article', error);
    return withRequestId(NextResponse.json({ message: 'Failed to create article' }, { status: 500 }), auth.log.requestId);
  }
}