"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import type { Database } from "@/types/database.types";

type SiteContentRow = Database["public"]["Tables"]["site_content"]["Row"];

type SiteContentFormState = {
  page_key: string;
  title: string;
  content: string;
  phone: string;
  email: string;
  address: string;
  facebook_url: string;
  instagram_url: string;
  linkedin_url: string;
};

const blankForm: SiteContentFormState = {
  page_key: "contact",
  title: "",
  content: "",
  phone: "",
  email: "",
  address: "",
  facebook_url: "",
  instagram_url: "",
  linkedin_url: "",
};

function emptyToNull(value: string) {
  const trimmed = value.trim();

  return trimmed ? trimmed : null;
}

function mapRowToForm(row: SiteContentRow): SiteContentFormState {
  return {
    page_key: row.page_key,
    title: row.title,
    content: row.content ?? "",
    phone: row.phone ?? "",
    email: row.email ?? "",
    address: row.address ?? "",
    facebook_url: row.facebook_url ?? "",
    instagram_url: row.instagram_url ?? "",
    linkedin_url: row.linkedin_url ?? "",
  };
}

export default function SiteContentForm() {
  const router = useRouter();
  const [form, setForm] = useState<SiteContentFormState>(blankForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const payload = useMemo(
    () => ({
      page_key: "contact",
      title: form.title.trim(),
      content: emptyToNull(form.content),
      phone: emptyToNull(form.phone),
      email: emptyToNull(form.email),
      address: emptyToNull(form.address),
      facebook_url: emptyToNull(form.facebook_url),
      instagram_url: emptyToNull(form.instagram_url),
      linkedin_url: emptyToNull(form.linkedin_url),
    }),
    [form]
  );

  useEffect(() => {
    void supabase
      .from("site_content")
      .select("*")
      .eq("page_key", "contact")
      .maybeSingle()
      .then(({ data, error: contentError }) => {
        if (contentError) {
          setError(contentError.message);
        } else if (data) {
          setForm(mapRowToForm(data));
        } else {
          setForm({
            ...blankForm,
            page_key: "contact",
            title: "Contact Us",
          });
        }

        setIsLoading(false);
      });
  }, []);

  function updateField<Key extends keyof SiteContentFormState>(
    key: Key,
    value: SiteContentFormState[Key]
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!payload.title) {
      setError("Title is required.");
      return;
    }

    setIsSaving(true);

    const { data: savedContent, error: saveError } = await supabase
      .from("site_content")
      .upsert(payload, { onConflict: "page_key" })
      .select("*")
      .single();

    setIsSaving(false);

    if (saveError) {
      setError(saveError.message);
      return;
    }

    if (savedContent) {
      setForm(mapRowToForm(savedContent));
    }

    router.refresh();
    setMessage("Site content updated successfully.");
  }

  return (
    <section className="rounded-[8px] border border-[#dfeadd] bg-white shadow-[0_10px_24px_rgba(49,88,61,0.06)]">
      <div className="border-b border-[#e4eee6] px-4 py-4 sm:px-5">
        <h2 className="text-[22px] font-bold text-[#10221f]">Site Content</h2>
        <p className="mt-1 text-[14px] font-medium text-[#667167]">
          Edit public contact page and footer phone, email, address, text, and social links.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 p-4 sm:p-5">
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

        {isLoading ? (
          <p className="rounded-[8px] border border-[#dfeadd] bg-[#fbfdf8] px-5 py-4 text-[14px] font-bold text-[#31583d]">
            Loading content...
          </p>
        ) : (
          <>
            <div className="grid gap-5 lg:grid-cols-2">
              <label className="block">
                <span className="text-[14px] font-bold text-[#1f3025]">
                  Title
                </span>
                <input
                  value={form.title}
                  onChange={(event) => updateField("title", event.target.value)}
                  required
                  className="mt-2 h-12 w-full rounded-[8px] border border-[#dfe8dd] bg-[#fbfdf8] px-4 text-[15px] font-medium text-[#1f3025] outline-none focus:border-[#5a9a4a] focus:ring-4 focus:ring-[#5a9a4a]/12"
                />
              </label>

              <label className="block">
                <span className="text-[14px] font-bold text-[#1f3025]">
                  Phone
                </span>
                <input
                  value={form.phone}
                  onChange={(event) => updateField("phone", event.target.value)}
                  className="mt-2 h-12 w-full rounded-[8px] border border-[#dfe8dd] bg-[#fbfdf8] px-4 text-[15px] font-medium text-[#1f3025] outline-none focus:border-[#5a9a4a] focus:ring-4 focus:ring-[#5a9a4a]/12"
                />
              </label>

              <label className="block">
                <span className="text-[14px] font-bold text-[#1f3025]">
                  Email
                </span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  className="mt-2 h-12 w-full rounded-[8px] border border-[#dfe8dd] bg-[#fbfdf8] px-4 text-[15px] font-medium text-[#1f3025] outline-none focus:border-[#5a9a4a] focus:ring-4 focus:ring-[#5a9a4a]/12"
                />
              </label>

              <label className="block">
                <span className="text-[14px] font-bold text-[#1f3025]">
                  Address
                </span>
                <input
                  value={form.address}
                  onChange={(event) =>
                    updateField("address", event.target.value)
                  }
                  className="mt-2 h-12 w-full rounded-[8px] border border-[#dfe8dd] bg-[#fbfdf8] px-4 text-[15px] font-medium text-[#1f3025] outline-none focus:border-[#5a9a4a] focus:ring-4 focus:ring-[#5a9a4a]/12"
                />
              </label>
            </div>

            <label className="block">
              <span className="text-[14px] font-bold text-[#1f3025]">
                Content
              </span>
              <textarea
                value={form.content}
                onChange={(event) => updateField("content", event.target.value)}
                rows={5}
                className="mt-2 w-full rounded-[8px] border border-[#dfe8dd] bg-[#fbfdf8] px-4 py-3 text-[15px] font-medium text-[#1f3025] outline-none focus:border-[#5a9a4a] focus:ring-4 focus:ring-[#5a9a4a]/12"
              />
            </label>

            <div className="grid gap-5 lg:grid-cols-3">
              <label className="block">
                <span className="text-[14px] font-bold text-[#1f3025]">
                  Facebook URL
                </span>
                <input
                  value={form.facebook_url}
                  onChange={(event) =>
                    updateField("facebook_url", event.target.value)
                  }
                  className="mt-2 h-12 w-full rounded-[8px] border border-[#dfe8dd] bg-[#fbfdf8] px-4 text-[15px] font-medium text-[#1f3025] outline-none focus:border-[#5a9a4a] focus:ring-4 focus:ring-[#5a9a4a]/12"
                />
              </label>
              <label className="block">
                <span className="text-[14px] font-bold text-[#1f3025]">
                  Instagram URL
                </span>
                <input
                  value={form.instagram_url}
                  onChange={(event) =>
                    updateField("instagram_url", event.target.value)
                  }
                  className="mt-2 h-12 w-full rounded-[8px] border border-[#dfe8dd] bg-[#fbfdf8] px-4 text-[15px] font-medium text-[#1f3025] outline-none focus:border-[#5a9a4a] focus:ring-4 focus:ring-[#5a9a4a]/12"
                />
              </label>
              <label className="block">
                <span className="text-[14px] font-bold text-[#1f3025]">
                  LinkedIn URL
                </span>
                <input
                  value={form.linkedin_url}
                  onChange={(event) =>
                    updateField("linkedin_url", event.target.value)
                  }
                  className="mt-2 h-12 w-full rounded-[8px] border border-[#dfe8dd] bg-[#fbfdf8] px-4 text-[15px] font-medium text-[#1f3025] outline-none focus:border-[#5a9a4a] focus:ring-4 focus:ring-[#5a9a4a]/12"
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#5a9a4a] px-7 text-[15px] font-bold text-white transition hover:bg-[#4f8b42] disabled:cursor-not-allowed disabled:opacity-65 sm:w-auto"
            >
              <Save size={18} strokeWidth={2.2} />
              {isSaving ? "Saving..." : "Save Content"}
            </button>
          </>
        )}
      </form>
    </section>
  );
}
