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
      <h1 className="header-mobile-brand display-font logo-3d" style={{ margin: 0 }}>BBC PLAYLIST</h1>
      <div className="search-container">
        <Search size={20} className="search-icon" />
        <input 
          type="text" 
          placeholder="Search" 
          className="search-input" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="header-actions">
        <button className="header-btn pill-btn" onClick={cycleTheme}>Theme</button>
      </div>
    </header>
  );
};

export default Header;
