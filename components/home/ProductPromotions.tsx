import Image from "next/image";
import Link from "next/link";
import { Fredoka } from "next/font/google";

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function ProductPromotions() {
  return (
    <section className={`${fredoka.className} w-full bg-white px-4 py-7 sm:px-6 lg:px-8 lg:py-9`}>
      <div className="mx-auto grid max-w-[1680px] grid-cols-1 gap-4 lg:grid-cols-[2.25fr_1fr] lg:gap-5">
        <Link
          href="/products"
          className="group relative block min-h-[320px] overflow-hidden rounded-[24px] shadow-sm outline-none transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.01] hover:shadow-xl focus-visible:ring-4 focus-visible:ring-[#f7c437]/45 sm:min-h-[390px] lg:min-h-[470px]"
          aria-label="Shop fresh everyday grocery products"
        >
          <Image
            src="/images/hero-1.png"
            alt="Grocery pantry products"
            fill
            priority
            sizes="(min-width: 1024px) 68vw, 100vw"
            className="object-cover object-[63%_50%] transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-white/62 backdrop-blur-[3px] lg:hidden" />

          <div className="relative z-10 flex min-h-[320px] max-w-[660px] flex-col justify-center px-6 py-8 sm:min-h-[390px] sm:px-12 lg:min-h-[470px] lg:px-[76px]">
            <h1 className="text-[38px] font-bold leading-[1.08] tracking-normal text-[#2c140f] sm:text-[56px] lg:text-[64px]">
              The Fresh
              <br />
              Everyday Grocery
            </h1>
            <p className="mt-5 text-[22px] font-medium leading-tight text-[#2b1712] sm:text-[32px]">
              Your one-stop shop for every meal.
            </p>
            <p className="mt-5 text-[17px] font-medium leading-tight text-[#2b1712] sm:text-[23px]">
              Starting from $5.99 for select items.
            </p>
            <span
              className="mt-8 inline-flex h-[52px] w-fit min-w-[176px] items-center justify-center rounded-lg bg-[#f7c437] px-7 text-[19px] font-bold text-[#27140f] shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] transition duration-300 group-hover:bg-[#efb91c]"
            >
              Shop Now
            </span>
          </div>
        </Link>

        <aside className="grid grid-cols-1 gap-4 lg:gap-5">
          <Link
            href="/products"
            className="group relative block min-h-[220px] overflow-hidden rounded-[24px] shadow-sm outline-none transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.01] hover:shadow-xl focus-visible:ring-4 focus-visible:ring-[#f7c437]/45"
            aria-label="Fresh produce specials coming soon"
          >
            <Image
              src="/images/hero-2.png"
              alt="Fresh dairy and juice"
              fill
              priority
              sizes="(min-width: 1024px) 30vw, 100vw"
              className="object-cover object-[65%_50%] transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-white/58 backdrop-blur-[3px] lg:hidden" />
            <div className="relative z-10 flex min-h-[220px] items-center px-7 py-7 sm:px-9">
              <h2 className="max-w-[300px] text-[28px] font-bold leading-[1.12] text-[#2f180f] sm:text-[33px]">
                Fresh Produce
                <br />
                Specials
                <br />
                Coming Soon
              </h2>
            </div>
          </Link>

          <Link
            href="/products"
            className="group relative block min-h-[220px] overflow-hidden rounded-[24px] shadow-sm outline-none transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.01] hover:shadow-xl focus-visible:ring-4 focus-visible:ring-[#f7c437]/45"
            aria-label="Ready-to-eat gourmet meals and frozen classics coming soon"
          >
            <Image
              src="/images/hero-3.png"
              alt="Ready to eat gourmet meal"
              fill
              priority
              sizes="(min-width: 1024px) 30vw, 100vw"
              className="object-cover object-[58%_50%] transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-black/42 backdrop-blur-[3px] lg:hidden" />
            <div className="relative z-10 flex min-h-[220px] items-center px-7 py-7 sm:px-9">
              <h2 className="max-w-[330px] text-[28px] font-bold leading-[1.14] text-white sm:text-[33px]">
                Ready-to-Eat
                <br />
                Gourmet Meals &
                <br />
                Frozen Classics
                <br />
                Coming Soon
              </h2>
            </div>
          </Link>
        </aside>
      </div>
    </section>
  );
}
