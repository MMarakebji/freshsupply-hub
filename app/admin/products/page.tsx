"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Edit3, Plus, Search, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import type { Database } from "@/types/database.types";

type ProductRow = Pick<
  Database["public"]["Tables"]["products"]["Row"],
  | "id"
  | "name"
  | "slug"
  | "price"
  | "availability"
  | "is_active"
  | "category_id"
  | "brand"
  | "updated_at"
> & {
  categories: { name: string } | null;
};

type CategoryOption = {
  id: string;
  name: string;
};

type ProductsResponse = {
  products?: ProductRow[];
  categories?: CategoryOption[];
  error?: string;
};

async function getAccessToken() {
  const { data } = await supabase.auth.getSession();

  return data.session?.access_token;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [search, setSearch] = useState("");
  const [availability, setAvailability] = useState("");
  const [activeFilter, setActiveFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sort, setSort] = useState("newest");
  const [isLoading, setIsLoading] = useState(true);
  const [deletingProductId, setDeletingProductId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    void getAccessToken().then(async (token) => {
      if (!token) {
        setError("Your admin session expired. Please login again.");
        setIsLoading(false);
        return;
      }

      const response = await fetch("/api/admin/products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = (await response.json()) as ProductsResponse;

      if (!response.ok) {
        setError(result.error ?? "Unable to load products.");
      } else {
        setProducts(result.products ?? []);
        setCategories(result.categories ?? []);
      }

      setIsLoading(false);
    });
  }, []);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return [...products]
      .filter((product) => {
        const matchesSearch =
          !normalizedSearch ||
          product.name.toLowerCase().includes(normalizedSearch) ||
          product.slug.toLowerCase().includes(normalizedSearch) ||
          product.brand?.toLowerCase().includes(normalizedSearch) ||
          product.categories?.name.toLowerCase().includes(normalizedSearch);
        const matchesAvailability =
          !availability || product.availability === availability;
        const matchesActive =
          !activeFilter ||
          (activeFilter === "active" ? product.is_active : !product.is_active);
        const matchesCategory =
          !categoryFilter || product.category_id === categoryFilter;

        return (
          matchesSearch &&
          matchesAvailability &&
          matchesActive &&
          matchesCategory
        );
      })
      .sort((first, second) => {
        if (sort === "name") {
          return first.name.localeCompare(second.name);
        }

        if (sort === "price-asc") {
          return Number(first.price) - Number(second.price);
        }

        if (sort === "price-desc") {
          return Number(second.price) - Number(first.price);
        }

        return (
          new Date(second.updated_at ?? 0).getTime() -
          new Date(first.updated_at ?? 0).getTime()
        );
      });
  }, [activeFilter, availability, categoryFilter, products, search, sort]);

  async function handleDelete(product: ProductRow) {
    const confirmed = window.confirm(
      `Delete "${product.name}"? This cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setDeletingProductId(product.id);

    const token = await getAccessToken();

    if (!token) {
      setError("Your admin session expired. Please login again.");
      setDeletingProductId("");
      return;
    }

    const response = await fetch(`/api/admin/products/${product.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const result = (await response.json()) as { error?: string };

    setDeletingProductId("");

    if (!response.ok) {
      setError(result.error ?? "Unable to delete product.");
      return;
    }

    setProducts((currentProducts) =>
      currentProducts.filter((item) => item.id !== product.id)
    );
  }

  return (
    <section className="rounded-[8px] border border-[#dfeadd] bg-white shadow-[0_10px_24px_rgba(49,88,61,0.06)]">
      <div className="flex flex-col gap-4 border-b border-[#e4eee6] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-[22px] font-bold text-[#10221f]">Products</h2>
          <p className="mt-1 text-[14px] font-medium text-[#667167]">
            Products loaded from the database.
          </p>
        </div>
        <Link
          href="/admin/products/add"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-[#5a9a4a] px-5 text-[14px] font-bold text-white transition hover:bg-[#4f8b42]"
        >
          <Plus size={17} strokeWidth={2.2} />
          Add Product
        </Link>
      </div>

      {error ? (
        <p className="m-5 rounded-[8px] border border-[#f4c7c7] bg-[#fff1f1] px-5 py-4 text-[14px] font-bold text-[#9b1c1c]">
          {error}
        </p>
      ) : null}

      <div className="grid gap-3 border-b border-[#e4eee6] px-5 py-4 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]">
        <label className="flex h-11 items-center gap-3 rounded-[8px] border border-[#dfe8dd] bg-[#fbfdf8] px-3 text-[#667167] focus-within:border-[#5a9a4a]">
          <Search size={17} strokeWidth={2.2} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search name, slug, brand, category"
            className="w-full bg-transparent text-[14px] font-medium text-[#1f3025] outline-none"
          />
        </label>
        <select
          value={categoryFilter}
          onChange={(event) => setCategoryFilter(event.target.value)}
          className="h-11 rounded-[8px] border border-[#dfe8dd] bg-[#fbfdf8] px-3 text-[14px] font-bold text-[#31583d] outline-none"
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <select
          value={availability}
          onChange={(event) => setAvailability(event.target.value)}
          className="h-11 rounded-[8px] border border-[#dfe8dd] bg-[#fbfdf8] px-3 text-[14px] font-bold text-[#31583d] outline-none"
        >
          <option value="">All availability</option>
          <option value="available">Available</option>
          <option value="out_of_stock">Out of Stock</option>
          <option value="coming_soon">Coming Soon</option>
        </select>
        <select
          value={activeFilter}
          onChange={(event) => setActiveFilter(event.target.value)}
          className="h-11 rounded-[8px] border border-[#dfe8dd] bg-[#fbfdf8] px-3 text-[14px] font-bold text-[#31583d] outline-none"
        >
          <option value="">All status</option>
          <option value="active">Active only</option>
          <option value="inactive">Inactive only</option>
        </select>
        <select
          value={sort}
          onChange={(event) => setSort(event.target.value)}
          className="h-11 rounded-[8px] border border-[#dfe8dd] bg-[#fbfdf8] px-3 text-[14px] font-bold text-[#31583d] outline-none"
        >
          <option value="newest">Recently updated</option>
          <option value="name">Name A-Z</option>
          <option value="price-asc">Price low-high</option>
          <option value="price-desc">Price high-low</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left">
          <thead className="bg-[#fbfdf8] text-[13px] font-bold uppercase text-[#667167]">
            <tr>
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3">Price</th>
              <th className="px-5 py-3">Availability</th>
              <th className="px-5 py-3">Active</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#edf2ea] text-[14px]">
            {filteredProducts.map((product) => (
              <tr key={product.id}>
                <td className="px-5 py-4 font-bold text-[#10221f]">
                  {product.name}
                </td>
                <td className="px-5 py-4 font-medium text-[#667167]">
                  {product.categories?.name ?? "Uncategorized"}
                </td>
                <td className="px-5 py-4 font-bold text-[#31583d]">
                  ${Number(product.price).toFixed(2)}
                </td>
                <td className="px-5 py-4 font-medium text-[#667167]">
                  {product.availability}
                </td>
                <td className="px-5 py-4 font-medium text-[#667167]">
                  {product.is_active ? "Yes" : "No"}
                </td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/products/edit/${product.id}`}
                      className="inline-flex h-9 items-center justify-center gap-2 rounded-full border border-[#dfe8dd] px-4 text-[13px] font-bold text-[#31583d] transition hover:bg-[#f4faf2]"
                    >
                      <Edit3 size={15} strokeWidth={2.2} />
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(product)}
                      disabled={deletingProductId === product.id}
                      className="inline-flex h-9 items-center justify-center gap-2 rounded-full border border-[#f4c7c7] px-4 text-[13px] font-bold text-[#9b1c1c] transition hover:bg-[#fff1f1] disabled:cursor-not-allowed disabled:opacity-65"
                    >
                      <Trash2 size={15} strokeWidth={2.2} />
                      {deletingProductId === product.id ? "Deleting" : "Delete"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!isLoading && filteredProducts.length === 0 ? (
          <p className="px-5 py-8 text-center text-[15px] font-medium text-[#667167]">
            No products match the current filters.
          </p>
        ) : null}
        {isLoading ? (
          <p className="px-5 py-8 text-center text-[15px] font-bold text-[#31583d]">
            Loading products...
          </p>
        ) : null}
      </div>
    </section>
  );
}
