import { connectDB } from '@/lib/db';
import { ThinkBoxArticleModel } from '@/lib/models/ThinkBoxArticle';
import { Article } from '@/app/system/types';

type ArticleDocument = Article & { _id?: unknown };

function serializeArticle(source: ArticleDocument): Article & { id: string } {
  return {
    ...source,
    id: String(source._id || source.topicId),
  };
}

export async function getPublishedThinkBoxArticle(topicId: string) {
  await connectDB();
  const article = await ThinkBoxArticleModel.findOne({
    topicId: topicId.trim().toLowerCase(),
    reviewStatus: 'published',
  }).lean<ArticleDocument | null>();

  return article ? serializeArticle(article) : null;
}

export async function getPublishedThinkBoxArticles() {
  await connectDB();
  const articles = await ThinkBoxArticleModel.find({ reviewStatus: 'published' })
    .sort({ title: 1 })
    .lean<ArticleDocument[]>();
  return articles.map(serializeArticle);
}

export async function getThinkBoxArticles() {
  await connectDB();
  const articles = await ThinkBoxArticleModel.find({})
    .sort({ updatedAt: -1 })
    .lean<ArticleDocument[]>();
  return articles.map(serializeArticle);
}

export async function getThinkBoxArticleById(id: string) {
  await connectDB();
  const article = await ThinkBoxArticleModel.findById(id).lean<ArticleDocument | null>();
  return article ? serializeArticle(article) : null;
}