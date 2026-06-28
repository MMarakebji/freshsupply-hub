"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowRight, CheckCircle2, PackageCheck, Truck, X } from "lucide-react";

const highlights = [
  {
    title: "Direct Sourcing & Traceability",
    text: "Working directly with selected producers allows us to maintain clear product traceability and consistent quality throughout the supply chain.",
    icon: CheckCircle2,
  },
  {
    title: "Competitive Wholesale Pricing",
    text: "Direct sourcing helps reduce costs in the supply chain, enabling competitive volume pricing and long-term value for our customers.",
    icon: Truck,
  },
  {
    title: "Reliable Supply & Logistics",
    text: "We combine quality control with efficient logistics to ensure dependable deliveries and consistent product availability for restaurants, grocery retailers, and professional buyers.",
    icon: PackageCheck,
  },
];

export default function AboutLearnMoreModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="mt-9 inline-flex h-[58px] min-w-[190px] items-center justify-center gap-4 rounded-full bg-[#55ad57] px-8 text-[19px] font-bold leading-none text-white shadow-[0_16px_30px_rgba(85,173,87,0.22)] transition hover:-translate-y-0.5 hover:bg-[#489d4a] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#55ad57]/25"
      >
        Learn More
        <ArrowRight size={24} strokeWidth={2.4} />
      </button>

      {isOpen
        ? createPortal(
            <div
              className="fixed inset-0 z-[9999] flex min-h-screen items-center justify-center overflow-y-auto bg-black/45 px-4 py-8"
              role="dialog"
              aria-modal="true"
              aria-labelledby="about-learn-more-title"
              onMouseDown={() => setIsOpen(false)}
            >
              <div
                className="w-full max-w-[720px] rounded-[8px] bg-white p-6 text-left shadow-[0_24px_70px_rgba(15,23,42,0.25)] sm:p-8"
                onMouseDown={(event) => event.stopPropagation()}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[13px] font-bold uppercase leading-none tracking-[0.14em] text-[#d5ae3e]">
                      B2B wholesale supply
                    </p>
                    <h2
                      id="about-learn-more-title"
                      className="mt-3 text-[28px] font-bold leading-tight text-[#10221f] sm:text-[36px]"
                    >
                      How Almfood AB Supports Your Business
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#dfe8dd] text-[#31583d] transition hover:bg-[#f4faf2]"
                    aria-label="Close about details popup"
                  >
                    <X size={19} strokeWidth={2.2} />
                  </button>
                </div>

                <p className="mt-5 text-[16px] font-medium leading-7 text-[#52615b] sm:text-[18px]">
                  Almfood AB supplies restaurants, grocery retailers, and
                  professional buyers with products sourced directly from
                  producers worldwide. Direct sourcing allows us to offer
                  competitive pricing, reliable traceability, and consistent
                  quality while maintaining a stable supply chain.
                </p>

                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  {highlights.map((highlight) => {
                    const Icon = highlight.icon;

                    return (
                      <article
                        key={highlight.title}
                        className="rounded-[8px] border border-[#e2ebdf] bg-[#fbfdf8] p-4"
                      >
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#edf6ea] text-[#31583d]">
                          <Icon size={20} strokeWidth={2.2} />
                        </span>
                        <h3 className="mt-4 text-[17px] font-bold leading-tight text-[#1f3025]">
                          {highlight.title}
                        </h3>
                        <p className="mt-2 text-[14px] font-medium leading-6 text-[#667167]">
                          {highlight.text}
                        </p>
                      </article>
                    );
                  })}
                </div>

                <p className="mt-6 rounded-[8px] bg-[#f8f3df] px-5 py-4 text-[15px] font-bold leading-6 text-[#2c140f]">
                  The result is a dependable wholesale partnership with quality
                  products, traceable sourcing, reliable delivery, and flexible
                  support adapted to your purchasing requirements.
                </p>
              </div>
            </div>,
            document.body
          )
        : null}
    </>
  );
}
