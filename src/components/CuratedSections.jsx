import React from 'react';
import { Play } from 'lucide-react';
import './CuratedSections.css';

const CuratedSections = () => {
  const madeForYou = [
    { id: 1, title: 'Romantic Evenings', desc: 'Soft romantic songs', artwork: '/images/1.jpg' },
    { id: 2, title: 'Midnight Memories', desc: 'Slow emotional songs', artwork: '/images/3.jpg' },
    { id: 3, title: 'Autumn Walk', desc: 'Nostalgic cinematic atmosphere', artwork: '/images/2.jpg' },
    { id: 4, title: 'Broken But Beautiful', desc: 'Melancholic songs', artwork: '/images/4.jpg' },
    { id: 5, title: 'Main Character', desc: 'Cinematic emotional songs', artwork: '/images/1.jpg' },
  ];

  return (
    <>
      <section className="curated-section">
        <h2 className="display-font section-title">Made For You</h2>
        <div className="card-scroll-container">
          {madeForYou.map(item => (
            <div key={item.id} className="curated-card">
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
