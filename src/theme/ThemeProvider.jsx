import React, { createContext, useState, useEffect } from 'react';
import { themes } from './themes';
import { songs } from './songs';

export const ThemeContext = createContext();
export const useTheme = () => React.useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [activeSong, setActiveSong] = useState(songs[0]);
  const [manualTheme, setManualTheme] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // New States for Library
  const [activeView, setActiveView] = useState('home');
  const [localSongs, setLocalSongs] = useState([]);
  const [isPlayerExpanded, setIsPlayerExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState('off'); // 'off', 'all', 'one'
  const [isRateUsOpen, setIsRateUsOpen] = useState(false);

  // ── Persistent Favorites (localStorage) ──────────────────────────────
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('dukh-aur-prem-favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('dukh-aur-prem-favorites', JSON.stringify(favorites));
  }, [favorites]);

  // ── Persistent Recently Played (localStorage) ─────────────────────────
  const [recentlyPlayed, setRecentlyPlayed] = useState(() => {
    try {
      const saved = localStorage.getItem('dukh-aur-prem-recently-played');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('dukh-aur-prem-recently-played', JSON.stringify(recentlyPlayed));
  }, [recentlyPlayed]);

  // ── Theme Effect ──────────────────────────────────────────────────────
  useEffect(() => {
    const currentTheme = themes[manualTheme || activeSong.themeId];
    if (currentTheme) {
      Object.keys(currentTheme).forEach((key) => {
        document.documentElement.style.setProperty(key, currentTheme[key]);
      });
    }
  }, [activeSong, manualTheme]);

  const toggleFavorite = (songId) => {
    setFavorites(prev => 
      prev.includes(songId) ? prev.filter(id => id !== songId) : [...prev, songId]
    );
  };

  const addRecentlyPlayed = (song) => {
    setRecentlyPlayed(prev => {
      const filtered = prev.filter(s => s.id !== song.id);
      return [song, ...filtered].slice(0, 20);
    });
  };

  const addLocalSongs = (newSongs) => {
    setLocalSongs(prev => [...prev, ...newSongs]);
  };

  return (
    <ThemeContext.Provider value={{ 
      activeSong, setActiveSong, 
      songs, 
      manualTheme, setManualTheme, 
      searchQuery, setSearchQuery,
      activeView, setActiveView,
      favorites, toggleFavorite,
      recentlyPlayed, addRecentlyPlayed,
      localSongs, addLocalSongs,
      isPlayerExpanded, setIsPlayerExpanded,
      isPlaying, setIsPlaying,
      isShuffle, setIsShuffle,
      repeatMode, setRepeatMode,
      isRateUsOpen, setIsRateUsOpen,
    }}>
      {children}
    </ThemeContext.Provider>
  );
};
