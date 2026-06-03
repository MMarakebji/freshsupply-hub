"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Menu, UserRound, X } from "lucide-react";
import { useEffect, useState } from "react";
import AdminLoginModal from "@/components/auth/AdminLoginModal";
import LanguageToggle from "@/components/layout/LanguageToggle";
import { supabase } from "@/lib/supabaseClient";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function checkAdminSession() {
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user.id;

      if (!userId) {
        setIsAdmin(false);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .maybeSingle();

      setIsAdmin(profile?.role === "admin");
    }

    checkAdminSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      checkAdminSession();
    });

    return () => subscription.unsubscribe();
  }, []);

  if (pathname.startsWith("/admin")) {
    return null;
  }

  const isActive = (href: string) =>
    href === "/" ? pathname === href : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-[#e6eadf] bg-white/92 backdrop-blur-xl">
      <nav className="mx-auto flex h-20 max-w-[1480px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-3 text-[#274832]"
          aria-label="Almfood AB home"
          onClick={() => setIsOpen(false)}
        >
          <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-white shadow-[0_10px_24px_rgba(49,88,61,0.16)] ring-1 ring-[#dfe9de]">
            <Image
              src="/images/main-logo.png"
              alt=""
              fill
              sizes="64px"
              className="scale-110 object-contain p-0"
              priority
            />
          </span>
          <span className="text-[24px] font-bold leading-none tracking-normal">
            Almfood AB
          </span>
        </Link>

        <div className="hidden items-center gap-2 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full px-5 py-3 text-[15px] font-semibold leading-none transition-colors ${
                isActive(link.href)
                  ? "bg-[#edf6ea] text-[#31583d]"
                  : "text-[#4c5b50] hover:bg-[#f4f8f0] hover:text-[#31583d]"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <LanguageToggle />
          {isAdmin ? (
            <Link
              href="/admin"
              className="inline-flex h-11 items-center gap-2 rounded-full border border-[#31583d] bg-[#31583d] px-5 text-[15px] font-semibold leading-none text-white transition-colors hover:bg-[#274832]"
            >
              <LayoutDashboard size={18} strokeWidth={2.2} />
              Dashboard
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => setIsLoginOpen(true)}
              className={`inline-flex h-11 items-center gap-2 rounded-full border px-5 text-[15px] font-semibold leading-none transition-colors ${
                isActive("/login")
                  ? "border-[#31583d] bg-[#31583d] text-white"
                  : "border-[#d9e3d8] text-[#31583d] hover:border-[#31583d] hover:bg-[#f4f8f0]"
              }`}
            >
              <UserRound size={18} strokeWidth={2.2} />
              Login
            </button>
          )}
          <Link
            href="/products"
            className="inline-flex h-11 items-center rounded-full bg-[#d5ae3e] px-5 text-[15px] font-bold leading-none text-[#22170b] shadow-[0_10px_24px_rgba(213,174,62,0.22)] transition hover:bg-[#cda232]"
          >
            Shop Now
          </Link>
        </div>

        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-[#d9e3d8] text-[#31583d] transition hover:bg-[#f4f8f0] lg:hidden"
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((current) => !current)}
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {isOpen ? (
        <div className="border-t border-[#e6eadf] bg-white px-4 pb-5 pt-2 shadow-[0_18px_30px_rgba(15,23,42,0.08)] lg:hidden">
          <div className="mx-auto flex max-w-[1480px] flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-xl px-4 py-3 text-[16px] font-semibold transition-colors ${
                  isActive(link.href)
                    ? "bg-[#edf6ea] text-[#31583d]"
                    : "text-[#4c5b50] hover:bg-[#f4f8f0] hover:text-[#31583d]"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2">
              <LanguageToggle />
            </div>
            {isAdmin ? (
              <Link
                href="/admin"
                className="mt-2 inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-[#31583d] bg-[#31583d] text-[16px] font-semibold text-white"
                onClick={() => setIsOpen(false)}
              >
                <LayoutDashboard size={18} strokeWidth={2.2} />
                Dashboard
              </Link>
            ) : (
              <button
                type="button"
                className="mt-2 inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-[#d9e3d8] text-[16px] font-semibold text-[#31583d]"
                onClick={() => {
                  setIsOpen(false);
                  setIsLoginOpen(true);
                }}
              >
                <UserRound size={18} strokeWidth={2.2} />
                Login
              </button>
            )}
            <Link
              href="/products"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-[#d5ae3e] text-[16px] font-bold text-[#22170b]"
              onClick={() => setIsOpen(false)}
            >
              Shop Now
            </Link>
          </div>
        </div>
      ) : null}
      <AdminLoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
      />
    </header>
  );
}
