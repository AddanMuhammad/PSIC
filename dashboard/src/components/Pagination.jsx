import React, { useState } from 'react';

function Pagination({ array, itemsPerPage, onPageChange }) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(array.length / itemsPerPage);

  const handleClick = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    const startIndex = (newPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    onPageChange(startIndex, endIndex, newPage);
  };

  return (
    <nav style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
      <button
        className="page-link"
        onClick={() => handleClick(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Prev
      </button>
      <span style={{ margin: '0 10px' }}>{`Page ${currentPage} of ${totalPages}`}</span>
      <button
        className="page-link"
        onClick={() => handleClick(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </nav>
  );
}

export default Pagination;