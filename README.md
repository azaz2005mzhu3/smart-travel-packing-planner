# Smart Travel Packing Planner

A simple travel planning website that helps users decide what to pack based on their destination, trip dates, and the local weather forecast.

**Course:** OIM 3690 — Web Development with AI  
**Project status:** Planning and design complete; application implementation and deployment are in progress.

## What problem does it solve?

Packing for a trip can be difficult when the destination has unfamiliar weather. Instead of checking the forecast and making a separate packing list, this tool is designed to combine both steps. Users choose a city and travel dates, and JavaScript calculates a suggested packing list with item quantities.

## Who is it for?

College students and other travelers who want a simple, weather-aware packing checklist.

## Planned features

- Search for a destination and select the correct city from matching results.
- Choose travel start and end dates within the supported forecast window.
- See forecast temperatures and precipitation for the selected trip.
- Generate clothing and weather-related packing recommendations with quantities.
- Check off items and see packing progress, saved for the same trip using localStorage.
- See helpful empty, loading, error, invalid-input, and in-use states.

These features are **requirements, not yet verified completed features**.

## API

This project uses **Open-Meteo**, a free weather API that does not require an API key for this use case.

### 1. Geocoding API

Converts a city search into coordinates.

**Documentation:**  
https://open-meteo.com/en/docs/geocoding-api

**Example request:**  
https://geocoding-api.open-meteo.com/v1/search?name=Tokyo&count=5&language=en&format=json

**Fields used:**

- `results[].name`
- `country`
- `latitude`
- `longitude`

### 2. Forecast API

Provides daily weather data for the selected coordinates.

**Documentation:**  
https://open-meteo.com/en/docs

**Example request:**  
https://api.open-meteo.com/v1/forecast?latitude=35.68&longitude=139.69&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum&timezone=auto&forecast_days=3

**Fields used:**

- `daily.time`
- `daily.temperature_2m_max`
- `daily.temperature_2m_min`
- `daily.precipitation_probability_max`
- `daily.precipitation_sum`

The page will use JavaScript `fetch()` and `await` to retrieve the data, with `try/catch` and `response.ok` checks for each request.

The forecast is only available for dates supported by the API.

## Setup and use

This is a static HTML, CSS, and JavaScript project; no package installation or build step is required. To run it locally, serve the repository root with a local HTTP server (for example, `python -m http.server 8000` if Python is installed) and open `http://localhost:8000`. Serving the files over HTTP is preferable to opening `index.html` as a `file://` URL when checking browser API requests.

1. Open the local site or the deployed site after its URL has been verified.
2. Search for a destination city and choose the correct result.
3. Select travel start and end dates.
4. Click **Generate Packing List**.
5. Review the forecast and suggested packing quantities.
6. Check off items as you pack and track your progress.

To publish on GitHub Pages, configure the repository's Pages settings to deploy the intended branch and site root, then verify the published URL before describing the site as deployed.

## Technology

- HTML
- CSS
- Vanilla JavaScript
- Open-Meteo Geocoding and Forecast APIs
- Browser localStorage
- GitHub Pages (planned hosting)

No React, Tailwind, external UI framework, or API key is required.

## Design

I compared two design-direction trial pages:

- [Option A — Sky Blue Minimalist](design-trials/sky-blue.html)
- [Option B — Warm Editorial](design-trials/warm-editorial.html)

I selected **Option B — Warm Editorial** because I preferred its visual presentation. It uses warm cream backgrounds, soft white cards, brown accents, and editorial-style headings.

See [DESIGN.md](DESIGN.md) for the selected colors, layout, accessibility, and UI-state decisions.

## Project Files

- [PROPOSAL.md](PROPOSAL.md) — Project idea and API plan.
- [PRD.md](PRD.md) — Features, behavior, states, and acceptance criteria.
- [DESIGN.md](DESIGN.md) — Visual direction and styling rules.
- [AGENTS.md](AGENTS.md) — Instructions for the AI coding agent.
- `design-trials/` — Two HTML design experiments.
- `index.html`, `css/styles.css`, `js/script.js` — Application files.

## Live Website

**Not deployed yet.** After publishing with GitHub Pages, verify and add the working URL here.

Expected GitHub Pages address (not yet verified):

https://azaz2005mzhu3.github.io/smart-travel-packing-planner/

## AI Use, Review, and a Specific Change

AI helped draft project documentation and the initial design direction.

One AI-assisted choice I **rejected** was the original **Sky Blue Minimalist** design. After comparing both trial pages, I decided that **Warm Editorial (Option B)** looked better for my travel-planning website.

I changed the design direction in `DESIGN.md` to specify the warm cream, brown, and editorial style instead of the original blue palette.

**Evidence:**

Git commit [`8c53219`](https://github.com/azaz2005mzhu3/smart-travel-packing-planner/commit/8c5321969dc7e9c39273a9a56e5858eff40ab065)

Commit message: `design: select Warm Editorial after comparing trial pages`

This is a documented example of reviewing and changing an AI-assisted output rather than accepting it unchanged.

As implementation continues, I will add another specific example if I reject, modify, or verify AI-generated JavaScript.

## Testing Checklist

- [ ] Browser fetch works without CORS errors.
- [ ] Search different cities and choose the correct location.
- [ ] Reject missing or invalid travel dates.
- [ ] Retrieve and display real weather data.
- [ ] Calculate trip length and packing quantities.
- [ ] Display empty, loading, error, invalid-input, and in-use states.
- [ ] Save checklist progress for each trip.
- [ ] Test keyboard navigation and mobile layout.
- [ ] Deploy to GitHub Pages and verify the live URL.

## Course Milestones

- **November 4, 2026:** Submit GitHub repository URL.
- **November 5, 2026, 3:00 PM:** Working deployed site ready for in-class demo.