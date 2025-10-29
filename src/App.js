import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import LandingPage from "./pages/LandingPage";
import BookFinder from "./pages/BookFinder";
import WeatherNow from "./pages/WeatherNow";
import RecipeIdeas from "./pages/RecipeIdeas";
import EarthquakeVisualizer from "./pages/EarthquakeVisualizer";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/book-finder" element={<BookFinder />} />
          <Route path="/weather-now" element={<WeatherNow />} />
          <Route path="/recipe-ideas" element={<RecipeIdeas />} />
          <Route path="/earthquake-visualizer" element={<EarthquakeVisualizer />} />
        </Route>
      </Routes>
    </Router>
  );
}
