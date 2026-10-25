"use client";

import React from "react";
import { ArrowUpDown } from "lucide-react";

interface SortSelectProps {
  currentSort: string;
  onSortChange: (sort: string) => void;
  className?: string;
}

export function SortSelect({
  currentSort = "featured",
  onSortChange,
  className = "",
}: SortSelectProps) {
  return (
    <div className={`relative inline-flex items-center w-full sm:w-auto ${className}`}>
      <label htmlFor="catalogue-sort" className="sr-only">
        Sort products by
      </label>
      <div className="relative w-full">
        <select
          id="catalogue-sort"
          value={currentSort}
          onChange={(e) => onSortChange(e.target.value)}
          className="appearance-none w-full sm:w-auto min-h-[44px] bg-white border border-[#DCD5C1] rounded-lg pl-3.5 pr-10 py-2 text-xs font-semibold text-[#153F2D] hover:border-[#153F2D] focus:outline-none focus:ring-2 focus:ring-[#153F2D] transition-colors cursor-pointer"
        >
          <option value="featured">Featured &amp; Newest</option>
          <option value="price-asc">Price: Low → High</option>
          <option value="price-desc">Price: High → Low</option>
          <option value="savings">Biggest Savings</option>
        </select>
        <ArrowUpDown
          className="w-3.5 h-3.5 text-[#5A5E53] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

export default SortSelect;
