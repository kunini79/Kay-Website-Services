import mongoose, { Schema } from 'mongoose';

const sourceSchema = new Schema(
  {
    type: { type: String, enum: ['wikipedia', 'nasa', 'editorial', 'offline'] },
    title: String,
    url: String,
    accessedAt: String,
  },
  { _id: false }
);

const sectionSchema = new Schema(
  {
    subtitle: { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const quizSchema = new Schema(
  {
    question: { type: String, required: true, trim: true },
    options: { type: [String], required: true },
    correctAnswer: { type: Number, required: true, min: 0, max: 3 },
    explanation: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const thinkBoxArticleSchema = new Schema(
  {
    topicId: { type: String, required: true, unique: true, index: true, trim: true },
    title: { type: String, required: true, trim: true },
    intro: { type: String, required: true, trim: true },
    funFact: { type: String, default: '', trim: true },
    sections: { type: [sectionSchema], required: true },
    relatedTopics: { type: [String], default: [] },
    category: { type: String, required: true, trim: true, index: true },
    imageSeed: { type: String, required: true, trim: true },
    ageRange: { type: [Number], default: [8, 12] },
    source: { type: sourceSchema },
    reviewStatus: {
      type: String,
      enum: ['ai-draft', 'review', 'published', 'needs-update'],
      default: 'review',
      index: true,
    },
    quiz: { type: [quizSchema], default: [] },
  },
  { timestamps: true }
);

export const ThinkBoxArticleModel =
  mongoose.models.ThinkBoxArticle ||
  mongoose.model('ThinkBoxArticle', thinkBoxArticleSchema);