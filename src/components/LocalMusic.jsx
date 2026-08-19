import React, { useRef } from 'react';
import { useTheme } from '../theme/ThemeProvider';
import { Play, Upload, MoreHorizontal } from 'lucide-react';
import './SongList.css';

const LocalMusic = () => {
  const { activeSong, setActiveSong, localSongs, addLocalSongs } = useTheme();
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const newLocalSongs = files.map(file => {
      // Create a temporary URL for the local file so the audio player can play it
      const audioSrc = URL.createObjectURL(file);
      return {
        id: `local-${file.name}-${Date.now()}`,
        title: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
        artist: "Local Device",
        artwork: import.meta.env.BASE_URL + "images/4.jpg", // Default placeholder
        audioSrc: audioSrc,
        themeId: "blue", // Default theme
        category: "Local",
        duration: "Unknown"
      };
    });

    addLocalSongs(newLocalSongs);
  };

  return (
    <div className="sections-container" style={{ marginTop: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 className="display-font section-title" style={{ margin: 0 }}>Local Music</h2>
        
        <input 
          type="file" 
          multiple 
          accept="audio/*" 
          style={{ display: 'none' }} 
          ref={fileInputRef}
          onChange={handleFileUpload}
        />
        <button 
          className="pill-btn primary-btn" 
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload size={18} /> Upload Local Files
        </button>
      </div>
      
      {localSongs.length === 0 ? (
        <div style={{ color: 'var(--text-secondary)', padding: '40px 0', textAlign: 'center' }}>
          <Upload size={48} style={{ opacity: 0.5, marginBottom: '16px' }} />
          <p>No local songs added yet.</p>
          <p style={{ fontSize: '0.85rem', opacity: 0.7, marginTop: '8px' }}>
            Click the upload button to select MP3 files from your device. <br/>
            Files are not uploaded to any server, they play directly from your browser's memory!
          </p>
        </div>
      ) : (
        <div className="song-list">
          <div className="song-list-header">
            <div className="col-index">#</div>
            <div className="col-title">Title</div>
            <div className="col-album">Source</div>
            <div className="col-date">Actions</div>
          </div>
          
          {localSongs.map((song, index) => {
            const isActive = activeSong?.id === song.id;
            return (
              <div 
                key={song.id} 
                className={`song-row ${isActive ? 'active' : ''}`}
                onClick={() => setActiveSong(song)}
              >
                <div className="col-index">
                  {isActive ? (
                    <Play size={16} fill="currentColor" className="playing-icon" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <div className="col-title">
                  <div className="song-img-wrapper">
                    <img src={song.artwork} alt={song.title} className="song-img" />
                  </div>
                  <div className="song-info">
                    <span className="song-title">{song.title}</span>
                    <span className="song-artist">{song.artist}</span>
                  </div>
                </div>
                <div className="col-album">
                  Local Device
                </div>
                <div className="col-date">
                  <MoreHorizontal size={20} className="more-icon" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LocalMusic;

