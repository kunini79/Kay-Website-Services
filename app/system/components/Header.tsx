import React from 'react';
import Image from 'next/image';
import { Search, Dice5, Backpack, Trophy } from 'lucide-react';
import { UserSettings } from '../types';
import { SettingsMenu } from './SettingsMenu';

interface HeaderProps {
  onSearch: (term: string) => void;
  onHome: () => void;
  onRandom: () => void;
  onBackpack: () => void;
  searchFilter: string;
  onSearchFilterChange: (value: string) => void;
  streakCount?: number;
  userXP?: number;
  userLevel?: number;
  settings: UserSettings;
  onSettingsUpdate: (newSettings: UserSettings) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onSearch,
  onHome,
  onRandom,
  onBackpack,
  searchFilter,
  onSearchFilterChange,
  streakCount = 7,
  userXP,
  userLevel,
  settings,
  onSettingsUpdate,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchFilter.trim()) {
      onSearch(searchFilter);
    }
  };

  return (
    <header className="tb-navbar" role="banner">
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

        {/* Right section: Settings + Backpack + Streak + Avatar */}
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

          <SettingsMenu settings={settings} onUpdate={onSettingsUpdate} />

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
            <span>{streakCount} day streak</span>
          </div>

          <button className="tb-avatar" aria-label="User profile">
            T
          </button>
        </div>
      </div>
    </header>
  );
};
