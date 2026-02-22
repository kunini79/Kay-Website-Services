
  { id: 'mimi', name: 'MiMi', image: '/ThinkBox/avatars/mimi.png', unlockAchievement: 'first_read' },
  { id: 'dogo', name: 'Dogo', image: '/ThinkBox/avatars/dogo.png', unlockAchievement: 'read_10' },
  { id: 'badosh', name: 'Badosh', image: '/ThinkBox/avatars/badosh.png', unlockAchievement: 'legend' },
];
}

  { id: 'first_read',      icon: '🌱', title: 'First Steps',       description: 'Read your very first article' },
  { id: 'read_10',         icon: '📚', title: 'Bookworm',          description: 'Read 10 articles' },
  { id: 'read_25',         icon: '🧠', title: 'Knowledge Seeker',  description: 'Read 25 articles' },
  { id: 'read_50',         icon: '🎓', title: 'Scholar',           description: 'Read 50 articles' },
  { id: 'streak_3',        icon: '🔥', title: 'On Fire',           description: 'Keep a 3-day streak' },
  { id: 'streak_7',        icon: '💪', title: 'Dedicated',         description: 'Keep a 7-day streak' },
  { id: 'streak_30',       icon: '👑', title: 'Legend',            description: 'Keep a 30-day streak' },
  { id: 'all_categories',  icon: '🗺️', title: 'Explorer',          description: 'Read in all 9 categories' },
  { id: 'backpack_5',      icon: '🎒', title: 'Collector',         description: 'Save 5 articles to your Backpack' },
  { id: 'backpack_20',     icon: '📦', title: 'Archivist',         description: 'Save 20 articles to your Backpack' },
  { id: 'quiz_1',          icon: '✏️', title: 'Quiz Taker',        description: 'Complete your first quiz' },
  { id: 'quiz_5',          icon: '🏆', title: 'Quiz Champion',     description: 'Complete 5 quizzes' },
  { id: 'quiz_perfect',    icon: '⭐', title: 'Perfect Score',     description: 'Get 100% on a quiz' },
  { id: 'quiz_perfect_3',  icon: '🌟', title: 'Quiz Master',       description: 'Get 3 perfect quiz scores' },
  { id: 'level_5',         icon: '🚀', title: 'Level Up',          description: 'Reach Level 5' },
  { id: 'level_10',        icon: '💎', title: 'Elite',             description: 'Reach Level 10' },
  { id: 'daily_challenge', icon: '☀️', title: 'Daily Hero',        description: 'Complete the Topic of the Day' },
];

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

  icon: string;
  description: string;
  cssClass: string;
}

  textSize: 'normal' | 'large' | 'xl';
  dyslexicFont: boolean;
  avatar?: AvatarId;
  theme?: string;
}

  textSize: 'normal',
  dyslexicFont: false,
};
