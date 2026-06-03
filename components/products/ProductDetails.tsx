import Link from "next/link";
import {
  ArrowLeft,
  Minus,
  Plus,
  ShieldCheck,
  Star,
  Truck,
} from "lucide-react";
import ProductImageGallery from "@/components/products/ProductImageGallery";

export type ProductDetailProduct = {
  id: string;
  name: string;
  category: string;
  image?: string;
  price: string;
  oldPrice?: string;
  sku: string;
  description: string;
  badge?: string;
  rating?: number;
  reviews?: number;
  thumbnails: string[];
  sizes: string[];
  packs: string[];
};

type ProductDetailsProps = {
  product: ProductDetailProduct;
};

export default function ProductDetails({ product }: ProductDetailsProps) {
  return (
    <section className="bg-white px-4 py-12 sm:px-6 lg:px-8 lg:py-18">
      <div className="mx-auto mb-6 max-w-[1180px]">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-[15px] font-bold leading-none text-[#31583d] transition hover:text-[#5a9a4a] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#5a9a4a]/20"
        >
          <ArrowLeft size={20} strokeWidth={2.4} />
          Back to Shop
        </Link>
      </div>

      <div className="mx-auto grid max-w-[1180px] gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
        <div>
          <ProductImageGallery
            productName={product.name}
            mainImage={product.image}
            thumbnails={product.thumbnails}
          />
        </div>

        <div className="flex flex-col justify-center">
          <p className="text-[14px] font-bold uppercase leading-none tracking-normal text-[#d5ae3e]">
            {product.category}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <h1 className="text-[36px] font-bold leading-tight text-[#10221f] sm:text-[48px]">
              {product.name}
            </h1>
            {product.badge ? (
              <span className="rounded-full bg-[#edf6ea] px-3 py-1 text-[12px] font-bold leading-none text-[#31583d]">
                {product.badge}
              </span>
            ) : null}
          </div>

          {product.rating && product.reviews ? (
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1 text-[#d5ae3e]">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    size={18}
                    strokeWidth={2}
                    fill={
                      index < Math.round(product.rating ?? 0)
                        ? "currentColor"
                        : "none"
                    }
                  />
                ))}
              </div>
              <p className="text-[14px] font-medium text-[#667167]">
                {product.rating.toFixed(1)} rating · {product.reviews} reviews
              </p>
            </div>
          ) : null}

          <div className="mt-5 flex flex-wrap items-end gap-3">
            <p className="text-[30px] font-bold leading-none text-[#5a9a4a]">
              {product.price}
            </p>
            {product.oldPrice ? (
              <p className="text-[18px] font-bold leading-none text-[#a9b0ac] line-through">
                {product.oldPrice}
              </p>
            ) : null}
          </div>

          {product.description ? (
            <p className="mt-5 max-w-[620px] text-[16px] font-medium leading-7 text-[#667167]">
              {product.description}
            </p>
          ) : null}

          {product.sizes.length > 0 || product.packs.length > 0 ? (
            <div className="mt-7 space-y-5">
              {product.sizes.length > 0 ? (
                <div>
                  <h2 className="text-[15px] font-bold leading-none text-[#1f3025]">
                    Best Size
                  </h2>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {product.sizes.map((size, index) => (
                      <button
                        key={`${size}-${index}`}
                        type="button"
                        className="rounded-full bg-[#f4faf2] px-4 py-2 text-[14px] font-bold leading-none text-[#667167] ring-1 ring-[#dfe8dd] transition hover:text-[#31583d]"
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              {product.packs.length > 0 ? (
                <div>
                  <h2 className="text-[15px] font-bold leading-none text-[#1f3025]">
                    Pack Type
                  </h2>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {product.packs.map((pack, index) => (
                      <button
                        key={`${pack}-${index}`}
                        type="button"
                        className="rounded-full bg-white px-4 py-2 text-[14px] font-bold leading-none text-[#667167] ring-1 ring-[#dfe8dd] transition hover:bg-[#f4faf2] hover:text-[#31583d]"
                      >
                        {pack}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex h-12 w-[136px] items-center justify-between rounded-full border border-[#dfe8dd] bg-white px-4 text-[#31583d]">
              <button type="button" aria-label="Decrease quantity">
                <Minus size={18} strokeWidth={2.2} />
              </button>
              <span className="text-[16px] font-bold text-[#1f3025]">1</span>
              <button type="button" aria-label="Increase quantity">
                <Plus size={18} strokeWidth={2.2} />
              </button>
            </div>

            <Link
              href="/contact"
              className="inline-flex h-12 items-center justify-center rounded-full bg-[#d5ae3e] px-7 text-[15px] font-bold leading-none text-[#241a0b] shadow-[0_14px_28px_rgba(213,174,62,0.2)] transition hover:-translate-y-0.5 hover:bg-[#cda232] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#d5ae3e]/35"
            >
              Buy Now
            </Link>

          </div>

          <div className="mt-8 grid gap-3 border-t border-[#e4eee6] pt-6 text-[14px] font-medium text-[#667167] sm:grid-cols-2">
            <p>
              <span className="font-bold text-[#1f3025]">Slug:</span>{" "}
              {product.sku}
            </p>
            <p>
              <span className="font-bold text-[#1f3025]">Type:</span>{" "}
              {product.category}
            </p>
            <p className="flex items-center gap-2">
              <Truck size={18} strokeWidth={2.2} className="text-[#5a9a4a]" />
              Fast local delivery
            </p>
            <p className="flex items-center gap-2">
              <ShieldCheck
                size={18}
                strokeWidth={2.2}
                className="text-[#5a9a4a]"
              />
              Quality checked products
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
