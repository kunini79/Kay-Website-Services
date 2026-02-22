export interface ArticleSection {
  subtitle: string;
  content: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Article {
  title: string;
  intro: string;
  funFact: string;
  sections: ArticleSection[];
  relatedTopics: string[];
  category: string;
  imageSeed?: string;
  quiz?: QuizQuestion[];
}

export interface TopicPreview {
  title: string;
  category: string;
  description: string;
}

export interface SavedArticle {
  title: string;
  category: string;
  dateAdded: number;
}

export enum ViewState {
  HOME = 'HOME',
  ARTICLE = 'ARTICLE',
  LOADING = 'LOADING',
  ERROR = 'ERROR',
  BACKPACK = 'BACKPACK',
  PROFILE = 'PROFILE',
}

export interface ReadHistoryItem {
  title: string;
  category: string;
  readAt: number; // timestamp
}

export type AvatarId = 'mimi' | 'dogo' | 'badosh';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: number; // timestamp when unlocked, undefined = locked
  unlocksAvatar?: AvatarId;
  unlocksTheme?: string;
}

export interface AvatarMeta {
  id: AvatarId;
  name: string;
  image: string; // path to image
  unlockAchievement?: string; // achievement id
}

export interface CategoryConfig {
  icon: string;
  description: string;
  cssClass: string;
}

export interface UserSettings {
  textSize: 'normal' | 'large' | 'xl';
  dyslexicFont: boolean;
  avatar?: AvatarId;
  theme?: string;
}
