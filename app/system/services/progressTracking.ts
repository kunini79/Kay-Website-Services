// EncartaKids Achievement & Progress Tracking System

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: string;
  earned: boolean;
  earnedDate?: Date;
}

export interface UserProgress {
  articlesRead: number;
  articlesReadByCategory: Record<string, number>;
  quizzesCompleted: number;
  quizzesScore: number;
  currentStreak: number;
  longestStreak: number;
  lastVisit: Date;
  badges: Badge[];
  totalPoints: number;
}

// Available badges
export const AVAILABLE_BADGES: Badge[] = [
  {
    id: 'first-article',
    name: 'First Steps',
    description: 'Read your first article',
    icon: '🌟',
    requirement: 'Read 1 article',
    earned: false,
  },
  {
    id: 'bookworm',
    name: 'Bookworm',
    description: 'Read 10 articles',
    icon: '📚',
    requirement: 'Read 10 articles',
    earned: false,
  },
  {
    id: 'super-reader',
    name: 'Super Reader',
    description: 'Read 50 articles',
    icon: '🦸',
    requirement: 'Read 50 articles',
    earned: false,
  },
  {
    id: 'quiz-starter',
    name: 'Quiz Starter',
    description: 'Complete your first quiz',
    icon: '🎯',
    requirement: 'Complete 1 quiz',
    earned: false,
  },
  {
    id: 'quiz-champion',
    name: 'Quiz Champion',
    description: 'Score 100% on 5 quizzes',
    icon: '🏆',
    requirement: 'Perfect score on 5 quizzes',
    earned: false,
  },
  {
    id: 'streak-7',
    name: 'Week Warrior',
    description: 'Learn for 7 consecutive days',
    icon: '🔥',
    requirement: '7-day streak',
    earned: false,
  },
  {
    id: 'explorer',
    name: 'World Explorer',
    description: 'Read articles from all categories',
    icon: '🌍',
    requirement: 'Read from all 10 categories',
    earned: false,
  },
  {
    id: 'curious-mind',
    name: 'Curious Mind',
    description: 'Search for 25 topics',
    icon: '🔍',
    requirement: 'Search 25 times',
    earned: false,
  },
  {
    id: 'night-owl',
    name: 'Night Owl',
    description: 'Read an article after 8 PM',
    icon: '🦉',
    requirement: 'Read after 8 PM',
    earned: false,
  },
  {
    id: 'early-bird',
    name: 'Early Bird',
    description: 'Read an article before 7 AM',
    icon: '🐦',
    requirement: 'Read before 7 AM',
    earned: false,
  },
];

// Load progress from localStorage
export function loadProgress(): UserProgress {
  if (typeof window === 'undefined') {
    return getDefaultProgress();
  }

  const stored = localStorage.getItem('encartakids_progress');
  if (stored) {
    const progress = JSON.parse(stored);
    // Convert date strings back to Date objects
    progress.lastVisit = new Date(progress.lastVisit);
    progress.badges = progress.badges.map((b: Badge) => ({
      ...b,
      earnedDate: b.earnedDate ? new Date(b.earnedDate) : undefined,
    }));
    return progress;
  }
  return getDefaultProgress();
}

// Save progress to localStorage
export function saveProgress(progress: UserProgress): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('encartakids_progress', JSON.stringify(progress));
}

// Get default progress state
function getDefaultProgress(): UserProgress {
  return {
    articlesRead: 0,
    articlesReadByCategory: {},
    quizzesCompleted: 0,
    quizzesScore: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastVisit: new Date(),
    badges: AVAILABLE_BADGES.map(b => ({ ...b })),
    totalPoints: 0,
  };
}

// Track article read
export function trackArticleRead(category: string): UserProgress {
  const progress = loadProgress();
  
  // Increment total articles
  progress.articlesRead++;
  
  // Increment category count
  progress.articlesReadByCategory[category] = 
    (progress.articlesReadByCategory[category] || 0) + 1;
  
  // Update streak
  updateStreak(progress);
  
  // Add points
  progress.totalPoints += 10;
  
  // Check for badges
  checkAndAwardBadges(progress);
  
  saveProgress(progress);
  return progress;
}

// Update streak calculation
function updateStreak(progress: UserProgress): void {
  const now = new Date();
  const lastVisit = new Date(progress.lastVisit);
  
  // Check if last visit was yesterday
  const daysDiff = Math.floor((now.getTime() - lastVisit.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysDiff === 0) {
    // Same day, no change to streak
  } else if (daysDiff === 1) {
    // Consecutive day, increment streak
    progress.currentStreak++;
    if (progress.currentStreak > progress.longestStreak) {
      progress.longestStreak = progress.currentStreak;
    }
  } else {
    // Streak broken
    progress.currentStreak = 1;
  }
  
  progress.lastVisit = now;
}

// Track quiz completion
export function trackQuizCompletion(score: number, totalQuestions: number): UserProgress {
  const progress = loadProgress();
  
  progress.quizzesCompleted++;
  progress.quizzesScore += score;
  
  // Add points based on score
  const percentage = (score / totalQuestions) * 100;
  if (percentage === 100) {
    progress.totalPoints += 50; // Perfect score bonus
  } else if (percentage >= 80) {
    progress.totalPoints += 30;
  } else if (percentage >= 60) {
    progress.totalPoints += 20;
  } else {
    progress.totalPoints += 10;
  }
  
  checkAndAwardBadges(progress);
  saveProgress(progress);
  return progress;
}

// Check and award badges
function checkAndAwardBadges(progress: UserProgress): Badge[] {
  const newBadges: Badge[] = [];
  
  progress.badges.forEach(badge => {
    if (badge.earned) return;
    
    let shouldAward = false;
    
    switch (badge.id) {
      case 'first-article':
        shouldAward = progress.articlesRead >= 1;
        break;
      case 'bookworm':
        shouldAward = progress.articlesRead >= 10;
        break;
      case 'super-reader':
        shouldAward = progress.articlesRead >= 50;
        break;
      case 'quiz-starter':
        shouldAward = progress.quizzesCompleted >= 1;
        break;
      case 'quiz-champion':
        // Count perfect quizzes (simplified - you'd need more detailed tracking)
        shouldAward = progress.quizzesCompleted >= 5 && 
                     (progress.quizzesScore / progress.quizzesCompleted) >= 4.5;
        break;
      case 'streak-7':
        shouldAward = progress.currentStreak >= 7;
        break;
      case 'explorer':
        shouldAward = Object.keys(progress.articlesReadByCategory).length >= 10;
        break;
    }
    
    if (shouldAward) {
      badge.earned = true;
      badge.earnedDate = new Date();
      newBadges.push(badge);
      progress.totalPoints += 100; // Badge bonus
    }
  });
  
  return newBadges;
}

// Get progress summary
export function getProgressSummary(progress: UserProgress) {
  const earnedBadges = progress.badges.filter(b => b.earned);
  const totalBadges = progress.badges.length;
  const avgQuizScore = progress.quizzesCompleted > 0 
    ? (progress.quizzesScore / progress.quizzesCompleted) * 20 
    : 0;
  
  return {
    articlesRead: progress.articlesRead,
    quizzesCompleted: progress.quizzesCompleted,
    avgQuizScore: Math.round(avgQuizScore),
    currentStreak: progress.currentStreak,
    longestStreak: progress.longestStreak,
    earnedBadges: earnedBadges.length,
    totalBadges,
    badgeProgress: Math.round((earnedBadges.length / totalBadges) * 100),
    totalPoints: progress.totalPoints,
    level: Math.floor(progress.totalPoints / 100) + 1,
  };
}
