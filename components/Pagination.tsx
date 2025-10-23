import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

interface PaginationProps {
 currentPage: number;
 totalPages: number;
 baseUrl: string;
 searchParams: Record<string, string>; // Preserves search query and other URL params
}

export default function Pagination({
 currentPage,
 totalPages,
 baseUrl,
 searchParams,
}: PaginationProps) {
 // Don't render pagination if there's only one page or less
 if (totalPages <= 1) return null;

 // Generate URL for a specific page while preserving existing search parameters
 const getPageUrl = (page: number) => {
  const params = new URLSearchParams({ ...searchParams, page: String(page) });
  return `${baseUrl}?${params.toString()}`;
 };
 // Generate array of visible page numbers with ellipsis for large page counts
 const getVisiblePages = () => {
  const delta = 2; // Number of pages to show on each side of current page
  const range = [];
  const rangeWithDots = [];

  // Generate range of pages around current page (excluding first and last)
  for (
   let i = Math.max(2, currentPage - delta);
   i <= Math.min(totalPages - 1, currentPage + delta);
   i++
  ) {
   range.push(i);
  }

  // Add first page and ellipsis if needed
  if (currentPage - delta > 2) {
   rangeWithDots.push(1, "...");
  } else {
   rangeWithDots.push(1);
  }

  // Add the middle range
  rangeWithDots.push(...range);

  // Add ellipsis and last page if needed
  if (currentPage + delta < totalPages - 1) {
   rangeWithDots.push("...", totalPages);
  } else {
   rangeWithDots.push(totalPages);
  }

  return rangeWithDots;
 };

 const visiblePages = getVisiblePages();
 return (
  <nav className='flex items-center justify-center gap-1'>
   {/* Previous Button - disabled on first page */}
   <Link
    href={getPageUrl(currentPage - 1)}
    className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg ${currentPage <= 1
      ? "text-gray-400 cursor-not-allowed bg-gray-100"
      : "text-gray-700 hover:bg-gray-100"
     } bg-white border border-gray-300`}
    aria-disabled={currentPage <= 1}>
    <ChevronLeft />
    Previous
   </Link>

   {/* Page Number Buttons */}
   {visiblePages.map((page, key) => {
    // Render ellipsis as non-clickable span
    if (page == "...") {
     return (
      <span
       key={key}
       className='px-3 py-2 text-sm text-gray-500'>
       ...
      </span>
     );
    }
    const pageNumber = page as number;
    const isCurrentPage = pageNumber === currentPage;

    return (
     <Link
      href={getPageUrl(pageNumber)}
      key={key}
      className={`px-3 py-2 text-sm font-medium rounded-lg ${isCurrentPage
        ? "bg-purple-600 text-white"
        : "text-gray-700 hover:bg-gray-100 bg-white border borer border-gray-300"
       }`}>
      {pageNumber}
     </Link>
    );
   })}

   {/* Next Button - disabled on last page */}
   <Link
    href={getPageUrl(currentPage + 1)}
    className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg ${currentPage >= totalPages
      ? "text-gray-400 cursor-not-allowed bg-gray-100"
      : "text-gray-700 hover:bg-gray-100"
     } bg-white border border-gray-300`}
    aria-disabled={currentPage >= totalPages}>
    Next
    <ChevronRight />
   </Link>
  </nav>
 );
}
