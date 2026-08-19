import React, { useContext } from 'react';
import { Play, Pause, Plus, Heart } from 'lucide-react';
import { ThemeContext } from '../theme/ThemeProvider';
import { useToast } from './Toast';
import './CinematicHero.css';

const CinematicHero = () => {
  const { showToast } = useToast();
  const { activeSong, isPlaying, setIsPlaying, favorites, toggleFavorite } = useContext(ThemeContext);

  if (!activeSong) return null;

  return (
    <div className="hero-container">
      <div 
        className="hero-background"
        style={{ backgroundImage: `url(${activeSong.artwork})` }}
      />
      <div className="hero-overlay" />
      
      <div className="hero-content">
        <div className="hero-artwork-wrapper">
          <img 
            src={activeSong.artwork} 
            alt={activeSong.title} 
            className="hero-artwork"
          />
        </div>
        
        <div className="hero-info">
          <span className="featured-label display-font">FEATURED</span>
          <h1 className="display-font">{activeSong.title}</h1>
          <p className="hero-artist">{activeSong.artist}</p>
          
          <div className="hero-actions">
            <button 
              className="btn-primary" 
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause fill="currentColor" size={20} /> : <Play fill="currentColor" size={20} />} 
              {isPlaying ? 'PAUSE' : 'PLAY'}
            </button>

            <button 
              className="btn-icon" 
              onClick={() => toggleFavorite(activeSong.id)}
            >
              <Heart 
                size={24} 
                fill={favorites.includes(activeSong.id) ? "var(--accent-primary)" : "none"}
                color={favorites.includes(activeSong.id) ? "var(--accent-primary)" : "currentColor"}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CinematicHero;
