import Image from "next/image";
import Link from "next/link";
import { Fredoka } from "next/font/google";
import {
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  Store,
} from "lucide-react";
import { submitContactMessage } from "./actions";
import { getSiteContent } from "@/features/siteContent/siteContentApi";

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const fallbackContact = {
  title: "Contact Almfood AB",
  content:
    "Have questions about products, orders, or delivery? Our team is here to help you find fresh groceries, get order support, and make every shopping experience simple.",
  phone: "+961 00 000 000",
  email: "hello@almfoodab.com",
  address: "Stockholm, Sweden",
};

function toPhoneHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

function toWhatsappHref(phone: string) {
  return `https://wa.me/${phone.replace(/\D/g, "")}`;
}

function toMapHref(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    address
  )}`;
}

export default async function ContactPage() {
  const content = await getSiteContent("contact").catch(() => null);
  const title = content?.title ?? fallbackContact.title;
  const description = content?.content ?? fallbackContact.content;
  const phone = content?.phone ?? fallbackContact.phone;
  const email = content?.email ?? fallbackContact.email;
  const address = content?.address ?? fallbackContact.address;
  const contactCards = [
    {
      title: "Phone",
      detail: phone,
      icon: Phone,
      href: toPhoneHref(phone),
    },
    {
      title: "WhatsApp",
      detail: phone,
      icon: MessageCircle,
      href: toWhatsappHref(phone),
    },
    {
      title: "Email",
      detail: email,
      icon: Mail,
      href: `mailto:${email}`,
    },
    {
      title: "Our Shop",
      detail: address,
      icon: Store,
      href: toMapHref(address),
    },
  ];

  return (
    <main className={`${fredoka.className} bg-white`}>
      <section className="relative isolate min-h-[calc(100svh-80px)] overflow-hidden bg-[#f3f9ee]">
        <Image
          src="/images/contact-us-background2.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="z-0 object-cover object-center"
        />
        <div className="absolute inset-0 z-10 bg-[#f3f9ee]/10" />

        <div className="relative z-30 mx-auto flex min-h-[calc(100svh-80px)] max-w-[1180px] flex-col items-center px-4 pb-[46vh] pt-12 text-center sm:px-6 sm:pb-[48vh] sm:pt-16 lg:px-8 lg:pb-[50vh] lg:pt-20">
          <p className="text-[18px] font-bold leading-none text-[#d5a022] sm:text-[24px]">
            Welcome To
          </p>
          <h1 className="mt-3 text-[34px] font-bold leading-tight tracking-normal text-[#1a2720] sm:text-[48px] lg:text-[58px]">
            {title}
          </h1>
          <p className="mt-4 max-w-[560px] text-[14px] font-medium leading-6 text-[#314035] sm:text-[17px] sm:leading-7">
            {description}
          </p>
          <Link
            href={`mailto:${email}`}
            className="mt-6 inline-flex h-[46px] items-center justify-center rounded-full bg-[#5a9a4a] px-8 text-[15px] font-bold leading-none text-white shadow-[0_14px_28px_rgba(90,154,74,0.24)] transition hover:-translate-y-0.5 hover:bg-[#4f8b42] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#d5ae3e]/35"
          >
            Get In Touch
          </Link>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 mx-auto h-[46vh] max-h-[410px] min-h-[250px] w-full sm:h-[48vh] sm:max-h-[460px] lg:h-[52vh] lg:max-h-[520px]">
          <Image
            src="/images/contact-us-products.png"
            alt="Almfood AB grocery products including rice, oil, milk, snacks, canned goods, and ready meals"
            fill
            priority
            sizes="(min-width: 1024px) 76vw, 116vw"
            className="object-contain object-bottom"
          />
        </div>
      </section>

      <section className="bg-white px-4 py-14 sm:px-6 sm:py-18 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-[1180px] items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div className="flex h-full flex-col justify-center">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {contactCards.map((item) => {
                const Icon = item.icon;

                return (
                  <a
                    key={item.title}
                    href={item.href}
                    target={item.href.startsWith("https://") ? "_blank" : undefined}
                    rel={
                      item.href.startsWith("https://")
                        ? "noreferrer"
                        : undefined
                    }
                    className="group flex min-h-[150px] flex-col items-center justify-center rounded-[8px] border border-[#dfeadd] bg-[#f4faf2] px-5 py-6 text-center shadow-[0_10px_24px_rgba(49,88,61,0.06)] transition hover:-translate-y-1 hover:border-[#b9d6b6] hover:bg-[#edf8eb] hover:shadow-[0_16px_34px_rgba(49,88,61,0.12)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#5a9a4a]/20"
                  >
                    <Icon
                      size={34}
                      strokeWidth={2.3}
                      className="text-[#31583d] transition group-hover:text-[#5a9a4a]"
                    />
                    <h2 className="mt-4 text-[18px] font-bold leading-none text-[#1f3025]">
                      {item.title}
                    </h2>
                    <p className="mt-3 text-[14px] font-medium leading-5 text-[#667167]">
                      {item.detail}
                    </p>
                  </a>
                );
              })}
            </div>

            <div className="mt-5 overflow-hidden rounded-[8px] border border-[#e4eee6] bg-[#f4faf2] shadow-[0_10px_24px_rgba(49,88,61,0.06)]">
              <div className="flex items-center gap-2 border-b border-[#e4eee6] bg-white px-4 py-3 text-[#31583d]">
                <MapPin size={19} strokeWidth={2.3} />
                <p className="text-[15px] font-bold leading-none">
                  Find Almfood AB
                </p>
              </div>
              <iframe
                title="Almfood AB location map"
                src="https://www.openstreetmap.org/export/embed.html?bbox=17.90%2C59.25%2C18.20%2C59.40&layer=mapnik&marker=59.3293%2C18.0686"
                className="h-[260px] w-full border-0"
                loading="lazy"
              />
            </div>
          </div>

          <div>
            <p className="text-[16px] font-bold uppercase leading-none tracking-normal text-[#d5ae3e]">
              Contact Us
            </p>
            <h2 className="mt-3 text-[40px] font-bold leading-tight tracking-normal text-[#10221f] sm:text-[54px]">
              Get In Touch
            </h2>
            <p className="mt-4 max-w-[620px] text-[16px] font-medium leading-7 text-[#667167]">
              {description}
            </p>

            <form
              action={submitContactMessage}
              className="mt-8 space-y-5 rounded-[8px] border border-[#e4eee6] bg-[#fbfdf8] p-5 shadow-[0_14px_34px_rgba(49,88,61,0.07)] sm:p-6"
            >
              <div>
                <label
                  htmlFor="name"
                  className="text-[14px] font-bold leading-none text-[#1f3025]"
                >
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="Your name"
                  className="mt-2 h-12 w-full rounded-[8px] border border-[#dfe8dd] bg-white px-4 text-[15px] font-medium text-[#1f3025] outline-none transition placeholder:text-[#a4aea5] focus:border-[#5a9a4a] focus:ring-4 focus:ring-[#5a9a4a]/12"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="text-[14px] font-bold leading-none text-[#1f3025]"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="mt-2 h-12 w-full rounded-[8px] border border-[#dfe8dd] bg-white px-4 text-[15px] font-medium text-[#1f3025] outline-none transition placeholder:text-[#a4aea5] focus:border-[#5a9a4a] focus:ring-4 focus:ring-[#5a9a4a]/12"
                />
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="text-[14px] font-bold leading-none text-[#1f3025]"
                >
                  Subject
                </label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  placeholder="Order support, delivery, products..."
                  className="mt-2 h-12 w-full rounded-[8px] border border-[#dfe8dd] bg-white px-4 text-[15px] font-medium text-[#1f3025] outline-none transition placeholder:text-[#a4aea5] focus:border-[#5a9a4a] focus:ring-4 focus:ring-[#5a9a4a]/12"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="text-[14px] font-bold leading-none text-[#1f3025]"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  placeholder="Write your message..."
                  required
                  rows={6}
                  className="mt-2 w-full resize-none rounded-[8px] border border-[#dfe8dd] bg-white px-4 py-3 text-[15px] font-medium text-[#1f3025] outline-none transition placeholder:text-[#a4aea5] focus:border-[#5a9a4a] focus:ring-4 focus:ring-[#5a9a4a]/12"
                />
              </div>

              <button
                type="submit"
                className="inline-flex h-13 w-full items-center justify-center gap-2 rounded-full bg-[#5a9a4a] px-8 text-[15px] font-bold leading-none text-white shadow-[0_14px_28px_rgba(90,154,74,0.22)] transition hover:-translate-y-0.5 hover:bg-[#4f8b42] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#d5ae3e]/35"
              >
                Send Now
                <Send size={18} strokeWidth={2.2} />
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
