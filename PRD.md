# Smart Travel Packing Planner — Product Requirements Document

## 1. Project Overview

**Project Name:** Smart Travel Packing Planner

**Purpose:** Build a simple website that helps users create a personalized packing list based on their travel destination, travel dates, and weather forecast.

The website will use the Open-Meteo API to get real weather data. It will then calculate the trip length and recommend clothing and other items based on the expected weather.

The goal is to make packing easier and help users avoid forgetting important items or bringing unnecessary things.

## 2. Target Users

The main target users are college students and people who travel frequently.

For example, a college student traveling from Boston to Tokyo may not know what clothes to pack. Instead of checking the weather separately and making a packing list manually, the student can use this website to get recommendations in one place.

## 3. User Stories

- As a user, I want to search for a destination city so that I can check the weather there.
- As a user, I want to select my travel dates so that I can see the forecast during my trip.
- As a user, I want to receive packing recommendations based on the weather so that I know what to bring.
- As a user, I want to see suggested quantities of clothing based on my trip length.
- As a user, I want to check off packed items so that I can track my packing progress.

## 4. Core Features

### Feature 1: Destination Search

Users can enter the name of a city.

The website will use the Open-Meteo Geocoding API to find the city's location.

**Requirements:**

- Provide a text input for the destination.
- Allow users to search for a city.
- Display matching locations when multiple cities have the same name.
- Allow the user to select the correct location.
- Show an error message if the city cannot be found.

### Feature 2: Travel Date Selection

Users can select their departure and return dates.

**Requirements:**

- Provide a start-date input and an end-date input.
- The end date cannot be earlier than the start date.
- Both dates must be within the available weather forecast period.
- Calculate the total number of travel days, including both departure and return dates.
- Display an error message when the dates are invalid.

### Feature 3: Weather Forecast

The website will retrieve weather information for the selected city and travel dates.

**API:** Open-Meteo Forecast API

**Weather Data:**

- Daily maximum temperature
- Daily minimum temperature
- Daily precipitation probability
- Daily precipitation amount

**Requirements:**

- Display the destination name and selected travel dates.
- Show the expected temperature range.
- Show whether rain is expected.
- Display a short weather summary.
- Clearly indicate that weather forecasts may change.

### Feature 4: Smart Packing List

The website will generate a packing list based on the weather and number of travel days.

**Packing Rules:**

| Weather Condition | Packing Recommendation |
|---|---|
| Cold weather (below 10°C) | Warm jacket, sweaters, long pants |
| Mild weather (10–24°C) | Light jacket, T-shirts, comfortable pants |
| Hot weather (above 24°C) | Light clothing, shorts, sunglasses |
| Rain expected | Umbrella, raincoat, waterproof shoes |

**Quantity Calculations:**

- Underwear: one per travel day, plus one extra.
- Socks: one pair per travel day, plus one extra.
- Tops: one per travel day.
- Pants: one pair for every two travel days, rounded up.
- Sleepwear: one set for trips of five days or fewer, two sets for longer trips.

**Requirements:**

- Automatically generate the packing list after the forecast loads.
- Display suggested quantities for clothing.
- Organize items into Clothing, Weather Essentials, and Personal Items.
- Allow users to check off items after packing them.

### Feature 5: Packing Progress Tracker

Users can track how much of their packing list is completed.

**Requirements:**

- Display a checkbox next to each packing item.
- Calculate the number of checked items.
- Display a packing completion percentage.
- Update the progress immediately when an item is checked or unchecked.
- Save checklist progress using `localStorage`.
- Keep saved progress when the user refreshes the page for the same trip.
- Keep separate checklist progress for different trips.

## 5. API Integration

### API 1: Open-Meteo Geocoding API

**Documentation:** https://open-meteo.com/en/docs/geocoding-api

Example request:

`https://geocoding-api.open-meteo.com/v1/search?name=Tokyo&count=5&language=en&format=json`

Fields used:

- `results`
- `name`
- `country`
- `latitude`
- `longitude`

### API 2: Open-Meteo Weather Forecast API

**Documentation:** https://open-meteo.com/en/docs

Example request:

`https://api.open-meteo.com/v1/forecast?latitude=35.68&longitude=139.69&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum&timezone=auto&forecast_days=3`

Fields used:

- `daily.time`
- `daily.temperature_2m_max`
- `daily.temperature_2m_min`
- `daily.precipitation_probability_max`
- `daily.precipitation_sum`

The website will use JavaScript `fetch()` and `await` to retrieve the API data.

Each API request must be inside `try/catch`, and the code must check `response.ok` before processing the JSON response.

The website will not require an API key.

## 6. User Interface States

### State 1: Empty State

**Before the user searches:**

- Display the website title and a short introduction.
- Show the destination input and travel date fields.
- Display instructions such as "Enter your destination and travel dates to create your packing list."
- Do not display a packing list yet.

**When no city is found:**

- Display "No matching cities found. Try another city name."
- Keep the search field available so the user can try again.

### State 2: Loading State

While the website is requesting data:

- Display a loading message such as "Checking the weather and preparing your packing list..."
- Disable the Generate Packing List button to prevent repeated requests.
- Keep the entered destination and dates visible.
- Remove the loading message when the request finishes.

### State 3: Error State

If an API request fails:

- Display a clear error message near the search form.
- Example: "We couldn't load the weather data. Please try again."
- Allow the user to retry without re-entering all information.
- Do not display incomplete or incorrect packing recommendations.

The error state must also work when the browser is offline.

### State 4: Invalid Input State

The website must validate user inputs before making an API request.

**Invalid examples:**

- The destination field is empty or too short.
- The user has not selected a city.
- The start date is missing.
- The end date is missing.
- The end date is before the start date.
- The selected dates are outside the available weather forecast period.

**Expected behavior:**

- Show a specific validation message.
- Keep the user's existing input.
- Do not send an API request until the input is valid.

### State 5: In-Use / Success State

After the API data loads successfully:

- Display the destination and travel dates.
- Show the weather summary.
- Display the generated packing list.
- Show suggested quantities.
- Display checkboxes and a progress indicator.
- Allow users to update packing progress.

## 7. Page Layout and Design

The website will use a clean, simple, travel-inspired design.

**Main Sections:**

1. **Header:** Website name and short description.
2. **Trip Planner Form:** Destination input and date selectors.
3. **Weather Summary:** Destination, temperature range, and rain information.
4. **Packing List:** Recommended items organized into categories.
5. **Progress Tracker:** Number and percentage of completed items.

**Design Goals:**

- Simple and easy to understand.
- Light blue and white color scheme.
- Clear headings and readable text.
- Rounded cards and buttons.
- Responsive layout for desktop and mobile.
- Accessible form labels and keyboard navigation.

The detailed visual decisions will be documented in `DESIGN.md` before styling the application.

## 8. Technical Requirements

The website must:

- Use plain HTML, CSS, and JavaScript.
- Use JavaScript `fetch()` and `await` for API requests.
- Render API data and calculated results using JavaScript.
- Use `try/catch` and `response.ok` for error handling.
- Use `localStorage` to save packing progress.
- Use semantic HTML.
- Work on desktop and mobile screens.
- Avoid React, Tailwind, external frameworks, and CDN libraries.
- Keep API keys and secrets out of the repository.
- Be deployed using GitHub Pages.

**GitHub Repository:**

https://github.com/azaz2005mzhu3/smart-travel-packing-planner

**Planned Live Website:**

https://azaz2005mzhu3.github.io/smart-travel-packing-planner/

## 9. Acceptance Criteria

The project will be considered complete when:

- [ ] A user can enter a city and select travel dates.
- [ ] The website retrieves location and weather data from Open-Meteo.
- [ ] A user can select the correct city from multiple search results.
- [ ] The website calculates the trip length correctly.
- [ ] The website generates packing recommendations based on weather conditions.
- [ ] The packing list displays suggested quantities.
- [ ] Users can check and uncheck packing items.
- [ ] The progress percentage updates correctly.
- [ ] Packing progress is saved when the page is refreshed.
- [ ] All five UI states work correctly.
- [ ] API errors are handled using `try/catch` and `response.ok`.
- [ ] The website is usable on a mobile device.
- [ ] The live GitHub Pages URL works.
- [ ] The project is ready for an in-class demonstration.

## 10. Out of Scope

To keep the project manageable, the first version will not include:

- User accounts or login.
- Flight or hotel booking.
- Paid weather APIs.
- AI-generated recommendations from an LLM.
- A database or cloud storage.
- Weather forecasts beyond the available API forecast period.

## 11. Development Plan

**October 27–29**
- Choose the API.
- Inspect the JSON response.
- Complete and commit `PROPOSAL.md`.

**October 30–31**
- Complete `PRD.md`.
- Create design trial pages.
- Complete `DESIGN.md` and `AGENTS.md`.

**November 1–3**
- Build the HTML structure and CSS.
- Connect the Open-Meteo APIs.
- Implement the packing recommendation calculations.
- Add checklist functionality and error handling.

**November 4**
- Test the website.
- Complete the README.
- Deploy and submit the GitHub Repository URL.

**November 5**
- Demonstrate the working website in class.
- Explain the API requests and JavaScript logic.
- Discuss one specific AI-generated output that was changed or verified, referring to its Git commit.