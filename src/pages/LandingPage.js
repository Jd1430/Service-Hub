import React from "react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  const services = [
    {
      id: "book-finder",
      title: "Book Finder",
      description: "Discover millions of books from around the world. Search by title, author, or ISBN to find your next great read.",
      icon: "📚",
      color: "from-blue-500 to-purple-600",
      user: "Alex - College Student",
      link: "/book-finder"
    },
    {
      id: "weather-now",
      title: "Weather Now",
      description: "Get real-time weather conditions for any city worldwide. Perfect for outdoor enthusiasts and travelers.",
      icon: "🌤️",
      color: "from-yellow-400 to-orange-500",
      user: "Jamie - Outdoor Enthusiast",
      link: "/weather-now"
    },
    {
      id: "recipe-ideas",
      title: "Recipe Ideas",
      description: "Find delicious recipes based on ingredients you have, cooking time, or your mood. Perfect for busy professionals.",
      icon: "🍳",
      color: "from-green-500 to-teal-600",
      user: "Taylor - Busy Professional",
      link: "/recipe-ideas"
    },
    {
      id: "earthquake-visualizer",
      title: "Earthquake Visualizer",
      description: "Visualize recent earthquake activity around the world with interactive maps to understand seismic patterns.",
      icon: "🌍",
      color: "from-red-500 to-pink-600",
      user: "Casey - Geography Student",
      link: "/earthquake-visualizer"
    }
  ];

  return (
    <div className="min-h-screen">
      <div className="professional-container">
        {/* Hero */}
        <section className="text-center py-14">
          <h1 className="elegant-title text-5xl md:text-6xl mb-4">Service Hub</h1>
          <p className="elegant-subtitle max-w-3xl mx-auto">Choose a professional tool crafted for your need.</p>
        </section>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-14">
          {services.map((service, index) => (
            <Link
              key={service.id}
              to={service.link}
              className="group block no-underline"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="elegant-card p-6 h-full transition-all duration-300 group-hover:shadow-2xl group-hover:-translate-y-1 text-inherit">
                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${service.color} flex items-center justify-center text-2xl mb-5`}>{service.icon}</div>
                {/* Title */}
                <h3 className="text-xl font-bold text-gray-800 mb-2">{service.title}</h3>
                {/* Description */}
                <p className="text-gray-600 text-sm leading-relaxed mb-4">{service.description}</p>
                {/* Persona */}
                <div className="text-xs text-gray-500">{service.user}</div>
              </div>
            </Link>
          ))}
        </div>

        {/* Features Section */}
        <div className="elegant-card p-8 mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Choose Our Services?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Each service is designed with specific user needs in mind, providing professional-grade tools with intuitive interfaces.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-2xl text-white mx-auto mb-4">
                🎯
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">User-Focused Design</h3>
              <p className="text-gray-600">Each service is crafted for specific user personas with their unique needs in mind.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center text-2xl text-white mx-auto mb-4">
                ⚡
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Fast & Reliable</h3>
              <p className="text-gray-600">Built with modern APIs and optimized for speed and reliability.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-2xl text-white mx-auto mb-4">
                📱
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Responsive Design</h3>
              <p className="text-gray-600">Works perfectly on all devices - desktop, tablet, and mobile.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center py-8">
          <p className="text-white/70 text-sm no-underline">
            Built with <span className="text-red-400">❤️</span> and React • Powered by professional APIs
          </p>
        </footer>
      </div>
    </div>
  );
}
