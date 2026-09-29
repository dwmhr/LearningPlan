"use client";

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface PaginationBarProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (
    page: number,
  ) => void;
  itemLabel?: string;
}

export default function PaginationBar({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  itemLabel = "universities",
}: PaginationBarProps) {
  if (totalItems === 0) {
    return null;
  }

  const startItem =
    (currentPage - 1) * pageSize + 1;

  const endItem = Math.min(
    currentPage * pageSize,
    totalItems,
  );

  return (
    <div
      className="
        flex h-full
        flex-col
        gap-3
        px-1

        sm:flex-row
        sm:items-center
        sm:justify-between
      "
    >
      <p className="text-sm text-slate-500">
        Showing {startItem} to{" "}
        {endItem} of {totalItems}{" "}
        {itemLabel}
      </p>

      {totalPages > 1 && (
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled={
              currentPage === 1
            }
            onClick={() =>
              onPageChange(
                currentPage - 1,
              )
            }
            className="
              flex h-8 w-8
              items-center
              justify-center
              rounded-lg
              border border-slate-200
              text-slate-400
              transition-colors
              hover:bg-slate-50
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
          >
            <ChevronLeft
              className="h-4 w-4"
              strokeWidth={2}
            />
          </button>

          {Array.from(
            {
              length: totalPages,
            },
            (_, index) =>
              index + 1,
          ).map((page) => {
            const isActive =
              page === currentPage;

            return (
              <button
                key={page}
                type="button"
                onClick={() =>
                  onPageChange(page)
                }
                className={`
                  flex h-8 w-8
                  items-center
                  justify-center
                  rounded-lg
                  text-sm
                  font-semibold
                  transition-colors

                  ${
                    isActive
                      ? "border border-blue-200 bg-blue-50 text-blue-600"
                      : "text-slate-500 hover:bg-slate-50"
                  }
                `}
              >
                {page}
              </button>
            );
          })}

          <button
            type="button"
            disabled={
              currentPage ===
              totalPages
            }
            onClick={() =>
              onPageChange(
                currentPage + 1,
              )
            }
            className="
              flex h-8 w-8
              items-center
              justify-center
              rounded-lg
              border border-slate-200
              text-slate-400
              transition-colors
              hover:bg-slate-50
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
          >
            <ChevronRight
              className="h-4 w-4"
              strokeWidth={2}
            />
          </button>
        </div>
      )}
    </div>
  );
}