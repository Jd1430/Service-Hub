import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { 
  getRecentEarthquakes, 
  getMagnitudeColor, 
  getMagnitudeLabel, 
  getMagnitudeIcon,
  formatTime,
  formatMagnitude,
  formatDepth,
  getTsunamiAlert,
  getSignificanceLevel
} from "../api/earthquakeApi";

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

export default function EarthquakeVisualizer() {
  const [earthquakes, setEarthquakes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [timeframe, setTimeframe] = useState("all_day");
  const [selectedEarthquake, setSelectedEarthquake] = useState(null);
  const [mapCenter, setMapCenter] = useState([20, 0]);
  const [mapZoom, setMapZoom] = useState(2);

  const timeframes = [
    { value: "all_hour", label: "Last Hour", icon: "⚡" },
    { value: "all_day", label: "Last 24 Hours", icon: "📅" },
    { value: "all_week", label: "Last Week", icon: "📆" },
    { value: "all_month", label: "Last Month", icon: "🗓️" }
  ];

  const fetchEarthquakes = async (selectedTimeframe = timeframe) => {
    setLoading(true);
    setError(null);

    try {
      const data = await getRecentEarthquakes(selectedTimeframe);
      setEarthquakes(data.features || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEarthquakes();
  }, []);

  const handleTimeframeChange = (newTimeframe) => {
    setTimeframe(newTimeframe);
    fetchEarthquakes(newTimeframe);
  };

  const getMarkerSize = (magnitude) => {
    if (magnitude >= 7) return 20;
    if (magnitude >= 6) return 16;
    if (magnitude >= 5) return 12;
    if (magnitude >= 4) return 8;
    return 6;
  };

  const EarthquakeCard = ({ earthquake, index }) => {
    const props = earthquake.properties;
    const coords = earthquake.geometry.coordinates;
    const [longitude, latitude, depth] = coords;
    const magnitude = props.mag;
    const tsunami = props.tsunami;
    const significance = getSignificanceLevel(props.sig);

    return (
      <div 
        className="elegant-card p-4 cursor-pointer hover:shadow-lg transition-all"
        onClick={() => setSelectedEarthquake(earthquake)}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{getMagnitudeIcon(magnitude)}</span>
            <div>
              <div className="font-bold text-lg text-gray-800">
                {formatMagnitude(magnitude)} Magnitude
              </div>
              <div className="text-sm text-gray-600">
                {getMagnitudeLabel(magnitude)} • {significance.level} Significance
              </div>
            </div>
          </div>
          <div className="text-right text-sm text-gray-500">
            {formatTime(props.time)}
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Location:</span>
            <span className="font-medium text-gray-800">{props.place}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Depth:</span>
            <span className="font-medium text-gray-800">{formatDepth(depth)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Coordinates:</span>
            <span className="font-medium text-gray-800 text-xs">
              {latitude.toFixed(2)}, {longitude.toFixed(2)}
            </span>
          </div>
          {tsunami === 1 && (
            <div className="text-red-600 font-semibold text-center py-1">
              🌊 Tsunami Alert
            </div>
          )}
        </div>
      </div>
    );
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
            🌍 Earthquake Visualizer
          </h1>
          <p className="elegant-subtitle max-w-2xl mx-auto mb-8">
            Visualize recent earthquake activity around the world with interactive maps to understand seismic patterns.
          </p>
          
          {/* Timeframe Selector */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="elegant-card p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Timeframe</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {timeframes.map((tf) => (
                  <button
                    key={tf.value}
                    onClick={() => handleTimeframeChange(tf.value)}
                    className={`p-3 rounded-lg text-sm font-medium transition-all ${
                      timeframe === tf.value
                        ? "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <div className="text-lg mb-1">{tf.icon}</div>
                    <div>{tf.label}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </header>

        {/* Stats */}
        {earthquakes.length > 0 && (
          <div className="stats-container mb-8">
            <p className="stats-text">
              Found <strong>{earthquakes.length}</strong> earthquakes in the last {timeframes.find(tf => tf.value === timeframe)?.label.toLowerCase()}
            </p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <div className="loading-spinner mx-auto mb-4"></div>
            <p className="text-white text-lg">Loading earthquake data...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="elegant-card p-8 text-center mb-8">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Failed to load earthquake data</h3>
            <p className="text-gray-600">{error}</p>
          </div>
        )}

        {/* Map and List */}
        {earthquakes.length > 0 && !loading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Map */}
            <div className="elegant-card p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Interactive Map</h3>
              <div className="h-96 rounded-lg overflow-hidden">
                <MapContainer
                  center={mapCenter}
                  zoom={mapZoom}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  {earthquakes.map((earthquake, index) => {
                    const coords = earthquake.geometry.coordinates;
                    const [longitude, latitude] = coords;
                    const magnitude = earthquake.properties.mag;
                    
                    return (
                      <CircleMarker
                        key={index}
                        center={[latitude, longitude]}
                        radius={getMarkerSize(magnitude)}
                        color={getMagnitudeColor(magnitude)}
                        fillColor={getMagnitudeColor(magnitude)}
                        fillOpacity={0.7}
                        weight={2}
                      >
                        <Popup>
                          <div className="p-2">
                            <div className="font-bold text-lg">
                              {formatMagnitude(magnitude)} Magnitude
                            </div>
                            <div className="text-sm text-gray-600 mb-2">
                              {earthquake.properties.place}
                            </div>
                            <div className="text-xs text-gray-500">
                              {formatTime(earthquake.properties.time)}
                            </div>
                            {earthquake.properties.tsunami === 1 && (
                              <div className="text-red-600 font-semibold mt-1">
                                🌊 Tsunami Alert
                              </div>
                            )}
                          </div>
                        </Popup>
                      </CircleMarker>
                    );
                  })}
                </MapContainer>
              </div>
            </div>

            {/* Earthquake List */}
            <div className="elegant-card p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Earthquakes</h3>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {earthquakes.slice(0, 10).map((earthquake, index) => (
                  <EarthquakeCard key={index} earthquake={earthquake} index={index} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="elegant-card p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Magnitude Legend</h3>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {[
              { min: 7, label: "Major (7.0+)" },
              { min: 6, max: 6.9, label: "Strong (6.0-6.9)" },
              { min: 5, max: 5.9, label: "Moderate (5.0-5.9)" },
              { min: 4, max: 4.9, label: "Light (4.0-4.9)" },
              { min: 3, max: 3.9, label: "Minor (3.0-3.9)" },
              { min: 0, max: 2.9, label: "Micro (< 3.0)" }
            ].map((range, index) => (
              <div key={index} className="text-center">
                <div 
                  className="w-6 h-6 rounded-full mx-auto mb-2"
                  style={{ backgroundColor: getMagnitudeColor(range.min) }}
                ></div>
                <div className="text-xs text-gray-600">{range.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* User Persona Info */}
        <div className="elegant-card p-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Designed for Casey</h3>
            <p className="text-gray-600 mb-6">
              <strong>Geography Student</strong> - Casey needs to visualize recent earthquake activity 
              around the world to understand seismic patterns and study geological phenomena.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div className="bg-red-50 rounded-lg p-4">
                <div className="text-red-600 font-semibold mb-2">📊 Data Analysis</div>
                <p className="text-gray-600">Study seismic patterns and trends</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-blue-600 font-semibold mb-2">🗺️ Interactive Maps</div>
                <p className="text-gray-600">Visualize earthquake locations globally</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-green-600 font-semibold mb-2">📚 Educational</div>
                <p className="text-gray-600">Learn about geological processes</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center py-8 mt-16">
          <p className="text-white/70 text-sm">
            Powered by <span className="font-semibold">USGS Earthquake API</span> • 
            Built with <span className="text-red-400">❤️</span> and React Leaflet
          </p>
        </footer>
      </div>
    </div>
  );
}
