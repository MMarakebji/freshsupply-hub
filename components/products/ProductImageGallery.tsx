"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";

type ProductImageGalleryProps = {
  productName: string;
  mainImage?: string;
  thumbnails: string[];
};

export default function ProductImageGallery({
  productName,
  mainImage,
  thumbnails,
}: ProductImageGalleryProps) {
  const images = useMemo(
    () => Array.from(new Set([mainImage, ...thumbnails].filter(Boolean))) as string[],
    [mainImage, thumbnails]
  );
  const [selectedImage, setSelectedImage] = useState(images[0]);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  if (!selectedImage) {
    return (
      <div className="relative aspect-square overflow-hidden rounded-[8px] border border-[#e4eee6] bg-[#f4faf2]">
        <div className="flex h-full items-center justify-center text-[16px] font-bold text-[#9aa69c]">
          No image
        </div>
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setIsZoomOpen(true)}
        className="group relative block aspect-square w-full overflow-hidden rounded-[8px] border border-[#e4eee6] bg-[#f4faf2] text-left"
        aria-label={`Zoom ${productName} image`}
      >
        <Image
          src={selectedImage}
          alt={productName}
          fill
          priority
          sizes="(min-width: 1024px) 46vw, 92vw"
          unoptimized={selectedImage.startsWith("http")}
          className="object-contain p-12 transition duration-300 group-hover:scale-[1.04]"
        />
        <span className="absolute bottom-4 right-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#31583d] shadow-[0_10px_24px_rgba(15,23,42,0.12)]">
          <Search size={18} strokeWidth={2.2} />
        </span>
      </button>

      {images.length > 1 ? (
        <div className="mt-4 grid grid-cols-4 gap-3">
          {images.map((thumbnail, index) => (
            <button
              key={`${thumbnail}-${index}`}
              type="button"
              onClick={() => setSelectedImage(thumbnail)}
              className={`relative aspect-square overflow-hidden rounded-[8px] border bg-white transition hover:border-[#5a9a4a] ${
                thumbnail === selectedImage
                  ? "border-[#5a9a4a]"
                  : "border-[#e4eee6]"
              }`}
              aria-label={`View ${productName} image ${index + 1}`}
            >
              <Image
                src={thumbnail}
                alt=""
                fill
                sizes="120px"
                unoptimized={thumbnail.startsWith("http")}
                className="object-contain p-3"
              />
            </button>
          ))}
        </div>
      ) : null}

      {isZoomOpen ? (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setIsZoomOpen(false)}
        >
          <button
            type="button"
            className="absolute right-5 top-5 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#10221f]"
            aria-label="Close image zoom"
            onClick={() => setIsZoomOpen(false)}
          >
            <X size={21} strokeWidth={2.2} />
          </button>
          <div
            className="relative h-[86vh] w-full max-w-[1100px]"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={selectedImage}
              alt={productName}
              fill
              sizes="95vw"
              unoptimized={selectedImage.startsWith("http")}
              className="object-contain"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
