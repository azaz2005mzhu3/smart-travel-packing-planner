// ==========================================================================
// Smart Travel Packing Planner
// - Destination search (Open-Meteo Geocoding API)
// - Travel dates with validation
// - Weather forecast (Open-Meteo Forecast API)
// - Smart packing list with suggested quantities
// - Packing checklist with progress tracking saved in localStorage
// ==========================================================================

// Neither Open-Meteo endpoint needs an API key.
const GEOCODING_API_URL = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_API_URL = "https://api.open-meteo.com/v1/forecast";

// How many days ahead the forecast API can reliably predict. Open-Meteo's
// free forecast endpoint supports about 16 days; we use 15 to stay a little
// inside that limit and avoid days that sometimes come back with no data.
const MAX_FORECAST_DAYS_AHEAD = 15;

// Grab the elements we need from the page once, so we don't look them up
// again every time something happens.
const cityInput = document.getElementById("city-input");
const searchButton = document.getElementById("search-button");
const citySearchStatus = document.getElementById("city-search-status");
const cityResultsList = document.getElementById("city-results");
const selectedCityText = document.getElementById("selected-city");

const startDateInput = document.getElementById("start-date");
const endDateInput = document.getElementById("end-date");

const plannerForm = document.getElementById("planner-form");
const formMessage = document.getElementById("form-message");
const generateButton = plannerForm.querySelector("button[type='submit']");

const weatherContent = document.getElementById("weather-content");
const packingContent = document.getElementById("packing-content");

// This keeps track of the city the user picked from the search results.
// It starts as null because no city has been chosen yet (empty state).
let selectedCity = null;

// ==========================================================================
// Small helper functions
// ==========================================================================

// Shows a message in the city search status area.
// "type" controls the styling: "loading", "error", "success", or "" (plain).
function setCitySearchStatus(message, type = "") {
  citySearchStatus.textContent = message;
  citySearchStatus.className = "status-message" + (type ? " " + type : "");
}

// Shows a message in the form-level status area (invalid input, loading,
// or an API error that happens after the user presses Generate).
function setFormMessage(message, type = "") {
  formMessage.textContent = message;
  formMessage.className = "status-message" + (type ? " " + type : "");
}

// Removes all previous search results from the list and hides it.
function clearCityResults() {
  cityResultsList.innerHTML = "";
  cityResultsList.hidden = true;
}

// Escapes text that came from the API (like a city name) before it is
// inserted with innerHTML, so it is always treated as plain text.
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// Turns a Date object into the "YYYY-MM-DD" text that <input type="date">
// and the Open-Meteo API both expect, using the browser's local date
// (not UTC), so "today" matches what the user sees on their calendar.
function formatDateForInput(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return year + "-" + month + "-" + day;
}

// Turns an ISO date string like "2026-10-28" into a friendlier label
// like "Oct 28" for display in the weather forecast.
function formatDisplayDate(isoDateString) {
  const date = new Date(isoDateString + "T00:00:00");
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

// Turns a "YYYY-MM-DD" date-only string (like the value from
// <input type="date">) into a Date object at local midnight.
// We need this helper instead of writing `new Date(dateString)` directly,
// because that parses date-only strings as UTC midnight. Comparing a UTC
// midnight against "today" (which is local midnight) can make a date look
// like it's a day earlier than what the user actually picked, depending on
// their timezone. Building the Date from year/month/day keeps everything
// in local time so the comparisons below are always correct.
function parseDateInputValue(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
}

// Counts the number of travel days, including both the start and end date.
function countTravelDays(startDate, endDate) {
  const msPerDay = 24 * 60 * 60 * 1000;
  const diff = Math.round((endDate - startDate) / msPerDay);
  return diff + 1;
}

// ==========================================================================
// Set up the date inputs with a sensible min/max range on page load.
// This matches PRD requirement: "Both dates must be within the available
// weather forecast period." The browser will stop the user from picking
// dates outside this range, and we double-check it again on submit.
// ==========================================================================

function setUpDateLimits() {
  const today = new Date();
  const furthestDate = new Date();
  furthestDate.setDate(today.getDate() + MAX_FORECAST_DAYS_AHEAD);

  const todayText = formatDateForInput(today);
  const furthestText = formatDateForInput(furthestDate);

  startDateInput.min = todayText;
  startDateInput.max = furthestText;
  endDateInput.min = todayText;
  endDateInput.max = furthestText;
}

setUpDateLimits();

// ==========================================================================
// Destination search (Open-Meteo Geocoding API)
// ==========================================================================

// Builds the clickable list of matching cities returned by the API.
function renderCityResults(results) {
  clearCityResults();

  results.forEach((place) => {
    const listItem = document.createElement("li");
    const button = document.createElement("button");
    button.type = "button";
    button.className = "city-result-btn";

    // Build a readable label, e.g. "Tokyo, Japan" or "Portland, Oregon, United States"
    const parts = [place.name];
    if (place.admin1) parts.push(place.admin1);
    if (place.country) parts.push(place.country);
    button.textContent = parts.join(", ");

    // When the user clicks a result, save it as the selected city.
    button.addEventListener("click", () => {
      selectedCity = {
        name: place.name,
        country: place.country || "",
        admin1: place.admin1 || "",
        latitude: place.latitude,
        longitude: place.longitude,
      };

      selectedCityText.textContent = "Selected: " + button.textContent;
      clearCityResults();
      setCitySearchStatus("");
    });

    listItem.appendChild(button);
    cityResultsList.appendChild(listItem);
  });

  cityResultsList.hidden = false;
}

// Calls the Open-Meteo Geocoding API and shows the matching cities.
// Uses fetch(), await, try/catch, and response.ok as required.
async function searchCity() {
  const cityName = cityInput.value.trim();

  // Invalid input state: the search box is empty or too short.
  if (cityName.length < 2) {
    setCitySearchStatus("Please enter at least 2 letters of a city name.", "error");
    clearCityResults();
    return;
  }

  // A new search means any previously selected city no longer applies.
  selectedCity = null;
  selectedCityText.textContent = "";
  clearCityResults();

  // Loading state: let the user know we are working on it.
  setCitySearchStatus("Searching for cities...", "loading");
  searchButton.disabled = true;

  try {
    const url =
      GEOCODING_API_URL +
      "?name=" +
      encodeURIComponent(cityName) +
      "&count=5&language=en&format=json";

    const response = await fetch(url);

    // Always check response.ok before trying to read the body.
    if (!response.ok) {
      throw new Error("Geocoding request failed with status " + response.status);
    }

    const data = await response.json();

    // The API does not include a "results" field when nothing is found.
    if (!data.results || data.results.length === 0) {
      setCitySearchStatus("No matching cities found. Try another city name.", "error");
      return;
    }

    setCitySearchStatus(
      "Found " + data.results.length + " matching cities. Select one below.",
      "success"
    );
    renderCityResults(data.results);
  } catch (error) {
    // Error state: the network failed, the API is down, or something else
    // went wrong. The user can simply press "Search" again to retry.
    console.error(error);
    setCitySearchStatus(
      "We couldn't load city results. Please check your connection and try again.",
      "error"
    );
  } finally {
    searchButton.disabled = false;
  }
}

// Trigger a search when the button is clicked...
searchButton.addEventListener("click", searchCity);

// ...or when the user presses Enter inside the city input field.
cityInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault(); // stop the form from submitting early
    searchCity();
  }
});

// If the user edits the text after already selecting a city, that old
// selection no longer matches what's typed. Clear it so they must search
// and pick again, instead of silently generating a list for the wrong city.
cityInput.addEventListener("input", () => {
  if (selectedCity) {
    selectedCity = null;
    selectedCityText.textContent = "";
  }
});

// ==========================================================================
// Form validation (Invalid Input State)
// ==========================================================================

// Checks every input the user needs to provide before we call the weather
// API. Returns an error message string, or "" if everything is valid.
function validatePlannerForm(startValue, endValue) {
  if (!selectedCity) {
    return "Please search for a city and select it from the results.";
  }

  if (!startValue || !endValue) {
    return "Please choose both a start date and an end date.";
  }

  const startDate = parseDateInputValue(startValue);
  const endDate = parseDateInputValue(endValue);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const furthestDate = new Date();
  furthestDate.setDate(today.getDate() + MAX_FORECAST_DAYS_AHEAD);

  if (endDate < startDate) {
    return "The end date cannot be earlier than the start date.";
  }

  if (startDate < today || startDate > furthestDate || endDate > furthestDate) {
    return (
      "Weather forecasts are only available from today through the next " +
      MAX_FORECAST_DAYS_AHEAD +
      " days. Please choose dates in that range."
    );
  }

  return "";
}

// ==========================================================================
// Weather forecast (Open-Meteo Forecast API)
// ==========================================================================

// Calls the forecast API for the selected city and date range.
// Uses fetch(), await, try/catch, and response.ok as required.
async function fetchWeatherForecast(city, startValue, endValue) {
  const url =
    FORECAST_API_URL +
    "?latitude=" +
    encodeURIComponent(city.latitude) +
    "&longitude=" +
    encodeURIComponent(city.longitude) +
    "&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum" +
    "&timezone=auto" +
    "&start_date=" +
    startValue +
    "&end_date=" +
    endValue;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Forecast request failed with status " + response.status);
  }

  const data = await response.json();

  // Make sure the JSON actually has the daily data we expect before using it.
  if (!data.daily || !data.daily.time || data.daily.time.length === 0) {
    throw new Error("Forecast response did not include daily weather data.");
  }

  return data.daily;
}

// ==========================================================================
// City photo (Wikipedia Summary API)
// ==========================================================================

// Wikipedia's free public "page summary" endpoint sometimes includes a
// thumbnail photo for a place. It does not need an API key, which matches
// the rule in AGENTS.md against using services that require one.
const WIKIPEDIA_SUMMARY_URL = "https://en.wikipedia.org/api/rest_v1/page/summary/";

// Tries to find a representative photo for the destination city.
// This is "best effort": if nothing suitable is found, or the request
// fails for any reason, it simply returns null instead of throwing, so a
// missing photo never breaks the weather forecast or packing list.
async function fetchCityImage(city) {
  // Plain city names can be ambiguous (for example "Springfield" matches
  // many places), so we first try "City, Region" for a more specific
  // match, then fall back to just the city name on its own.
  const titlesToTry = [];
  if (city.admin1 && city.admin1 !== city.name) {
    titlesToTry.push(city.name + ", " + city.admin1);
  }
  titlesToTry.push(city.name);

  for (const title of titlesToTry) {
    try {
      const url = WIKIPEDIA_SUMMARY_URL + encodeURIComponent(title);
      const response = await fetch(url);

      if (!response.ok) {
        continue; // Try the next title instead of giving up right away.
      }

      const data = await response.json();

      // "standard" means a real article page (not a disambiguation page,
      // which lists multiple unrelated places and has no single photo).
      if (data.type === "standard" && data.thumbnail && data.thumbnail.source) {
        return data.thumbnail.source;
      }
    } catch (error) {
      console.error(error);
      // Keep trying the next title rather than failing the whole search.
    }
  }

  return null; // No photo found for any of the titles we tried.
}

// Turns the raw daily arrays from the API into the summary numbers we need:
// the overall temperature range, whether rain is expected, and a simple
// per-day list for display.
function summarizeWeather(daily) {
  const days = daily.time.map((date, index) => ({
    date: date,
    high: daily.temperature_2m_max[index],
    low: daily.temperature_2m_min[index],
    rainChance: daily.precipitation_probability_max[index],
    precipitation: daily.precipitation_sum[index],
  }));

  const highs = days.map((day) => day.high).filter((value) => value !== null);
  const lows = days.map((day) => day.low).filter((value) => value !== null);

  const overallMax = Math.max(...highs);
  const overallMin = Math.min(...lows);

  // The PRD defines rain using either a 40% chance or at least 1 mm.
  const rainExpected = days.some(
    (day) =>
      (day.rainChance !== null && day.rainChance >= 40) ||
      (day.precipitation !== null && day.precipitation >= 1)
  );

  return { days, overallMax, overallMin, rainExpected };
}

// Builds the weather section's HTML content from the summary.
// "imageUrl" is optional: pass null/undefined when no city photo was found,
// and the photo is simply left out (per the agreed "hide" fallback).
function renderWeather(cityLabel, tripDays, weather, imageUrl) {
  const dailyListItems = weather.days
    .map((day) => {
      const high = day.high === null ? "--" : Math.round(day.high) + "°C";
      const low = day.low === null ? "--" : Math.round(day.low) + "°C";
      const rain = day.rainChance === null ? "--" : day.rainChance + "%";
      return (
        "<li>" +
        formatDisplayDate(day.date) +
        ": high " +
        high +
        ", low " +
        low +
        ", " +
        rain +
        " chance of rain</li>"
      );
    })
    .join("");

  // Only add the photo markup when we actually have an image URL.
  const imageHtml = imageUrl
    ? '<img class="city-photo" src="' +
      escapeHtml(imageUrl) +
      '" alt="Photo of ' +
      escapeHtml(cityLabel) +
      '">'
    : "";

  weatherContent.innerHTML =
    imageHtml +
    '<p class="trip-summary"><strong>' +
    escapeHtml(cityLabel) +
    "</strong> &mdash; " +
    tripDays +
    " day" +
    (tripDays === 1 ? "" : "s") +
    "</p>" +
    "<p>Expected temperatures: " +
    Math.round(weather.overallMin) +
    "&deg;C to " +
    Math.round(weather.overallMax) +
    "&deg;C.</p>" +
    "<p>" +
    (weather.rainExpected
      ? "Rain is likely on at least one day of your trip."
      : "Little to no rain is expected during your trip.") +
    "</p>" +
    '<ul class="daily-list">' +
    dailyListItems +
    "</ul>" +
    '<p class="weather-note">Weather forecasts may change, especially for dates further in the future. Check back closer to your trip.</p>';
}

// ==========================================================================
// Smart packing list (Feature 4 in PRD.md)
// ==========================================================================

// Builds the packing list items, organized into the three required
// categories, using the weather summary and the number of travel days.
function buildPackingList(tripDays, weather) {
  const clothing = [];
  const weatherEssentials = [];
  const personalItems = [];

  // Check all forecast days against the temperature rules in PRD.md.
  let topStyle;
  let bottomStyle;
  let jacketItem = null;
  const hasColdWeather = weather.days.some((day) => day.low !== null && day.low < 10);
  const hasHotWeather = weather.days.some((day) => day.high !== null && day.high > 24);

  if (hasColdWeather) {
    topStyle = "Warm tops (sweaters)";
    bottomStyle = "Long pants";
    jacketItem = "Warm jacket";
  } else if (hasHotWeather) {
    topStyle = "Lightweight clothing";
    bottomStyle = "Shorts";
  } else {
    topStyle = "T-shirts";
    bottomStyle = "Comfortable pants";
    jacketItem = "Light jacket";
  }

  // Quantity Calculations from PRD.md.
  clothing.push({ name: topStyle, qty: tripDays });
  clothing.push({ name: bottomStyle, qty: Math.ceil(tripDays / 2) });
  clothing.push({ name: "Underwear", qty: tripDays + 1 });
  clothing.push({ name: "Socks (pairs)", qty: tripDays + 1 });
  clothing.push({ name: "Sleepwear (sets)", qty: tripDays <= 5 ? 1 : 2 });

  if (jacketItem) {
    clothing.push({ name: jacketItem, qty: 1 });
  }

  // Hot weather also calls for sunglasses.
  if (hasHotWeather) {
    weatherEssentials.push({ name: "Sunglasses", qty: 1 });
  }

  // Rain essentials, only added when rain is expected.
  if (weather.rainExpected) {
    weatherEssentials.push({ name: "Umbrella", qty: 1 });
    weatherEssentials.push({ name: "Raincoat", qty: 1 });
    weatherEssentials.push({ name: "Waterproof shoes", qty: 1 });
  }

  // A small, fixed set of personal items every trip needs.
  personalItems.push({ name: "Toiletries bag", qty: 1 });
  personalItems.push({ name: "Phone charger", qty: 1 });
  personalItems.push({ name: "Travel documents (ID / passport)", qty: 1 });
  personalItems.push({ name: "Medications (if needed)", qty: 1 });

  return {
    Clothing: clothing,
    "Weather Essentials": weatherEssentials,
    "Personal Items": personalItems,
  };
}

// ==========================================================================
// Packing progress tracker (Feature 5 in PRD.md), saved with localStorage
// ==========================================================================

// Builds a storage key that is unique to this city + date range, so
// different trips keep separate checklist progress.
function getTripStorageKey(city, startValue, endValue) {
  return (
    "packing-progress::" +
    city.name +
    "::" +
    city.country +
    "::" +
    city.latitude +
    "::" +
    city.longitude +
    "::" +
    startValue +
    "::" +
    endValue
  );
}

// Reads saved checkbox states for this trip from localStorage.
// Returns an empty object if nothing has been saved yet, or if
// localStorage is unavailable/corrupted.
function loadTripProgress(storageKey) {
  try {
    const raw = localStorage.getItem(storageKey);
    return raw ? JSON.parse(raw) : {};
  } catch (error) {
    console.error("Could not read saved packing progress.", error);
    return {};
  }
}

// Saves the current checkbox states for this trip to localStorage.
function saveTripProgress(storageKey, progress) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(progress));
  } catch (error) {
    console.error("Could not save packing progress.", error);
  }
}

// Recalculates how many items are checked and updates the progress bar
// and text accordingly.
function updateProgressDisplay() {
  const checkboxes = packingContent.querySelectorAll('input[type="checkbox"]');
  const total = checkboxes.length;
  let checked = 0;
  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) checked += 1;
  });

  const percent = total === 0 ? 0 : Math.round((checked / total) * 100);

  const progressFill = document.getElementById("progress-fill");
  const progressTrack = document.getElementById("progress-track");
  const progressText = document.getElementById("progress-text");

  if (progressFill) progressFill.style.width = percent + "%";
  if (progressTrack) progressTrack.setAttribute("aria-valuenow", String(percent));
  if (progressText) {
    progressText.textContent = checked + " of " + total + " items packed (" + percent + "%)";
  }
}

// Builds the full packing list section: progress bar, categories, and
// checkboxes, restoring any previously saved progress for this exact trip.
function renderPackingList(tripDays, categories, storageKey) {
  const savedProgress = loadTripProgress(storageKey);

  let html =
    '<div class="progress-wrap">' +
    '<div id="progress-track" class="progress-track" role="progressbar" ' +
    'aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" aria-label="Packing progress">' +
    '<div id="progress-fill" class="progress-fill" style="width: 0%"></div>' +
    "</div>" +
    '<p id="progress-text" class="progress-text">0 of 0 items packed (0%)</p>' +
    "</div>";

  Object.keys(categories).forEach((categoryName) => {
    const items = categories[categoryName];
    if (items.length === 0) return;

    html += '<div class="packing-category"><h3>' + categoryName + "</h3><ul class='checklist'>";

    items.forEach((item) => {
      const itemKey = categoryName + "||" + item.name;
      const isChecked = savedProgress[itemKey] === true;
      const checkedAttr = isChecked ? "checked" : "";

      html +=
        '<li><label><input type="checkbox" data-item-key="' +
        itemKey +
        '" ' +
        checkedAttr +
        "> " +
        item.name +
        " &mdash; " +
        item.qty +
        "</label></li>";
    });

    html += "</ul></div>";
  });

  packingContent.innerHTML = html;

  // Hook up each checkbox so checking/unchecking saves progress and
  // updates the progress bar immediately.
  packingContent.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      const progress = loadTripProgress(storageKey);
      progress[checkbox.dataset.itemKey] = checkbox.checked;
      saveTripProgress(storageKey, progress);
      updateProgressDisplay();
    });
  });

  updateProgressDisplay();
}

// ==========================================================================
// Putting it all together: handle the "Generate Packing List" button
// ==========================================================================

plannerForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const startValue = startDateInput.value;
  const endValue = endDateInput.value;

  // Invalid Input State: stop here if anything required is missing or wrong.
  const validationError = validatePlannerForm(startValue, endValue);
  if (validationError) {
    setFormMessage(validationError, "error");
    return;
  }

  setFormMessage("");

  const startDate = parseDateInputValue(startValue);
  const endDate = parseDateInputValue(endValue);
  const tripDays = countTravelDays(startDate, endDate);
  const cityLabel = [selectedCity.name, selectedCity.admin1, selectedCity.country]
    .filter(Boolean)
    .join(", ");

  // Loading State: show status, keep entered values, disable the button.
  setFormMessage("Checking the weather and preparing your packing list...", "loading");
  generateButton.disabled = true;

  try {
    const daily = await fetchWeatherForecast(selectedCity, startValue, endValue);
    const weather = summarizeWeather(daily);

    // The city photo is a "nice to have" extra, not required weather data,
    // so we fetch it after the forecast succeeds and never let a missing
    // photo turn into an error for the whole page (see fetchCityImage).
    const imageUrl = await fetchCityImage(selectedCity);

    renderWeather(cityLabel, tripDays, weather, imageUrl);

    const categories = buildPackingList(tripDays, weather);
    const storageKey = getTripStorageKey(selectedCity, startValue, endValue);
    renderPackingList(tripDays, categories, storageKey);

    setFormMessage("");
  } catch (error) {
    // Error State: don't show incomplete/incorrect data, and let the user
    // retry just by pressing Generate again without losing their inputs.
    console.error(error);
    setFormMessage("We couldn't load the weather data. Please try again.", "error");
  } finally {
    generateButton.disabled = false;
  }
});
