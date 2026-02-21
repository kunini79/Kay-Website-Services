import React, { useState, useRef, useEffect } from 'react';
import { UserSettings } from '../types';
import { Settings, Type, AlignLeft, BookOpen } from 'lucide-react';

interface SettingsMenuProps {
  settings: UserSettings;
  onUpdate: (newSettings: UserSettings) => void;
}

export const SettingsMenu: React.FC<SettingsMenuProps> = ({ settings, onUpdate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOpen = () => setIsOpen(!isOpen);

  const setSize = (size: UserSettings['textSize']) => {
    onUpdate({ ...settings, textSize: size });
  };

  const toggleDyslexic = () => {
    onUpdate({ ...settings, dyslexicFont: !settings.dyslexicFont });
  };

  return (
    <div className="relative" ref={menuRef} style={{ position: 'relative' }}>
      <button
        onClick={toggleOpen}
        className="tb-icon-btn"
        aria-label="Display settings"
        aria-expanded={isOpen}
      >
        <Settings size={24} color={isOpen ? 'var(--tb-primary)' : 'var(--tb-text-muted)'} />
      </button>

      {isOpen && (
        <div className="tb-settings-dropdown">
          <h4 className="tb-settings-title">Display Settings</h4>
          
          {/* Text Size */}
          <div className="tb-settings-section">
            <div className="tb-settings-label">
              <Type size={18} />
              <span>Text Size</span>
            </div>
            <div className="tb-segmented-control">
              <button 
                className={settings.textSize === 'normal' ? 'active' : ''}
                onClick={() => setSize('normal')}
                aria-label="Normal text size"
                title="Normal"
              >
                A
              </button>
              <button 
                className={settings.textSize === 'large' ? 'active' : ''}
                onClick={() => setSize('large')}
                aria-label="Large text size"
                title="Large"
                style={{ fontSize: '18px' }}
              >
                A
              </button>
              <button 
                className={settings.textSize === 'xl' ? 'active' : ''}
                onClick={() => setSize('xl')}
                aria-label="Extra large text size"
                title="Extra Large"
                style={{ fontSize: '22px' }}
              >
                A
              </button>
            </div>
          </div>

          {/* Dyslexic Font */}
          <div className="tb-settings-section">
             <div className="tb-settings-label">
              <BookOpen size={18} />
              <span>Dyslexia Friendly</span>
            </div>
            <label className="tb-switch">
              <input 
                type="checkbox" 
                checked={settings.dyslexicFont}
                onChange={toggleDyslexic}
              />
              <span className="tb-switch-slider"></span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};
