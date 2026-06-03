import Image from "next/image";
import Link from "next/link";
import { Fredoka } from "next/font/google";
import { Beef, Milk, Package, Snowflake, Wheat } from "lucide-react";
import { getCategoryFilters } from "@/features/categories/categoryApi";

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const categories = [
  { label: "Pantry", slug: "pantry", icon: Wheat },
  { label: "Snacks", slug: "snacks", icon: Package },
  { label: "Dairy", slug: "dairy", icon: Milk },
  { label: "Frozen", slug: "frozen", icon: Snowflake },
  { label: "Ready Food", slug: "ready-food", icon: Beef },
];

export default async function HeroSection() {
  const categoryFilters = await getCategoryFilters();

  return (
    <section
      className={`${fredoka.className} relative isolate min-h-[calc(100svh-80px)] w-full overflow-hidden bg-[#fbfaf4]`}
    >
      <Image
        src="/images/hero2-background.png"
        alt="Fresh pantry foods, herbs, drinks, and ready meals arranged around a clean table"
        fill
        priority
        sizes="100vw"
        className="z-0 object-cover object-center"
      />
      <div className="absolute inset-0 z-10 bg-[#fbfaf4]/42 sm:bg-[#fbfaf4]/16" />

      <div className="relative z-20 mx-auto flex min-h-[calc(100svh-80px)] max-w-[1180px] flex-col items-center justify-center px-4 py-6 text-center sm:px-6 sm:py-7 lg:px-8">
        <p className="text-[10px] font-bold uppercase leading-none tracking-[0.32em] text-[#34402b] sm:text-[11px]">
          For Fresh Tables
        </p>

        <div className="mt-5 flex w-full max-w-[350px] flex-wrap justify-center gap-x-4 gap-y-3 text-[#495536] sm:mt-8 sm:grid sm:max-w-[620px] sm:grid-cols-5 sm:gap-5">
          {categories.map((category) => {
            const Icon = category.icon;
            const matchingCategory = categoryFilters.find(
              (filter) =>
                filter.slug === category.slug ||
                filter.name.toLowerCase() === category.label.toLowerCase()
            );
            const categorySlug = matchingCategory?.slug ?? category.slug;

            return (
              <Link
                href={`/products?category=${encodeURIComponent(categorySlug)}`}
                key={category.label}
                className="group flex w-[58px] flex-col items-center gap-1.5 sm:w-auto sm:gap-2"
                aria-label={`Shop ${category.label}`}
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#c9d1bc] bg-[#eef3e7]/84 text-[#586743] shadow-[0_7px_18px_rgba(52,64,43,0.08)] transition group-hover:-translate-y-0.5 group-hover:bg-white sm:h-14 sm:w-14">
                  <Icon size={22} strokeWidth={1.8} />
                </span>
                <span className="text-[11px] font-bold leading-tight sm:text-[17px] sm:leading-none">
                  {category.label}
                </span>
              </Link>
            );
          })}
        </div>

        <div className="mt-6 max-w-[760px] sm:mt-8">
          <p className="text-[16px] font-bold leading-none text-[#495536] sm:text-[27px]">
            Fresh food for every home
          </p>
          <h1 className="mt-4 text-[clamp(2.55rem,13vw,3.45rem)] font-bold leading-[0.88] tracking-normal text-[#46512f] sm:mt-5 sm:text-[82px] lg:text-[104px]">
            Almfood AB
            <span className="block">Fresh Daily</span>
          </h1>
          <p className="mx-auto mt-5 max-w-[340px] text-[14px] font-medium leading-6 text-[#3f4536] sm:mt-8 sm:max-w-[590px] sm:text-[16px] sm:leading-7">
            Stock your kitchen with crisp produce, pantry essentials, snacks,
            dairy, frozen favorites, and ready meals selected for real everyday
            freshness.
          </p>
          <Link
            href="/products"
            className="mt-6 inline-flex h-[44px] min-w-[150px] items-center justify-center rounded-full bg-[#91aa76] px-7 text-[10px] font-bold uppercase leading-none tracking-[0.26em] text-white shadow-[0_14px_26px_rgba(72,88,49,0.2)] transition hover:-translate-y-0.5 hover:bg-[#7d9863] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#d5ae3e]/40 sm:mt-8 sm:h-[46px] sm:min-w-[162px] sm:px-8 sm:text-[11px] sm:tracking-[0.28em]"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </section>
  );
}
