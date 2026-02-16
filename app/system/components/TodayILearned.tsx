import React, { useState, useEffect } from 'react';
import { getDailyHighlight, markHighlightViewed, DailyHighlight } from '../services/dailyHighlights';
import { Calendar, Lightbulb, History, Target, Sparkles } from 'lucide-react';

interface TodayILearnedProps {
  onTopicClick: (topic: string) => void;
}

export const TodayILearned: React.FC<TodayILearnedProps> = ({ onTopicClick }) => {
  const [highlight, setHighlight] = useState<DailyHighlight | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    const dailyHighlight = getDailyHighlight();
    setHighlight(dailyHighlight);
  }, []);

  if (!highlight) return null;

  const handleViewHighlight = () => {
    markHighlightViewed(new Date().toDateString());
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="max-w-7xl mx-auto mb-12 animate-in fade-in slide-in-from-top-4">
      {/* Compact Header - Always Visible */}
      <div
        className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-3xl p-6 shadow-2xl cursor-pointer hover:shadow-3xl transition-all"
        onClick={handleViewHighlight}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white flex items-center gap-2">
                Today I Learned! <Sparkles className="w-6 h-6" />
              </h2>
              <p className="text-white/90 text-sm font-medium">{highlight.date}</p>
            </div>
          </div>
          <button className="text-white/80 hover:text-white text-3xl font-bold transition-transform">
            {isExpanded ? '−' : '+'}
          </button>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="mt-6 space-y-4 animate-in slide-in-from-top-2">
            {/* Fun Fact */}
            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-5 border-2 border-white/30">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-6 h-6 text-yellow-300 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-white text-lg mb-2">💡 Fun Fact of the Day</h3>
                  <p className="text-white/95 text-lg leading-relaxed">{highlight.funFact}</p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Featured Topic */}
              <div className="bg-white/15 backdrop-blur-md rounded-2xl p-5 border-2 border-white/30">
                <div className="flex items-start gap-3 mb-3">
                  <Target className="w-6 h-6 text-green-300 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-bold text-white text-lg mb-2">🎯 Featured Topic</h3>
                    <p className="text-white/95 mb-3">{highlight.featuredTopic}</p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onTopicClick(highlight.featuredTopic);
                      }}
                      className="bg-white/25 hover:bg-white/40 text-white px-4 py-2 rounded-full font-semibold text-sm transition-all transform hover:scale-105"
                    >
                      Learn More →
                    </button>
                  </div>
                </div>
              </div>

              {/* On This Day */}
              <div className="bg-white/15 backdrop-blur-md rounded-2xl p-5 border-2 border-white/30">
                <div className="flex items-start gap-3">
                  <History className="w-6 h-6 text-blue-300 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-white text-lg mb-2">📅 On This Day</h3>
                    <p className="text-white/95">{highlight.onThisDay}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Daily Challenge */}
            <div className="bg-gradient-to-r from-yellow-400/20 to-orange-400/20 backdrop-blur-md rounded-2xl p-5 border-2 border-yellow-300/50">
              <div className="flex items-start gap-3">
                <div className="bg-yellow-300/30 rounded-full p-2">
                  <span className="text-3xl">🎯</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-white text-lg mb-2">Today's Challenge</h3>
                  <p className="text-white/95 text-lg font-medium">{highlight.challenge}</p>
                  <p className="text-white/75 text-sm mt-2">Complete this and earn 25 bonus points!</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Stats Bar */}
      {isExpanded && (
        <div className="mt-4 bg-white rounded-2xl shadow-lg p-4 flex justify-around items-center">
          <div className="text-center">
            <p className="text-3xl font-black text-purple-600">365</p>
            <p className="text-xs text-gray-600 font-semibold">Days of Learning</p>
          </div>
          <div className="w-px h-12 bg-gray-200"></div>
          <div className="text-center">
            <p className="text-3xl font-black text-pink-600">∞</p>
            <p className="text-xs text-gray-600 font-semibold">Topics to Explore</p>
          </div>
          <div className="w-px h-12 bg-gray-200"></div>
          <div className="text-center">
            <p className="text-3xl font-black text-orange-600">🎓</p>
            <p className="text-xs text-gray-600 font-semibold">Always Learning</p>
          </div>
        </div>
      )}
    </div>
  );
};
