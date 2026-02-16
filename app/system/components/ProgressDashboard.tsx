import React, { useState, useEffect } from 'react';
import { loadProgress, getProgressSummary, UserProgress } from '../services/progressTracking';
import { Trophy, BookOpen, Target, Flame, Star, Award, TrendingUp } from 'lucide-react';

interface ProgressDashboardProps {
  onClose: () => void;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({ onClose }) => {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    const userProgress = loadProgress();
    const progressSummary = getProgressSummary(userProgress);
    setProgress(userProgress);
    setSummary(progressSummary);
  }, []);

  if (!progress || !summary) {
    return null;
  }

  const earnedBadges = progress.badges.filter(b => b.earned);
  const unearnedBadges = progress.badges.filter(b => !b.earned);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl p-8 max-w-4xl w-full shadow-2xl my-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#0066CC] to-[#FF6B35] mb-2">
              Your Progress Dashboard 📊
            </h2>
            <p className="text-gray-600">Keep up the amazing work, young learner! 🌟</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-3xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<BookOpen className="w-8 h-8" />}
            label="Articles Read"
            value={summary.articlesRead}
            color="blue"
          />
          <StatCard
            icon={<Target className="w-8 h-8" />}
            label="Quizzes Taken"
            value={summary.quizzesCompleted}
            color="orange"
          />
          <StatCard
            icon={<Flame className="w-8 h-8" />}
            label="Day Streak"
            value={summary.currentStreak}
            color="red"
          />
          <StatCard
            icon={<Star className="w-8 h-8" />}
            label="Total Points"
            value={summary.totalPoints}
            color="yellow"
          />
        </div>

        {/* Level Progress */}
        <div className="bg-gradient-to-r from-[#0066CC]/10 to-[#FF6B35]/10 rounded-2xl p-6 mb-8 border-2 border-[#FFD23F]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-2xl font-black text-gray-800">Level {summary.level}</h3>
              <p className="text-gray-600">Learning Champion</p>
            </div>
            <div className="text-4xl">🎖️</div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-gradient-to-r from-[#0066CC] to-[#FF6B35] h-4 rounded-full transition-all duration-500"
              style={{ width: `${(summary.totalPoints % 100)}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {100 - (summary.totalPoints % 100)} points to Level {summary.level + 1}
          </p>
        </div>

        {/* Quiz Performance */}
        {summary.quizzesCompleted > 0 && (
          <div className="bg-blue-50 rounded-2xl p-6 mb-8 border-2 border-blue-200">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-bold text-gray-800">Quiz Performance</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Average Score</p>
                <p className="text-3xl font-black text-blue-600">{summary.avgQuizScore}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Longest Streak</p>
                <p className="text-3xl font-black text-orange-600">{summary.longestStreak} days</p>
              </div>
            </div>
          </div>
        )}

        {/* Earned Badges */}
        {earnedBadges.length > 0 && (
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Award className="w-6 h-6 text-yellow-500" />
              Your Badges ({earnedBadges.length}/{progress.badges.length})
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {earnedBadges.map(badge => (
                <div
                  key={badge.id}
                  className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-4 border-2 border-yellow-300 text-center transform hover:scale-105 transition-all"
                >
                  <div className="text-4xl mb-2">{badge.icon}</div>
                  <h4 className="font-bold text-gray-800 text-sm mb-1">{badge.name}</h4>
                  <p className="text-xs text-gray-600">{badge.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Next Badges */}
        {unearnedBadges.length > 0 && (
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Trophy className="w-6 h-6 text-gray-400" />
              Next Badges to Earn
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {unearnedBadges.slice(0, 4).map(badge => (
                <div
                  key={badge.id}
                  className="bg-gray-100 rounded-2xl p-4 border-2 border-gray-300 text-center opacity-60"
                >
                  <div className="text-4xl mb-2 grayscale">{badge.icon}</div>
                  <h4 className="font-bold text-gray-800 text-sm mb-1">{badge.name}</h4>
                  <p className="text-xs text-gray-600">{badge.requirement}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Category Breakdown */}
        {Object.keys(progress.articlesReadByCategory).length > 0 && (
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Topics You've Explored 🗺️
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(progress.articlesReadByCategory)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 6)
                .map(([category, count]) => (
                  <div
                    key={category}
                    className="bg-gray-50 rounded-xl p-3 border border-gray-200"
                  >
                    <p className="text-sm text-gray-600">{category}</p>
                    <p className="text-2xl font-bold text-[#0066CC]">{count}</p>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Close Button */}
        <div className="mt-8 text-center">
          <button
            onClick={onClose}
            className="px-8 py-4 bg-gradient-to-r from-[#0066CC] to-[#FF6B35] text-white rounded-full font-bold hover:shadow-lg transition-all"
          >
            Continue Learning 🚀
          </button>
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: 'blue' | 'orange' | 'red' | 'yellow';
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, color }) => {
  const colorClasses = {
    blue: 'from-blue-50 to-blue-100 border-blue-300 text-blue-600',
    orange: 'from-orange-50 to-orange-100 border-orange-300 text-orange-600',
    red: 'from-red-50 to-red-100 border-red-300 text-red-600',
    yellow: 'from-yellow-50 to-yellow-100 border-yellow-300 text-yellow-600',
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} rounded-2xl p-4 border-2 text-center`}>
      <div className="flex justify-center mb-2">{icon}</div>
      <p className="text-3xl font-black mb-1">{value}</p>
      <p className="text-sm font-semibold opacity-80">{label}</p>
    </div>
  );
};
