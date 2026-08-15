import React from 'react';
import { Home, Compass, Search, Clock, Heart, ListMusic, Folder, Settings, User } from 'lucide-react';
import { useTheme } from '../theme/ThemeProvider';
import './Sidebar.css';

const Sidebar = () => {
  const { activeView, setActiveView } = useTheme();

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
          <li className={activeView === 'discover' ? 'active' : ''} onClick={() => setActiveView('discover')}><Compass size={20} /> Discover</li>
          <li className={activeView === 'search' ? 'active' : ''} onClick={() => setActiveView('search')}><Search size={20} /> Search</li>
        </ul>
      </nav>

      <nav className="nav-group">
        <h4 className="nav-title">YOUR LIBRARY</h4>
        <ul>
          <li className={activeView === 'recently-played' ? 'active' : ''} onClick={() => setActiveView('recently-played')}><Clock size={20} /> Recently Played</li>
          <li className={activeView === 'favorites' ? 'active' : ''} onClick={() => setActiveView('favorites')}><Heart size={20} /> Favorites</li>
          <li className={activeView === 'playlists' ? 'active' : ''} onClick={() => setActiveView('playlists')}><ListMusic size={20} /> Your Playlists</li>
          <li className={activeView === 'local-music' ? 'active' : ''} onClick={() => setActiveView('local-music')}><Folder size={20} /> Local Music</li>
        </ul>
      </nav>

      <nav className="nav-group collection">
        <h4 className="nav-title">COLLECTION</h4>
        <ul>
          <li>Romantic</li>
          <li>Sad</li>
          <li>Chill</li>
          <li>Late Night</li>
        </ul>
      </nav>

      <div className="sidebar-bottom">
        <ul>
          <li><Settings size={20} /> Theme</li>
          <li><Settings size={20} /> Settings</li>
          <li><User size={20} /> Profile</li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
