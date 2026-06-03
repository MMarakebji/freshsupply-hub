import { Award, Leaf, PackageCheck, ShieldCheck, Truck } from "lucide-react";
import { Fredoka } from "next/font/google";

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const highlights = [
  {
    title: "Fresh Every Day",
    text: "Daily-picked groceries selected for quality, color, and flavor.",
    icon: Leaf,
  },
  {
    title: "Fast Delivery",
    text: "Quick local delivery keeps your food fresh from store to door.",
    icon: Truck,
  },
  {
    title: "Quality Checked",
    text: "Every order is packed carefully before it leaves our shop.",
    icon: PackageCheck,
  },
  {
    title: "Trusted Products",
    text: "Reliable pantry staples, produce, snacks, and household essentials.",
    icon: ShieldCheck,
  },
  {
    title: "Best Value",
    text: "Almfood AB brings fair prices and useful deals for every meal.",
    icon: Award,
  },
];

export default function HomeHighlights() {
  return (
    <section className={`${fredoka.className} bg-white px-4 py-7 sm:px-6 lg:px-8`}>
      <div className="mx-auto grid max-w-[1020px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
        {highlights.map((item) => {
          const Icon = item.icon;

          return (
            <article
              className="group rounded-[14px] border border-[#e4eee6] bg-[#f4faf2] px-5 py-5 text-center shadow-[0_8px_22px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#eef8ec] hover:shadow-[0_14px_32px_rgba(15,23,42,0.09)] lg:col-span-2 lg:[&:nth-child(4)]:col-start-2"
              key={item.title}
            >
              <span className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#2f6b61] shadow-sm transition-transform duration-300 group-hover:scale-110">
                <Icon size={23} strokeWidth={2} />
              </span>
              <h3 className="text-[17px] font-bold leading-tight text-[#14231f]">
                {item.title}
              </h3>
              <p className="mx-auto mt-2 max-w-[190px] text-[13px] font-medium leading-5 text-[#65736c]">
                {item.text}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
