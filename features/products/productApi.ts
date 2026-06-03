import { supabase } from "@/lib/supabaseClient";
import type { ProductCardProduct } from "@/components/products/ProductCard";
import type { ProductDetailProduct } from "@/components/products/ProductDetails";
import type { Database } from "@/types/database.types";

type ProductRow = Database["public"]["Tables"]["products"]["Row"];
type CategoryRow = Database["public"]["Tables"]["categories"]["Row"];
type ProductImageRow = Database["public"]["Tables"]["product_images"]["Row"];
type ProductAvailability = Database["public"]["Enums"]["product_availability"];

export type ProductSort = "default" | "price-asc" | "price-desc" | "newest";
type ProductOrderBy = "created_at" | "updated_at";

export type ProductFilters = {
  search?: string;
  category?: string;
  availability?: ProductAvailability;
  minPrice?: number;
  maxPrice?: number;
  sort?: ProductSort;
  featuredOnly?: boolean;
  orderBy?: ProductOrderBy;
  limit?: number;
};

type ProductWithRelations = ProductRow & {
  categories: Pick<CategoryRow, "name" | "slug"> | null;
  product_images?: Pick<
    ProductImageRow,
    "image_url" | "alt_text" | "display_order"
  >[];
};

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const availabilityLabels: Record<ProductAvailability, string> = {
  available: "Fresh Stock",
  out_of_stock: "Out of Stock",
  coming_soon: "Coming Soon",
};

function getStatusBadge(product: ProductWithRelations) {
  if (product.availability === "out_of_stock") {
    return {
      label: "Out of Stock",
      tone: "muted" as const,
    };
  }

  if (product.availability === "coming_soon") {
    return {
      label: "Coming Soon",
      tone: "danger" as const,
    };
  }

  return undefined;
}

function formatPrice(value: number | null) {
  return `$${Number(value ?? 0).toFixed(2)}`;
}

function getCategoryName(product: ProductWithRelations) {
  return product.categories?.name ?? "Almfood AB";
}

function getPrimaryImage(product: ProductWithRelations) {
  return product.main_image_url ?? undefined;
}

function getProductHref(product: ProductWithRelations) {
  return `/products/${product.slug}`;
}

function getUnitLabel(product: ProductWithRelations) {
  return (
    product.unit_quantity ??
    product.size ??
    product.weight ??
    product.packaging_type ??
    product.brand ??
    undefined
  );
}

function getGalleryImages(product: ProductWithRelations) {
  const mainImage = getPrimaryImage(product);
  const extraImages =
    product.product_images
      ? [...product.product_images]
          .sort(
            (first, second) =>
              (first.display_order ?? 0) - (second.display_order ?? 0)
          )
          .map((image) => image.image_url)
          .filter((imageUrl) => imageUrl && imageUrl !== mainImage)
      : [];

  return mainImage
    ? [mainImage, ...extraImages].slice(0, 4)
    : extraImages.slice(0, 4);
}

function getUniqueValues(values: Array<string | null>) {
  return Array.from(
    new Set(values.map((value) => value?.trim()).filter(Boolean) as string[])
  );
}

export function mapProductToCard(
  product: ProductWithRelations
): ProductCardProduct {
  return {
    id: product.id,
    name: product.name,
    category: getCategoryName(product),
    image: getPrimaryImage(product),
    href: getProductHref(product),
    price: formatPrice(product.price),
    unit: getUnitLabel(product),
    sku: product.brand ?? undefined,
    badges: product.is_featured ? ["Featured"] : undefined,
    statusBadge: getStatusBadge(product),
    unavailable: product.availability === "out_of_stock",
  };
}

export function mapProductToDetail(
  product: ProductWithRelations
): ProductDetailProduct {
  const image = getPrimaryImage(product);
  const category = getCategoryName(product);
  const galleryImages = getGalleryImages(product);
  const sizeOptions = getUniqueValues([
    product.size,
    product.weight,
    product.unit_quantity,
  ]);
  const packOptions = getUniqueValues([product.packaging_type, product.brand]);

  return {
    id: product.id,
    name: product.name,
    category,
    image,
    price: formatPrice(product.price),
    sku: product.slug,
    badge: availabilityLabels[product.availability],
    description: product.description ?? product.short_description ?? "",
    thumbnails: galleryImages,
    sizes: sizeOptions,
    packs: packOptions,
  };
}

export async function getProducts(filters: ProductFilters = {}) {
  let categoryId: string | null = null;

  if (filters.category) {
    const { data: category, error: categoryError } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", filters.category)
      .eq("is_active", true)
      .maybeSingle();

    if (categoryError) {
      throw new Error(categoryError.message);
    }

    if (!category) {
      return [];
    }

    categoryId = category.id;
  }

  let query = supabase
    .from("products")
    .select(
      `
      *,
      categories!products_category_id_fkey(name, slug),
      product_images(image_url, alt_text, display_order)
    `
    )
    .eq("is_active", true);

  if (filters.featuredOnly) {
    query = query.eq("is_featured", true);
  }

  if (filters.search) {
    const search = filters.search.replaceAll(",", " ").trim();

    if (search) {
      query = query.or(
        `name.ilike.%${search}%,slug.ilike.%${search}%,short_description.ilike.%${search}%,description.ilike.%${search}%,brand.ilike.%${search}%`
      );
    }
  }

  if (categoryId) {
    query = query.eq("category_id", categoryId);
  }

  if (filters.availability) {
    query = query.eq("availability", filters.availability);
  }

  if (typeof filters.minPrice === "number") {
    query = query.gte("price", filters.minPrice);
  }

  if (typeof filters.maxPrice === "number") {
    query = query.lte("price", filters.maxPrice);
  }

  if (filters.sort === "price-asc") {
    query = query.order("price", { ascending: true });
  } else if (filters.sort === "price-desc") {
    query = query.order("price", { ascending: false });
  } else {
    query = query.order(filters.orderBy ?? "created_at", {
      ascending: false,
    });
  }

  if (typeof filters.limit === "number" && filters.limit > 0) {
    query = query.limit(filters.limit);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as ProductWithRelations[];
}

export async function getProductByIdentifier(identifier: string) {
  const query = supabase
    .from("products")
    .select(
      `
      *,
      categories!products_category_id_fkey(name, slug),
      product_images(image_url, alt_text, display_order)
    `
    )
    .eq("is_active", true);

  const { data, error } = uuidPattern.test(identifier)
    ? await query.eq("id", identifier).maybeSingle()
    : await query.eq("slug", identifier).maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data as ProductWithRelations | null;
}

export async function getProductCards(filters: ProductFilters = {}) {
  const products = await getProducts(filters);

  return products.map(mapProductToCard);
}

export async function getProductDetailById(identifier: string) {
  const product = await getProductByIdentifier(identifier);

  return product ? mapProductToDetail(product) : null;
}
