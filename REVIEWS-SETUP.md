# Live Google Reviews — one-time setup

The website auto-syncs your Google reviews once a day (and shows the static
fallback reviews until it's connected). To turn it on, do these three things:

## 1. Get your Place ID
- Go to: https://developers.google.com/maps/documentation/places/web-service/place-id
- Search for **H2O Bros** in the finder and copy the **Place ID**
  (looks like `ChIJ...`).

## 2. Create a Google API key (Places API)
- Go to https://console.cloud.google.com/ → create a project (any name).
- **APIs & Services → Enable APIs → enable "Places API"** (the classic one).
- **Credentials → Create credentials → API key.** Copy the key.
- (Recommended) Edit the key → **API restrictions → restrict to "Places API".**
- Billing must be enabled on the project, but a once-a-day call stays well
  within Google's free monthly credit — effectively $0.

## 3. Add both as GitHub secrets
- In the repo: **Settings → Secrets and variables → Actions → New repository secret.**
- Add:
  - `GOOGLE_PLACE_ID` = your Place ID from step 1
  - `GOOGLE_PLACES_API_KEY` = your API key from step 2

## Run it
- **Actions tab → "Sync Google Reviews" → Run workflow.** It fetches your
  reviews into `reviews.json`, and the homepage updates automatically.
- After that it runs every day on its own.

Notes: Google's API returns up to ~5 reviews plus your live star rating and
total count. The homepage shows those; if the sync ever fails, it falls back
to the built-in reviews so nothing looks broken.
