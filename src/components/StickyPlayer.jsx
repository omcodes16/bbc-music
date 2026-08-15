import React, { useRef, useState, useEffect } from 'react';
import { useTheme } from '../theme/ThemeProvider';
import { Play, Pause, SkipBack, SkipForward, Repeat, Shuffle, Volume2, Mic2, Maximize2, Heart, ChevronDown } from 'lucide-react';
import './StickyPlayer.css';

const StickyPlayer = () => {
  const { activeSong, favorites, toggleFavorite, addRecentlyPlayed, isPlayerExpanded, setIsPlayerExpanded } = useTheme();
  const audioRef = useRef(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [duration, setDuration] = useState('0:00');
  const [volume, setVolume] = useState(1);

  // Apply volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Load and play new song when activeSong changes
  useEffect(() => {
    if (audioRef.current && activeSong) {
      audioRef.current.src = activeSong.audioSrc || "";
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log("Audio play error:", e));
      }
      
      // Track recently played
      addRecentlyPlayed(activeSong);
    }
  }, [activeSong]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => {
          console.log("Audio play error:", e);
          alert("Audio file not found! Please place your MP3 files in the public/audio folder as instructed.");
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds)) return '0:00';
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const total = audioRef.current.duration;
      setCurrentTime(formatTime(current));
      
      if (total) {
        setDuration(formatTime(total));
        setProgress((current / total) * 100);
      }
    }
  };

  const handleSeek = (e) => {
    if (audioRef.current) {
      const newTime = (e.target.value / 100) * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
      setProgress(e.target.value);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.log("Error attempting to enable fullscreen:", err);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  return (
    <>
      <audio 
        ref={audioRef} 
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
      />

      {isPlayerExpanded && activeSong && (
        <div className="fullscreen-overlay">
          <button className="close-fullscreen" onClick={() => setIsPlayerExpanded(false)}>
            <ChevronDown size={32} />
          </button>
          
          <img src={activeSong.artwork} alt="background blur" className="fullscreen-bg-blur" />
          
          <div className="fullscreen-content">
            <img src={activeSong.artwork} alt={activeSong.title} className="fullscreen-artwork" />
            
            <div className="fullscreen-details">
              <div className="fullscreen-title-container">
                <h2>{activeSong.title}</h2>
                <p>{activeSong.artist}</p>
              </div>
              <Heart 
                size={28} 
                className="heart-icon" 
                style={{ cursor: 'pointer', color: favorites.includes(activeSong.id) ? 'var(--accent-primary)' : 'var(--text-secondary)', transition: 'all 0.2s' }}
                fill={favorites.includes(activeSong.id) ? "var(--accent-primary)" : "none"}
                onClick={() => toggleFavorite(activeSong.id)}
              />
            </div>

            <div className="fullscreen-progress">
              <div className="progress-bar">
                <input 
                  type="range" 
                  className="progress-slider" 
                  min="0" max="100" 
                  value={progress} 
                  onChange={handleSeek}
                  style={{ backgroundSize: `${progress}% 100%` }}
                />
              </div>
              <div className="time-row">
                <span>{currentTime}</span>
                <span>{duration || activeSong.duration}</span>
              </div>
            </div>

            <div className="fullscreen-controls">
              <button className="control-btn"><Shuffle size={24} /></button>
              <button className="control-btn"><SkipBack size={36} fill="currentColor" /></button>
              <button className="control-btn play-btn" style={{ width: '64px', height: '64px' }} onClick={togglePlay}>
                {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" />}
              </button>
              <button className="control-btn"><SkipForward size={36} fill="currentColor" /></button>
              <button className="control-btn"><Repeat size={24} /></button>
            </div>
          </div>
        </div>
      )}

      <div 
        className="sticky-player" 
        onClick={(e) => {
          // Prevent expanding if clicking on a button or input inside the sticky player
          if(e.target.closest('button') || e.target.closest('input')) return;
          setIsPlayerExpanded(true);
        }}
        style={{ cursor: 'pointer' }}
      >
      
      <div className="player-left">
        {activeSong ? (
          <>
            <div className="player-img-wrapper">
              <img src={activeSong.artwork} alt={activeSong.title} className="player-img" />
            </div>
            <div className="player-info" style={{ marginRight: '16px' }}>
              <h4 className="player-title">{activeSong.title}</h4>
              <p className="player-artist">{activeSong.artist}</p>
            </div>
            <Heart 
              size={20} 
              className="heart-icon" 
              style={{ cursor: 'pointer', transition: 'all 0.2s', color: favorites.includes(activeSong.id) ? 'var(--accent-primary)' : 'var(--text-secondary)' }}
              fill={favorites.includes(activeSong.id) ? "var(--accent-primary)" : "none"}
              onClick={() => toggleFavorite(activeSong.id)}
            />
          </>
        ) : (
          <div className="player-info">
            <h4 className="player-title">Select a song</h4>
          </div>
        )}
      </div>

      <div className="player-center">
        <div className="player-controls">
          <button className="control-btn"><Shuffle size={18} /></button>
          <button className="control-btn"><SkipBack size={24} fill="currentColor" /></button>
          <button className="control-btn play-btn" onClick={togglePlay}>
            {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
          </button>
          <button className="control-btn"><SkipForward size={24} fill="currentColor" /></button>
          <button className="control-btn"><Repeat size={18} /></button>
        </div>
        <div className="player-progress-container">
          <span className="time-text">{currentTime}</span>
          <div className="progress-bar">
            <input 
              type="range" 
              className="progress-slider" 
              min="0" max="100" 
              value={progress} 
              onChange={handleSeek}
              style={{ backgroundSize: `${progress}% 100%` }}
            />
          </div>
          <span className="time-text">{duration || (activeSong ? activeSong.duration : "0:00")}</span>
        </div>
      </div>

      <div className="player-right">
        <button className="control-btn"><Mic2 size={18} /></button>
        <button className="control-btn"><Volume2 size={18} /></button>
        <div className="volume-bar" style={{ display: 'flex', alignItems: 'center' }}>
          <input 
            type="range" 
            className="progress-slider" 
            min="0" max="1" step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            style={{ backgroundSize: `${volume * 100}% 100%`, width: '100%', height: '4px', margin: 0 }}
          />
        </div>
        <button className="control-btn" onClick={toggleFullscreen} title="Toggle Fullscreen">
          <Maximize2 size={18} />
        </button>
      </div>
    </div>
    </>
  );
};

export default StickyPlayer;
