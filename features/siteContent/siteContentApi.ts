import { supabase } from "@/lib/supabaseClient";
import type { Database } from "@/types/database.types";

export type SiteContentRow =
  Database["public"]["Tables"]["site_content"]["Row"];

export async function getSiteContent(pageKey: string) {
  const { data, error } = await supabase
    .from("site_content")
    .select("*")
    .eq("page_key", pageKey)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
