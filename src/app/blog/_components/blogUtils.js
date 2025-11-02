/**
 * Blog Utilities
 * Helper functions for blog functionality
 */

/**
 * Calculate pagination window
 * @param {number} currentPage - Current page number
 * @param {number} totalPages - Total number of pages
 * @returns {Object} Object with startPage and endPage
 */
export function calculatePaginationWindow(currentPage, totalPages) {
  let startPage = 1;
  let endPage = Math.min(3, totalPages);

  if (totalPages > 3) {
    if (currentPage <= 1) {
      startPage = 1;
      endPage = 3;
    } else if (currentPage >= totalPages - 1) {
      startPage = totalPages - 2;
      endPage = totalPages;
    } else {
      startPage = currentPage - 1;
      endPage = currentPage + 1;
    }

    if (startPage < 1) {
      startPage = 1;
      endPage = 3;
    }

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, totalPages - 2);
    }
  }

  return { startPage, endPage };
}

/**
 * Get pagination pages array
 * @param {number} currentPage - Current page number
 * @param {number} totalPages - Total number of pages
 * @returns {number[]} Array of page numbers to display
 */
export function getPaginationPages(currentPage, totalPages) {
  const { startPage, endPage } = calculatePaginationWindow(currentPage, totalPages);
  const pages = [];

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return pages;
}
