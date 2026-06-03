import { supabase } from "@/lib/supabaseClient";

export type DashboardProduct = {
  id: string;
  name: string;
  price: number;
  availability: string;
  category: string;
  isActive: boolean;
  createdAt: string | null;
};

export type DashboardMessage = {
  id: string;
  name: string;
  email: string;
  subject: string;
  status: "unread" | "read" | "replied";
  createdAt: string | null;
};

export type DashboardData = {
  stats: {
    products: number;
    activeProducts: number;
    categories: number;
    messages: number;
    unreadMessages: number;
    availableProducts: number;
    outOfStockProducts: number;
    comingSoonProducts: number;
  };
  latestProducts: DashboardProduct[];
  recentMessages: DashboardMessage[];
};

function normalizeAvailability(value: string) {
  return value.toLowerCase().replaceAll(" ", "_").replaceAll("-", "_");
}

export async function getDashboardData(): Promise<DashboardData> {
  const [productsResponse, categoriesResponse, messagesResponse] =
    await Promise.all([
      supabase
        .from("products")
        .select(
          `
          id,
          name,
          price,
          availability,
          is_active,
          created_at,
          categories!products_category_id_fkey(name)
        `
        )
        .order("created_at", { ascending: false }),
      supabase.from("categories").select("id, is_active"),
      supabase
        .from("contact_messages")
        .select("id, name, email, subject, status, created_at")
        .order("created_at", { ascending: false }),
    ]);

  if (productsResponse.error) {
    throw new Error(productsResponse.error.message);
  }

  if (categoriesResponse.error) {
    throw new Error(categoriesResponse.error.message);
  }

  if (messagesResponse.error) {
    throw new Error(messagesResponse.error.message);
  }

  const products = (productsResponse.data ?? []).map((product) => ({
    id: product.id,
    name: product.name,
    price: Number(product.price),
    availability: String(product.availability),
    category: product.categories?.name ?? "Uncategorized",
    isActive: product.is_active,
    createdAt: product.created_at,
  }));
  const activeProducts = products.filter((product) => product.isActive);

  return {
    stats: {
      products: products.length,
      activeProducts: activeProducts.length,
      categories: (categoriesResponse.data ?? []).filter(
        (category) => category.is_active
      ).length,
      messages: (messagesResponse.data ?? []).length,
      unreadMessages: (messagesResponse.data ?? []).filter(
        (message) => message.status === "unread"
      ).length,
      availableProducts: activeProducts.filter(
        (product) => normalizeAvailability(product.availability) === "available"
      ).length,
      outOfStockProducts: activeProducts.filter(
        (product) =>
          normalizeAvailability(product.availability) === "out_of_stock"
      ).length,
      comingSoonProducts: activeProducts.filter(
        (product) => normalizeAvailability(product.availability) === "coming_soon"
      ).length,
    },
    latestProducts: products.slice(0, 6),
    recentMessages: (messagesResponse.data ?? []).slice(0, 6).map((message) => ({
      id: message.id,
      name: message.name,
      email: message.email,
      subject: message.subject,
      status: message.status,
      createdAt: message.created_at,
    })),
  };
}
