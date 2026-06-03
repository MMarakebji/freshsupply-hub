"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import type { ReactNode } from "react";
import type { ProductSort } from "@/features/products/productApi";

type CategoryFilter = {
  name: string;
  slug: string;
};

type ProductRealtimeFiltersProps = {
  children: ReactNode;
  categories: CategoryFilter[];
  productCount: number;
  currentSearch: string;
  currentCategory: string;
  currentAvailability?: string;
  currentPriceRange?: string;
  currentSort: ProductSort;
};

const availabilityOptions = [
  { label: "Available", value: "available" },
  { label: "Out of Stock", value: "out_of_stock" },
  { label: "Coming Soon", value: "coming_soon" },
] as const;

const priceOptions = [
  { label: "$0 - $10", value: "0-10" },
  { label: "$10 - $25", value: "10-25" },
  { label: "$25 - $50", value: "25-50" },
  { label: "$50+", value: "50-" },
] as const;

const sortOptions: { label: string; value: ProductSort }[] = [
  { label: "Default", value: "default" },
  { label: "Price low to high", value: "price-asc" },
  { label: "Price high to low", value: "price-desc" },
  { label: "Newest", value: "newest" },
];

export default function ProductRealtimeFilters({
  children,
  categories,
  productCount,
  currentSearch,
  currentCategory,
  currentAvailability,
  currentPriceRange,
  currentSort,
}: ProductRealtimeFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(currentSearch);
  const [isPending, startTransition] = useTransition();

  const activeCategoryName = useMemo(
    () =>
      categories.find((category) => category.slug === currentCategory)?.name ??
      "All Products",
    [categories, currentCategory]
  );

  const updateFilters = useCallback(
    (updates: Record<string, string | undefined>) => {
      const nextParams = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          nextParams.set(key, value);
        } else {
          nextParams.delete(key);
        }
      });

      const queryString = nextParams.toString();

      startTransition(() => {
        router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
          scroll: false,
        });
      });
    },
    [pathname, router, searchParams]
  );

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      if (search !== currentSearch) {
        updateFilters({ q: search.trim() || undefined });
      }
    }, 500);

    return () => window.clearTimeout(timeout);
  }, [currentSearch, search, updateFilters]);

  return (
    <>
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[15px] font-bold uppercase leading-none tracking-normal text-[#d5ae3e]">
            Almfood AB Shop
          </p>
          <h2 className="mt-3 text-[34px] font-bold leading-tight text-[#1f3025] sm:text-[44px]">
            Popular Products
          </h2>
        </div>

        <label className="flex h-12 min-w-[260px] items-center gap-3 rounded-full border border-[#dfe8dd] bg-[#fbfdf8] px-4 text-[#667167] focus-within:border-[#5a9a4a] focus-within:ring-4 focus-within:ring-[#5a9a4a]/12 sm:min-w-[360px]">
          <Search size={19} strokeWidth={2.2} />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search products"
            className="w-full bg-transparent text-[15px] font-medium text-[#1f3025] outline-none placeholder:text-[#9aa69c]"
          />
          {search ? (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => setSearch("")}
              className="text-[#667167] transition hover:text-[#31583d]"
            >
              <X size={18} strokeWidth={2.2} />
            </button>
          ) : null}
        </label>
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="rounded-[8px] border border-[#dfeadd] bg-[#fbfdf8] p-5 shadow-[0_10px_24px_rgba(49,88,61,0.06)] lg:sticky lg:top-28 lg:self-start">
          <div className="flex items-center justify-between border-b border-[#e4eee6] pb-4">
            <h3 className="text-[20px] font-bold leading-none text-[#1f3025]">
              Filter Options
            </h3>
            <SlidersHorizontal
              size={20}
              strokeWidth={2.2}
              className="text-[#5a9a4a]"
            />
          </div>

          <div className="space-y-7 pt-5">
            <div>
              <h4 className="text-[15px] font-bold leading-none text-[#31583d]">
                By Category
              </h4>
              <div className="mt-4 space-y-3">
                {categories.map((category) => (
                  <label
                    key={category.slug || "all-products"}
                    className="flex cursor-pointer items-center gap-3 text-[14px] font-medium text-[#667167]"
                  >
                    <input
                      type="radio"
                      name="category"
                      value={category.slug}
                      checked={currentCategory === category.slug}
                      onChange={() =>
                        updateFilters({ category: category.slug || undefined })
                      }
                      className="h-4 w-4 border-[#cad9c8] accent-[#5a9a4a]"
                    />
                    {category.name}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-[15px] font-bold leading-none text-[#31583d]">
                By Stock Type
              </h4>
              <div className="mt-4 space-y-3">
                {availabilityOptions.map((option) => (
                  <label
                    key={option.value}
                    className="flex cursor-pointer items-center gap-3 text-[14px] font-medium text-[#667167]"
                  >
                    <input
                      type="radio"
                      name="availability"
                      value={option.value}
                      checked={currentAvailability === option.value}
                      onChange={() =>
                        updateFilters({ availability: option.value })
                      }
                      className="h-4 w-4 border-[#cad9c8] accent-[#5a9a4a]"
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-[15px] font-bold leading-none text-[#31583d]">
                By Price
              </h4>
              <div className="mt-4 space-y-3">
                {priceOptions.map((option) => (
                  <label
                    key={option.value}
                    className="flex cursor-pointer items-center gap-3 text-[14px] font-medium text-[#667167]"
                  >
                    <input
                      type="radio"
                      name="priceRange"
                      value={option.value}
                      checked={currentPriceRange === option.value}
                      onChange={() => updateFilters({ priceRange: option.value })}
                      className="h-4 w-4 border-[#cad9c8] accent-[#5a9a4a]"
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setSearch("");
              startTransition(() => router.replace(pathname, { scroll: false }));
            }}
            className="mt-7 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-[#dfe8dd] bg-white px-5 text-[14px] font-bold text-[#31583d] transition hover:bg-[#f4faf2]"
          >
            <X size={17} strokeWidth={2.2} />
            Clear Filters
          </button>
        </aside>

        <div>
          <div className="mb-6 flex flex-col gap-4 rounded-[8px] border border-[#e4eee6] bg-white px-4 py-4 shadow-[0_8px_20px_rgba(15,23,42,0.04)] sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[14px] font-medium text-[#667167]">
              Showing{" "}
              <span className="font-bold text-[#1f3025]">
                {productCount > 0 ? `1-${productCount}` : "0"}
              </span>{" "}
              of <span className="font-bold text-[#1f3025]">{productCount}</span>{" "}
              results
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[#edf6ea] px-4 py-2 text-[13px] font-bold leading-none text-[#31583d]">
                {activeCategoryName}
              </span>
              {isPending ? (
                <span className="rounded-full bg-[#fbfdf8] px-4 py-2 text-[13px] font-bold leading-none text-[#667167] ring-1 ring-[#dfe8dd]">
                  Updating
                </span>
              ) : null}
            </div>

            <label className="flex h-10 items-center gap-2 rounded-full border border-[#dfe8dd] bg-[#fbfdf8] px-4 text-[14px] font-bold text-[#31583d]">
              Sort by:
              <select
                value={currentSort}
                onChange={(event) => updateFilters({ sort: event.target.value })}
                className="bg-transparent text-[14px] font-medium text-[#667167] outline-none"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {children}
        </div>
      </div>
    </>
  );
}
