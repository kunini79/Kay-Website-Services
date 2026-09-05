import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { lookupDictionary } from '@/lib/offlineDictionary';
import { lookupWordNet } from '@/lib/wordnetDictionary';

export async function GET(request: NextRequest) {
  const user = await verifyAuth();
  if (!user) return NextResponse.json({ message: 'Authentication required' }, { status: 401 });

  const word = new URL(request.url).searchParams.get('word')?.trim() || '';
  if (!word || word.length > 80) {
    return NextResponse.json({ message: 'Provide a word to look up' }, { status: 400 });
  }

  const curated = lookupDictionary(word);
  const entries = curated ? [curated] : await lookupWordNet(word, 8);
  return NextResponse.json({ word, entries, source: curated ? 'thinkbox' : 'wordnet-3.1' });
}
