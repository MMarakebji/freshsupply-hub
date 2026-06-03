import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getString, requireAdmin } from "../../users/adminUserRouteHelpers";
import type { Database } from "@/types/database.types";

type ProductAvailability = Database["public"]["Enums"]["product_availability"];

type ProductRouteProps = {
  params: Promise<{
    id: string;
  }>;
};

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

export async function GET(request: NextRequest, { params }: ProductRouteProps) {
  const adminCheck = await requireAdmin(request);

  if (adminCheck.error) {
    return adminCheck.error;
  }

  const { id } = await params;
  const [productResponse, imagesResponse] = await Promise.all([
    supabaseAdmin.from("products").select("*").eq("id", id).maybeSingle(),
    supabaseAdmin
      .from("product_images")
      .select("id, image_url, alt_text, display_order")
      .eq("product_id", id)
      .order("display_order", { ascending: true }),
  ]);

  if (productResponse.error) {
    return NextResponse.json(
      { error: productResponse.error.message },
      { status: 400 }
    );
  }

  if (imagesResponse.error) {
    return NextResponse.json(
      { error: imagesResponse.error.message },
      { status: 400 }
    );
  }

  if (!productResponse.data) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }

  return NextResponse.json({
    product: productResponse.data,
    images: imagesResponse.data ?? [],
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: ProductRouteProps
) {
  const adminCheck = await requireAdmin(request);

  if (adminCheck.error) {
    return adminCheck.error;
  }

  const { id } = await params;
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

  const { error } = await supabaseAdmin
    .from("products")
    .update(payload)
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ id });
}

export async function DELETE(
  request: NextRequest,
  { params }: ProductRouteProps
) {
  const adminCheck = await requireAdmin(request);

  if (adminCheck.error) {
    return adminCheck.error;
  }

  const { id } = await params;
  const { error } = await supabaseAdmin.from("products").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ id });
}
