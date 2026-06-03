import Image from "next/image";
import Link from "next/link";
import { Fredoka } from "next/font/google";
import { ArrowRight, Leaf } from "lucide-react";
import ProductCard from "@/components/products/ProductCard";
import ProductRealtimeFilters from "@/components/products/ProductRealtimeFilters";
import { getCategoryFilters } from "@/features/categories/categoryApi";
import {
  getProductCards,
  type ProductFilters,
  type ProductSort,
} from "@/features/products/productApi";
import type { Database } from "@/types/database.types";

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

type ProductAvailability = Database["public"]["Enums"]["product_availability"];

const availabilityValues: ProductAvailability[] = [
  "available",
  "out_of_stock",
  "coming_soon",
];

const priceOptions = [
  { value: "0-10", min: 0, max: 10 },
  { value: "10-25", min: 10, max: 25 },
  { value: "25-50", min: 25, max: 50 },
  { value: "50-", min: 50, max: undefined },
];

const sortValues: ProductSort[] = [
  "default",
  "price-asc",
  "price-desc",
  "newest",
];

type ProductsPageProps = {
  searchParams?: Promise<{
    q?: string;
    category?: string;
    availability?: string;
    priceRange?: string;
    sort?: string;
  }>;
};

function getFirstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function parseAvailability(value: string | undefined) {
  return availabilityValues.includes(value as ProductAvailability)
    ? (value as ProductAvailability)
    : undefined;
}

function parsePriceRange(value: string | undefined) {
  const option = priceOptions.find((priceOption) => priceOption.value === value);

  return {
    minPrice: option?.min,
    maxPrice: option?.max,
  };
}

function parseSort(value: string | undefined): ProductSort {
  return sortValues.includes(value as ProductSort)
    ? (value as ProductSort)
    : "default";
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = (await searchParams) ?? {};
  const search = getFirstParam(params.q)?.trim() ?? "";
  const category = getFirstParam(params.category) ?? "";
  const availability = parseAvailability(getFirstParam(params.availability));
  const priceRange = getFirstParam(params.priceRange);
  const priceFilter = parsePriceRange(priceRange);
  const sort = parseSort(getFirstParam(params.sort));
  const filters: ProductFilters = {
    search,
    category: category || undefined,
    availability,
    minPrice: priceFilter.minPrice,
    maxPrice: priceFilter.maxPrice,
    sort,
  };
  const products = await getProductCards(filters);
  const databaseCategories = await getCategoryFilters();
  const categories = [{ name: "All Products", slug: "" }, ...databaseCategories];

  return (
    <main className={`${fredoka.className} bg-white`}>
      <section className="relative isolate overflow-hidden bg-[#f7fbf3] px-4 py-10 sm:px-6 sm:py-14 lg:min-h-[540px] lg:px-8 lg:py-16">
        <div className="absolute bottom-0 right-0 z-0 hidden aspect-square w-[52vw] max-w-[830px] translate-x-[5%] translate-y-[5%] rounded-full bg-[#e8f4df] lg:block" />
        <div className="pointer-events-none relative mx-auto mb-8 aspect-[1.26] w-full max-w-[500px] sm:max-w-[620px] lg:absolute lg:bottom-0 lg:right-0 lg:z-10 lg:mb-0 lg:h-[80%] lg:w-[52vw] lg:max-w-none">
          <Image
            src="/images/product-shop2.png"
            alt="Fresh grocery products arranged inside a shopping bag"
            fill
            priority
            sizes="(min-width: 1024px) 58vw, 94vw"
            className="object-contain object-right-bottom"
          />
        </div>

        <div className="relative z-20 mx-auto flex max-w-[1480px] items-center lg:min-h-[410px] lg:pb-0">
          <div className="mx-auto max-w-[620px] text-center sm:text-left lg:mx-0">
            <p className="inline-flex items-center gap-2 text-[13px] font-bold uppercase leading-none tracking-[0.18em] text-[#d5ae3e] sm:text-[14px]">
              <Leaf size={17} strokeWidth={2.4} />
              All Natural Products
            </p>
            <h1 className="mt-5 max-w-[620px] text-[44px] font-bold leading-[0.98] tracking-normal text-[#10221f] sm:text-[66px] lg:text-[78px]">
              Fresh and Healthy
              <span className="block text-[#5a9a4a]">Grocery Market</span>
            </h1>
            <p className="mx-auto mt-6 max-w-[520px] text-[16px] font-medium leading-7 text-[#5d675e] sm:mx-0 sm:text-[18px]">
              Shop pantry staples, snacks, drinks, dairy, frozen favorites, and
              ready meals selected to keep everyday grocery shopping simple and
              fresh.
            </p>
            <Link
              href="#shop-products"
              className="mt-8 inline-flex h-[50px] items-center justify-center gap-3 rounded-full bg-[#5a9a4a] px-8 text-[15px] font-bold leading-none text-white shadow-[0_14px_28px_rgba(90,154,74,0.22)] transition hover:-translate-y-0.5 hover:bg-[#4f8b42] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#d5ae3e]/35"
            >
              Shop Now
              <ArrowRight size={20} strokeWidth={2.3} />
            </Link>
          </div>
        </div>
      </section>

      <section
        id="shop-products"
        className="bg-white px-4 py-12 sm:px-6 lg:px-8 lg:py-16"
      >
        <div className="mx-auto max-w-[1480px]">
          <ProductRealtimeFilters
            categories={categories}
            productCount={products.length}
            currentSearch={search}
            currentCategory={category}
            currentAvailability={availability}
            currentPriceRange={priceRange}
            currentSort={sort}
          >
            {products.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="rounded-[8px] border border-[#e4eee6] bg-[#fbfdf8] px-6 py-12 text-center">
                <h3 className="text-[22px] font-bold text-[#1f3025]">
                  No products found
                </h3>
                <p className="mx-auto mt-3 max-w-[460px] text-[15px] font-medium leading-6 text-[#667167]">
                  No active database products match the current filters.
                </p>
              </div>
            )}
          </ProductRealtimeFilters>
        </div>
      </section>
    </main>
  );
}
