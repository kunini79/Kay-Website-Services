import { NextRequest, NextResponse } from 'next/server';
import { getPublishedThinkBoxArticle } from '@/lib/thinkbox';

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ topicId: string }> }
) {
  try {
    const { topicId } = await context.params;
    const article = await getPublishedThinkBoxArticle(decodeURIComponent(topicId));
    if (!article) {
      return NextResponse.json({ message: 'Article not found' }, { status: 404 });
    }
    return NextResponse.json(article, { status: 200 });
  } catch (error) {
    console.error('Failed to load ThinkBox article:', error);
    return NextResponse.json({ message: 'Article repository unavailable' }, { status: 503 });
  }
}