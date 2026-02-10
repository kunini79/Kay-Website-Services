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
  ANIMALS = 'Animals',
  SCIENCE = 'Science',
  SPORTS = 'Sports and Recreation',
  ARTS = 'Arts',
  READING = 'Reading and Writing',
  PEOPLE = 'People',
  PLACES = 'Places',
  HISTORY = 'History',
  SOCIAL_STUDIES = 'Social Studies',
  GAMES = 'Games and Fun'
}