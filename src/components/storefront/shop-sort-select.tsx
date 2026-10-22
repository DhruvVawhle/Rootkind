"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function ShopSortSelect({ currentSort }: { currentSort?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", e.target.value);
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <select
      aria-label="Sort products by"
      value={currentSort || "newest"}
      onChange={handleSortChange}
      className="bg-white border border-[#DCD5C1] rounded-md text-xs font-medium text-[#282B25] px-3 py-2 focus:ring-1 focus:ring-[#153F2D] cursor-pointer"
    >
      <option value="newest">Featured &amp; Newest</option>
      <option value="price-asc">Price: Low to High</option>
      <option value="price-desc">Price: High to Low</option>
      <option value="name-asc">Alphabetical: A-Z</option>
    </select>
  );
}
