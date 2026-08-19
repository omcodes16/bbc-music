import React from 'react';
import { Home, Heart, ListMusic, Folder, Star, MessageSquare } from 'lucide-react';
import { useTheme } from '../theme/ThemeProvider';
import './Sidebar.css';

const Sidebar = () => {
  const { activeView, setActiveView, setIsRateUsOpen } = useTheme();

  return (
    <aside className="sidebar">
      <div className="brand" onClick={() => setActiveView('home')} style={{cursor: 'pointer'}}>
        <h1 className="display-font">BBC</h1>
        <p>PLAYLIST</p>
      </div>

      <nav className="nav-group">
        <h4 className="nav-title">MAIN</h4>
        <ul>
          <li className={activeView === 'home' ? 'active' : ''} onClick={() => setActiveView('home')}><Home size={20} /> Home</li>
        </ul>
      </nav>

      <nav className="nav-group">
        <h4 className="nav-title">PLAYLISTS</h4>
        <ul>
          <li className={activeView === 'hindi-songs' ? 'active' : ''} onClick={() => setActiveView('hindi-songs')}><ListMusic size={20} /> Hindi Songs</li>
          <li className={activeView === 'english-songs' ? 'active' : ''} onClick={() => setActiveView('english-songs')}><ListMusic size={20} /> English Songs</li>
        </ul>
      </nav>

      <nav className="nav-group">
        <h4 className="nav-title">YOUR LIBRARY</h4>
        <ul>
          <li className={activeView === 'favorites' ? 'active' : ''} onClick={() => setActiveView('favorites')}><Heart size={20} /> Favorites</li>
          <li className={activeView === 'local-music' ? 'active' : ''} onClick={() => setActiveView('local-music')}><Folder size={20} /> Local Music</li>
        </ul>
      </nav>

      <nav className="nav-group">
        <h4 className="nav-title">FEEDBACK</h4>
        <ul>
          <li onClick={() => setIsRateUsOpen(true)}>
            <Star size={20} /> Rate Us
          </li>
          <li className={activeView === 'reviews' ? 'active' : ''} onClick={() => setActiveView('reviews')}>
            <MessageSquare size={20} /> Reviews
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
