import React from 'react';
import { Home, Heart, Folder, Star } from 'lucide-react';
import { useTheme } from '../theme/ThemeProvider';
import './MobileNav.css';

const MobileNav = () => {
  const { activeView, setActiveView } = useTheme();
  
  return (
    <nav className="mobile-nav">
      <div 
        className={`mobile-nav-item ${activeView === 'home' ? 'active' : ''}`}
        onClick={() => setActiveView('home')}
      >
        <Home size={24} />
        <span>Home</span>
      </div>
      <div 
        className={`mobile-nav-item ${activeView === 'favorites' ? 'active' : ''}`}
        onClick={() => setActiveView('favorites')}
      >
        <Heart size={24} />
        <span>Favorites</span>
      </div>
      <div 
        className={`mobile-nav-item ${activeView === 'local-music' ? 'active' : ''}`}
        onClick={() => setActiveView('local-music')}
      >
        <Folder size={24} />
        <span>Local Music</span>
      </div>
      <div 
        className={`mobile-nav-item ${activeView === 'reviews' ? 'active' : ''}`}
        onClick={() => setActiveView('reviews')}
      >
        <Star size={24} />
        <span>Reviews</span>
      </div>
    </nav>
  );
};

export default MobileNav;
