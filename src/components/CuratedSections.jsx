import React, { useContext } from 'react';
import { Play } from 'lucide-react';
import { ThemeContext } from '../theme/ThemeProvider';
import './CuratedSections.css';

const CuratedSections = () => {
  const { songs, setActiveSong, setIsPlaying } = useContext(ThemeContext);

  const madeForYou = [
    { id: 1, title: 'Romantic Evenings', desc: 'Soft romantic songs', artwork: import.meta.env.BASE_URL + 'images/Gemini_Generated_Image_ (1).png' },
    { id: 2, title: 'Midnight Memories', desc: 'Slow emotional songs', artwork: import.meta.env.BASE_URL + 'images/Gemini_Generated_Image_5a9q205a9q205a9q.png' },
    { id: 3, title: 'Autumn Walk', desc: 'Nostalgic cinematic atmosphere', artwork: import.meta.env.BASE_URL + 'images/Gemini_Generated_Image_dde27cdde27cdde2.png' },
    { id: 4, title: 'Broken But Beautiful', desc: 'Melancholic songs', artwork: import.meta.env.BASE_URL + 'images/Gemini_Generated_Image_p82yhop82yhop82y.png' },
    { id: 5, title: 'Main Character', desc: 'Cinematic emotional songs', artwork: import.meta.env.BASE_URL + 'images/Gemini_Generated_Image_rk3u2crk3u2crk3u.png' },
  ];

  const playRandomSong = () => {
    if (songs && songs.length > 0) {
      const randomIndex = Math.floor(Math.random() * songs.length);
      setActiveSong(songs[randomIndex]);
      setIsPlaying(true);
    }
  };

  return (
    <>
      <section className="curated-section">
        <h2 className="display-font section-title">Made For You</h2>
        <div className="card-scroll-container">
          {madeForYou.map(item => (
            <div key={item.id} className="curated-card" onClick={playRandomSong}>
              <div className="curated-img-wrapper">
                <img src={item.artwork} alt={item.title} className="curated-img" />
                <button className="curated-play"><Play fill="currentColor" size={24} /></button>
              </div>
              <h4 className="curated-title">{item.title}</h4>
              <p className="curated-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default CuratedSections;

