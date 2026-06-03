import Image from "next/image";
import Link from "next/link";
import { Fredoka } from "next/font/google";
import AboutLearnMoreModal from "@/components/about/AboutLearnMoreModal";

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const reasons = [
  {
    title: "Direct Import",
    text: "Handpicked selection sourced straight from select producers worldwide.",
    image: "/images/about-board-t.png",
  },
  {
    title: "Reliable Logistics",
    text: "Strict quality control and fast, dependable delivery for wholesale orders.",
    image: "/images/about-map-t.png",
  },
  {
    title: "Flexible Terms",
    text: "Competitive volume pricing and dedicated support for restaurants and retailers.",
    image: "/images/about-leaf-t.png",
  },
];

const stats = [
  { value: "40+", label: "Wholesale Products" },
  { value: "459+", label: "Business Clients" },
  { value: "12k+", label: "Orders Supplied" },
];

export default function AboutPage() {
  return (
    <main className={`${fredoka.className} bg-white`}>
      <section className="relative isolate overflow-hidden bg-white px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="mx-auto grid max-w-[1480px] items-center gap-10 lg:min-h-[650px] lg:grid-cols-[0.88fr_1.12fr] lg:gap-8">
          <div className="relative z-20 text-center sm:text-left">
            <p className="text-[15px] font-semibold uppercase leading-none tracking-normal text-[#d5ae3e] sm:text-[17px]">
              About Almfood AB
            </p>
            <h1 className="mt-5 text-[44px] font-bold leading-[1.08] tracking-normal text-[#101510] sm:text-[64px] lg:text-[78px]">
              Supplying
              <span className="text-[#6d9659]"> premium food</span>
              <span className="block">for growing businesses</span>
            </h1>
            <p className="mx-auto mt-6 max-w-[560px] text-[17px] font-medium leading-8 text-[#313a32] sm:mx-0 sm:text-[20px]">
              Welcome to Almfood AB, your B2B food wholesale partner. We supply
              premium ingredients directly to restaurants, grocery stores, and
              retailers with better pricing, full traceability, and
              uncompromising quality.
            </p>
            <Link
              href="/products"
              className="mt-8 inline-flex h-[54px] min-w-[168px] items-center justify-center rounded-full bg-[#5a9a4a] px-8 text-[18px] font-semibold leading-none text-white shadow-[0_16px_30px_rgba(90,154,74,0.25)] transition hover:-translate-y-0.5 hover:bg-[#4f8b42] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#d5ae3e]/40"
            >
              Shop Now
            </Link>
          </div>

          <div className="relative z-10 mx-auto aspect-square w-full max-w-[660px] lg:max-w-[760px]">
            <Image
              src="/images/hero-plate1.png"
              alt="Healthy foods arranged around a rice plate"
              fill
              priority
              sizes="(min-width: 1024px) 54vw, 92vw"
              className="object-contain"
            />
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-14 sm:px-6 sm:py-18 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-[1280px] items-center gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16">
          <div className="text-center sm:text-left">
            <h2 className="text-[42px] font-bold leading-tight tracking-normal text-[#10221f] sm:text-[56px] lg:text-[68px]">
              About Us
            </h2>
            <p className="mx-auto mt-6 max-w-[520px] text-[20px] font-medium leading-[1.7] text-[#252a32] sm:mx-0 sm:text-[24px]">
              By importing directly from select producers worldwide, we cut out
              the middlemen. This gives your business access to dependable
              supply, competitive volume pricing, and ingredients selected for
              consistent wholesale quality.
            </p>
            <AboutLearnMoreModal />
          </div>

          <div className="relative mx-auto aspect-[867/871] w-full max-w-[720px]">
            <Image
              src="/images/about-us-section2.png"
              alt="Fresh groceries and prepared foods arranged in a clean collage"
              fill
              sizes="(min-width: 1024px) 54vw, 92vw"
              className="object-contain"
            />
          </div>
        </div>
      </section>

      <section
        id="why-choose-us"
        className="bg-white px-4 py-12 sm:px-6 lg:px-8 lg:py-16"
      >
        <div className="mx-auto max-w-[1120px] text-center">
          <h2 className="text-[34px] font-bold leading-tight text-[#1f3025] sm:text-[42px]">
            Why Choose Us?
          </h2>
          <p className="mx-auto mt-3 max-w-[560px] text-[16px] font-medium leading-7 text-[#68746b]">
            Almfood AB helps restaurants, grocery stores, and retailers source
            premium ingredients with direct importing, reliable logistics, and
            flexible terms.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {reasons.map((reason) => (
              <article key={reason.title} className="px-4">
                <div className="relative mx-auto h-24 w-24">
                  <Image
                    src={reason.image}
                    alt=""
                    fill
                    sizes="96px"
                    className="object-contain"
                  />
                </div>
                <h3 className="mt-5 text-[19px] font-bold leading-tight text-[#1f3025]">
                  {reason.title}
                </h3>
                <p className="mx-auto mt-3 max-w-[250px] text-[14px] font-medium leading-6 text-[#68746b]">
                  {reason.text}
                </p>
              </article>
            ))}
          </div>

          <div className="mx-auto mt-12 grid max-w-[760px] grid-cols-1 gap-6 border-t border-[#e2ebdf] pt-9 sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-[32px] font-bold leading-none text-[#1f3025]">
                  {stat.value}
                </p>
                <p className="mt-2 text-[14px] font-medium text-[#68746b]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
