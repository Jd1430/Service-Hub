import React from "react";
import { NavLink, Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="backdrop-blur-md bg-white/10 border-b border-white/20 sticky top-0 z-40">
      <div className="professional-container flex items-center justify-between py-4">
        <Link to="/" className="no-underline">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
              BF
            </div>
            <div>
              <div className="elegant-title text-2xl leading-none">Service Hub</div>
              <div className="text-xs text-white/70">Books • Weather • Recipes • Quakes</div>
            </div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-2">
          {[
            { to: "/", label: "Home" },
            { to: "/book-finder", label: "Book Finder" },
            { to: "/weather-now", label: "Weather Now" },
            { to: "/recipe-ideas", label: "Recipe Ideas" },
            { to: "/earthquake-visualizer", label: "Earthquakes" },
          ].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm font-medium no-underline ${
                  isActive
                    ? "bg-white/20 text-white shadow"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
