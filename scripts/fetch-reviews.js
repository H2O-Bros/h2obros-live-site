/* Fetches the latest Google reviews for the H2O Bros Business Profile and
 * writes them to /reviews.json, which the homepage reads and renders.
 * Runs in GitHub Actions (see .github/workflows/reviews.yml).
 * Requires two repo secrets: GOOGLE_PLACES_API_KEY and GOOGLE_PLACE_ID.
 * Google's Place Details API returns up to 5 reviews + the live rating/count. */
const fs = require('fs');

const KEY = process.env.GOOGLE_PLACES_API_KEY;
const PLACE = process.env.GOOGLE_PLACE_ID;

if (!KEY || !PLACE) {
  console.error('Missing GOOGLE_PLACES_API_KEY or GOOGLE_PLACE_ID secret.');
  process.exit(1);
}

const url = 'https://maps.googleapis.com/maps/api/place/details/json'
  + '?place_id=' + encodeURIComponent(PLACE)
  + '&reviews_sort=newest&reviews_no_translations=true'
  + '&fields=rating,user_ratings_total,reviews'
  + '&key=' + encodeURIComponent(KEY);

(async () => {
  const res = await fetch(url);
  const data = await res.json();
  if (data.status !== 'OK') {
    console.error('Places API error:', data.status, data.error_message || '');
    process.exit(1);
  }
  const r = data.result || {};
  const esc = s => String(s || '').replace(/\s+/g, ' ').trim();

  const reviews = (r.reviews || [])
    .filter(rv => rv.rating >= 4 && rv.text && rv.text.trim().length > 25)
    .slice(0, 6)
    .map(rv => ({
      author: esc(rv.author_name) || 'Google Reviewer',
      rating: rv.rating,
      text: esc(rv.text),
      when: esc(rv.relative_time_description),
    }));

  const out = {
    updated: new Date().toISOString(),
    rating: typeof r.rating === 'number' ? r.rating : null,
    total: typeof r.user_ratings_total === 'number' ? r.user_ratings_total : null,
    reviews,
  };

  fs.writeFileSync('reviews.json', JSON.stringify(out, null, 2) + '\n');
  console.log(`Wrote reviews.json — rating ${out.rating}, total ${out.total}, ${reviews.length} review(s).`);
})().catch(e => { console.error(e); process.exit(1); });
