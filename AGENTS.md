# AGENTS.md — Smart Travel Packing Planner

## Project Overview

This project is a Smart Travel Packing Planner that helps users decide what to pack based on their destination, travel dates, and weather forecast.

The website uses the Open-Meteo API to retrieve weather information and generates a personalized packing list with suggested quantities.

## Instructions for My AI Agent

### 1. Keep the Code Simple

I am still learning JavaScript, so please use simple and beginner-friendly code.

- Use plain HTML, CSS, and JavaScript.
- Do not use React, Tailwind, or other frameworks.
- Do not add unnecessary libraries or complicated features.
- Use clear variable names and short functions.
- Add comments when the logic might be difficult to understand.
- Make sure I can explain the code during my class presentation.

### 2. Follow My Project Documents

Before writing code, read these files:

- `PROPOSAL.md` — My original project idea.
- `PRD.md` — The required features and user interactions.
- `DESIGN.md` — The visual design and layout decisions.

Do not add features that are not included in these documents unless I approve them.

### 3. Follow My Design Direction

Use **Option B — Warm Editorial**, which is the design direction I selected.

The website should have:

- A warm cream background.
- Soft white cards.
- Brown buttons and accents.
- Elegant headings.
- Simple and readable text.
- A clean, organized layout.

Use the colors and design rules from `DESIGN.md`.

Make sure the website works on both desktop and mobile screens.

### 4. Use the Open-Meteo API

The website should use two API endpoints:

**Geocoding API:** To search for a destination city and retrieve its coordinates.

**Weather Forecast API:** To retrieve weather information for the selected city and travel dates.

Use JavaScript `fetch()` and `await` for API requests.

For every API request:

- Use `try/catch` to handle errors.
- Check `response.ok` before reading the response.
- Check that the expected JSON data exists.
- Show a useful error message if the request fails.

Do not hard-code Tokyo as the only available destination.

### 5. Calculate Packing Recommendations

The website should calculate packing recommendations using the weather data and number of travel days.

Follow the rules in `PRD.md`.

For example:

- Cold weather: recommend warm clothes and jackets.
- Hot weather: recommend lightweight clothes.
- Rainy weather: recommend an umbrella or raincoat.
- Longer trips: recommend more clothing items.

The packing list must be calculated using JavaScript, not manually written for one example destination.

### 6. Include All Required UI States

The website must handle:

1. **Empty State:** Before the user enters information.
2. **Loading State:** While waiting for the API response.
3. **Error State:** When an API request fails.
4. **Invalid Input State:** When the user enters incorrect or missing information.
5. **In-Use State:** When the weather forecast and packing list are displayed.

Also show a helpful message when a city search returns no results.

### 7. Packing Checklist

Users should be able to check off items after packing them.

- Show a checkbox for each packing item.
- Update the packing progress percentage.
- Use `localStorage` to save progress.
- Keep the progress when the page is refreshed.
- Save progress separately for different trips.

### 8. Accessibility and Responsive Design

- Use semantic HTML.
- Add labels to all input fields.
- Make buttons and checkboxes accessible by keyboard.
- Show clear focus styles.
- Use readable font sizes.
- Make the layout responsive for mobile devices.
- Do not use color alone to communicate errors or success.

### 9. Security and API Keys

- Do not put API keys or passwords in the code.
- Do not commit secrets to GitHub.
- Use the public Open-Meteo endpoints that do not require an API key.

### 10. GitHub and Development Process

- Work on one feature at a time.
- Use clear Git commit messages.
- Do not rewrite or delete existing project documents without asking.
- Test each feature before moving to the next one.
- Do not claim a feature works unless it has been tested.
- Keep the website compatible with GitHub Pages.

### 11. Important Reminder

Please do not build extra features just because they seem useful.

My goal is to create a simple, functional website that meets the assignment requirements.

I want to understand the JavaScript and API logic instead of relying on complicated AI-generated code.