import React, { useState } from "react";
import { getCoverUrl } from "../api/openLibrary";

export default function BookCard({ book, index }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const cover = getCoverUrl(book.cover_i);
  const authors = (book.author_name || []).join(", ");
  const publishYear = book.first_publish_year || "—";

  return (
    <div className="book-card" style={{ animationDelay: `${index * 0.1}s` }}>
      {/* Book Cover */}
      <div className="relative">
        {cover && !imageError ? (
          <img
            src={cover}
            alt={`${book.title} cover`}
            className="book-image"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="book-image bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="text-4xl mb-2">📚</div>
              <p className="text-sm font-medium">No Cover</p>
            </div>
          </div>
        )}
        
        {/* Year Badge */}
        <div className="absolute top-3 right-3">
          <span className="book-year">{publishYear}</span>
        </div>
      </div>

      {/* Book Content */}
      <div className="book-content">
        <h3 className="book-title">{book.title}</h3>
        
        {authors && (
          <p className="book-author">by {authors}</p>
        )}

        {/* Additional Info */}
        <div className="book-meta">
          {book.language && (
            <span className="text-xs text-gray-500">
              {book.language[0]}
            </span>
          )}
          {book.subject && (
            <span className="text-xs text-gray-500 truncate">
              {book.subject[0]}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
