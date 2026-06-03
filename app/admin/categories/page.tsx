"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Edit3, Plus, Search, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import type { Database } from "@/types/database.types";

type CategoryRow = Pick<
  Database["public"]["Tables"]["categories"]["Row"],
  "id" | "name" | "slug" | "description" | "is_active"
>;

type CategoriesResponse = {
  categories?: CategoryRow[];
  error?: string;
};

async function getAccessToken() {
  const { data } = await supabase.auth.getSession();

  return data.session?.access_token;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("");
  const [sort, setSort] = useState("name");
  const [isLoading, setIsLoading] = useState(true);
  const [deletingCategoryId, setDeletingCategoryId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    void getAccessToken().then(async (token) => {
      if (!token) {
        setError("Your admin session expired. Please login again.");
        setIsLoading(false);
        return;
      }

      const response = await fetch("/api/admin/categories", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = (await response.json()) as CategoriesResponse;

      if (!response.ok) {
        setError(result.error ?? "Unable to load categories.");
      } else {
        setCategories(result.categories ?? []);
      }

      setIsLoading(false);
    });
  }, []);

  const filteredCategories = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return [...categories]
      .filter((category) => {
        const matchesSearch =
          !normalizedSearch ||
          category.name.toLowerCase().includes(normalizedSearch) ||
          category.slug.toLowerCase().includes(normalizedSearch) ||
          category.description?.toLowerCase().includes(normalizedSearch);
        const matchesActive =
          !activeFilter ||
          (activeFilter === "active"
            ? category.is_active
            : !category.is_active);

        return matchesSearch && matchesActive;
      })
      .sort((first, second) => {
        if (sort === "inactive") {
          return Number(first.is_active) - Number(second.is_active);
        }

        if (sort === "active") {
          return Number(second.is_active) - Number(first.is_active);
        }

        return first.name.localeCompare(second.name);
      });
  }, [activeFilter, categories, search, sort]);

  async function handleDelete(category: CategoryRow) {
    const confirmed = window.confirm(
      `Delete "${category.name}"? Products in this category will become uncategorized.`
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setDeletingCategoryId(category.id);

    const token = await getAccessToken();

    if (!token) {
      setError("Your admin session expired. Please login again.");
      setDeletingCategoryId("");
      return;
    }

    const response = await fetch(`/api/admin/categories/${category.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const result = (await response.json()) as { error?: string };

    setDeletingCategoryId("");

    if (!response.ok) {
      setError(result.error ?? "Unable to delete category.");
      return;
    }

    setCategories((currentCategories) =>
      currentCategories.filter((item) => item.id !== category.id)
    );
  }

  return (
    <section className="rounded-[8px] border border-[#dfeadd] bg-white shadow-[0_10px_24px_rgba(49,88,61,0.06)]">
      <div className="flex flex-col gap-4 border-b border-[#e4eee6] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div>
          <h2 className="text-[22px] font-bold text-[#10221f]">Categories</h2>
          <p className="mt-1 text-[14px] font-medium text-[#667167]">
            Categories loaded from the database.
          </p>
        </div>
        <Link
          href="/admin/categories/add"
          className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-full bg-[#5a9a4a] px-5 text-[14px] font-bold text-white transition hover:bg-[#4f8b42] sm:w-auto"
        >
          <Plus size={17} strokeWidth={2.2} />
          Add Category
        </Link>
      </div>

      {error ? (
        <p className="m-5 rounded-[8px] border border-[#f4c7c7] bg-[#fff1f1] px-5 py-4 text-[14px] font-bold text-[#9b1c1c]">
          {error}
        </p>
      ) : null}

      <div className="grid gap-3 border-b border-[#e4eee6] px-4 py-4 sm:grid-cols-2 sm:px-5 lg:grid-cols-[1.5fr_1fr_1fr]">
        <label className="flex h-11 items-center gap-3 rounded-[8px] border border-[#dfe8dd] bg-[#fbfdf8] px-3 text-[#667167] focus-within:border-[#5a9a4a]">
          <Search size={17} strokeWidth={2.2} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search name, slug, description"
            className="w-full bg-transparent text-[14px] font-medium text-[#1f3025] outline-none"
          />
        </label>
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
          <option value="name">Name A-Z</option>
          <option value="active">Active first</option>
          <option value="inactive">Inactive first</option>
        </select>
      </div>

      <div className="divide-y divide-[#edf2ea] sm:hidden">
        {filteredCategories.map((category) => (
          <article key={category.id} className="px-4 py-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="truncate text-[16px] font-bold text-[#10221f]">
                  {category.name}
                </h3>
                <p className="mt-1 break-all text-[13px] font-medium text-[#667167]">
                  {category.slug}
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-[#fbfdf8] px-3 py-1 text-[12px] font-bold text-[#31583d] ring-1 ring-[#dfe8dd]">
                {category.is_active ? "Active" : "Inactive"}
              </span>
            </div>
            <p className="mt-3 text-[14px] font-medium leading-6 text-[#667167]">
              {category.description ?? "-"}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Link
                href={`/admin/categories/edit/${category.id}`}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-[#dfe8dd] px-4 text-[13px] font-bold text-[#31583d] transition hover:bg-[#f4faf2]"
              >
                <Edit3 size={15} strokeWidth={2.2} />
                Edit
              </Link>
              <button
                type="button"
                onClick={() => handleDelete(category)}
                disabled={deletingCategoryId === category.id}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-[#f4c7c7] px-4 text-[13px] font-bold text-[#9b1c1c] transition hover:bg-[#fff1f1] disabled:cursor-not-allowed disabled:opacity-65"
              >
                <Trash2 size={15} strokeWidth={2.2} />
                {deletingCategoryId === category.id ? "Deleting" : "Delete"}
              </button>
            </div>
          </article>
        ))}
      </div>

      <div className="hidden overflow-x-auto sm:block">
        <table className="w-full min-w-[680px] text-left">
          <thead className="bg-[#fbfdf8] text-[13px] font-bold uppercase text-[#667167]">
            <tr>
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Slug</th>
              <th className="px-5 py-3">Description</th>
              <th className="px-5 py-3">Active</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#edf2ea] text-[14px]">
            {filteredCategories.map((category) => (
              <tr key={category.id}>
                <td className="px-5 py-4 font-bold text-[#10221f]">
                  {category.name}
                </td>
                <td className="px-5 py-4 font-medium text-[#667167]">
                  {category.slug}
                </td>
                <td className="max-w-[420px] px-5 py-4 font-medium text-[#667167]">
                  {category.description ?? "-"}
                </td>
                <td className="px-5 py-4 font-medium text-[#667167]">
                  {category.is_active ? "Yes" : "No"}
                </td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/categories/edit/${category.id}`}
                      className="inline-flex h-9 items-center justify-center gap-2 rounded-full border border-[#dfe8dd] px-4 text-[13px] font-bold text-[#31583d] transition hover:bg-[#f4faf2]"
                    >
                      <Edit3 size={15} strokeWidth={2.2} />
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(category)}
                      disabled={deletingCategoryId === category.id}
                      className="inline-flex h-9 items-center justify-center gap-2 rounded-full border border-[#f4c7c7] px-4 text-[13px] font-bold text-[#9b1c1c] transition hover:bg-[#fff1f1] disabled:cursor-not-allowed disabled:opacity-65"
                    >
                      <Trash2 size={15} strokeWidth={2.2} />
                      {deletingCategoryId === category.id ? "Deleting" : "Delete"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!isLoading && filteredCategories.length === 0 ? (
        <p className="px-5 py-8 text-center text-[15px] font-medium text-[#667167]">
          No categories match the current filters.
        </p>
      ) : null}
      {isLoading ? (
        <p className="px-5 py-8 text-center text-[15px] font-bold text-[#31583d]">
          Loading categories...
        </p>
      ) : null}
    </section>
  );
}
