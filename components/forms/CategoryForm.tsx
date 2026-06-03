"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import type { Database } from "@/types/database.types";

type CategoryRow = Database["public"]["Tables"]["categories"]["Row"];

type CategoryFormProps = {
  mode: "add" | "edit";
  categoryId?: string;
};

type CategoryResponse = {
  category?: CategoryRow;
  id?: string;
  error?: string;
};

type CategoryFormState = {
  name: string;
  slug: string;
  description: string;
  image_url: string;
  is_active: boolean;
};

const blankForm: CategoryFormState = {
  name: "",
  slug: "",
  description: "",
  image_url: "",
  is_active: true,
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function emptyToNull(value: string) {
  const trimmed = value.trim();

  return trimmed ? trimmed : null;
}

function mapCategoryToForm(category: CategoryRow): CategoryFormState {
  return {
    name: category.name,
    slug: category.slug,
    description: category.description ?? "",
    image_url: category.image_url ?? "",
    is_active: category.is_active,
  };
}

async function getAccessToken() {
  const { data } = await supabase.auth.getSession();

  return data.session?.access_token;
}

export default function CategoryForm({ mode, categoryId }: CategoryFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<CategoryFormState>(blankForm);
  const [isLoading, setIsLoading] = useState(mode === "edit");
  const [isSaving, setIsSaving] = useState(false);
  const [slugEdited, setSlugEdited] = useState(mode === "edit");
  const [error, setError] = useState("");

  const title = mode === "add" ? "Add Category" : "Edit Category";
  const payload = useMemo(
    () => ({
      name: form.name.trim(),
      slug: form.slug.trim(),
      description: emptyToNull(form.description),
      image_url: emptyToNull(form.image_url),
      is_active: form.is_active,
    }),
    [form]
  );

  useEffect(() => {
    if (mode !== "edit" || !categoryId) {
      return;
    }

    void getAccessToken().then(async (token) => {
      if (!token) {
        setError("Your admin session expired. Please login again.");
        setIsLoading(false);
        return;
      }

      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = (await response.json()) as CategoryResponse;

      if (!response.ok || !result.category) {
        setError(result.error ?? "Category not found.");
      } else {
        setForm(mapCategoryToForm(result.category));
      }

      setIsLoading(false);
    });
  }, [categoryId, mode]);

  function updateField<Key extends keyof CategoryFormState>(
    key: Key,
    value: CategoryFormState[Key]
  ) {
    setForm((current) => {
      const next = { ...current, [key]: value };

      if (key === "name" && !slugEdited) {
        next.slug = slugify(String(value));
      }

      return next;
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!payload.name || !payload.slug) {
      setError("Category name and slug are required.");
      return;
    }

    const token = await getAccessToken();

    if (!token) {
      setError("Your admin session expired. Please login again.");
      return;
    }

    setIsSaving(true);

    const response = await fetch(
      mode === "add" ? "/api/admin/categories" : `/api/admin/categories/${categoryId}`,
      {
        method: mode === "add" ? "POST" : "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );
    const result = (await response.json()) as CategoryResponse;

    setIsSaving(false);

    if (!response.ok) {
      setError(result.error ?? "Unable to save category.");
      return;
    }

    router.push("/admin/categories");
    router.refresh();
  }

  if (isLoading) {
    return (
      <p className="rounded-[8px] border border-[#dfeadd] bg-white px-5 py-4 text-[14px] font-bold text-[#31583d]">
        Loading category form...
      </p>
    );
  }

  return (
    <section className="rounded-[8px] border border-[#dfeadd] bg-white shadow-[0_10px_24px_rgba(49,88,61,0.06)]">
      <div className="border-b border-[#e4eee6] px-4 py-4 sm:px-5">
        <Link
          href="/admin/categories"
          className="inline-flex items-center gap-2 text-[14px] font-bold text-[#31583d] transition hover:text-[#5a9a4a]"
        >
          <ArrowLeft size={17} strokeWidth={2.2} />
          Back to Categories
        </Link>
        <h2 className="mt-3 text-[22px] font-bold text-[#10221f]">{title}</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 p-4 sm:p-5">
        {error ? (
          <p className="rounded-[8px] border border-[#f4c7c7] bg-[#fff1f1] px-5 py-4 text-[14px] font-bold text-[#9b1c1c]">
            {error}
          </p>
        ) : null}

        <div className="grid gap-5 lg:grid-cols-2">
          <label className="block">
            <span className="text-[14px] font-bold text-[#1f3025]">Name</span>
            <input
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
              required
              className="mt-2 h-12 w-full rounded-[8px] border border-[#dfe8dd] bg-[#fbfdf8] px-4 text-[15px] font-medium text-[#1f3025] outline-none focus:border-[#5a9a4a] focus:ring-4 focus:ring-[#5a9a4a]/12"
            />
          </label>

          <label className="block">
            <span className="text-[14px] font-bold text-[#1f3025]">Slug</span>
            <input
              value={form.slug}
              onChange={(event) => {
                setSlugEdited(true);
                updateField("slug", slugify(event.target.value));
              }}
              required
              className="mt-2 h-12 w-full rounded-[8px] border border-[#dfe8dd] bg-[#fbfdf8] px-4 text-[15px] font-medium text-[#1f3025] outline-none focus:border-[#5a9a4a] focus:ring-4 focus:ring-[#5a9a4a]/12"
            />
          </label>
        </div>

        <label className="block">
          <span className="text-[14px] font-bold text-[#1f3025]">
            Image URL
          </span>
          <input
            value={form.image_url}
            onChange={(event) => updateField("image_url", event.target.value)}
            className="mt-2 h-12 w-full rounded-[8px] border border-[#dfe8dd] bg-[#fbfdf8] px-4 text-[15px] font-medium text-[#1f3025] outline-none focus:border-[#5a9a4a] focus:ring-4 focus:ring-[#5a9a4a]/12"
          />
        </label>

        <label className="block">
          <span className="text-[14px] font-bold text-[#1f3025]">
            Description
          </span>
          <textarea
            value={form.description}
            onChange={(event) =>
              updateField("description", event.target.value)
            }
            rows={5}
            className="mt-2 w-full rounded-[8px] border border-[#dfe8dd] bg-[#fbfdf8] px-4 py-3 text-[15px] font-medium text-[#1f3025] outline-none focus:border-[#5a9a4a] focus:ring-4 focus:ring-[#5a9a4a]/12"
          />
        </label>

        <label className="flex cursor-pointer items-center gap-3 text-[14px] font-bold text-[#1f3025]">
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={(event) => updateField("is_active", event.target.checked)}
            className="h-4 w-4 rounded border-[#cad9c8] accent-[#5a9a4a]"
          />
          Active category
        </label>

        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#5a9a4a] px-7 text-[15px] font-bold text-white transition hover:bg-[#4f8b42] disabled:cursor-not-allowed disabled:opacity-65 sm:w-auto"
        >
          <Save size={18} strokeWidth={2.2} />
          {isSaving ? "Saving..." : "Save Category"}
        </button>
      </form>
    </section>
  );
}
