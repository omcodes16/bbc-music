import React, { useState } from 'react';
import { Star, X, Send } from 'lucide-react';
import { addReview, isConfigured } from '../utils/reviewsApi';
import { useToast } from './Toast';
import { useTheme } from '../theme/ThemeProvider';
import './RateUs.css';

const LABELS = ['', 'Poor', 'Fair', 'Good', 'Great', 'Amazing!'];

const RateUs = () => {
  const { showToast } = useToast();
  const { isRateUsOpen, setIsRateUsOpen } = useTheme();
  const [rating, setRating]       = useState(0);
  const [hovered, setHovered]     = useState(0);
  const [name, setName]           = useState('');
  const [message, setMessage]     = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isRateUsOpen) return null;

  const close = () => {
    setIsRateUsOpen(false);
    setRating(0);
    setHovered(0);
    setName('');
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      showToast('Please select a star rating!');
      return;
    }
    setSubmitting(true);
    try {
      const review = {
        id: Date.now(),
        name:    name.trim() || 'Anonymous',
        rating,
        message: message.trim(),
        date:    new Date().toLocaleDateString('en-IN', {
          day: 'numeric', month: 'long', year: 'numeric',
        }),
      };
      await addReview(review);
      showToast(
        isConfigured()
          ? 'Thank you for your review! It is now live.'
          : 'Thank you! (Set up JSONBin to save reviews online.)',
      );
      close();
    } catch {
      showToast('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const active = hovered || rating;

  return (
    <div className="rate-overlay" onClick={close}>
      <div className="rate-modal" onClick={(e) => e.stopPropagation()}>

        {/* Close */}
        <button className="rate-close" onClick={close} aria-label="Close">
          <X size={20} />
        </button>

        {/* Header */}
        <div className="rate-header">
          <span className="rate-emoji">🎵</span>
          <h2 className="display-font rate-title">Rate Our Website</h2>
          <p className="rate-subtitle">Your feedback means everything to us</p>
        </div>

        <form onSubmit={handleSubmit} className="rate-form">

          {/* Stars */}
          <div className="star-row">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`star-btn ${star <= active ? 'lit' : ''}`}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHovered(star)}
                onMouseLeave={() => setHovered(0)}
                aria-label={`${star} star${star > 1 ? 's' : ''}`}
              >
                <Star size={38} fill={star <= active ? 'currentColor' : 'none'} />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="rating-label">{LABELS[rating]}</p>
          )}

          {/* Name */}
          <input
            className="rate-input"
            type="text"
            placeholder="Your name (optional)"
            value={name}
            maxLength={50}
            onChange={(e) => setName(e.target.value)}
          />

          {/* Message */}
          <textarea
            className="rate-textarea"
            placeholder="Write something about your experience with this website..."
            value={message}
            maxLength={400}
            rows={4}
            onChange={(e) => setMessage(e.target.value)}
          />
          <span className="char-count">{message.length}/400</span>

          {/* Submit */}
          <button
            type="submit"
            className="rate-submit"
            disabled={submitting || rating === 0}
          >
            {submitting
              ? <span className="btn-inner">Submitting...</span>
              : <span className="btn-inner"><Send size={15} /> Submit Review</span>
            }
          </button>

          {!isConfigured() && (
            <p className="demo-note">
              ⚠️ Demo mode — reviews not saved online yet.{' '}
              <a href="https://npoint.io" target="_blank" rel="noreferrer">
                Set up npoint.io
              </a>{' '}
              to persist reviews.
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default RateUs;
