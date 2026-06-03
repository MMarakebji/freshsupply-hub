import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getString, requireAdmin } from "../users/adminUserRouteHelpers";

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

export async function GET(request: NextRequest) {
  const adminCheck = await requireAdmin(request);

  if (adminCheck.error) {
    return adminCheck.error;
  }

  const { data, error } = await supabaseAdmin
    .from("categories")
    .select("id, name, slug, description, is_active")
    .order("name", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ categories: data ?? [] });
}

export async function POST(request: NextRequest) {
  const adminCheck = await requireAdmin(request);

  if (adminCheck.error) {
    return adminCheck.error;
  }

  const body = (await request.json()) as Record<string, unknown>;
  const payload = buildCategoryPayload(body);

  if (!payload.name || !payload.slug) {
    return NextResponse.json(
      { error: "Category name and slug are required." },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from("categories")
    .insert(payload)
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ id: data.id });
}
