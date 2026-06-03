import Link from "next/link";
import { CheckCircle2, ClipboardList, PackageCheck, Truck } from "lucide-react";
import { Fredoka } from "next/font/google";

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const steps = [
  {
    title: "Direct Import",
    text: "Handpicked ingredients sourced straight from select producers.",
    icon: ClipboardList,
  },
  {
    title: "Reliable Logistics",
    text: "Strict quality control and dependable delivery for business orders.",
    icon: PackageCheck,
    featured: true,
  },
  {
    title: "Flexible Terms",
    text: "Competitive volume pricing and dedicated support for every account.",
    icon: Truck,
  },
  {
    title: "Premium Supply",
    text: "Quality ingredients for restaurants, grocery stores, and retailers.",
    icon: CheckCircle2,
  },
];

export default function AboutUs() {
  return (
    <section className={`${fredoka.className} overflow-hidden bg-white px-4 py-10 sm:px-6 lg:px-8 lg:py-14`}>
      <div className="mx-auto grid max-w-[1480px] items-center gap-10 lg:grid-cols-[0.92fr_1fr] lg:gap-16">
        <div className="grid max-w-[560px] grid-cols-1 gap-5 sm:grid-cols-2 sm:items-start">
          <div className="min-h-[190px] rounded-[24px] bg-white p-6 shadow-[0_18px_42px_rgba(15,23,42,0.12)] transition-transform duration-300 hover:-translate-y-1 sm:mt-8">
            <ClipboardList className="mb-4 text-[#2f6b61]" size={34} />
            <h3 className="text-[19px] font-bold leading-tight text-[#111111]">
              Direct Import
            </h3>
            <p className="mt-2 text-[14px] font-medium leading-snug text-[#65736c]">
              Handpicked selection straight from the source.
            </p>
          </div>

          <div className="min-h-[190px] rounded-[24px] bg-[#f7c437] p-6 text-[#2c140f] shadow-[0_20px_48px_rgba(247,196,55,0.28)] transition-transform duration-300 hover:-translate-y-1">
            <PackageCheck className="mb-4" size={36} />
            <h3 className="text-[19px] font-bold leading-tight">
              Reliable Logistics
            </h3>
            <p className="mt-2 text-[14px] font-medium leading-snug text-[#2c140f]/80">
              Strict quality control and fast, dependable delivery.
            </p>
          </div>

          <div className="min-h-[190px] rounded-[24px] bg-white p-6 shadow-[0_18px_42px_rgba(15,23,42,0.12)] transition-transform duration-300 hover:-translate-y-1">
            <Truck className="mb-4 text-[#2f6b61]" size={34} />
            <h3 className="text-[19px] font-bold leading-tight text-[#111111]">
              B2B Wholesale
            </h3>
            <p className="mt-2 text-[14px] font-medium leading-snug text-[#65736c]">
              Supplying restaurants, grocery stores, and retailers.
            </p>
          </div>

          <div className="min-h-[190px] rounded-[24px] bg-white p-6 shadow-[0_18px_42px_rgba(15,23,42,0.12)] transition-transform duration-300 hover:-translate-y-1 sm:mt-8">
            <CheckCircle2 className="mb-4 text-[#2f6b61]" size={34} />
            <h3 className="text-[19px] font-bold leading-tight text-[#111111]">
              Flexible Terms
            </h3>
            <p className="mt-2 text-[14px] font-medium leading-snug text-[#65736c]">
              Volume pricing and dedicated support for your business.
            </p>
          </div>
        </div>

        <div>
          <p className="mb-3 text-[16px] font-bold uppercase tracking-[0.14em] text-[#c3a844]">
            About us
          </p>
          <h2 className="max-w-[650px] text-[36px] font-bold leading-[1.1] text-[#2f6b61] sm:text-[46px]">
            Your B2B food wholesale partner
          </h2>
          <p className="mt-6 max-w-[720px] text-[18px] font-medium leading-8 text-[#52615b]">
            Welcome to Almfood AB. We supply premium ingredients directly to
            restaurants, grocery stores, and retailers. By importing directly
            from select producers worldwide, we cut out the middlemen for better
            pricing, full traceability, and uncompromising quality.
          </p>

          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            {steps.map((step) => {
              const Icon = step.icon;

              return (
                <div
                  className="flex gap-3 rounded-[18px] bg-[#f8fbf7] p-4"
                  key={step.title}
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f8f3df] text-[#2f6b61]">
                    <Icon size={20} />
                  </span>
                  <div>
                    <h3 className="text-[17px] font-bold leading-tight text-[#111111]">
                      {step.title}
                    </h3>
                    <p className="mt-1 text-[14px] font-medium leading-5 text-[#65736c]">
                      {step.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <Link
            href="/about"
            className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-[#f7c437] px-8 text-[16px] font-bold text-[#2c140f] shadow-[0_12px_28px_rgba(247,196,55,0.24)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#efb91c]"
          >
            Learn more
          </Link>
        </div>
      </div>
    </section>
  );
}
