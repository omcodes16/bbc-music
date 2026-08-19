import React, { useEffect, useState } from 'react';
import { Star, RefreshCw, AlertCircle } from 'lucide-react';
import { getReviews, isConfigured } from '../utils/reviewsApi';
import { useTheme } from '../theme/ThemeProvider';
import './ReviewsPage.css';

const StarDisplay = ({ rating }) => (
  <div className="star-display">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star
        key={s}
        size={14}
        fill={s <= rating ? 'currentColor' : 'none'}
        className={s <= rating ? 'star-lit' : 'star-dim'}
      />
    ))}
  </div>
);

const ReviewsPage = () => {
  const { setIsRateUsOpen } = useTheme();
  const [reviews, setReviews]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getReviews();
      setReviews(data);
    } catch (err) {
      setError('Could not load reviews. Check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  const countFor = (n) => reviews.filter((r) => r.rating === n).length;

  return (
    <div className="reviews-page">

      {/* ── Header ─────────────────────────────── */}
      <div className="reviews-header">
        <h2 className="display-font reviews-title">Community Reviews</h2>
        <p className="reviews-sub">What people say about Dukh Aur Prem</p>
      </div>

      {/* ── Stats Card ─────────────────────────── */}
      <div className="stats-card">
        <div className="avg-block">
          <span className="avg-number">{avgRating}</span>
          <StarDisplay rating={Math.round(Number(avgRating))} />
          <span className="total-count">
            {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
          </span>
        </div>

        <div className="bar-chart">
          {[5, 4, 3, 2, 1].map((n) => {
            const pct = reviews.length ? (countFor(n) / reviews.length) * 100 : 0;
            return (
              <div key={n} className="bar-row">
                <span className="bar-label">{n}</span>
                <Star size={11} fill="currentColor" className="bar-star" />
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${pct}%` }} />
                </div>
                <span className="bar-count">{countFor(n)}</span>
              </div>
            );
          })}
        </div>

        <button className="rate-cta" onClick={() => setIsRateUsOpen(true)}>
          ⭐ Rate This Website
        </button>
      </div>

      {/* ── Refresh ────────────────────────────── */}
      <div className="reviews-toolbar">
        <h3 className="reviews-list-title">All Reviews</h3>
        <button className="refresh-btn" onClick={load} disabled={loading}>
          <RefreshCw size={15} className={loading ? 'spinning' : ''} />
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {!isConfigured() && (
        <div className="demo-banner">
          <AlertCircle size={16} />
          <span>
            Showing demo reviews. Add your npoint.io Bin ID in the <strong>.env</strong> file to go live.{' '}
          <a href="https://npoint.io" target="_blank" rel="noreferrer">
            Open npoint.io →
          </a>
          </span>
        </div>
      )}

      {/* ── Review Cards ───────────────────────── */}
      {loading && reviews.length === 0 && (
        <div className="reviews-loading">
          <div className="loading-spinner" />
          <p>Loading reviews...</p>
        </div>
      )}

      {error && (
        <div className="reviews-error">
          <AlertCircle size={20} />
          <p>{error}</p>
          <button onClick={load}>Try again</button>
        </div>
      )}

      {!loading && !error && reviews.length === 0 && (
        <div className="reviews-empty">
          <span className="empty-emoji">💬</span>
          <p>No reviews yet. Be the first!</p>
          <button className="rate-cta" onClick={() => setIsRateUsOpen(true)}>
            ⭐ Write a Review
          </button>
        </div>
      )}

      <div className="reviews-grid">
        {reviews.map((review) => (
          <div key={review.id} className="review-card">
            <div className="card-top">
              <div className="avatar">{review.name[0].toUpperCase()}</div>
              <div className="card-meta">
                <span className="reviewer-name">{review.name}</span>
                <span className="review-date">{review.date}</span>
              </div>
              <StarDisplay rating={review.rating} />
            </div>
            {review.message && (
              <p className="review-message">"{review.message}"</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewsPage;
