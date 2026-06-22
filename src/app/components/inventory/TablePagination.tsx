import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TablePaginationProps {
  page: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export default function TablePagination({
  page,
  totalPages,
  totalCount,
  limit,
  onPageChange,
}: TablePaginationProps) {
  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, totalCount);

  // Build page number buttons — always show first, last, current ± 1, with ellipsis
  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];

    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    pages.push(1);

    if (page > 3) pages.push("...");

    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      pages.push(i);
    }

    if (page < totalPages - 2) pages.push("...");

    pages.push(totalPages);

    return pages;
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-border">

      {/* Count label */}
      <p className="text-[12px] text-muted-foreground">
        Showing <span className="font-medium text-foreground">{from}–{to}</span> of{" "}
        <span className="font-medium text-foreground">{totalCount}</span> products
      </p>

      {/* Page controls */}
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7 rounded-md"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </Button>

        {getPageNumbers().map((p, i) =>
          p === "..." ? (
            <span key={`ellipsis-${i}`} className="text-[12px] text-muted-foreground px-1">
              …
            </span>
          ) : (
            <Button
              key={p}
              variant={page === p ? "default" : "outline"}
              size="icon"
              className={`h-7 w-7 rounded-md text-[12px] ${
                page === p
                  ? "bg-amber-500 hover:bg-amber-600 border-amber-500 text-white"
                  : ""
              }`}
              onClick={() => onPageChange(p as number)}
            >
              {p}
            </Button>
          )
        )}

        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7 rounded-md"
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </Button>
      </div>

    </div>
  );
}