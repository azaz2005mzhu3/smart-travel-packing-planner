# Product Requirements Document (PRD)
## Smart Travel Packing Planner

**Status:** Draft for student review. No application code has been implemented in this repository.

## 1. Problem and goal
Travelers often pack too much or forget essentials when visiting places with unfamiliar weather. Build a simple responsive website that retrieves real forecast data and computes a useful packing checklist.

## 2. Target user
A college student planning a short trip within the available forecast window.

## 3. User flow
1. Enter a city name and click Search.
2. Review matching city and country results and choose one.
3. Select start and end dates.
4. Click Generate Packing List.
5. Review weather summary, recommendations and item quantities.
6. Check off items and see progress update.

## 4. API and data
**Geocoding:** https://geocoding-api.open-meteo.com/v1/search?name=Tokyo&count=5&language=en&format=json

Read `results[].name`, `country`, `latitude`, `longitude` and a stable city ID when available.

**Forecast:** https://api.open-meteo.com/v1/forecast?latitude=35.68&longitude=139.69&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum&timezone=auto&forecast_days=3

Read `daily.time`, `daily.temperature_2m_max`, `daily.temperature_2m_min`, `daily.precipitation_probability_max`, `daily.precipitation_sum`.

Use `fetch()`, `await`, `try/catch` and `response.ok` for **each** request. The user selects a city rather than hard-coding Tokyo. Use the destination timezone for dates and avoid interpreting YYYY-MM-DD as UTC-local time. The forecast is limited to Open-Meteo's supported future dates (up to 16 days with the relevant settings); do not pretend to provide distant-future forecasts.

## 5. Functional requirements
### City search
- Require at least two non-space characters before requesting.
- Show city, region (when available) and country to distinguish duplicate names.
- Show a no-results message if no matches are returned.
- Store the selected result's coordinates for the weather request.

### Date selection
- Require both dates and an end date on or after the start date.
- Limit dates to the actual forecast window.
- Calculate trip days inclusively: end minus start + 1.
- If dates change, regenerate the forecast and list.

### Weather summary
- Display selected destination, trip dates, number of days, minimum of daily lows, maximum of daily highs, and rainy-day count.
- Display daily weather details with appropriate units and explain that forecasts can change.
- Only use actual dates returned by the API; report missing dates rather than guessing.

### Packing recommendation rules (initial version)
- For any daily low below 10°C: warm jacket and sweater.
- For moderate days: light jacket and long pants.
- For any daily high above 24°C: lightweight tops and shorts.
- For any daily precipitation probability >= 40% OR precipitation sum >= 1 mm: umbrella or raincoat.
- Underwear and socks: trip days + 1 each.
- Tops: trip days.
- Pants: max(1, ceil(trip days / 2)).
- Sleepwear: 1 set for up to five days, otherwise 2.
- Always include toiletries, charger, travel documents and medications as a general reminder (not medical advice).
- Explain recommendations as simple heuristics, not guarantees.

### Checklist and progress
- Group items into Clothing, Weather Essentials and Personal Items.
- Each item shows label, quantity and checkbox.
- Completion percentage = checked items / all items * 100, rounded to a whole number.
- Save checked item IDs in localStorage scoped to city ID, start date and end date. A new trip starts a separate checklist.

## 6. UI states
**Empty initial:** Intro, city input, date inputs, instructions, no packing list.

**Empty search results:** 'No matching cities found. Try another search.' Keep the input and allow another search.

**Loading:** Show 'Looking up cities...' or 'Checking weather and building your packing list...' as appropriate; disable the active request button and avoid duplicate requests.

**Error:** Show an accessible inline message near the form when fetch fails, response.ok is false, or JSON is unusable; retain input and offer Retry. Test with DevTools Network Offline.

**Invalid input:** Show a specific error for blank/short city, no selected city, missing dates, end before start or out-of-range dates. Do not call the API until valid.

**In use:** Show weather summary, computed recommendations, quantities, checkboxes and progress; changes update immediately.

## 7. Layout and accessibility
Header and introduction, destination search, matching cities, date form, weather summary, packing groups, progress indicator. Use semantic HTML, explicit labels, visible keyboard focus, status messages with aria-live, and mobile-friendly responsive layouts. No external fonts, libraries or CDN.

## 8. Technical constraints
Plain HTML, CSS and JavaScript only; no React or Tailwind. No API key in the repository. Deploy static files on GitHub Pages. Follow DESIGN.md once the design-direction trials have been reviewed.

## 9. Acceptance tests
- Searching Tokyo shows matching cities; user can select Tokyo, Japan.
- A different city produces different coordinates and a different weather request.
- A valid three-day trip produces three-day quantities.
- An invalid date range does not trigger fetch.
- Offline mode shows a useful error and allows retry.
- No matches show the empty-results state.
- Refresh preserves checklist progress for the same trip.
- Changing trip dates does not incorrectly reuse the previous checklist.
- All controls work by keyboard and on a phone-sized screen.
- Each fetch checks response.ok and has try/catch.
- GitHub Pages loads the deployed site successfully.

## 10. Out of scope
Accounts, flight bookings, paid APIs, databases, LLM-generated packing suggestions, and forecasts outside the supported API window.

## 11. Course delivery
- Proposal is student-written and committed before AI implementation.
- Create design-direction trial pages before finalizing DESIGN.md and styling.
- Maintain AGENTS.md and README.md.
- README must document API, use instructions, live URL, where AI output differed from expectations, and a specific AI-output change or verification with commit reference.
- Submit repository URL by Wednesday November 4, 2026.
- Have a working deployment by Thursday November 5, 2026 at 3:00 PM for the class demo.
