import React, { useState } from "react";

export default function SearchBar({ value, onChange, onSubmit }) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="elegant-card p-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="flex gap-4"
      >
        <div className="flex-1 relative">
          <input
            type="text"
            className="professional-input"
            placeholder="Search by title, author, or ISBN..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          )}
        </div>
        <button
          type="submit"
          className={`professional-btn ${!value.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={!value.trim()}
        >
          Search
        </button>
      </form>
    </div>
  );
}
