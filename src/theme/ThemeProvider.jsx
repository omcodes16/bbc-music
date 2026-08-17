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
  const [favorites, setFavorites] = useState([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [localSongs, setLocalSongs] = useState([]);
  const [isPlayerExpanded, setIsPlayerExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState('off'); // 'off', 'all', 'one'

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
      return [song, ...filtered].slice(0, 20); // Keep last 20
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
      repeatMode, setRepeatMode
    }}>
      {children}
    </ThemeContext.Provider>
  );
};
