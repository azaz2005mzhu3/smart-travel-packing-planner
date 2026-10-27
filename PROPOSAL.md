# Smart Travel Packing Planner — Proposal Draft

> **Student review required:** This is an AI-assisted draft. Rewrite it in your own words and commit your version before using AI to implement the application, as required by the assignment.

## What I am building
A website that looks up weather forecasts for a travel destination and creates a packing list with suggested quantities.

## Who it is for
College students and travelers, including me, who want to pack efficiently for trips to places with unfamiliar weather.

## The API
Open-Meteo Geocoding API: https://open-meteo.com/en/docs/geocoding-api

Example city lookup: https://geocoding-api.open-meteo.com/v1/search?name=Tokyo&count=5&language=en&format=json

Open-Meteo Forecast API: https://open-meteo.com/en/docs

Example forecast URL: https://api.open-meteo.com/v1/forecast?latitude=35.68&longitude=139.69&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum&timezone=auto&forecast_days=3

Fields: geocoding results name, country, latitude and longitude; forecast daily.time, daily.temperature_2m_max, daily.temperature_2m_min, daily.precipitation_probability_max and daily.precipitation_sum.

I have inspected a Tokyo forecast JSON response, which included temperatures and precipitation for three days. I still need to confirm CORS from my GitHub Pages browser console.

## What the user chooses
A destination city and travel start and end dates within the available forecast period.

## What the page works out
Trip duration, weather conditions, clothing quantities, recommended weather essentials, and packing completion percentage.

## Features
1. Search for a destination city and choose the correct match.
2. Select valid travel dates.
3. Show the weather forecast for the trip.
4. Generate a weather-aware packing checklist with quantities.
5. Check off items and track packing progress.

## What I do not know yet
How to chain geocoding and forecast requests using fetch and await, validate JSON and date inputs, and handle API errors correctly.

## Before finalizing
- [ ] Rewrite the proposal in my own words.
- [ ] Verify the city-search endpoint's actual JSON response.
- [ ] Run fetch in the browser console of my course site and check for CORS errors.
- [ ] Commit the reviewed proposal before application code.
