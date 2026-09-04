import { Article, Category } from '../types';

export type KnowledgeSource = {
  type: 'wikipedia' | 'nasa' | 'editorial' | 'offline';
  title?: string;
  url?: string;
  accessedAt?: string;
};

export type TopicRecord = {
  id: string;
  title: string;
  aliases: string[];
  category?: Category | string;
  canonicalSource?: string;
  imageSeed: string;
  ageRange: [number, number];
};

const TOPIC_RECORDS: TopicRecord[] = [
  {
    id: 'chicken',
    title: 'Chicken',
    aliases: ['chickens', 'chicken bird'],
    category: Category.ANIMALS,
    canonicalSource: 'Chicken (bird)',
    imageSeed: 'Chicken (bird)',
    ageRange: [8, 12],
  },
  {
    id: 'birds',
    title: 'Birds',
    aliases: ['bird'],
    category: Category.ANIMALS,
    canonicalSource: 'Bird',
    imageSeed: 'Bird',
    ageRange: [8, 12],
  },
];

const normalizeTopic = (value: string) => value.trim().toLowerCase();

export function getTopicRecord(topic: string): TopicRecord | undefined {
  const normalized = normalizeTopic(topic);
  return TOPIC_RECORDS.find((record) =>
    [record.title, record.id, ...record.aliases].some(
      (value) => normalizeTopic(value) === normalized
    )
  );
}

export function getCanonicalTopicId(topic: string): string {
  return getTopicRecord(topic)?.id || normalizeTopic(topic).replace(/[^a-z0-9]+/g, '-');
}

export function getImageSeed(topic: string, fallback = topic): string {
  return getTopicRecord(topic)?.imageSeed || fallback;
}

export function enrichArticleMetadata(article: Article, requestedTopic: string): Article {
  const record = getTopicRecord(requestedTopic) || getTopicRecord(article.title);
  const canonicalSource = article.source?.title || record?.canonicalSource;

  return {
    ...article,
    topicId: article.topicId || record?.id || getCanonicalTopicId(requestedTopic),
    imageSeed: article.imageSeed || record?.imageSeed || requestedTopic,
    ageRange: article.ageRange || record?.ageRange || [8, 12],
    source: article.source || (canonicalSource ? {
      type: 'wikipedia',
      title: canonicalSource,
      url: `https://en.wikipedia.org/wiki/${encodeURIComponent(canonicalSource.replace(/ /g, '_'))}`,
    } : undefined),
    reviewStatus: article.reviewStatus || 'ai-draft',
  };
}