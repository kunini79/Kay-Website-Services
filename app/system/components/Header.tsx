import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface HeaderProps {
  onSearch: (term: string) => void;
  onHome: () => void;
  searchFilter: string;
  onSearchFilterChange: (value: string) => void;
  streakCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  onSearch,
  onHome,
  searchFilter,
  onSearchFilterChange,
  streakCount = 7,
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
          <div
            style={{
              background: 'var(--tb-primary)',
              borderRadius: 'var(--tb-radius-sm)',
              padding: '8px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span style={{ fontSize: '22px' }} role="img" aria-hidden="true">
              💡
            </span>
            <span
              style={{
                fontFamily: 'var(--tb-font-heading)',
                fontWeight: 700,
                fontSize: '20px',
                color: 'white',
                letterSpacing: '-0.02em',
              }}
            >
              ThinkBox
            </span>
          </div>
        </button>

        {/* Search Bar */}
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

        {/* Right section: Streak + Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
