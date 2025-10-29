# Service Hub (Books • Weather • Recipes • Earthquakes)

Live Demo-https://smart-service-hub-8uwy.onrender.com

A professional multi-tool React application featuring four services under a unified design system and shared header:

- Book Finder: Search books via Open Library API
- Weather Now: Get current weather via Open‑Meteo API
- Recipe Ideas: Discover recipes via TheMealDB API
- Earthquake Visualizer: View recent quakes on an interactive map via USGS + React‑Leaflet

## Tech Stack
- React 19 (Create React App)
- React Router DOM
- Tailwind CSS (utility classes and a custom design system in `src/index.css`)
- React‑Leaflet + Leaflet (maps)

## Getting Started
1. Install dependencies
```bash
npm install
```
2. Start the dev server (defaults to port 3000)
```bash
npm start
```
3. Build for production
```bash
npm run build
```

If port 3000 is busy, either stop the running app or start with a different port:
```bash
set PORT=3001 && npm start
```

## Project Structure
```text
src/
  api/
    openLibrary.js          # Book Finder API helpers
    weatherApi.js           # Open‑Meteo helpers + geocoding
    recipeApi.js            # TheMealDB helpers & parsers
    earthquakeApi.js        # USGS helpers + formatters
  components/
    Header.js               # Shared header across all pages
    SearchBar.js            # Reused in Book Finder
    BookCard.js, Pagination.js
  pages/
    Layout.js               # Wraps pages with Header via <Outlet />
    LandingPage.js          # Service grid (entry)
    BookFinder.js           # Books service
    WeatherNow.js           # Weather service
    RecipeIdeas.js          # Recipes service
    EarthquakeVisualizer.js # Earthquake map
  index.css                 # Tailwind layers + design tokens + base styles
  App.js                    # Router config
```

## Routing
- `/` → Landing Page (Service Hub)
- `/book-finder` → Book Finder
- `/weather-now` → Weather Now
- `/recipe-ideas` → Recipe Ideas
- `/earthquake-visualizer` → Earthquake Visualizer

All pages share the same header via `pages/Layout.js`.

## APIs Used
- Open Library Search: `https://openlibrary.org/search.json?title={title}` and helpers in `api/openLibrary.js`
- Open‑Meteo: geocoding + current weather in `api/weatherApi.js`
- TheMealDB: search/filter/random + parsing helpers in `api/recipeApi.js`
- USGS Earthquakes: GeoJSON feeds in `api/earthquakeApi.js`

No API keys are required for these endpoints.

## Styling & Design
- Tailwind layers are enabled in `src/index.css` (`@tailwind base/components/utilities`).
- Global link reset removes underlines and inherits color.
- Reusable utility classes implement a consistent, professional look (cards, buttons, inputs, grids).

## Map Notes (Earthquakes)
Leaflet assets are loaded via `react-leaflet` and the default marker fix in `pages/EarthquakeVisualizer.js`. Map tiles use OpenStreetMap.

## Scripts
- `npm start` - start dev server
- `npm run build` - production build
- `npm test` - CRA test runner (no tests included by default)

## Accessibility & Performance
- Keyboard focus styles enabled on inputs
- Optimized images via external APIs
- Responsive grid layouts for mobile and desktop

## Troubleshooting
- Styles not applying: ensure `src/index.css` contains Tailwind layers and is imported by `src/index.js`.
- Port already in use: stop the existing process or change the port (`set PORT=3001 && npm start`).
- Map tiles not showing: check network/cors and verify Leaflet css is loaded (`import 'leaflet/dist/leaflet.css'`).

## License
This project is for educational/demo purposes. API data is provided by respective providers (Open Library, Open‑Meteo, TheMealDB, USGS).
