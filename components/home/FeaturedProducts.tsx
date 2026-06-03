import Link from "next/link";
import { Fredoka } from "next/font/google";
import ProductCard, { type ProductCardProduct } from "@/components/products/ProductCard";
import { fallbackProductCards } from "@/features/products/fallbackProducts";

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const tabs = ["All product", "Organic Produce", "Fresh Vegetables", "Fresh Fruit"];

type FeaturedProductsProps = {
  products?: ProductCardProduct[];
};

export default function FeaturedProducts({
  products = fallbackProductCards,
}: FeaturedProductsProps) {
  return (
    <section className={`${fredoka.className} bg-white px-4 py-7 sm:px-6 lg:px-8 lg:py-9`}>
      <div className="mx-auto max-w-[1480px]">
        <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="text-[30px] font-bold leading-none text-[#2f6b61] sm:text-[36px]">
            Our Products
          </h2>

          <nav className="flex flex-wrap items-center gap-2 sm:gap-5" aria-label="Product categories">
            {tabs.map((tab, index) => (
              <Link
                href={index === 0 ? "/products" : `/products?category=${tab.toLowerCase().replaceAll(" ", "-")}`}
                key={tab}
                className={`rounded-xl px-3.5 py-2.5 text-[14px] font-medium leading-none transition-colors ${
                  index === 0
                    ? "bg-[#f8f3df] text-[#2f6b61]"
                    : "text-black hover:bg-[#f8f3df] hover:text-[#2f6b61]"
                }`}
              >
                {tab}
              </Link>
            ))}
          </nav>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
