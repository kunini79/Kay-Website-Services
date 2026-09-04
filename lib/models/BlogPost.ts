import mongoose, { Document, Schema } from 'mongoose';

export interface IBlogPostSection {
  heading: string;
  body: string[];
}

export interface IBlogPost extends Document {
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  readTime: string;
  featured: boolean;
  status: 'draft' | 'published';
  tags: string[];
  intro: string[];
  sections: IBlogPostSection[];
  closingCta: string;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const blogPostSectionSchema = new Schema<IBlogPostSection>(
  {
    heading: {
      type: String,
      required: true,
      trim: true,
    },
    body: {
      type: [String],
      default: [],
    },
  },
  { _id: false }
);

const blogPostSchema = new Schema<IBlogPost>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      trim: true,
      lowercase: true,
    },
    excerpt: {
      type: String,
      required: [true, 'Excerpt is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    readTime: {
      type: String,
      default: '5 min read',
      trim: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },
    tags: {
      type: [String],
      default: [],
    },
    intro: {
      type: [String],
      default: [],
    },
    sections: {
      type: [blogPostSectionSchema],
      default: [],
    },
    closingCta: {
      type: String,
      default: '',
      trim: true,
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

blogPostSchema.index({ slug: 1 }, { unique: true });
blogPostSchema.index({ status: 1, featured: -1, publishedAt: -1 });

export const BlogPostModel =
  mongoose.models.BlogPost ||
  mongoose.model<IBlogPost>('BlogPost', blogPostSchema);
