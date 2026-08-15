import React, { useContext } from 'react';
import { Play } from 'lucide-react';
import { ThemeContext } from '../theme/ThemeProvider';
import './QuickAccess.css';

const QuickAccess = () => {
  const { songs, setActiveSong, activeSong } = useContext(ThemeContext);
  
  // Pick the first 6 songs for Quick Access
  const quickAccessSongs = songs.slice(0, 6);

  return (
    <section className="quick-access-section">
      <h2 className="display-font section-title">Good evening</h2>
      <div className="quick-access-grid">
        {quickAccessSongs.map((song) => (
          <div 
            key={song.id} 
            className={`quick-access-card ${activeSong.id === song.id ? 'active' : ''}`}
            onClick={() => setActiveSong(song)}
          >
            <div className="quick-access-img-wrapper">
              <img src={song.artwork} alt={song.title} className="quick-access-img" />
            </div>
            <div className="quick-access-info">
              <h4 className="quick-access-title">{song.title}</h4>
            </div>
            <button className="quick-access-play">
              <Play fill="currentColor" size={20} />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default QuickAccess;
