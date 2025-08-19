import React from 'react';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="flex justify-center" aria-label="Pagination">
      <ul className="flex space-x-2">
        {pageNumbers.map((page) => (
          <li key={page}>
            <button
              onClick={() => onPageChange(page)}
              className={`px-4 py-2 rounded-md transition-colors ${
                currentPage === page
                  ? 'bg-accent-color text-white'
                  : 'bg-secondary-bg text-text-primary hover:bg-opacity-80'
              }`}
            >
              {page}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Pagination; 