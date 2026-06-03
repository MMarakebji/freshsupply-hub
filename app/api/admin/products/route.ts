import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getString, requireAdmin } from "../users/adminUserRouteHelpers";
import type { Database } from "@/types/database.types";

type ProductAvailability = Database["public"]["Enums"]["product_availability"];

const availabilityValues: ProductAvailability[] = [
  "available",
  "out_of_stock",
  "coming_soon",
];

function getNullableString(value: unknown) {
  const text = getString(value);

  return text || null;
}

function getBoolean(value: unknown, fallback: boolean) {
  return typeof value === "boolean" ? value : fallback;
}

function getAvailability(value: unknown): ProductAvailability {
  return availabilityValues.includes(value as ProductAvailability)
    ? (value as ProductAvailability)
    : "available";
}

function buildProductPayload(body: Record<string, unknown>) {
  return {
    category_id: getNullableString(body.category_id),
    name: getString(body.name),
    slug: getString(body.slug),
    short_description: getNullableString(body.short_description),
    description: getNullableString(body.description),
    price: Number(body.price),
    availability: getAvailability(body.availability),
    brand: getNullableString(body.brand),
    size: getNullableString(body.size),
    weight: getNullableString(body.weight),
    packaging_type: getNullableString(body.packaging_type),
    unit_quantity: getNullableString(body.unit_quantity),
    main_image_url: getNullableString(body.main_image_url),
    is_featured: getBoolean(body.is_featured, false),
    is_active: getBoolean(body.is_active, true),
    updated_at: new Date().toISOString(),
  };
}

export async function GET(request: NextRequest) {
  const adminCheck = await requireAdmin(request);

  if (adminCheck.error) {
    return adminCheck.error;
  }

  const [productsResponse, categoriesResponse] = await Promise.all([
    supabaseAdmin
      .from("products")
      .select(
        "id, name, slug, price, availability, is_featured, is_active, category_id, brand, updated_at, categories!products_category_id_fkey(name)"
      )
      .order("updated_at", { ascending: false }),
    supabaseAdmin
      .from("categories")
      .select("id, name")
      .order("name", { ascending: true }),
  ]);

  if (productsResponse.error) {
    return NextResponse.json(
      { error: productsResponse.error.message },
      { status: 400 }
    );
  }

  if (categoriesResponse.error) {
    return NextResponse.json(
      { error: categoriesResponse.error.message },
      { status: 400 }
    );
  }

  return NextResponse.json({
    products: productsResponse.data ?? [],
    categories: categoriesResponse.data ?? [],
  });
}

export async function POST(request: NextRequest) {
  const adminCheck = await requireAdmin(request);

  if (adminCheck.error) {
    return adminCheck.error;
  }

  const body = (await request.json()) as Record<string, unknown>;
  const payload = buildProductPayload(body);

  if (!payload.name || !payload.slug) {
    return NextResponse.json(
      { error: "Product name and slug are required." },
      { status: 400 }
    );
  }

  if (!Number.isFinite(payload.price) || payload.price < 0) {
    return NextResponse.json(
      { error: "Product price must be a valid number." },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from("products")
    .insert(payload)
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ id: data.id });
}
