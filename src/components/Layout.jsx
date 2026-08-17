import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import CinematicHero from './CinematicHero';
import QuickAccess from './QuickAccess';
import CuratedSections from './CuratedSections';
import SongList from './SongList';
import StickyPlayer from './StickyPlayer';
import MobileNav from './MobileNav';
import Favorites from './Favorites';
import RecentlyPlayed from './RecentlyPlayed';
import LocalMusic from './LocalMusic';
import { useTheme } from '../theme/ThemeProvider';
import './Layout.css';

const Layout = () => {
  const { searchQuery, activeView } = useTheme();
  
  const renderContent = () => {
    if (searchQuery || activeView === 'search') {
      return (
        <div className="sections-container" style={{ marginTop: '40px' }}>
          <h2 className="display-font section-title">{searchQuery ? `Search Results for "${searchQuery}"` : "Search"}</h2>
          <SongList />
        </div>
      );
    }

    switch (activeView) {
      case 'favorites':
        return <Favorites />;
      case 'recently-played':
        return <RecentlyPlayed />;
      case 'local-music':
        return <LocalMusic />;
      case 'playlists':
        return (
          <div className="sections-container" style={{ marginTop: '40px' }}>
            <CuratedSections />
          </div>
        );
      case 'discover':
        return (
          <div className="sections-container" style={{ marginTop: '40px' }}>
            <h2 className="display-font section-title">Discover</h2>
            <SongList />
          </div>
        );
      case 'home':
      default:
        return (
          <>
            <CinematicHero />
            <div className="sections-container">
              <QuickAccess />
              <CuratedSections />
              <SongList />
            </div>
          </>
        );
    }
  };

  return (
    <div className="app-container">
      <div className="layout-container">
        <Sidebar />
        <main className="main-content">
          <Header />
          <div className="content-inner view-transition" key={activeView}>
            {renderContent()}
          </div>
        </main>
      </div>
      <StickyPlayer />
      <MobileNav />
    </div>
  );
};

export default Layout;
