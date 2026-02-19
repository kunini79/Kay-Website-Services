export interface ArticleSection {
  subtitle: string;
  content: string;
}

export interface Article {
  title: string;
  intro: string;
  funFact: string;
  sections: ArticleSection[];
  relatedTopics: string[];
  category: string;
}

export interface TopicPreview {
  title: string;
  category: string;
  description: string;
}

export enum ViewState {
  HOME = 'HOME',
  ARTICLE = 'ARTICLE',
  LOADING = 'LOADING',
  ERROR = 'ERROR'
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
