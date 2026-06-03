"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, ImagePlus, Save, Trash2 } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import type { Database } from "@/types/database.types";

type ProductAvailability = Database["public"]["Enums"]["product_availability"];
type ProductRow = Database["public"]["Tables"]["products"]["Row"];
type ProductImageRow = Database["public"]["Tables"]["product_images"]["Row"];

type ProductFormProps = {
  mode: "add" | "edit";
  productId?: string;
};

type CategoryOption = {
  id: string;
  name: string;
};

type ProductImage = Pick<
  ProductImageRow,
  "id" | "image_url" | "alt_text" | "display_order"
>;

type ProductDetailResponse = {
  product?: ProductRow;
  images?: ProductImage[];
  error?: string;
};

type ProductSaveResponse = {
  id?: string;
  error?: string;
};

type ProductFormState = {
  category_id: string;
  name: string;
  slug: string;
  short_description: string;
  description: string;
  price: string;
  availability: ProductAvailability;
  brand: string;
  size: string;
  weight: string;
  packaging_type: string;
  unit_quantity: string;
  is_featured: boolean;
  is_active: boolean;
};

const blankForm: ProductFormState = {
  category_id: "",
  name: "",
  slug: "",
  short_description: "",
  description: "",
  price: "",
  availability: "available",
  brand: "",
  size: "",
  weight: "",
  packaging_type: "",
  unit_quantity: "",
  is_featured: false,
  is_active: true,
};

const availabilityOptions: { label: string; value: ProductAvailability }[] = [
  { label: "Available", value: "available" },
  { label: "Out of Stock", value: "out_of_stock" },
  { label: "Coming Soon", value: "coming_soon" },
];

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

function mapProductToForm(product: ProductRow): ProductFormState {
  return {
    category_id: product.category_id ?? "",
    name: product.name,
    slug: product.slug,
    short_description: product.short_description ?? "",
    description: product.description ?? "",
    price: String(product.price),
    availability: product.availability,
    brand: product.brand ?? "",
    size: product.size ?? "",
    weight: product.weight ?? "",
    packaging_type: product.packaging_type ?? "",
    unit_quantity: product.unit_quantity ?? "",
    is_featured: product.is_featured,
    is_active: product.is_active,
  };
}

function getFileExtension(file: File) {
  return file.name.split(".").pop()?.toLowerCase() || "jpg";
}

async function uploadProductImage(productId: string, file: File) {
  const filePath = `${productId}/${crypto.randomUUID()}.${getFileExtension(file)}`;
  const { error } = await supabase.storage
    .from("product-images")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabase.storage
    .from("product-images")
    .getPublicUrl(filePath);

  return data.publicUrl;
}

async function getAccessToken() {
  const { data } = await supabase.auth.getSession();

  return data.session?.access_token;
}

export default function ProductForm({ mode, productId }: ProductFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<ProductFormState>(blankForm);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [isLoading, setIsLoading] = useState(mode === "edit");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [slugEdited, setSlugEdited] = useState(mode === "edit");
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [existingMainImageUrl, setExistingMainImageUrl] = useState("");
  const [existingImages, setExistingImages] = useState<ProductImage[]>([]);
  const [removedImageIds, setRemovedImageIds] = useState<string[]>([]);

  const title = mode === "add" ? "Add Product" : "Edit Product";

  const productPayload = useMemo(
    () => ({
      category_id: form.category_id || null,
      name: form.name.trim(),
      slug: form.slug.trim(),
      short_description: emptyToNull(form.short_description),
      description: emptyToNull(form.description),
      price: Number(form.price),
      availability: form.availability,
      brand: emptyToNull(form.brand),
      size: emptyToNull(form.size),
      weight: emptyToNull(form.weight),
      packaging_type: emptyToNull(form.packaging_type),
      unit_quantity: emptyToNull(form.unit_quantity),
      is_featured: form.is_featured,
      is_active: form.is_active,
    }),
    [form]
  );

  useEffect(() => {
    async function loadFormData() {
      const { data: categoryData, error: categoryError } = await supabase
        .from("categories")
        .select("id, name")
        .eq("is_active", true)
        .order("name", { ascending: true });

      if (categoryError) {
        setError(categoryError.message);
      } else {
        setCategories(categoryData ?? []);
      }

      if (mode === "edit" && productId) {
        const token = await getAccessToken();

        if (!token) {
          setError("Your admin session expired. Please login again.");
        } else {
          const response = await fetch(`/api/admin/products/${productId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const result = (await response.json()) as ProductDetailResponse;

          if (!response.ok || !result.product) {
            setError(result.error ?? "Product not found.");
          } else {
            setForm(mapProductToForm(result.product));
            setExistingMainImageUrl(result.product.main_image_url ?? "");
            setExistingImages(result.images ?? []);
          }
        }
      }

      setIsLoading(false);
    }

    loadFormData();
  }, [mode, productId]);

  function updateField<Key extends keyof ProductFormState>(
    key: Key,
    value: ProductFormState[Key]
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

    if (!productPayload.name || !productPayload.slug) {
      setError("Product name and slug are required.");
      return;
    }

    if (!Number.isFinite(productPayload.price) || productPayload.price < 0) {
      setError("Product price must be a valid number.");
      return;
    }

    setIsSaving(true);

    try {
      let savedProductId = productId ?? "";
      let mainImageUrl = existingMainImageUrl || null;
      const token = await getAccessToken();

      if (!token) {
        throw new Error("Your admin session expired. Please login again.");
      }

      if (mode === "add") {
        const response = await fetch("/api/admin/products", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...productPayload,
            main_image_url: null,
          }),
        });
        const result = (await response.json()) as ProductSaveResponse;

        if (!response.ok || !result.id) {
          throw new Error(result.error ?? "Unable to create product.");
        }

        savedProductId = result.id;
      }

      if (!savedProductId) {
        throw new Error("Missing product id.");
      }

      if (mainImageFile) {
        mainImageUrl = await uploadProductImage(savedProductId, mainImageFile);
      }

      const uploadedGalleryUrls = await Promise.all(
        galleryFiles.map((file) => uploadProductImage(savedProductId, file))
      );

      if (!mainImageUrl && uploadedGalleryUrls.length > 0) {
        mainImageUrl = uploadedGalleryUrls[0];
      }

      const updateResponse = await fetch(`/api/admin/products/${savedProductId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...productPayload,
          main_image_url: mainImageUrl,
        }),
      });
      const updateResult = (await updateResponse.json()) as ProductSaveResponse;

      if (!updateResponse.ok) {
        throw new Error(updateResult.error ?? "Unable to update product.");
      }

      if (removedImageIds.length > 0) {
        const { error: removeImagesError } = await supabase
          .from("product_images")
          .delete()
          .in("id", removedImageIds);

        if (removeImagesError) {
          throw new Error(removeImagesError.message);
        }
      }

      if (uploadedGalleryUrls.length > 0) {
        const startOrder =
          existingImages.filter((image) => !removedImageIds.includes(image.id))
            .length + 1;
        const { error: imageInsertError } = await supabase
          .from("product_images")
          .insert(
            uploadedGalleryUrls.map((imageUrl, index) => ({
              product_id: savedProductId,
              image_url: imageUrl,
              alt_text: productPayload.name,
              display_order: startOrder + index,
            }))
          );

        if (imageInsertError) {
          throw new Error(imageInsertError.message);
        }
      }

      setIsSaving(false);
      router.push("/admin/products");
      router.refresh();
    } catch (caughtError) {
      setIsSaving(false);
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to save product."
      );
    }
  }

  if (isLoading) {
    return (
      <p className="rounded-[8px] border border-[#dfeadd] bg-white px-5 py-4 text-[14px] font-bold text-[#31583d]">
        Loading product form...
      </p>
    );
  }

  return (
    <section className="rounded-[8px] border border-[#dfeadd] bg-white shadow-[0_10px_24px_rgba(49,88,61,0.06)]">
      <div className="flex flex-col gap-4 border-b border-[#e4eee6] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div>
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-2 text-[14px] font-bold text-[#31583d] transition hover:text-[#5a9a4a]"
          >
            <ArrowLeft size={17} strokeWidth={2.2} />
            Back to Products
          </Link>
          <h2 className="mt-3 text-[22px] font-bold text-[#10221f]">
            {title}
          </h2>
        </div>
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

          <label className="block">
            <span className="text-[14px] font-bold text-[#1f3025]">
              Category
            </span>
            <select
              value={form.category_id}
              onChange={(event) =>
                updateField("category_id", event.target.value)
              }
              className="mt-2 h-12 w-full rounded-[8px] border border-[#dfe8dd] bg-[#fbfdf8] px-4 text-[15px] font-medium text-[#1f3025] outline-none focus:border-[#5a9a4a] focus:ring-4 focus:ring-[#5a9a4a]/12"
            >
              <option value="">Uncategorized</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-[14px] font-bold text-[#1f3025]">
              Availability
            </span>
            <select
              value={form.availability}
              onChange={(event) =>
                updateField(
                  "availability",
                  event.target.value as ProductAvailability
                )
              }
              className="mt-2 h-12 w-full rounded-[8px] border border-[#dfe8dd] bg-[#fbfdf8] px-4 text-[15px] font-medium text-[#1f3025] outline-none focus:border-[#5a9a4a] focus:ring-4 focus:ring-[#5a9a4a]/12"
            >
              {availabilityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-[14px] font-bold text-[#1f3025]">Price</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={(event) => updateField("price", event.target.value)}
              required
              className="mt-2 h-12 w-full rounded-[8px] border border-[#dfe8dd] bg-[#fbfdf8] px-4 text-[15px] font-medium text-[#1f3025] outline-none focus:border-[#5a9a4a] focus:ring-4 focus:ring-[#5a9a4a]/12"
            />
          </label>

        </div>

        <section className="rounded-[8px] border border-[#dfe8dd] bg-[#fbfdf8] p-4 sm:p-5">
          <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <h3 className="text-[16px] font-bold text-[#1f3025]">
                Main Product Image
              </h3>
              <p className="mt-1 text-[13px] font-medium text-[#667167]">
                Upload the primary image shown on product cards.
              </p>

              <label className="mt-4 flex min-h-[150px] cursor-pointer flex-col items-center justify-center rounded-[8px] border border-dashed border-[#cad9c8] bg-white px-4 py-6 text-center transition hover:border-[#5a9a4a]">
                <ImagePlus
                  size={28}
                  strokeWidth={2.2}
                  className="text-[#5a9a4a]"
                />
                <span className="mt-3 text-[14px] font-bold text-[#31583d]">
                  Choose main image
                </span>
                <span className="mt-1 text-[12px] font-medium text-[#667167]">
                  JPG, PNG, WEBP
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) =>
                    setMainImageFile(event.target.files?.[0] ?? null)
                  }
                  className="sr-only"
                />
              </label>

              {mainImageFile ? (
                <p className="mt-3 text-[13px] font-bold text-[#31583d]">
                  Selected: {mainImageFile.name}
                </p>
              ) : existingMainImageUrl ? (
                <div className="mt-4">
                  <p className="mb-2 text-[13px] font-bold text-[#667167]">
                    Current main image
                  </p>
                  <div className="relative aspect-[1.4] max-w-[220px] overflow-hidden rounded-[8px] border border-[#dfe8dd] bg-white">
                    <Image
                      src={existingMainImageUrl}
                      alt="Current main product image"
                      fill
                      sizes="220px"
                      unoptimized={existingMainImageUrl.startsWith("http")}
                      className="object-contain p-3"
                    />
                  </div>
                </div>
              ) : null}
            </div>

            <div>
              <h3 className="text-[16px] font-bold text-[#1f3025]">
                Gallery Images
              </h3>
              <p className="mt-1 text-[13px] font-medium text-[#667167]">
                Upload one or more extra product images.
              </p>

              <label className="mt-4 flex min-h-[150px] cursor-pointer flex-col items-center justify-center rounded-[8px] border border-dashed border-[#cad9c8] bg-white px-4 py-6 text-center transition hover:border-[#5a9a4a]">
                <ImagePlus
                  size={28}
                  strokeWidth={2.2}
                  className="text-[#5a9a4a]"
                />
                <span className="mt-3 text-[14px] font-bold text-[#31583d]">
                  Choose gallery images
                </span>
                <span className="mt-1 text-[12px] font-medium text-[#667167]">
                  Multiple images allowed
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(event) =>
                    setGalleryFiles(Array.from(event.target.files ?? []))
                  }
                  className="sr-only"
                />
              </label>

              {galleryFiles.length > 0 ? (
                <div className="mt-3 space-y-1 text-[13px] font-bold text-[#31583d]">
                  {galleryFiles.map((file) => (
                    <p key={`${file.name}-${file.size}`}>{file.name}</p>
                  ))}
                </div>
              ) : null}

              {existingImages.length > 0 ? (
                <div className="mt-4">
                  <p className="mb-2 text-[13px] font-bold text-[#667167]">
                    Current gallery
                  </p>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {existingImages
                      .filter((image) => !removedImageIds.includes(image.id))
                      .map((image) => (
                        <div
                          key={image.id}
                          className="rounded-[8px] border border-[#dfe8dd] bg-white p-2"
                        >
                          <div className="relative aspect-square overflow-hidden rounded-[6px] bg-[#f7fbf3]">
                            <Image
                              src={image.image_url}
                              alt={image.alt_text ?? "Product gallery image"}
                              fill
                              sizes="160px"
                              unoptimized={image.image_url.startsWith("http")}
                              className="object-contain p-2"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              setRemovedImageIds((current) => [
                                ...current,
                                image.id,
                              ])
                            }
                            className="mt-2 inline-flex h-8 w-full items-center justify-center gap-2 rounded-full border border-[#f4c7c7] text-[12px] font-bold text-[#9b1c1c] transition hover:bg-[#fff1f1]"
                          >
                            <Trash2 size={14} strokeWidth={2.2} />
                            Remove
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </section>

        <div className="grid gap-5 lg:grid-cols-2">
          <label className="block">
            <span className="text-[14px] font-bold text-[#1f3025]">
              Short Description
            </span>
            <textarea
              value={form.short_description}
              onChange={(event) =>
                updateField("short_description", event.target.value)
              }
              rows={4}
              className="mt-2 w-full rounded-[8px] border border-[#dfe8dd] bg-[#fbfdf8] px-4 py-3 text-[15px] font-medium text-[#1f3025] outline-none focus:border-[#5a9a4a] focus:ring-4 focus:ring-[#5a9a4a]/12"
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
              rows={4}
              className="mt-2 w-full rounded-[8px] border border-[#dfe8dd] bg-[#fbfdf8] px-4 py-3 text-[15px] font-medium text-[#1f3025] outline-none focus:border-[#5a9a4a] focus:ring-4 focus:ring-[#5a9a4a]/12"
            />
          </label>
        </div>

        <div className="grid gap-5 lg:grid-cols-5">
          {[
            ["brand", "Brand"],
            ["size", "Size"],
            ["weight", "Weight"],
            ["packaging_type", "Packaging Type"],
            ["unit_quantity", "Unit Quantity"],
          ].map(([field, label]) => (
            <label key={field} className="block">
              <span className="text-[14px] font-bold text-[#1f3025]">
                {label}
              </span>
              <input
                value={String(form[field as keyof ProductFormState])}
                onChange={(event) =>
                  updateField(
                    field as keyof ProductFormState,
                    event.target.value as never
                  )
                }
                className="mt-2 h-12 w-full rounded-[8px] border border-[#dfe8dd] bg-[#fbfdf8] px-4 text-[15px] font-medium text-[#1f3025] outline-none focus:border-[#5a9a4a] focus:ring-4 focus:ring-[#5a9a4a]/12"
              />
            </label>
          ))}
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:gap-5">
          <label className="flex cursor-pointer items-center gap-3 text-[14px] font-bold text-[#1f3025]">
            <input
              type="checkbox"
              checked={form.is_featured}
              onChange={(event) =>
                updateField("is_featured", event.target.checked)
              }
              className="h-4 w-4 rounded border-[#cad9c8] accent-[#5a9a4a]"
            />
            Show on homepage
          </label>

          <label className="flex cursor-pointer items-center gap-3 text-[14px] font-bold text-[#1f3025]">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(event) =>
                updateField("is_active", event.target.checked)
              }
              className="h-4 w-4 rounded border-[#cad9c8] accent-[#5a9a4a]"
            />
            Active product
          </label>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#5a9a4a] px-7 text-[15px] font-bold text-white transition hover:bg-[#4f8b42] disabled:cursor-not-allowed disabled:opacity-65 sm:w-auto"
        >
          <Save size={18} strokeWidth={2.2} />
          {isSaving ? "Saving..." : "Save Product"}
        </button>
      </form>
    </section>
  );
}
