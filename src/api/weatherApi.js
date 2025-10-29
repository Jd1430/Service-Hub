// Weather API service using Open-Meteo API
const BASE_URL = "https://api.open-meteo.com/v1/forecast";

export async function getCurrentWeather(latitude, longitude) {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m",
    timezone: "auto"
  });

  const response = await fetch(`${BASE_URL}?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`Weather API Error: ${response.status}`);
  }
  return await response.json();
}

export async function getWeatherByCity(cityName) {
  // First get coordinates from city name using geocoding
  const geocodeResponse = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`
  );
  
  if (!geocodeResponse.ok) {
    throw new Error(`Geocoding API Error: ${geocodeResponse.status}`);
  }
  
  const geocodeData = await geocodeResponse.json();
  
  if (!geocodeData.results || geocodeData.results.length === 0) {
    throw new Error("City not found");
  }
  
  const { latitude, longitude, name, country } = geocodeData.results[0];
  
  // Then get weather data
  const weatherData = await getCurrentWeather(latitude, longitude);
  
  return {
    ...weatherData,
    location: {
      name,
      country,
      latitude,
      longitude
    }
  };
}

export function getWeatherIcon(weatherCode) {
  // Weather codes mapping based on WMO Weather interpretation codes
  const weatherIcons = {
    0: "☀️", // Clear sky
    1: "🌤️", // Mainly clear
    2: "⛅", // Partly cloudy
    3: "☁️", // Overcast
    45: "🌫️", // Fog
    48: "🌫️", // Depositing rime fog
    51: "🌦️", // Light drizzle
    53: "🌦️", // Moderate drizzle
    55: "🌧️", // Dense drizzle
    61: "🌧️", // Slight rain
    63: "🌧️", // Moderate rain
    65: "🌧️", // Heavy rain
    71: "❄️", // Slight snow fall
    73: "❄️", // Moderate snow fall
    75: "❄️", // Heavy snow fall
    77: "❄️", // Snow grains
    80: "🌦️", // Slight rain showers
    81: "🌦️", // Moderate rain showers
    82: "🌧️", // Violent rain showers
    85: "🌨️", // Slight snow showers
    86: "🌨️", // Heavy snow showers
    95: "⛈️", // Thunderstorm
    96: "⛈️", // Thunderstorm with slight hail
    99: "⛈️"  // Thunderstorm with heavy hail
  };
  
  return weatherIcons[weatherCode] || "🌤️";
}

export function getWeatherDescription(weatherCode) {
  const descriptions = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    71: "Slight snow fall",
    73: "Moderate snow fall",
    75: "Heavy snow fall",
    77: "Snow grains",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    85: "Slight snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail"
  };
  
  return descriptions[weatherCode] || "Unknown";
}
