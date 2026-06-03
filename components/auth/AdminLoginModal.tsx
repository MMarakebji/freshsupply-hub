"use client";

import { FormEvent, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { LockKeyhole, Mail, X } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

type AdminLoginModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AdminLoginModal({ isOpen, onClose }: AdminLoginModalProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError || !data.user) {
      setError(signInError?.message ?? "Unable to login.");
      setIsSubmitting(false);
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .maybeSingle();

    if (
      profileError ||
      !profile ||
      profile.role !== "admin"
    ) {
      await supabase.auth.signOut();
      setError("Only admin users can login to the dashboard.");
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
    onClose();
    router.push("/admin");
    router.refresh();
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex min-h-screen items-center justify-center overflow-y-auto bg-black/45 px-4 py-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-login-title"
      onMouseDown={onClose}
    >
      <div
        className="w-full max-w-[430px] rounded-[8px] bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.25)]"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2
              id="admin-login-title"
              className="text-[26px] font-bold leading-tight text-[#10221f]"
            >
              Admin Login
            </h2>
            <p className="mt-2 text-[14px] font-medium leading-6 text-[#667167]">
              Only admin users can login to the dashboard.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#dfe8dd] text-[#31583d] transition hover:bg-[#f4faf2]"
            aria-label="Close login popup"
          >
            <X size={19} strokeWidth={2.2} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block">
            <span className="text-[14px] font-bold text-[#1f3025]">Email</span>
            <span className="mt-2 flex h-12 items-center gap-3 rounded-[8px] border border-[#dfe8dd] bg-[#fbfdf8] px-4 focus-within:border-[#5a9a4a] focus-within:ring-4 focus-within:ring-[#5a9a4a]/12">
              <Mail size={18} strokeWidth={2.2} className="text-[#667167]" />
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="w-full bg-transparent text-[15px] font-medium text-[#1f3025] outline-none"
              />
            </span>
          </label>

          <label className="block">
            <span className="text-[14px] font-bold text-[#1f3025]">
              Password
            </span>
            <span className="mt-2 flex h-12 items-center gap-3 rounded-[8px] border border-[#dfe8dd] bg-[#fbfdf8] px-4 focus-within:border-[#5a9a4a] focus-within:ring-4 focus-within:ring-[#5a9a4a]/12">
              <LockKeyhole
                size={18}
                strokeWidth={2.2}
                className="text-[#667167]"
              />
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                className="w-full bg-transparent text-[15px] font-medium text-[#1f3025] outline-none"
              />
            </span>
          </label>

          {error ? (
            <p className="rounded-[8px] border border-[#f4c7c7] bg-[#fff1f1] px-4 py-3 text-[14px] font-bold text-[#9b1c1c]">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex h-12 w-full items-center justify-center rounded-full bg-[#5a9a4a] px-6 text-[15px] font-bold text-white shadow-[0_14px_28px_rgba(90,154,74,0.22)] transition hover:bg-[#4f8b42] disabled:cursor-not-allowed disabled:opacity-65"
          >
            {isSubmitting ? "Checking access..." : "Login"}
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
}
