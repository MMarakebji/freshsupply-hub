"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import type { Database } from "@/types/database.types";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

type AdminUserFormProps = {
  mode: "add" | "edit";
  userId?: string;
};

type AdminUserFormState = {
  full_name: string;
  email: string;
  phone: string;
  password: string;
};

const blankForm: AdminUserFormState = {
  full_name: "",
  email: "",
  phone: "",
  password: "",
};

function mapProfileToForm(profile: ProfileRow): AdminUserFormState {
  return {
    full_name: profile.full_name,
    email: profile.email,
    phone: profile.phone ?? "",
    password: "",
  };
}

async function getAccessToken() {
  const { data } = await supabase.auth.getSession();

  return data.session?.access_token;
}

export default function AdminUserForm({ mode, userId }: AdminUserFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<AdminUserFormState>(blankForm);
  const [isLoading, setIsLoading] = useState(mode === "edit");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const title = mode === "add" ? "Add Admin" : "Edit Admin";

  useEffect(() => {
    if (mode !== "edit" || !userId) {
      return;
    }

    void supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle()
      .then(({ data, error: profileError }) => {
        if (profileError) {
          setError(profileError.message);
        } else if (!data) {
          setError("Admin user not found.");
        } else {
          setForm(mapProfileToForm(data));
        }

        setIsLoading(false);
      });
  }, [mode, userId]);

  function updateField<Key extends keyof AdminUserFormState>(
    key: Key,
    value: AdminUserFormState[Key]
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!form.full_name.trim() || !form.email.trim()) {
      setError("Full name and email are required.");
      return;
    }

    if (mode === "add" && !form.password.trim()) {
      setError("Password is required when adding a new admin.");
      return;
    }

    const token = await getAccessToken();

    if (!token) {
      setError("Your admin session expired. Please login again.");
      return;
    }

    setIsSaving(true);

    const response = await fetch(
      mode === "add" ? "/api/admin/users" : `/api/admin/users/${userId}`,
      {
        method: mode === "add" ? "POST" : "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      }
    );
    const result = (await response.json()) as { error?: string };

    setIsSaving(false);

    if (!response.ok) {
      setError(result.error ?? "Unable to save admin user.");
      return;
    }

    router.push("/admin/users");
    router.refresh();
  }

  if (isLoading) {
    return (
      <p className="rounded-[8px] border border-[#dfeadd] bg-white px-5 py-4 text-[14px] font-bold text-[#31583d]">
        Loading admin form...
      </p>
    );
  }

  return (
    <section className="rounded-[8px] border border-[#dfeadd] bg-white shadow-[0_10px_24px_rgba(49,88,61,0.06)]">
      <div className="border-b border-[#e4eee6] px-5 py-4">
        <Link
          href="/admin/users"
          className="inline-flex items-center gap-2 text-[14px] font-bold text-[#31583d] transition hover:text-[#5a9a4a]"
        >
          <ArrowLeft size={17} strokeWidth={2.2} />
          Back to Admins
        </Link>
        <h2 className="mt-3 text-[22px] font-bold text-[#10221f]">{title}</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 p-5">
        {error ? (
          <p className="rounded-[8px] border border-[#f4c7c7] bg-[#fff1f1] px-5 py-4 text-[14px] font-bold text-[#9b1c1c]">
            {error}
          </p>
        ) : null}

        <div className="grid gap-5 lg:grid-cols-2">
          <label className="block">
            <span className="text-[14px] font-bold text-[#1f3025]">
              Full Name
            </span>
            <input
              value={form.full_name}
              onChange={(event) => updateField("full_name", event.target.value)}
              required
              className="mt-2 h-12 w-full rounded-[8px] border border-[#dfe8dd] bg-[#fbfdf8] px-4 text-[15px] font-medium text-[#1f3025] outline-none focus:border-[#5a9a4a] focus:ring-4 focus:ring-[#5a9a4a]/12"
            />
          </label>

          <label className="block">
            <span className="text-[14px] font-bold text-[#1f3025]">Email</span>
            <input
              type="email"
              value={form.email}
              onChange={(event) => updateField("email", event.target.value)}
              required
              className="mt-2 h-12 w-full rounded-[8px] border border-[#dfe8dd] bg-[#fbfdf8] px-4 text-[15px] font-medium text-[#1f3025] outline-none focus:border-[#5a9a4a] focus:ring-4 focus:ring-[#5a9a4a]/12"
            />
          </label>

          <label className="block">
            <span className="text-[14px] font-bold text-[#1f3025]">Phone</span>
            <input
              value={form.phone}
              onChange={(event) => updateField("phone", event.target.value)}
              className="mt-2 h-12 w-full rounded-[8px] border border-[#dfe8dd] bg-[#fbfdf8] px-4 text-[15px] font-medium text-[#1f3025] outline-none focus:border-[#5a9a4a] focus:ring-4 focus:ring-[#5a9a4a]/12"
            />
          </label>

          <label className="block">
            <span className="text-[14px] font-bold text-[#1f3025]">
              {mode === "add" ? "Password" : "New Password"}
            </span>
            <input
              type="password"
              value={form.password}
              onChange={(event) => updateField("password", event.target.value)}
              required={mode === "add"}
              placeholder={mode === "edit" ? "Leave blank to keep password" : ""}
              className="mt-2 h-12 w-full rounded-[8px] border border-[#dfe8dd] bg-[#fbfdf8] px-4 text-[15px] font-medium text-[#1f3025] outline-none focus:border-[#5a9a4a] focus:ring-4 focus:ring-[#5a9a4a]/12"
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#5a9a4a] px-7 text-[15px] font-bold text-white transition hover:bg-[#4f8b42] disabled:cursor-not-allowed disabled:opacity-65"
        >
          <Save size={18} strokeWidth={2.2} />
          {isSaving ? "Saving..." : "Save Admin"}
        </button>
      </form>
    </section>
  );
}
