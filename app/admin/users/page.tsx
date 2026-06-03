"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Edit3, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import type { Database } from "@/types/database.types";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

async function getAccessToken() {
  const { data } = await supabase.auth.getSession();

  return data.session?.access_token;
}

export default function AdminUsersPage() {
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [currentUserId, setCurrentUserId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [deletingUserId, setDeletingUserId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    void Promise.all([
      supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase.auth.getUser(),
    ]).then(([profilesResponse, userResponse]) => {
      if (profilesResponse.error) {
        setError(profilesResponse.error.message);
      } else {
        setProfiles(profilesResponse.data ?? []);
      }

      setCurrentUserId(userResponse.data.user?.id ?? "");
      setIsLoading(false);
    });
  }, []);

  async function handleDelete(profile: ProfileRow) {
    const confirmed = window.confirm(
      `Remove admin "${profile.full_name}"? This deletes the linked auth user.`
    );

    if (!confirmed) {
      return;
    }

    const token = await getAccessToken();

    if (!token) {
      setError("Your admin session expired. Please login again.");
      return;
    }

    setError("");
    setDeletingUserId(profile.id);

    const response = await fetch(`/api/admin/users/${profile.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const result = (await response.json()) as { error?: string };

    setDeletingUserId("");

    if (!response.ok) {
      setError(result.error ?? "Unable to delete admin user.");
      return;
    }

    setProfiles((currentProfiles) =>
      currentProfiles.filter((item) => item.id !== profile.id)
    );
  }

  return (
    <section className="rounded-[8px] border border-[#dfeadd] bg-white shadow-[0_10px_24px_rgba(49,88,61,0.06)]">
      <div className="flex flex-col gap-4 border-b border-[#e4eee6] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div>
          <h2 className="text-[22px] font-bold text-[#10221f]">Admins</h2>
          <p className="mt-1 text-[14px] font-medium text-[#667167]">
            Admin accounts loaded from Supabase profiles.
          </p>
        </div>
        <Link
          href="/admin/users/add"
          className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-full bg-[#5a9a4a] px-5 text-[14px] font-bold text-white transition hover:bg-[#4f8b42] sm:w-auto"
        >
          <Plus size={17} strokeWidth={2.2} />
          Add Admin
        </Link>
      </div>

      {error ? (
        <p className="m-5 rounded-[8px] border border-[#f4c7c7] bg-[#fff1f1] px-5 py-4 text-[14px] font-bold text-[#9b1c1c]">
          {error}
        </p>
      ) : null}

      <div className="divide-y divide-[#edf2ea] sm:hidden">
        {profiles.map((profile) => (
          <article key={profile.id} className="px-4 py-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="text-[16px] font-bold text-[#10221f]">
                  {profile.full_name}
                  {profile.id === currentUserId ? (
                    <span className="ml-2 rounded-full bg-[#edf6ea] px-2 py-1 text-[11px] font-bold text-[#31583d]">
                      You
                    </span>
                  ) : null}
                </h3>
                <p className="mt-1 break-all text-[13px] font-medium text-[#667167]">
                  {profile.email}
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-[#fbfdf8] px-3 py-1 text-[12px] font-bold text-[#31583d] ring-1 ring-[#dfe8dd]">
                {profile.role}
              </span>
            </div>
            <p className="mt-3 text-[14px] font-medium text-[#667167]">
              {profile.phone ?? "-"}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Link
                href={`/admin/users/edit/${profile.id}`}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-[#dfe8dd] px-4 text-[13px] font-bold text-[#31583d] transition hover:bg-[#f4faf2]"
              >
                <Edit3 size={15} strokeWidth={2.2} />
                Edit
              </Link>
              <button
                type="button"
                onClick={() => handleDelete(profile)}
                disabled={
                  deletingUserId === profile.id || profile.id === currentUserId
                }
                className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-[#f4c7c7] px-4 text-[13px] font-bold text-[#9b1c1c] transition hover:bg-[#fff1f1] disabled:cursor-not-allowed disabled:opacity-65"
              >
                <Trash2 size={15} strokeWidth={2.2} />
                {deletingUserId === profile.id ? "Deleting" : "Delete"}
              </button>
            </div>
          </article>
        ))}
      </div>

      <div className="hidden overflow-x-auto sm:block">
        <table className="w-full min-w-[760px] text-left">
          <thead className="bg-[#fbfdf8] text-[13px] font-bold uppercase text-[#667167]">
            <tr>
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Email</th>
              <th className="px-5 py-3">Phone</th>
              <th className="px-5 py-3">Role</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#edf2ea] text-[14px]">
            {profiles.map((profile) => (
              <tr key={profile.id}>
                <td className="px-5 py-4 font-bold text-[#10221f]">
                  {profile.full_name}
                  {profile.id === currentUserId ? (
                    <span className="ml-2 rounded-full bg-[#edf6ea] px-2 py-1 text-[11px] font-bold text-[#31583d]">
                      You
                    </span>
                  ) : null}
                </td>
                <td className="px-5 py-4 font-medium text-[#667167]">
                  {profile.email}
                </td>
                <td className="px-5 py-4 font-medium text-[#667167]">
                  {profile.phone ?? "-"}
                </td>
                <td className="px-5 py-4 font-medium text-[#667167]">
                  {profile.role}
                </td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/users/edit/${profile.id}`}
                      className="inline-flex h-9 items-center justify-center gap-2 rounded-full border border-[#dfe8dd] px-4 text-[13px] font-bold text-[#31583d] transition hover:bg-[#f4faf2]"
                    >
                      <Edit3 size={15} strokeWidth={2.2} />
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(profile)}
                      disabled={
                        deletingUserId === profile.id ||
                        profile.id === currentUserId
                      }
                      className="inline-flex h-9 items-center justify-center gap-2 rounded-full border border-[#f4c7c7] px-4 text-[13px] font-bold text-[#9b1c1c] transition hover:bg-[#fff1f1] disabled:cursor-not-allowed disabled:opacity-65"
                    >
                      <Trash2 size={15} strokeWidth={2.2} />
                      {deletingUserId === profile.id ? "Deleting" : "Delete"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!isLoading && profiles.length === 0 ? (
        <p className="px-5 py-8 text-center text-[15px] font-medium text-[#667167]">
          No admin profiles in the database yet.
        </p>
      ) : null}
      {isLoading ? (
        <p className="px-5 py-8 text-center text-[15px] font-bold text-[#31583d]">
          Loading admins...
        </p>
      ) : null}
    </section>
  );
}
