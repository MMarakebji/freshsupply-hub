import Image from "next/image";
import Link from "next/link";
import { Fredoka } from "next/font/google";

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const categories = [
  {
    name: "Butter & Eggs",
    count: "5 products",
    href: "/products?category=butter-eggs",
    image:
      "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=420&q=80",
    bg: "bg-[#fff0de]",
    blob: "bg-[#f5ddc1]",
  },
  {
    name: "Dried",
    count: "4 products",
    href: "/products?category=dried",
    image:
      "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=420&q=80",
    bg: "bg-[#ecffe8]",
    blob: "bg-[#d6f7ce]",
  },
  {
    name: "Fresh Meat",
    count: "4 products",
    href: "/products?category=fresh-meat",
    image:
      "https://images.unsplash.com/photo-1603048297172-c92544798d5a?auto=format&fit=crop&w=420&q=80",
    bg: "bg-[#ffe5e9]",
    blob: "bg-[#f4cdd5]",
  },
  {
    name: "Fruits",
    count: "5 products",
    href: "/products?category=fruits",
    image:
      "https://images.unsplash.com/photo-1567870335471-c4218d320f8c?auto=format&fit=crop&w=420&q=80",
    bg: "bg-[#f0efff]",
    blob: "bg-[#dedcf1]",
  },
  {
    name: "Fruits & Vegetables",
    count: "6 products",
    href: "/products?category=fruits-vegetables",
    image:
      "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&w=420&q=80",
    bg: "bg-[#e8ffe6]",
    blob: "bg-[#cef8cb]",
  },
  {
    name: "Juice",
    count: "2 products",
    href: "/products?category=juice",
    image:
      "https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=420&q=80",
    bg: "bg-[#fff9d8]",
    blob: "bg-[#f3e899]",
  },
];

export default function HotCategories() {
  return (
    <section className={`${fredoka.className} bg-white px-4 py-8 sm:px-6 lg:px-8 lg:py-10`}>
      <div className="mx-auto max-w-[1710px]">
        <div className="mb-8 text-center">
          <h2 className="text-[32px] font-bold leading-none text-[#1f2d38] sm:text-[40px]">
            Hot categories
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {categories.map((category) => (
            <Link
              href={category.href}
              key={category.name}
              className="group relative block pt-14 outline-none"
              aria-label={`Shop ${category.name}`}
            >
              <div
                className={`absolute left-1/2 top-0 z-10 flex h-32 w-32 -translate-x-1/2 items-center justify-center overflow-hidden rounded-full ${category.bg} transition-transform duration-300 ease-out group-hover:-translate-y-2 group-hover:scale-105`}
              >
                <span
                  className={`absolute bottom-0 right-2 h-20 w-20 rounded-full ${category.blob}`}
                />
                <Image
                  src={category.image}
                  alt={category.name}
                  width={160}
                  height={160}
                  className="relative z-10 h-24 w-24 rounded-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                />
              </div>

              <div className="flex min-h-[178px] flex-col items-center justify-end rounded-[14px] bg-white px-4 pb-7 text-center shadow-[0_14px_34px_rgba(15,23,42,0.1)] transition-all duration-300 ease-out group-hover:-translate-y-1 group-hover:shadow-[0_20px_44px_rgba(15,23,42,0.15)] group-focus-visible:ring-4 group-focus-visible:ring-[#7bd51f]/35">
                <h3 className="text-[21px] font-bold leading-tight text-[#0f1720]">
                  {category.name}
                </h3>
                <p className="mt-2 text-[16px] font-medium leading-none text-[#0f1720]">
                  {category.count}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
