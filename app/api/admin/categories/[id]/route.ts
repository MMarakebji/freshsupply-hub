import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getString, requireAdmin } from "../../users/adminUserRouteHelpers";

type CategoryRouteProps = {
  params: Promise<{
    id: string;
  }>;
};

function getNullableString(value: unknown) {
  const text = getString(value);

  return text || null;
}

function getBoolean(value: unknown, fallback: boolean) {
  return typeof value === "boolean" ? value : fallback;
}

function buildCategoryPayload(body: Record<string, unknown>) {
  return {
    name: getString(body.name),
    slug: getString(body.slug),
    description: getNullableString(body.description),
    image_url: getNullableString(body.image_url),
    is_active: getBoolean(body.is_active, true),
    updated_at: new Date().toISOString(),
  };
}

export async function GET(request: NextRequest, { params }: CategoryRouteProps) {
  const adminCheck = await requireAdmin(request);

  if (adminCheck.error) {
    return adminCheck.error;
  }

  const { id } = await params;
  const { data, error } = await supabaseAdmin
    .from("categories")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  if (!data) {
    return NextResponse.json({ error: "Category not found." }, { status: 404 });
  }

  return NextResponse.json({ category: data });
}

export async function PATCH(
  request: NextRequest,
  { params }: CategoryRouteProps
) {
  const adminCheck = await requireAdmin(request);

  if (adminCheck.error) {
    return adminCheck.error;
  }

  const { id } = await params;
  const body = (await request.json()) as Record<string, unknown>;
  const payload = buildCategoryPayload(body);

  if (!payload.name || !payload.slug) {
    return NextResponse.json(
      { error: "Category name and slug are required." },
      { status: 400 }
    );
  }

  const { error } = await supabaseAdmin
    .from("categories")
    .update(payload)
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ id });
}

export async function DELETE(
  request: NextRequest,
  { params }: CategoryRouteProps
) {
  const adminCheck = await requireAdmin(request);

  if (adminCheck.error) {
    return adminCheck.error;
  }

  const { id } = await params;
  const { error: productError } = await supabaseAdmin
    .from("products")
    .update({ category_id: null, updated_at: new Date().toISOString() })
    .eq("category_id", id);

  if (productError) {
    return NextResponse.json({ error: productError.message }, { status: 400 });
  }

  const { error } = await supabaseAdmin.from("categories").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ id });
}
