import React from "react";

export default function Pagination({ page, totalPages, onChange }) {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const start = Math.max(1, page - 2);
      const end = Math.min(totalPages, start + maxVisible - 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="pagination">
      <button
        className="pagination-btn"
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
      >
        ← Previous
      </button>

      {pageNumbers.map((num) => (
        <button
          key={num}
          className={`pagination-btn ${num === page ? 'active' : ''}`}
          onClick={() => onChange(num)}
        >
          {num}
        </button>
      ))}

      <button
        className="pagination-btn"
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
      >
        Next →
      </button>
    </div>
  );
}
