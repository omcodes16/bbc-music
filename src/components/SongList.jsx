import React from 'react';
import { useTheme } from '../theme/ThemeProvider';
import { songs } from '../theme/songs';
import { Play, Heart, MoreHorizontal } from 'lucide-react';
import './SongList.css';

const SongList = () => {
  const { activeSong, setActiveSong, searchQuery, favorites, toggleFavorite, setIsPlayerExpanded } = useTheme();

  let displaySongs = songs;
  
  if (searchQuery) {
    displaySongs = songs.filter(song => 
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      song.artist.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  return (
    <section className="song-list-section">
      <div className="category-group">
        <h2 className="display-font section-title" style={{ marginBottom: '24px' }}>Your Playlist</h2>
        <div className="song-list">
          <div className="song-list-header">
            <div className="col-index">#</div>
            <div className="col-title">Title</div>
            <div className="col-album">Theme World</div>
            <div className="col-date">Duration</div>
          </div>
          
          {displaySongs.map((song, index) => {
            const isActive = activeSong?.id === song.id;
            return (
              <div 
                key={song.id} 
                className={`song-row ${isActive ? 'active' : ''}`}
                onClick={() => {
                  setActiveSong(song);
                  setIsPlayerExpanded(true);
                }}
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
                    fill={favorites.includes(song.id) ? "var(--accent-primary)" : "none"}
                    color={favorites.includes(song.id) ? "var(--accent-primary)" : "currentColor"}
                    style={{ opacity: favorites.includes(song.id) ? 1 : undefined }}
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
          
          {displaySongs.length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              No tracks found matching your search.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default SongList;
