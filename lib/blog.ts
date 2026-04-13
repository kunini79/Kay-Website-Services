import { blogPosts as defaultBlogPosts } from '@/data/blogPosts';
import { connectDB } from '@/lib/db';
import { BlogPostModel } from '@/lib/models/BlogPost';

export interface PublicBlogSection {
  heading: string;
  body: string[];
}

export interface PublicBlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  readTime: string;
  publishedAt: string;
  featured: boolean;
  status: 'draft' | 'published';
  tags: string[];
  intro: string[];
  sections: PublicBlogSection[];
  closingCta: string;
}

export interface AdminBlogPost extends PublicBlogPost {
  publishedAtInput: string;
  createdAt: string;
  updatedAt: string;
}

function formatPublishedDate(value: Date | string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value));
}

function asParagraphs(values: unknown): string[] {
  if (!Array.isArray(values)) return [];
  return values
    .filter((value): value is string => typeof value === 'string')
    .map((value) => value.trim())
    .filter(Boolean);
}

function asSections(values: unknown): PublicBlogSection[] {
  if (!Array.isArray(values)) return [];
  return values
    .map((value) => {
      if (!value || typeof value !== 'object') return null;
      const section = value as { heading?: unknown; body?: unknown };
      const heading =
        typeof section.heading === 'string' ? section.heading.trim() : '';
      const body = asParagraphs(section.body);
      if (!heading || body.length === 0) return null;
      return { heading, body };
    })
    .filter((value): value is PublicBlogSection => value !== null);
}

function serializePublicPost(source: {
  _id?: unknown;
  id?: unknown;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  readTime?: string;
  featured?: boolean;
  status?: 'draft' | 'published';
  tags?: unknown;
  intro?: unknown;
  sections?: unknown;
  closingCta?: string;
  publishedAt?: Date | string;
}): PublicBlogPost {
  return {
    id: String(source._id ?? source.id ?? source.slug),
    title: source.title,
    slug: source.slug,
    excerpt: source.excerpt,
    category: source.category,
    readTime: source.readTime || '5 min read',
    publishedAt: formatPublishedDate(source.publishedAt || new Date()),
    featured: Boolean(source.featured),
    status: source.status || 'published',
    tags: asParagraphs(source.tags),
    intro: asParagraphs(source.intro),
    sections: asSections(source.sections),
    closingCta: source.closingCta?.trim() || '',
  };
}

type SerializablePublicPost = Parameters<typeof serializePublicPost>[0];
type SerializableAdminPost = Parameters<typeof serializeAdminPost>[0];

function serializeAdminPost(source: {
  _id?: unknown;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  readTime?: string;
  featured?: boolean;
  status?: 'draft' | 'published';
  tags?: unknown;
  intro?: unknown;
  sections?: unknown;
  closingCta?: string;
  publishedAt?: Date | string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}): AdminBlogPost {
  const post = serializePublicPost(source);
  const publishedAt = new Date(source.publishedAt || new Date());
  const createdAt = new Date(source.createdAt || new Date());
  const updatedAt = new Date(source.updatedAt || new Date());

  return {
    ...post,
    publishedAtInput: publishedAt.toISOString().slice(0, 10),
    createdAt: createdAt.toISOString(),
    updatedAt: updatedAt.toISOString(),
  };
}

function getFallbackPosts(): PublicBlogPost[] {
  return defaultBlogPosts.map((post) =>
    serializePublicPost({
      ...post,
      status: 'published',
      publishedAt: post.publishedAt,
    })
  );
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export async function seedDefaultBlogPosts() {
  const connection = await connectDB();
  const collectionName = BlogPostModel.collection.collectionName;
  const database = connection?.connection?.db;

  if (!database) {
    throw new Error('Database connection is not ready');
  }

  const existingCollections = await database
    .listCollections({ name: collectionName })
    .toArray();

  if (existingCollections.length > 0) return;

  await BlogPostModel.insertMany(
    defaultBlogPosts.map((post) => ({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      category: post.category,
      readTime: post.readTime,
      featured: post.featured,
      status: 'published',
      tags: post.tags,
      intro: post.intro,
      sections: post.sections,
      closingCta: post.closingCta,
      publishedAt: new Date(post.publishedAt),
    }))
  );
}

export async function getPublishedBlogPosts(): Promise<PublicBlogPost[]> {
  try {
    await seedDefaultBlogPosts();
    const posts = await BlogPostModel.find({ status: 'published' })
      .sort({ featured: -1, publishedAt: -1, updatedAt: -1 })
      .lean<SerializablePublicPost[]>();

    return posts.map((post) => serializePublicPost(post));
  } catch (error) {
    console.error('Failed to load published blog posts, using fallback.', error);
    return getFallbackPosts();
  }
}

export async function getPublishedBlogPostBySlug(
  slug: string
): Promise<PublicBlogPost | null> {
  try {
    await seedDefaultBlogPosts();
    const post = await BlogPostModel.findOne({
      slug,
      status: 'published',
    }).lean<SerializablePublicPost | null>();

    if (!post) return null;
    return serializePublicPost(post);
  } catch (error) {
    console.error(`Failed to load blog post "${slug}", using fallback.`, error);
    const fallback = getFallbackPosts().find((post) => post.slug === slug);
    return fallback || null;
  }
}

export async function getAdminBlogPosts(): Promise<AdminBlogPost[]> {
  await seedDefaultBlogPosts();
  const posts = await BlogPostModel.find({})
    .sort({ featured: -1, publishedAt: -1, updatedAt: -1 })
    .lean<SerializableAdminPost[]>();

  return posts.map((post) => serializeAdminPost(post));
}

export async function getAdminBlogPostById(
  id: string
): Promise<AdminBlogPost | null> {
  await seedDefaultBlogPosts();
  const post = await BlogPostModel.findById(id).lean<SerializableAdminPost | null>();
  return post ? serializeAdminPost(post) : null;
}
