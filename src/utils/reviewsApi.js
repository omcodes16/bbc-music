// ─────────────────────────────────────────────────────────────────────────────
// reviewsApi.js — Uses npoint.io (free, no account needed!)
//
// npoint.io is like a free online notepad for JSON data.
// We store all reviews there so they stay saved permanently.
//
// How it works:
//   READ  → GET  https://api.npoint.io/{YOUR_BIN_ID}
//   WRITE → POST https://api.npoint.io/{YOUR_BIN_ID}  (with new data)
// ─────────────────────────────────────────────────────────────────────────────

const BIN_ID  = import.meta.env.VITE_NPOINT_BIN_ID;
const SECRET  = import.meta.env.VITE_NPOINT_SECRET; // optional but recommended
const BASE_URL = `https://api.npoint.io/${BIN_ID}`;

/** Returns true if the .env keys are configured */
export const isConfigured = () => Boolean(BIN_ID);

/** Build headers — add secret token only if one is set */
const makeHeaders = () => {
  const headers = { 'Content-Type': 'application/json' };
  if (SECRET) headers['x-secret-token'] = SECRET;
  return headers;
};

/**
 * Fetch all reviews from npoint.io
 * Returns an array of review objects.
 */
export const getReviews = async () => {
  if (!isConfigured()) return getDemoReviews();

  const res = await fetch(BASE_URL, { headers: makeHeaders() });
  if (!res.ok) throw new Error('Failed to load reviews');
  const data = await res.json();
  return data.reviews ?? [];
};

/**
 * Add a new review.
 * 1. Fetch existing reviews
 * 2. Prepend new review
 * 3. POST updated list back to npoint.io
 */
export const addReview = async (review) => {
  if (!isConfigured()) {
    return { ok: true }; // demo mode — nothing actually saves
  }

  // 1. Get existing
  const existing = await getReviews();

  // 2. Add new review at the top
  const updated = [review, ...existing];

  // 3. Save back to npoint.io
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: makeHeaders(),
    body: JSON.stringify({ reviews: updated }),
  });

  if (!res.ok) throw new Error('Failed to save review');
  return res.json();
};

/**
 * Demo reviews — shown when npoint is not set up yet.
 * The UI still looks great and you can see how it works!
 */
const getDemoReviews = () => [
  {
    id: 1,
    name: 'Priya Sharma',
    rating: 5,
    message: 'This music player is absolutely beautiful! The cinematic themes and song collection is amazing. Channa Mereya hits different here.',
    date: '19 August 2026',
  },
  {
    id: 2,
    name: 'Rahul Verma',
    rating: 5,
    message: 'The UI is stunning and the Hindi songs selection is top notch. Love the dark aesthetic!',
    date: '18 August 2026',
  },
  {
    id: 3,
    name: 'Sneha',
    rating: 4,
    message: 'Beautiful website! The theme changes with each song is a really cool touch. Would love more Bollywood classics.',
    date: '17 August 2026',
  },
  {
    id: 4,
    name: 'Anonymous',
    rating: 5,
    message: 'Dukh aur Prem perfectly captures the mood. Stephen Sanchez + Arijit Singh in one place — perfect.',
    date: '16 August 2026',
  },
];
