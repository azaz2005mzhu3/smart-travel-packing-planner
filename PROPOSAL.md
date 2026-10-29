# Smart Travel Packing Planner — Project Proposal

## 1. What I Am Building

I want to build a Smart Travel Packing Planner, a website that helps people decide what to pack for their trips based on the weather at their destination. Users can enter a city and their travel dates, and the website will use real weather data to create a personalized packing list with suggested quantities.

## 2. Who It Is For

This tool is for college students and people who travel often, including myself. When I travel, I sometimes have trouble deciding what clothes to bring, especially when the weather is different from where I live. I want to make packing easier by creating a tool that checks the weather and recommends what to bring.

## 3. The API

I plan to use the **Open-Meteo API**, which provides weather forecasts for different locations.

**API Documentation:**
https://open-meteo.com/en/docs

**City Search API:**
https://geocoding-api.open-meteo.com/v1/search?name=Tokyo&count=5&language=en&format=json

**Weather Forecast API:**
https://api.open-meteo.com/v1/forecast?latitude=35.68&longitude=139.69&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum&timezone=auto&forecast_days=3

The main data I plan to use includes:

- `name`, `country`, `latitude`, and `longitude` to identify the destination.
- `temperature_2m_max` and `temperature_2m_min` to understand the temperature.
- `precipitation_probability_max` to check the chance of rain.
- `precipitation_sum` to understand the expected amount of rain.
- `time` to match weather forecasts with travel dates.

I tested the weather API using Tokyo's coordinates and received JSON data showing daily temperatures and precipitation for three days.

I will use JavaScript `fetch()` and `await` to retrieve this information and display it on my website.

## 4. What the User Chooses

Users will be able to:

- Enter a destination city.
- Select the correct city from the search results.
- Choose their travel start and end dates.
- Check off items after packing them.

The website will use these choices to generate a packing list based on the destination, trip length, and weather forecast.

## 5. What the Page Works Out

The website will calculate the number of travel days and use the weather data to recommend what to pack.

For example, if the weather is cold, the website will recommend jackets and warm clothes. If rain is expected, it will suggest bringing an umbrella or raincoat.

The website will also calculate how many basic clothing items a person might need based on the length of the trip. It will show the number of items packed and the percentage of the packing list completed.

This makes the website more useful than simply displaying weather information.

## 6. Features

1. **Destination Search:** Users can search for a city and select the correct location.
2. **Travel Date Selection:** Users can choose their travel start and end dates.
3. **Weather Forecast:** The website displays the expected temperature and rain conditions during the trip.
4. **Smart Packing List:** The website generates packing recommendations with suggested quantities based on the weather and trip length.
5. **Packing Progress Tracker:** Users can check off packed items and see their packing progress.

## 7. What I Do Not Know Yet

I understand basic HTML, CSS, and some JavaScript, but I am still learning how to work with APIs.

I am not completely sure how to use `fetch()` and `await` to get data from two different API endpoints or how to turn the JSON response into packing recommendations.

I also need to learn how to handle errors when the API does not respond or when a user enters an invalid city.

I plan to use my AI coding agent to help me build these features, but I want to understand how the API requests work and how the website uses the returned data.