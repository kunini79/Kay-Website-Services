import { Article } from '../types';

export interface OfflineTopic {
  id: number;
  title: string;
  summary: string;
  url?: string;
  thumbnail?: string | null; // data URL when downloaded with images
}

let cachedTopics: OfflineTopic[] | null = null;

export async function loadOfflineTopics(): Promise<OfflineTopic[]> {
  if (cachedTopics) return cachedTopics;
  try {
    const res = await fetch('/offline/topics.json', { cache: 'force-cache' });
    if (!res.ok) throw new Error(`status ${res.status}`);
    const data = await res.json();
    if (Array.isArray(data)) {
      cachedTopics = data as OfflineTopic[];
      return cachedTopics;
    }
    throw new Error('invalid data');
  } catch (err) {
    console.warn('[offline] failed to load topics.json', err);
    cachedTopics = [];
    return cachedTopics;
  }
}

export async function getOfflineTopic(title: string): Promise<OfflineTopic | null> {
  const list = await loadOfflineTopics();
  const lower = title.trim().toLowerCase();
  return list.find(t => t.title.trim().toLowerCase() === lower) || null;
}

export async function getOfflineQuickPicks(count = 12): Promise<OfflineTopic[]> {
  const list = await loadOfflineTopics();
  if (!list.length) return [];
  const shuffled = [...list].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function toArticleFromOffline(topic: OfflineTopic): Article {
  return {
    title: topic.title,
    intro: topic.summary || `Learn about ${topic.title}.`,
    funFact: '',
    category: 'Offline',
    sections: [
      {
        subtitle: 'Quick Summary',
        content: topic.summary || 'No summary available yet.'
      }
    ],
    relatedTopics: []
  };
}
