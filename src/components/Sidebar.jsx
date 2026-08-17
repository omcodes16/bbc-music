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
        </ul>
      </nav>

      <nav className="nav-group">
        <h4 className="nav-title">YOUR LIBRARY</h4>
        <ul>
          <li className={activeView === 'favorites' ? 'active' : ''} onClick={() => setActiveView('favorites')}><Heart size={20} /> Favorites</li>
          <li className={activeView === 'local-music' ? 'active' : ''} onClick={() => setActiveView('local-music')}><Folder size={20} /> Local Music</li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
