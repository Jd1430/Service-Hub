import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import BookCard from "../components/BookCard";
import Pagination from "../components/Pagination";
import { searchBooks } from "../api/openLibrary";
import useDebounce from "../hooks/useDebounce";

export default function BookFinder() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [numFound, setNumFound] = useState(0);
  const debouncedQuery = useDebounce(query, 400);
  const limit = 20;

  useEffect(() => {
    if (!debouncedQuery) {
      setBooks([]);
      setNumFound(0);
      return;
    }

    async function fetchBooks() {
      setLoading(true);
      setError(null);
      try {
        const data = await searchBooks({ q: debouncedQuery, page, limit });
        setBooks(data.docs || []);
        setNumFound(data.numFound || 0);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchBooks();
  }, [debouncedQuery, page]);

  const totalPages = Math.ceil(numFound / limit);

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
            📚 Book Finder
          </h1>
          <p className="elegant-subtitle max-w-2xl mx-auto mb-8">
            Discover millions of books from around the world. Search by title, author, or ISBN to find your next great read.
          </p>
          
          {/* Search Section */}
          <div className="max-w-2xl mx-auto mb-8">
            <SearchBar
              value={query}
              onChange={(v) => {
                setQuery(v);
                setPage(1);
              }}
              onSubmit={() => setPage(1)}
            />
          </div>
        </header>

        {/* Stats Section */}
        {numFound > 0 && (
          <div className="stats-container">
            <p className="stats-text">
              Found <strong>{numFound.toLocaleString()}</strong> books • 
              Showing page <strong>{page}</strong> of <strong>{totalPages}</strong>
            </p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <div className="loading-spinner mx-auto mb-4"></div>
            <p className="text-white text-lg">Searching the library...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="elegant-card p-8 text-center mb-8">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Something went wrong</h3>
            <p className="text-gray-600">{error}</p>
          </div>
        )}

        {/* No Results */}
        {!loading && !error && books.length === 0 && debouncedQuery && (
          <div className="elegant-card p-8 text-center mb-8">
            <div className="text-gray-400 text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No books found</h3>
            <p className="text-gray-600">Try adjusting your search terms or check your spelling</p>
          </div>
        )}

        {/* Books Grid */}
        {books.length > 0 && (
          <div className="professional-grid">
            {books.map((book, index) => (
              <BookCard key={book.key} book={book} index={index} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {numFound > 0 && (
          <Pagination
            page={page}
            totalPages={totalPages}
            onChange={(p) => setPage(p)}
          />
        )}

        {/* Footer */}
        <footer className="text-center py-8 mt-16">
          <p className="text-white/70 text-sm">
            Powered by <span className="font-semibold">Open Library</span> • 
            Built with <span className="text-red-400">❤️</span> and React
          </p>
        </footer>
      </div>
    </div>
  );
}
