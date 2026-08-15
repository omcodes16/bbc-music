import React from 'react';
import { Search, Bell, User, Plus } from 'lucide-react';
import { useTheme } from '../theme/ThemeProvider';
import './Header.css';

const Header = () => {
  const { searchQuery, setSearchQuery, manualTheme, setManualTheme, activeSong } = useTheme();

  const cycleTheme = () => {
    const themeIds = ['forest', 'sunset', 'night', 'blue'];
    const currentId = manualTheme || activeSong.themeId;
    const currentIndex = themeIds.indexOf(currentId);
    const nextIndex = (currentIndex + 1) % themeIds.length;
    setManualTheme(themeIds[nextIndex]);
  };

  return (
    <header className="header">
      <div className="search-bar">
        <Search size={20} className="search-icon" />
        <input 
          type="text" 
          placeholder="What do you want to listen to?" 
          className="search-input" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="header-actions">
        <button className="header-btn pill-btn" onClick={cycleTheme}>Theme</button>
        <button className="header-btn icon-btn"><Bell size={20} /></button>
        <button className="header-btn icon-btn"><User size={20} /></button>
        <button className="header-btn pill-btn primary-btn"><Plus size={18} /> Add Music</button>
      </div>
    </header>
  );
};

export default Header;
