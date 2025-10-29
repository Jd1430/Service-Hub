import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getWeatherByCity, getWeatherIcon, getWeatherDescription } from "../api/weatherApi";

export default function WeatherNow() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recentSearches, setRecentSearches] = useState([]);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("weatherRecentSearches");
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  const searchWeather = async (cityName) => {
    if (!cityName.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const data = await getWeatherByCity(cityName);
      setWeather(data);
      
      // Add to recent searches
      const newRecent = [cityName, ...recentSearches.filter(c => c !== cityName)].slice(0, 5);
      setRecentSearches(newRecent);
      localStorage.setItem("weatherRecentSearches", JSON.stringify(newRecent));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    searchWeather(city);
  };

  const handleRecentClick = (cityName) => {
    setCity(cityName);
    searchWeather(cityName);
  };

  const formatTemperature = (temp) => {
    return `${Math.round(temp)}°C`;
  };

  const formatWindSpeed = (speed) => {
    return `${Math.round(speed)} km/h`;
  };

  const formatWindDirection = (direction) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(direction / 22.5) % 16;
    return directions[index];
  };

  return (
    <div className="min-h-screen">
      <div className="professional-container">
        {/* Back Button */}
        <div className="pt-6 pb-4">
          <Link 
            to="/" 
            className="inline-flex items-center text-white/80 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Services
          </Link>
        </div>

        {/* Header Section */}
        <header className="text-center py-8">
          <h1 className="elegant-title text-5xl md:text-6xl mb-6">
            🌤️ Weather Now
          </h1>
          <p className="elegant-subtitle max-w-2xl mx-auto mb-8">
            Get real-time weather conditions for any city worldwide. Perfect for outdoor enthusiasts and travelers.
          </p>
          
          {/* Search Section */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="elegant-card p-6">
              <form onSubmit={handleSubmit} className="flex gap-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    className="professional-input"
                    placeholder="Enter city name (e.g., London, New York, Tokyo)..."
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className={`professional-btn ${!city.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={!city.trim() || loading}
                >
                  {loading ? "Searching..." : "Search"}
                </button>
              </form>
            </div>
          </div>
        </header>

        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <div className="elegant-card p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Searches</h3>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((searchCity, index) => (
                <button
                  key={index}
                  onClick={() => handleRecentClick(searchCity)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors"
                >
                  {searchCity}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <div className="loading-spinner mx-auto mb-4"></div>
            <p className="text-white text-lg">Fetching weather data...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="elegant-card p-8 text-center mb-8">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Weather data unavailable</h3>
            <p className="text-gray-600">{error}</p>
          </div>
        )}

        {/* Weather Display */}
        {weather && !loading && (
          <div className="elegant-card p-8 mb-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {weather.location.name}, {weather.location.country}
              </h2>
              <p className="text-gray-600">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Main Weather Info */}
              <div className="text-center">
                <div className="text-6xl mb-4">
                  {getWeatherIcon(weather.current.weather_code)}
                </div>
                <div className="text-4xl font-bold text-gray-800 mb-2">
                  {formatTemperature(weather.current.temperature_2m)}
                </div>
                <div className="text-lg text-gray-600 mb-2">
                  {getWeatherDescription(weather.current.weather_code)}
                </div>
                <div className="text-sm text-gray-500">
                  Feels like {formatTemperature(weather.current.apparent_temperature)}
                </div>
              </div>

              {/* Additional Weather Details */}
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Humidity</span>
                    <span className="font-semibold text-gray-800">{weather.current.relative_humidity_2m}%</span>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Cloud Cover</span>
                    <span className="font-semibold text-gray-800">{weather.current.cloud_cover}%</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Wind Speed</span>
                    <span className="font-semibold text-gray-800">{formatWindSpeed(weather.current.wind_speed_10m)}</span>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Wind Direction</span>
                    <span className="font-semibold text-gray-800">{formatWindDirection(weather.current.wind_direction_10m)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Precipitation</span>
                    <span className="font-semibold text-gray-800">{weather.current.precipitation} mm</span>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Coordinates</span>
                    <span className="font-semibold text-gray-800 text-xs">
                      {weather.location.latitude.toFixed(2)}, {weather.location.longitude.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* User Persona Info */}
        <div className="elegant-card p-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Designed for Jamie</h3>
            <p className="text-gray-600 mb-6">
              <strong>Outdoor Enthusiast</strong> - Jamie needs quick access to current weather conditions 
              for planning outdoor activities, hiking trips, and travel adventures.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-blue-600 font-semibold mb-2">🌲 Hiking</div>
                <p className="text-gray-600">Check conditions before hitting the trails</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-green-600 font-semibold mb-2">🏕️ Camping</div>
                <p className="text-gray-600">Plan your outdoor adventures safely</p>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4">
                <div className="text-yellow-600 font-semibold mb-2">✈️ Travel</div>
                <p className="text-gray-600">Know what to expect at your destination</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center py-8 mt-16">
          <p className="text-white/70 text-sm">
            Powered by <span className="font-semibold">Open-Meteo API</span> • 
            Built with <span className="text-red-400">❤️</span> and React
          </p>
        </footer>
      </div>
    </div>
  );
}
