import React from 'react';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
    if (totalPages <= 0) {
        return null;
    }

    const page = Math.min(Math.max(currentPage, 1), totalPages);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages && newPage !== page) {
            onPageChange(newPage);
        }
    };

    return (
        <div className="flex items-center justify-center gap-2">
            {/* Previous Button */}
            <Button
                type="button"
                variant="outline"
                size="icon"
                className="cursor-pointer"
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                aria-label="Previous page"
            >
                <ChevronLeft className="h-4 w-4" />
            </Button>

            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (pageNumber) => (
                    <Button
                        type="button"
                        key={pageNumber}
                        variant={page === pageNumber ? 'default' : 'outline'}
                        className={`cursor-pointer ${page === pageNumber
                                ? 'bg-blue-500 hover:bg-blue-600'
                                : ''
                            }`}
                        onClick={() => handlePageChange(pageNumber)}
                        aria-current={page === pageNumber ? 'page' : undefined}
                    >
                        {pageNumber}
                    </Button>
                )
            )}

            {/* Next Button */}
            <Button
                type="button"
                variant="outline"
                size="icon"
                className="cursor-pointer"
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                aria-label="Next page"
            >
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    );
};

export default Pagination;