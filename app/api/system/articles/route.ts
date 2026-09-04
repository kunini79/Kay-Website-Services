import { NextResponse } from 'next/server';
import { getPublishedThinkBoxArticles } from '@/lib/thinkbox';

export async function GET() {
  try {
    const articles = await getPublishedThinkBoxArticles();
    return NextResponse.json({ articles }, { status: 200 });
  } catch (error) {
    console.error('Failed to load ThinkBox article index:', error);
    return NextResponse.json({ message: 'Article repository unavailable' }, { status: 503 });
  }
}