import React, { useRef, useState, useEffect } from 'react';
import { useTheme } from '../theme/ThemeProvider';
import { Play, Pause, SkipBack, SkipForward, Repeat, Shuffle, Volume2, Mic2, Maximize2, Heart, ChevronDown } from 'lucide-react';
import Visualizer from './Visualizer';
import { useToast } from './Toast';
import './StickyPlayer.css';

const StickyPlayer = () => {
  const { showToast } = useToast();

  const { 
    activeSong, setActiveSong, 
    favorites, toggleFavorite, 
    addRecentlyPlayed, 
    isPlayerExpanded, setIsPlayerExpanded, 
    songs,
    isPlaying, setIsPlaying,
    isShuffle, setIsShuffle,
    repeatMode, setRepeatMode
  } = useTheme();
  const audioRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [duration, setDuration] = useState('0:00');
  const [volume, setVolume] = useState(1);
  const [analyser, setAnalyser] = useState(null);
  const audioContextRef = useRef(null);
  const sourceRef = useRef(null);
  const bassFilterRef = useRef(null);

  // New Advanced Features State
  const [loopA, setLoopA] = useState(null);
  const [loopB, setLoopB] = useState(null);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showLyrics, setShowLyrics] = useState(false);
  const [lyricsData, setLyricsData] = useState({ text: '', synced: false });

  // Fetch lyrics automatically
  useEffect(() => {
    if (activeSong && showLyrics) {
      setLyricsData({ text: 'Finding lyrics on LRCLIB...', synced: false });
      const url = `https://lrclib.net/api/search?track_name=${encodeURIComponent(activeSong.title)}&artist_name=${encodeURIComponent(activeSong.artist)}`;
      fetch(url)
        .then(res => res.json())
        .then(data => {
          if (data && data.length > 0) {
            const track = data[0];
            if (track.plainLyrics) {
              setLyricsData({ text: track.plainLyrics, synced: false });
            } else {
              setLyricsData({ text: 'Lyrics not found for this song.', synced: false });
            }
          } else {
            setLyricsData({ text: 'Lyrics not found for this song.', synced: false });
          }
        })
        .catch(err => {
          setLyricsData({ text: 'Error loading lyrics.', synced: false });
        });
    }
  }, [activeSong, showLyrics]);

  // Setup Audio Context for Visualizer
  useEffect(() => {
    if (audioRef.current && !audioContextRef.current) {
      const handlePlay = () => {
        if (!audioContextRef.current) {
          try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            audioContextRef.current = new AudioContext();
            
            sourceRef.current = audioContextRef.current.createMediaElementSource(audioRef.current);
            const newAnalyser = audioContextRef.current.createAnalyser();
            newAnalyser.fftSize = 256;
            
            sourceRef.current.connect(newAnalyser);
            newAnalyser.connect(audioContextRef.current.destination);
            
            setAnalyser(newAnalyser);
          } catch (e) {
            console.error("AudioContext setup failed:", e);
          }
        } else if (audioContextRef.current.state === 'suspended') {
          audioContextRef.current.resume();
        }
      };

      audioRef.current.addEventListener('play', handlePlay);
      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('play', handlePlay);
        }
      };
    }
  }, []);

  // Apply volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Apply Playback Rate
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate, activeSong]);

  // Load and play new song when activeSong changes
  useEffect(() => {
    if (audioRef.current && activeSong) {
      // Reset A-B loop when song changes
      setLoopA(null);
      setLoopB(null);

      audioRef.current.src = activeSong.audioSrc || "";
      if (isPlaying) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(e => {
            console.log("Audio play error (activeSong):", e);
            if (e.name !== 'AbortError') {
              setIsPlaying(false);
            }
          });
        }
      }
      
      // Track recently played
      addRecentlyPlayed(activeSong);
    }
  }, [activeSong]);

  // Sync global isPlaying state with audio element
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying && audioRef.current.paused) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(e => {
            console.log("Audio play error (isPlaying):", e);
            if (e.name !== 'AbortError') {
              setIsPlaying(false);
            }
          });
        }
      } else if (!isPlaying && !audioRef.current.paused) {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
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

      // Handle A-B Loop
      if (loopA !== null && loopB !== null && current >= loopB) {
        audioRef.current.currentTime = loopA;
        if (audioRef.current.paused) {
           audioRef.current.play().catch(console.error);
        }
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

  const playNextSong = (autoPlay = false) => {
    if (!activeSong || !songs || songs.length === 0) return;
    
    if (autoPlay && repeatMode === 'one') {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(console.error);
      }
      return;
    }

    if (isShuffle) {
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * songs.length);
      } while (songs.length > 1 && songs[randomIndex].id === activeSong.id);
      setActiveSong(songs[randomIndex]);
      return;
    }

    const currentIndex = songs.findIndex(s => s.id === activeSong.id);
    if (currentIndex === songs.length - 1 && autoPlay && repeatMode === 'off') {
      setIsPlaying(false);
      return;
    }

    const nextSong = songs[(currentIndex + 1) % songs.length];
    setActiveSong(nextSong);
  };

  const playPrevSong = () => {
    if (!activeSong || !songs || songs.length === 0) return;
    const currentIndex = songs.findIndex(s => s.id === activeSong.id);
    const prevIndex = currentIndex === 0 ? songs.length - 1 : currentIndex - 1;
    setActiveSong(songs[prevIndex]);
  };

  const toggleRepeat = () => {
    if (repeatMode === 'off') setRepeatMode('all');
    else if (repeatMode === 'all') setRepeatMode('one');
    else setRepeatMode('off');
  };

  const handleSetA = () => {
    if (!audioRef.current) return;
    setLoopA(audioRef.current.currentTime);
    showToast("Point A Set!");
  };

  const handleSetB = () => {
    if (!audioRef.current) return;
    if (loopA !== null && audioRef.current.currentTime <= loopA) {
      showToast("Point B must be after Point A!");
      return;
    }
    setLoopB(audioRef.current.currentTime);
    showToast("Point B Set! Looping...");
  };

  const clearLoop = () => {
    setLoopA(null);
    setLoopB(null);
    showToast("Loop Cleared");
  };

  const cyclePlaybackRate = () => {
    const rates = [0.5, 0.75, 1, 1.25, 1.5, 2];
    const nextIndex = (rates.indexOf(playbackRate) + 1) % rates.length;
    setPlaybackRate(rates[nextIndex]);
    showToast(`Speed: ${rates[nextIndex]}x`);
  };

  const getRepeatIcon = () => {
    if (repeatMode === 'one') {
      return (
        <div style={{ position: 'relative' }}>
          <Repeat size={24} color="var(--accent-primary)" />
          <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '10px', color: 'var(--accent-primary)', fontWeight: 'bold' }}>1</span>
        </div>
      );
    }
    return <Repeat size={24} color={repeatMode === 'all' ? "var(--accent-primary)" : "currentColor"} />;
  };

  const getRepeatIconSmall = () => {
    if (repeatMode === 'one') {
      return (
        <div style={{ position: 'relative' }}>
          <Repeat size={18} color="var(--accent-primary)" />
          <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '8px', color: 'var(--accent-primary)', fontWeight: 'bold' }}>1</span>
        </div>
      );
    }
    return <Repeat size={18} color={repeatMode === 'all' ? "var(--accent-primary)" : "currentColor"} />;
  };

  return (
    <>
      <audio 
        ref={audioRef} 
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => playNextSong(true)}
        crossOrigin="anonymous"
      />

      {isPlayerExpanded && activeSong && (
        <div className="fullscreen-overlay">
          <button className="close-fullscreen" onClick={() => setIsPlayerExpanded(false)}>
            <ChevronDown size={32} />
          </button>
          
          <img src={activeSong.artwork} alt="background blur" className="fullscreen-bg-blur" />
          
          <div className="fullscreen-content">
            {showLyrics ? (
              <div className="fullscreen-lyrics" style={{ width: '100%', height: '50vh', overflowY: 'auto', textAlign: 'center', marginBottom: '20px', padding: '20px', background: 'rgba(0,0,0,0.6)', borderRadius: '16px', backdropFilter: 'blur(10px)', transition: 'all 0.3s' }}>
                <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', fontSize: '1.2rem', lineHeight: '2', color: 'rgba(255,255,255,0.95)' }}>
                  {lyricsData.text}
                </pre>
              </div>
            ) : (
              <img src={activeSong.artwork} alt={activeSong.title} className="fullscreen-artwork" />
            )}
            
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

            {/* Extra Controls Row */}
            <div className="fullscreen-extra-controls" style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <button 
                className="control-btn" 
                onClick={() => setShowLyrics(!showLyrics)}
                style={{ fontSize: '14px', fontWeight: 'bold', color: showLyrics ? 'var(--accent-primary)' : 'inherit', border: '1px solid currentColor', borderRadius: '12px', padding: '4px 12px' }}
              >
                Lyrics
              </button>
              <button 
                className="control-btn" 
                onClick={cyclePlaybackRate}
                style={{ fontSize: '14px', fontWeight: 'bold', color: playbackRate !== 1 ? 'var(--accent-primary)' : 'inherit', border: '1px solid currentColor', borderRadius: '12px', padding: '4px 12px' }}
              >
                {playbackRate}x
              </button>
              
              <div style={{ display: 'flex', gap: '5px' }}>
                <button 
                  className="control-btn" 
                  onClick={handleSetA}
                  style={{ fontSize: '12px', fontWeight: 'bold', color: loopA !== null ? 'var(--accent-primary)' : 'inherit', border: '1px solid currentColor', borderRadius: '12px', padding: '4px 8px' }}
                >
                  Set A {loopA !== null && `(${formatTime(loopA)})`}
                </button>
                <button 
                  className="control-btn" 
                  onClick={handleSetB}
                  style={{ fontSize: '12px', fontWeight: 'bold', color: loopB !== null ? 'var(--accent-primary)' : 'inherit', border: '1px solid currentColor', borderRadius: '12px', padding: '4px 8px' }}
                >
                  Set B {loopB !== null && `(${formatTime(loopB)})`}
                </button>
                {(loopA !== null || loopB !== null) && (
                  <button 
                    className="control-btn" 
                    onClick={clearLoop}
                    style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-secondary)', border: '1px solid currentColor', borderRadius: '12px', padding: '4px 8px' }}
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            <div className="fullscreen-controls">
              <button className="control-btn" onClick={() => setIsShuffle(!isShuffle)}>
                <Shuffle size={24} color={isShuffle ? "var(--accent-primary)" : "currentColor"} />
              </button>
              <button className="control-btn" onClick={playPrevSong}><SkipBack size={36} fill="currentColor" /></button>
              <button className="control-btn play-btn" style={{ width: '64px', height: '64px' }} onClick={togglePlay}>
                {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" />}
              </button>
              <button className="control-btn" onClick={() => playNextSong(false)}><SkipForward size={36} fill="currentColor" /></button>
              <button className="control-btn" onClick={toggleRepeat}>{getRepeatIcon()}</button>
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
            <button className="control-btn" onClick={(e) => { e.stopPropagation(); toggleFavorite(activeSong.id); }}>
              <Heart 
                size={20} 
                className="heart-icon" 
                style={{ cursor: 'pointer', transition: 'all 0.2s', color: favorites.includes(activeSong.id) ? 'var(--accent-primary)' : 'var(--text-secondary)' }}
                fill={favorites.includes(activeSong.id) ? "var(--accent-primary)" : "none"}
              />
            </button>
          </>
        ) : (
          <div className="player-info">
            <h4 className="player-title">Select a song</h4>
          </div>
        )}
      </div>

      <div className="player-center">
        <div className="player-controls">
          <button className="control-btn" onClick={() => setIsShuffle(!isShuffle)}>
            <Shuffle size={18} color={isShuffle ? "var(--accent-primary)" : "currentColor"} />
          </button>
          <button className="control-btn" onClick={playPrevSong}><SkipBack size={24} fill="currentColor" /></button>
          <button className="control-btn play-btn" onClick={togglePlay}>
            {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
          </button>
          <button className="control-btn" onClick={() => playNextSong(false)}><SkipForward size={24} fill="currentColor" /></button>
          <button className="control-btn" onClick={toggleRepeat}>{getRepeatIconSmall()}</button>
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
        <button className="control-btn" onClick={() => {
          setIsPlayerExpanded(true);
          setShowLyrics(!showLyrics);
        }}>
          <Mic2 size={18} color={showLyrics ? "var(--accent-primary)" : "currentColor"} />
        </button>
        <button className="control-btn" onClick={() => setVolume(volume === 0 ? 1 : 0)}>
          {volume === 0 ? <Volume2 size={18} opacity={0.5} /> : <Volume2 size={18} />}
        </button>
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
