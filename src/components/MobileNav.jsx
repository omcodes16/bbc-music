import React from 'react';
import { Home, Search, Library, User } from 'lucide-react';
import './MobileNav.css';

const MobileNav = () => {
  return (
    <nav className="mobile-nav">
      <div className="mobile-nav-item active">
        <Home size={24} />
        <span>Home</span>
      </div>
      <div className="mobile-nav-item">
        <Search size={24} />
        <span>Search</span>
      </div>
      <div className="mobile-nav-item">
        <Library size={24} />
        <span>Library</span>
      </div>
      <div className="mobile-nav-item">
        <User size={24} />
        <span>Profile</span>
      </div>
    </nav>
  );
};

export default MobileNav;
