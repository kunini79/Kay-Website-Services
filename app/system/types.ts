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
  BACKPACK = 'BACKPACK' // New view state
}

export enum Category {
  ANIMALS = 'Animals & Nature',
  SCIENCE = 'Science & Space',
  HISTORY = 'History & Civilizations',
  PEOPLE = 'People & Leaders',
  WORLD = 'World & Places',
  ARTS = 'Arts & Music',
  SPORTS = 'Sports & Games',
  TECH = 'Technology',
  READING = 'Reading & Stories'
}

export interface CategoryConfig {
  icon: string;
  description: string;
  cssClass: string;
}

export interface UserSettings {
  textSize: 'normal' | 'large' | 'xl';
  dyslexicFont: boolean;
}

export const DEFAULT_SETTINGS: UserSettings = {
  textSize: 'normal',
  dyslexicFont: false,
};
