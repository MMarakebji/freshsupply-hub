"use client";

import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

type AdminAuthGuardProps = {
  children: ReactNode;
};

export default function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  const router = useRouter();
  const [status, setStatus] = useState<"checking" | "allowed" | "denied">(
    "checking"
  );

  useEffect(() => {
    let isMounted = true;

    async function checkAdminAccess() {
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user.id;

      if (!userId) {
        if (isMounted) {
          setStatus("denied");
        }
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .maybeSingle();

      if (!profile || profile.role !== "admin") {
        await supabase.auth.signOut();
        if (isMounted) {
          setStatus("denied");
        }
        return;
      }

      if (isMounted) {
        setStatus("allowed");
      }
    }

    checkAdminAccess();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      router.refresh();
      checkAdminAccess();
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [router]);

  if (status === "checking") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7fbf3] px-4">
        <div className="rounded-[8px] border border-[#dfeadd] bg-white px-6 py-5 text-[15px] font-bold text-[#31583d] shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
          Checking admin access...
        </div>
      </main>
    );
  }

  if (status === "denied") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7fbf3] px-4">
        <div className="w-full max-w-[460px] rounded-[8px] border border-[#dfeadd] bg-white p-7 text-center shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#fff1f1] text-[#9b1c1c]">
            <ShieldAlert size={23} strokeWidth={2.2} />
          </div>
          <h1 className="mt-4 text-[26px] font-bold text-[#10221f]">
            Admin Access Required
          </h1>
          <p className="mt-3 text-[15px] font-medium leading-6 text-[#667167]">
            Only admin users can access the dashboard.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-[#5a9a4a] px-6 text-[14px] font-bold text-white transition hover:bg-[#4f8b42]"
          >
            Back to Site
          </Link>
        </div>
      </main>
    );
  }

  return children;
}
