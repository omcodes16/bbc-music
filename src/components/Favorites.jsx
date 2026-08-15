import React from 'react';
import { useTheme } from '../theme/ThemeProvider';
import { Play, Heart, MoreHorizontal } from 'lucide-react';
import './SongList.css'; // Reusing song list styles

const Favorites = () => {
  const { activeSong, setActiveSong, songs, favorites, toggleFavorite } = useTheme();

  const favoriteSongs = songs.filter(song => favorites.includes(song.id));

  return (
    <div className="sections-container" style={{ marginTop: '40px' }}>
      <h2 className="display-font section-title">Your Favorites</h2>
      
      {favoriteSongs.length === 0 ? (
        <div style={{ color: 'var(--text-secondary)' }}>You haven't added any favorites yet. Click the heart icon on any song to add it here.</div>
      ) : (
        <div className="song-list">
          <div className="song-list-header">
            <div className="col-index">#</div>
            <div className="col-title">Title</div>
            <div className="col-album">Theme World</div>
            <div className="col-date">Duration</div>
          </div>
          
          {favoriteSongs.map((song, index) => {
            const isActive = activeSong?.id === song.id;
            const isFav = favorites.includes(song.id);
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
                  {song.themeId.charAt(0).toUpperCase() + song.themeId.slice(1)} World
                </div>
                <div className="col-date">
                  <Heart 
                    size={18} 
                    className="heart-icon" 
                    fill={isFav ? "var(--accent-primary)" : "none"}
                    color={isFav ? "var(--accent-primary)" : "currentColor"}
                    style={{ opacity: isFav ? 1 : undefined }}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(song.id);
                    }}
                  />
                  <span>{song.duration}</span>
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

export default Favorites;
