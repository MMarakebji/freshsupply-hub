"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Boxes,
  FileText,
  Home,
  LayoutDashboard,
  LogOut,
  MessageSquareText,
  Tags,
  UserRound,
  UsersRound,
} from "lucide-react";
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

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

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
          {adminLinks.map((link) => {
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
              >
                <Icon size={18} strokeWidth={2.2} />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="lg:pl-[260px]">
        <header className="sticky top-0 z-40 border-b border-[#dfeadd] bg-white/95 backdrop-blur">
          <div className="flex min-h-16 items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
            <div>
              <p className="text-[13px] font-bold uppercase text-[#d5ae3e]">
                Admin Dashboard
              </p>
              <h1 className="text-[22px] font-bold text-[#10221f]">
                Almfood AB Control Panel
              </h1>
            </div>
            <div className="flex items-center gap-2">
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

          <nav className="flex gap-2 overflow-x-auto border-t border-[#edf2ea] px-4 py-2 lg:hidden">
            <Link
              href="/"
              className="whitespace-nowrap rounded-full bg-[#fbfdf8] px-4 py-2 text-[13px] font-bold text-[#31583d] ring-1 ring-[#dfe8dd]"
            >
              Home
            </Link>
            {adminLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="whitespace-nowrap rounded-full bg-[#fbfdf8] px-4 py-2 text-[13px] font-bold text-[#31583d] ring-1 ring-[#dfe8dd]"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
