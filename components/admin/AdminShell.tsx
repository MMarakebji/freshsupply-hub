"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Boxes,
  FileText,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareText,
  Tags,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type AdminShellProps = {
  children: React.ReactNode;
};

const adminLinks = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Boxes },
  { label: "Categories", href: "/admin/categories", icon: Tags },
  { label: "Admins", href: "/admin/users", icon: UsersRound },
  { label: "Profile", href: "/admin/profile", icon: UserRound },
  { label: "Content", href: "/admin/content", icon: FileText },
  { label: "Messages", href: "/admin/messages", icon: MessageSquareText },
];

export default function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  async function handleLogout() {
    setIsMenuOpen(false);
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const renderAdminLink = (link: (typeof adminLinks)[number]) => {
    const Icon = link.icon;
    const isActive =
      link.href === "/admin"
        ? pathname === link.href
        : pathname.startsWith(link.href);

    return (
      <Link
        key={link.href}
        href={link.href}
        className={`flex h-11 items-center gap-3 rounded-[8px] px-3 text-[14px] font-bold transition ${
          isActive
            ? "bg-[#edf6ea] text-[#31583d]"
            : "text-[#667167] hover:bg-[#f4faf2] hover:text-[#31583d]"
        }`}
        onClick={() => setIsMenuOpen(false)}
      >
        <Icon size={18} strokeWidth={2.2} />
        {link.label}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-[#f7fbf3]">
      <aside className="fixed inset-y-0 left-0 hidden w-[260px] border-r border-[#dfeadd] bg-white px-4 py-5 lg:block">
        <Link href="/" className="block px-3 text-[24px] font-bold text-[#274832]">
          Almfood AB
        </Link>
        <Link
          href="/"
          className="mt-5 flex h-11 items-center gap-3 rounded-[8px] border border-[#dfe8dd] px-3 text-[14px] font-bold text-[#31583d] transition hover:bg-[#f4faf2]"
        >
          <Home size={18} strokeWidth={2.2} />
          Home
        </Link>
        <nav className="mt-4 space-y-2">
          {adminLinks.map(renderAdminLink)}
        </nav>
      </aside>

      <div className="lg:pl-[260px]">
        <header className="sticky top-0 z-40 border-b border-[#dfeadd] bg-white/95 backdrop-blur">
          <div className="flex min-h-16 items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#dfe8dd] bg-white text-[#31583d] transition hover:bg-[#f4faf2] lg:hidden"
                aria-label={
                  isMenuOpen ? "Close admin menu" : "Open admin menu"
                }
                aria-expanded={isMenuOpen}
                aria-controls="admin-mobile-menu"
                onClick={() => setIsMenuOpen((current) => !current)}
              >
                {isMenuOpen ? <X size={21} /> : <Menu size={21} />}
              </button>
              <div className="min-w-0">
                <p className="text-[13px] font-bold uppercase text-[#d5ae3e]">
                  Admin Dashboard
                </p>
                <h1 className="truncate text-[20px] font-bold text-[#10221f] sm:text-[22px]">
                  Almfood AB Control Panel
                </h1>
              </div>
            </div>
            <div className="hidden items-center gap-2 sm:flex">
              <Link
                href="/"
                className="inline-flex h-10 items-center gap-2 rounded-full border border-[#dfe8dd] bg-white px-4 text-[14px] font-bold text-[#31583d] transition hover:bg-[#f4faf2]"
              >
                <Home size={17} strokeWidth={2.2} />
                Home
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex h-10 items-center gap-2 rounded-full border border-[#dfe8dd] bg-white px-4 text-[14px] font-bold text-[#31583d] transition hover:bg-[#f4faf2]"
              >
                <LogOut size={17} strokeWidth={2.2} />
                Logout
              </button>
            </div>
          </div>
        </header>

        {isMenuOpen ? (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              type="button"
              className="absolute inset-0 bg-[#10221f]/35"
              aria-label="Close admin menu"
              onClick={() => setIsMenuOpen(false)}
            />
            <aside
              id="admin-mobile-menu"
              className="relative flex h-full w-[min(320px,86vw)] flex-col border-r border-[#dfeadd] bg-white px-4 py-5 shadow-[18px_0_40px_rgba(15,23,42,0.16)]"
            >
              <div className="flex items-center justify-between gap-3 px-3">
                <Link
                  href="/"
                  className="text-[22px] font-bold text-[#274832]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Almfood AB
                </Link>
                <button
                  type="button"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#dfe8dd] text-[#31583d] transition hover:bg-[#f4faf2]"
                  aria-label="Close admin menu"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <X size={21} />
                </button>
              </div>
              <Link
                href="/"
                className="mt-5 flex h-11 items-center gap-3 rounded-[8px] border border-[#dfe8dd] px-3 text-[14px] font-bold text-[#31583d] transition hover:bg-[#f4faf2]"
                onClick={() => setIsMenuOpen(false)}
              >
                <Home size={18} strokeWidth={2.2} />
                Home
              </Link>
              <nav className="mt-4 flex-1 space-y-2 overflow-y-auto">
                {adminLinks.map(renderAdminLink)}
              </nav>
              <button
                type="button"
                onClick={handleLogout}
                className="mt-4 flex h-11 items-center gap-3 rounded-[8px] border border-[#dfe8dd] px-3 text-[14px] font-bold text-[#31583d] transition hover:bg-[#f4faf2]"
              >
                <LogOut size={18} strokeWidth={2.2} />
                Logout
              </button>
            </aside>
          </div>
        ) : null}

        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
