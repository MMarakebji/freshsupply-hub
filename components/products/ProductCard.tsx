import { ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export type ProductCardProduct = {
  id: string;
  name: string;
  category: string;
  image?: string;
  href?: string;
  price: string;
  oldPrice?: string;
  badges?: string[];
  statusBadge?: {
    label: string;
    tone: "muted" | "danger";
  };
  unavailable?: boolean;
  unit?: string;
  sku?: string;
};

type ProductCardProps = {
  product: ProductCardProduct;
};

export default function ProductCard({ product }: ProductCardProps) {
  const href = product.href ?? `/products/${product.id}`;
  const statusBadge =
    product.statusBadge ??
    (product.unavailable
      ? {
          label: "Out of Stock",
          tone: "muted" as const,
        }
      : null);

  return (
    <Link
      href={href}
      className="group relative block overflow-hidden rounded-[20px] border border-[#e4e8e5] bg-white px-5 pb-5 pt-5 shadow-[0_8px_20px_rgba(15,23,42,0.08)] outline-none transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_15px_32px_rgba(15,23,42,0.13)] focus-visible:ring-4 focus-visible:ring-[#2f6b61]/25"
      aria-label={`View ${product.name}`}
    >
      {statusBadge ? (
        <span
          className={`absolute left-7 top-7 z-20 rounded-full px-3 py-1.5 text-[12px] font-medium leading-none ${
            statusBadge.tone === "danger"
              ? "bg-[#ffe8e8] text-[#c91f1f]"
              : "bg-[#f1f1f1] text-black"
          }`}
        >
          {statusBadge.label}
        </span>
      ) : null}

      <div className="relative mb-4 flex aspect-[1.22] items-center justify-center overflow-hidden rounded-[15px] bg-white">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            width={260}
            height={210}
            unoptimized={product.image.startsWith("http")}
            className="h-[72%] w-[72%] object-contain transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <span className="text-[14px] font-bold text-[#9aa69c]">
            No image
          </span>
        )}
      </div>

      <div className="pr-10">
        <p className="mb-2 text-[14px] font-medium leading-none text-[#c3a844]">
          {product.category}
        </p>
        <h3 className="line-clamp-2 min-h-[40px] text-[16px] font-bold leading-tight text-[#111111]">
          {product.name}
        </h3>
        <p className="mt-2.5 text-[14px] font-medium leading-none text-[#111111]">
          {product.sku
            ? `Brand: ${product.sku}`
            : product.unit
              ? `Unit: ${product.unit}`
              : product.category}
        </p>
        <div className="mt-3.5 flex flex-wrap items-center gap-2 text-[18px] font-bold">
          {product.oldPrice ? (
            <span className="text-[#a9b0ac] line-through">{product.oldPrice}</span>
          ) : null}
          <span className="text-[#2f6b61]">{product.price}</span>
        </div>
      </div>

      <span className="absolute bottom-5 right-5 inline-flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#f4f5f4] text-[#2f6b61] transition-all duration-300 group-hover:bg-[#2f6b61] group-hover:text-white">
        <ShoppingBag size={19} strokeWidth={2} />
      </span>
    </Link>
  );
}
