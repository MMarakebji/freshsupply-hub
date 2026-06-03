import { supabase } from "@/lib/supabaseClient";

export async function getCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("name", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getCategoryNames() {
  const categories = await getCategories();

  return categories.map((category) => category.name);
}

export async function getCategoryFilters() {
  const categories = await getCategories();

  return categories.map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
  }));
}

export async function getCategoryBySlug(slug: string) {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
