"use client";

import React from "react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
}) => {
    if (totalPages <= 1) {
        return null;
    }

    const getPageNumbers = (): (number | -1)[] => {
        const pages: (number | -1)[] = [];

        // Always show first page
        pages.push(1);

        const start = Math.max(2, currentPage - 1);
        const end = Math.min(
            totalPages - 1,
            currentPage + 1
        );

        // Left ellipsis
        if (start > 2) {
            pages.push(-1);
        }

        // Middle pages
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        // Right ellipsis
        if (end < totalPages - 1) {
            pages.push(-1);
        }

        // Always show last page
        if (totalPages > 1) {
            pages.push(totalPages);
        }

        return pages;
    };

    const pages = getPageNumbers();

    return (
        <div className="flex flex-wrap items-center justify-center gap-2 bg-white px-4 py-4">
            {/* Previous */}
            <button
                type="button"
                onClick={() =>
                    onPageChange(Math.max(1, currentPage - 1))
                }
                disabled={currentPage === 1}
                aria-label="Previous page"
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${currentPage === 1
                    ? "cursor-not-allowed bg-slate-100 text-slate-400"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
            >
                Prev
            </button>

            {/* Page Numbers */}
            {pages.map((page, index) =>
                page === -1 ? (
                    <span
                        key={`ellipsis-${index}`}
                        className="flex h-9 min-w-9 items-center justify-center text-sm text-slate-400"
                    >
                        ...
                    </span>
                ) : (
                    <button
                        key={page}
                        type="button"
                        onClick={() => onPageChange(page)}
                        aria-current={
                            page === currentPage
                                ? "page"
                                : undefined
                        }
                        className={`flex h-9 min-w-9 items-center justify-center rounded-lg px-3 text-sm font-medium transition ${page === currentPage
                            ? "bg-blue-600 text-white shadow-sm"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                            }`}
                    >
                        {page}
                    </button>
                )
            )}

            {/* Next */}
            <button
                type="button"
                onClick={() =>
                    onPageChange(
                        Math.min(
                            totalPages,
                            currentPage + 1
                        )
                    )
                }
                disabled={currentPage === totalPages}
                aria-label="Next page"
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${currentPage === totalPages
                    ? "cursor-not-allowed bg-slate-100 text-slate-400"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;