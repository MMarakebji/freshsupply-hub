"use client";

import { FormEvent, useEffect, useState } from "react";
import { Save, UserRound } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

type ProfileFormState = {
  full_name: string;
  email: string;
  phone: string;
  password: string;
};

const blankForm: ProfileFormState = {
  full_name: "",
  email: "",
  phone: "",
  password: "",
};

export default function AdminProfileForm() {
  const [form, setForm] = useState<ProfileFormState>(blankForm);
  const [userId, setUserId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    void supabase.auth.getUser().then(async ({ data: userData }) => {
      const id = userData.user?.id;

      if (!id) {
        setError("No logged in admin user found.");
        setIsLoading(false);
        return;
      }

      setUserId(id);

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("full_name, email, phone")
        .eq("id", id)
        .maybeSingle();

      if (profileError) {
        setError(profileError.message);
      } else if (profile) {
        setForm({
          full_name: profile.full_name,
          email: profile.email,
          phone: profile.phone ?? "",
          password: "",
        });
      }

      setIsLoading(false);
    });
  }, []);

  function updateField<Key extends keyof ProfileFormState>(
    key: Key,
    value: ProfileFormState[Key]
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!userId) {
      setError("No logged in admin user found.");
      return;
    }

    if (!form.full_name.trim() || !form.email.trim()) {
      setError("Full name and email are required.");
      return;
    }

    setIsSaving(true);

    const authUpdates: { email: string; password?: string; data: object } = {
      email: form.email.trim().toLowerCase(),
      data: {
        full_name: form.full_name.trim(),
      },
    };

    if (form.password.trim()) {
      authUpdates.password = form.password.trim();
    }

    const { error: authError } = await supabase.auth.updateUser(authUpdates);

    if (authError) {
      setError(authError.message);
      setIsSaving(false);
      return;
    }

    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        full_name: form.full_name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim() || null,
      })
      .eq("id", userId);

    setIsSaving(false);

    if (profileError) {
      setError(profileError.message);
      return;
    }

    setForm((current) => ({ ...current, password: "" }));
    setMessage("Profile updated successfully.");
  }

  if (isLoading) {
    return (
      <p className="rounded-[8px] border border-[#dfeadd] bg-white px-5 py-4 text-[14px] font-bold text-[#31583d]">
        Loading profile...
      </p>
    );
  }

  return (
    <section className="rounded-[8px] border border-[#dfeadd] bg-white shadow-[0_10px_24px_rgba(49,88,61,0.06)]">
      <div className="border-b border-[#e4eee6] px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-[8px] bg-[#edf6ea] text-[#31583d]">
            <UserRound size={21} strokeWidth={2.2} />
          </span>
          <div>
            <h2 className="text-[22px] font-bold text-[#10221f]">
              Admin Profile
            </h2>
            <p className="mt-1 text-[14px] font-medium text-[#667167]">
              Update your account information and password.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 p-5">
        {error ? (
          <p className="rounded-[8px] border border-[#f4c7c7] bg-[#fff1f1] px-5 py-4 text-[14px] font-bold text-[#9b1c1c]">
            {error}
          </p>
        ) : null}

        {message ? (
          <p className="rounded-[8px] border border-[#cfe8cc] bg-[#f1faef] px-5 py-4 text-[14px] font-bold text-[#31583d]">
            {message}
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
              New Password
            </span>
            <input
              type="password"
              value={form.password}
              onChange={(event) => updateField("password", event.target.value)}
              placeholder="Leave blank to keep password"
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
          {isSaving ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </section>
  );
}
