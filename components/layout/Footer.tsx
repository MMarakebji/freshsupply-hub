"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Mail, MapPin, PencilLine, Phone } from "lucide-react";
import type { SiteContentRow } from "@/features/siteContent/siteContentApi";

const shopLinks = [
  { label: "All Products", href: "/products" },
  { label: "Organic Produce", href: "/products?category=organic-produce" },
  { label: "Fresh Vegetables", href: "/products?category=fresh-vegetables" },
  { label: "Fresh Fruit", href: "/products?category=fresh-fruit" },
];

const companyLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Login", href: "/login" },
];

const fallbackContact = {
  content:
    "Fresh groceries, pantry essentials, snacks, and household favorites selected for everyday meals.",
  phone: "+961 00 000 000",
  email: "hello@almfoodab.com",
  address: "Almfood AB Market, Beirut, Lebanon",
  instagram_url: "",
  facebook_url: "",
  linkedin_url: "",
};

function toPhoneHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

function InstagramMark() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px]"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    >
      <rect x="4" y="4" width="16" height="16" rx="5" />
      <circle cx="12" cy="12" r="3.5" />
      <circle cx="17" cy="7" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookMark() {
  return (
    <span aria-hidden="true" className="text-[21px] font-black leading-none">
      f
    </span>
  );
}

function LinkedInMark() {
  return (
    <span aria-hidden="true" className="text-[14px] font-black leading-none">
      in
    </span>
  );
}

type FooterProps = {
  contactContent?: Partial<SiteContentRow> | null;
};

export default function Footer({ contactContent }: FooterProps) {
  const pathname = usePathname();
  const contact = contactContent ?? fallbackContact;

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="mt-auto border-t border-[#e6eadf] bg-[#f7fbf4]">
      <div className="mx-auto max-w-[1480px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-[1.45fr_0.9fr_0.9fr_1.1fr]">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-3 text-[#274832]"
              aria-label="Almfood AB home"
            >
              <span className="relative h-[68px] w-[68px] shrink-0 overflow-hidden rounded-full bg-white shadow-[0_10px_24px_rgba(49,88,61,0.16)] ring-1 ring-[#dfe9de]">
                <Image
                  src="/images/main-logo.png"
                  alt=""
                  fill
                  sizes="68px"
                  className="scale-110 object-contain p-0"
                />
              </span>
              <span className="text-[26px] font-bold leading-none tracking-normal">
                Almfood AB
              </span>
            </Link>
            <p className="mt-5 max-w-[380px] text-[15px] font-medium leading-7 text-[#5d6a60]">
              {contact.content ?? fallbackContact.content}
            </p>
            <div className="mt-6 flex items-center gap-3">
              {[
                {
                  label: "Instagram",
                  icon: InstagramMark,
                  href: contact.instagram_url,
                },
                {
                  label: "Facebook",
                  icon: FacebookMark,
                  href: contact.facebook_url,
                },
                {
                  label: "LinkedIn",
                  icon: LinkedInMark,
                  href: contact.linkedin_url,
                },
              ]
                .filter((item) => item.href)
                .map((item) => {
                  const Icon = item.icon;

                  return (
                    <Link
                      href={item.href ?? "/contact"}
                      key={item.label}
                      aria-label={item.label}
                      target="_blank"
                      rel="noreferrer"
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d9e3d8] bg-white text-[#31583d] transition hover:border-[#31583d] hover:bg-[#edf6ea]"
                    >
                      <Icon />
                    </Link>
                  );
                })}
              {[
                { label: "Write to Almfood AB", icon: PencilLine, href: "/contact" },
                { label: "Contact", icon: Mail, href: "/contact" },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    href={item.href}
                    key={item.label}
                    aria-label={item.label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d9e3d8] bg-white text-[#31583d] transition hover:border-[#31583d] hover:bg-[#edf6ea]"
                  >
                    <Icon size={18} strokeWidth={2.2} />
                  </Link>
                );
              })}
            </div>
          </div>

          <div>
            <h2 className="text-[17px] font-bold text-[#1f3025]">Shop</h2>
            <div className="mt-5 flex flex-col gap-3">
              {shopLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="w-fit text-[15px] font-medium text-[#5d6a60] transition hover:text-[#31583d]"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-[17px] font-bold text-[#1f3025]">Company</h2>
            <div className="mt-5 flex flex-col gap-3">
              {companyLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="w-fit text-[15px] font-medium text-[#5d6a60] transition hover:text-[#31583d]"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-[17px] font-bold text-[#1f3025]">Contact</h2>
            <div className="mt-5 flex flex-col gap-4 text-[15px] font-medium leading-6 text-[#5d6a60]">
              <p className="flex gap-3">
                <MapPin className="mt-1 shrink-0 text-[#31583d]" size={18} strokeWidth={2.2} />
                {contact.address ?? fallbackContact.address}
              </p>
              <Link href={toPhoneHref(contact.phone ?? fallbackContact.phone)} className="flex w-fit gap-3 transition hover:text-[#31583d]">
                <Phone className="mt-1 shrink-0 text-[#31583d]" size={18} strokeWidth={2.2} />
                {contact.phone ?? fallbackContact.phone}
              </Link>
              <Link href={`mailto:${contact.email ?? fallbackContact.email}`} className="flex w-fit gap-3 transition hover:text-[#31583d]">
                <Mail className="mt-1 shrink-0 text-[#31583d]" size={18} strokeWidth={2.2} />
                {contact.email ?? fallbackContact.email}
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-[#dfe9de] pt-6 text-[14px] font-medium text-[#6c766d] sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; 2026 Almfood AB. All rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            <Link href="/contact" className="transition hover:text-[#31583d]">
              Support
            </Link>
            <Link href="/products" className="transition hover:text-[#31583d]">
              Fresh Deals
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
