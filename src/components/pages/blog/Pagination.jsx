"use client";
import { useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function Pagination({
  totalItems,
  itemsPerPage = 6
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const currentPage = Number(searchParams.get("page")) || 1;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage <= 3) {
        // Show first 4 pages and ellipsis
        for (let i = 2; i <= 4; i++) {
          pages.push(i);
        }
        if (totalPages > 4) {
          pages.push("...");
        }
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Show ellipsis and last 4 pages
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Show first, ellipsis, current-1, current, current+1, ellipsis, last
        pages.push("...");
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  // Build URL with query params
  const createPageUrl = (page) => {
    const params = new URLSearchParams(searchParams.toString());
    if (page === 1) {
      params.delete("page");
    } else {
      params.set("page", page.toString());
    }
    return `${pathname}${params.toString() ? `?${params.toString()}` : ""}`;
  };

  const prevPage = currentPage > 1 ? currentPage - 1 : 1;
  const nextPage = currentPage < totalPages ? currentPage + 1 : totalPages;

  // Don't render if only one page
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="page-nav-wrap mt-12 sm:mt-16 text-center">
      <ul className="flex items-center justify-center gap-2 flex-wrap">
        {/* Previous Button */}
        <li>
          <Link
            href={createPageUrl(prevPage)}
            scroll={false}
            className={`previous inline-block w-14 h-14 sm:w-14 sm:h-14 leading-[56px] text-center bg-white text-title border border-transparent rounded-full transition-all duration-300 hover:bg-theme hover:text-white hover:border-transparent ${currentPage === 1 ? "opacity-50 cursor-not-allowed pointer-events-none" : ""
              }`}
            aria-label="Previous page"
          >
            <ArrowLeft className="w-4 h-4 inline-block" />
          </Link>
        </li>

        {/* Page Numbers */}
        {pageNumbers.map((page, index) => {
          if (page === "...") {
            return (
              <li key={`ellipsis-${index}`}>
                <span className="page-numbers inline-block w-14 h-14 sm:w-14 sm:h-14 leading-[56px] text-center bg-white text-title rounded-full cursor-default">
                  ...
                </span>
              </li>
            );
          }

          const pageNum = Number(page);
          const isActive = pageNum === currentPage;

          return (
            <li key={pageNum}>
              <Link
                href={createPageUrl(pageNum)}
                scroll={false}
                className={`page-numbers inline-block w-14 h-14 sm:w-14 sm:h-14 leading-[56px] text-center rounded-full transition-all duration-300 hover:bg-theme hover:text-white ${isActive ? "bg-theme text-white" : "bg-white text-title"}`}
                aria-label={`Go to page ${pageNum}`}
                aria-current={isActive ? "page" : undefined}
              >
                {pageNum}
              </Link>
            </li>
          );
        })}

        {/* Next Button */}
        <li>
          <Link
            href={createPageUrl(nextPage)}
            scroll={false}
            className={`next inline-block w-14 h-14 sm:w-14 sm:h-14 leading-[56px] text-center bg-white text-title border border-transparent rounded-full transition-all duration-300 hover:bg-theme hover:text-white hover:border-transparent ${currentPage === totalPages ? "opacity-50 cursor-not-allowed pointer-events-none" : ""
              }`}
            aria-label="Next page"
          >
            <ArrowRight className="w-4 h-4 inline-block" />
          </Link>
        </li>
      </ul>
    </div>
  );
}
