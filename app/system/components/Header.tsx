import React from 'react';
import Image from 'next/image';
import { Search, Dice5, Backpack, BookOpen, Trophy, User } from 'lucide-react';
import { getGuideCharacter, UserSettings } from '../types';
import { SettingsMenu } from './SettingsMenu';

interface HeaderProps {
  onSearch: (term: string) => void;
  onHome: () => void;
  onRandom: () => void;
  onBackpack: () => void;
  onProfile: () => void;
  searchFilter: string;
  onSearchFilterChange: (value: string) => void;
  streakCount?: number;
  userXP?: number;
  userLevel?: number;
  settings: UserSettings;
  onSettingsUpdate: (newSettings: UserSettings) => void;
  unlockedAchievementsCount?: number;
  isHome?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onSearch,
  onHome,
  onRandom,
  onBackpack,
  onProfile,
  searchFilter,
  onSearchFilterChange,
  streakCount = 1,
  userXP,
  userLevel,
  settings,
  onSettingsUpdate,
  unlockedAchievementsCount = 0,
  isHome = false,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchFilter.trim()) {
      onSearch(searchFilter);
    }
  };

  const guide = getGuideCharacter(userLevel || 1);

  return (
    <header className={`tb-navbar ${isHome ? 'tb-navbar--home' : ''}`} role="banner">
      <div className="tb-navbar-inner">
        {/* Logo */}
        <button
          onClick={onHome}
          className="tb-logo-pulse flex items-center gap-2 shrink-0"
          aria-label="ThinkBox home"
        >
          <Image
            src="/ThinkBox/Think Box Logo.png"
            alt="ThinkBox"
            width={480}
            height={184}
            priority
            style={{ height: '112px', width: 'auto' }}
          />
        </button>

        {/* Search Bar */}
        <div className="flex-1 flex gap-2 max-w-xl">
          <form onSubmit={handleSubmit} className="tb-search" role="search">
            <Search className="tb-search-icon" size={18} aria-hidden="true" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => onSearchFilterChange(e.target.value)}
              placeholder="Search topics..."
              aria-label="Search topics"
            />
          </form>

          {/* Surprise Me! */}
          <button
            onClick={onRandom}
            className="tb-btn-icon tb-btn-secondary"
            title="Surprise Me!"
            aria-label="Random topic"
          >
            <Dice5 size={22} />
          </button>
        </div>

        {/* Right section: Settings + Backpack + AI guide + Streak + Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={onBackpack}
            className="tb-btn-icon"
            style={{ position: 'relative' }}
            title="My Backpack"
            aria-label="View saved articles"
          >
            <Backpack size={22} />
          </button>

          <button
            onClick={() => window.dispatchEvent(new CustomEvent('tb-dictionary-open'))}
            className="tb-btn-icon tb-btn-secondary"
            title="Offline dictionary"
            aria-label="Open offline dictionary"
          >
            <BookOpen size={21} />
          </button>

          <SettingsMenu settings={settings} onUpdate={onSettingsUpdate} />

          {/* Current-level AI guide */}
          <button
            className="tb-btn-icon tb-btn-secondary"
            title={`${guide.name}, your Level ${userLevel || 1} AI guide`}
            aria-label={`Open ${guide.name}, your Level ${userLevel || 1} AI guide`}
            style={{ position: 'relative' }}
            onClick={() => window.dispatchEvent(new CustomEvent('tb-assistant-open'))}
          >
            <img className="tb-header-guide-image" src={guide.image} alt="" aria-hidden="true" />
          </button>

          {/* XP Display */}
          <div 
            className="hidden md:flex items-center gap-2 bg-indigo-600 px-3 py-1.5 rounded-full text-white font-bold text-sm shadow-sm"
            title={`Level ${userLevel || 1}: ${userXP || 0} XP`}
          >
            <Trophy size={16} className="text-yellow-300" />
            <span>Lvl {userLevel || 1}</span>
            <span className="text-white/30 mx-1">|</span>
            <span>{userXP || 0} XP</span>
          </div>

          <div className="tb-streak" aria-label={`${streakCount} day streak`}>
            <span role="img" aria-hidden="true">🔥</span>
            <span>{streakCount} {streakCount === 1 ? 'day' : 'days'} streak</span>
          </div>

          <button
            onClick={onProfile}
            className="tb-avatar"
            aria-label="View profile"
            title="My Profile"
            style={{ position: 'relative' }}
          >
            <User size={18} />
            {unlockedAchievementsCount > 0 && (
              <span style={{
                position: 'absolute', top: '-4px', right: '-4px',
                background: '#F59E0B', color: 'white',
                borderRadius: '50%', width: '16px', height: '16px',
                fontSize: '9px', fontWeight: 800,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '2px solid white',
              }}>{unlockedAchievementsCount}</span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
