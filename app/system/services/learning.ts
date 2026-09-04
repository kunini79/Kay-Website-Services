import { QuizQuestion, TopicMastery } from '../types';

export const LEARNING_PATHS = [
  { id: 'nature-explorer', title: 'Nature Explorer', topics: ['Birds', 'Chicken', 'Plants', 'Ecosystems'] },
  { id: 'space-starter', title: 'Space Starter', topics: ['The Solar System', 'The Sun', 'Planets', 'Space Exploration'] },
  { id: 'history-builder', title: 'History Builder', topics: ['Ancient Egypt', 'Ancient Civilizations', 'Archaeology', 'Africa'] },
] as const;

export type QuizResult = {
  score: number;
  total: number;
  accuracy: number;
  xpEarned: number;
  isPerfect: boolean;
};

export function getMasteryLevel(mastery?: TopicMastery): number {
  return mastery?.level || 1;
}

export function selectAdaptiveQuestions(
  questions: QuizQuestion[],
  mastery?: TopicMastery
): QuizQuestion[] {
  const level = getMasteryLevel(mastery);
  const targetDifficulty = level >= 4 ? 'hard' : level >= 2 ? 'medium' : 'easy';
  const preferred = questions.filter((question) => (question.difficulty || 'medium') === targetDifficulty);
  return (preferred.length > 0 ? preferred : questions).slice(0, 5);
}

export function updateTopicMastery(
  previous: TopicMastery | undefined,
  result: QuizResult
): TopicMastery {
  const accuracy = result.total > 0 ? result.accuracy : 0;
  const nextLevel = accuracy >= 0.9
    ? Math.min(5, (previous?.level || 1) + 1)
    : accuracy < 0.6
      ? Math.max(1, (previous?.level || 1) - 1)
      : previous?.level || 1;
  const intervals = [1, 2, 4, 7, 14, 30];
  const reviewDays = intervals[nextLevel] || 30;

  return {
    attempts: (previous?.attempts || 0) + 1,
    correct: (previous?.correct || 0) + result.score,
    accuracy,
    level: nextLevel,
    lastAttemptAt: Date.now(),
    nextReviewAt: Date.now() + reviewDays * 24 * 60 * 60 * 1000,
  };
}