// Earthquake API service using USGS Earthquake API
const BASE_URL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary";

export async function getRecentEarthquakes(timeframe = "all_day") {
  const endpoints = {
    "all_hour": `${BASE_URL}/all_hour.geojson`,
    "all_day": `${BASE_URL}/all_day.geojson`,
    "all_week": `${BASE_URL}/all_week.geojson`,
    "all_month": `${BASE_URL}/all_month.geojson`
  };

  const url = endpoints[timeframe] || endpoints["all_day"];
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Earthquake API Error: ${response.status}`);
  }
  
  const data = await response.json();
  return data;
}

export function getMagnitudeColor(magnitude) {
  if (magnitude >= 7) return "#8B0000"; // Dark red - Major
  if (magnitude >= 6) return "#FF0000"; // Red - Strong
  if (magnitude >= 5) return "#FF8C00"; // Orange - Moderate
  if (magnitude >= 4) return "#FFD700"; // Gold - Light
  if (magnitude >= 3) return "#ADFF2F"; // Green yellow - Minor
  return "#00CED1"; // Dark turquoise - Micro
}

export function getMagnitudeLabel(magnitude) {
  if (magnitude >= 7) return "Major";
  if (magnitude >= 6) return "Strong";
  if (magnitude >= 5) return "Moderate";
  if (magnitude >= 4) return "Light";
  if (magnitude >= 3) return "Minor";
  return "Micro";
}

export function getMagnitudeIcon(magnitude) {
  if (magnitude >= 7) return "🔴";
  if (magnitude >= 6) return "🟠";
  if (magnitude >= 5) return "🟡";
  if (magnitude >= 4) return "🟢";
  if (magnitude >= 3) return "🔵";
  return "⚪";
}

export function formatTime(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });
}

export function formatMagnitude(magnitude) {
  return magnitude ? magnitude.toFixed(1) : "N/A";
}

export function formatDepth(depth) {
  return depth ? `${depth.toFixed(1)} km` : "N/A";
}

export function getDistanceFromUser(userLat, userLon, eqLat, eqLon) {
  if (!userLat || !userLon || !eqLat || !eqLon) return null;
  
  const R = 6371; // Earth's radius in kilometers
  const dLat = (eqLat - userLat) * Math.PI / 180;
  const dLon = (eqLon - userLon) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(userLat * Math.PI / 180) * Math.cos(eqLat * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  return distance.toFixed(1);
}

export function getTsunamiAlert(tsunami) {
  return tsunami === 1 ? "🌊 Tsunami Alert" : null;
}

export function getSignificanceLevel(sig) {
  if (sig >= 1000) return { level: "High", color: "#8B0000" };
  if (sig >= 600) return { level: "Medium", color: "#FF8C00" };
  if (sig >= 300) return { level: "Low", color: "#FFD700" };
  return { level: "Very Low", color: "#ADFF2F" };
}
