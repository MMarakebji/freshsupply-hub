"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { Database } from "@/types/database.types";

type MessageRow = Database["public"]["Tables"]["contact_messages"]["Row"];

function formatDate(value: string | null) {
  if (!value) {
    return "No date";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<MessageRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadMessages() {
      const { data, error: messagesError } = await supabase
        .from("contact_messages")
        .select("id, name, email, subject, message, status, created_at")
        .order("created_at", { ascending: false });

      if (messagesError) {
        setError(messagesError.message);
      } else {
        setMessages(data ?? []);
      }

      setIsLoading(false);
    }

    loadMessages();
  }, []);

  return (
    <section className="rounded-[8px] border border-[#dfeadd] bg-white shadow-[0_10px_24px_rgba(49,88,61,0.06)]">
      <div className="border-b border-[#e4eee6] px-5 py-4">
        <h2 className="text-[22px] font-bold text-[#10221f]">Messages</h2>
        <p className="mt-1 text-[14px] font-medium text-[#667167]">
          Contact messages loaded from the database.
        </p>
      </div>

      {error ? (
        <p className="m-5 rounded-[8px] border border-[#f4c7c7] bg-[#fff1f1] px-5 py-4 text-[14px] font-bold text-[#9b1c1c]">
          {error}
        </p>
      ) : null}

      <div className="divide-y divide-[#edf2ea]">
        {messages.map((message) => (
          <article key={message.id} className="px-5 py-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="text-[18px] font-bold text-[#10221f]">
                  {message.subject}
                </h3>
                <p className="mt-1 text-[14px] font-medium text-[#667167]">
                  {message.name} · {message.email}
                </p>
              </div>
              <span className="w-fit rounded-full bg-[#fbfdf8] px-3 py-1 text-[12px] font-bold text-[#31583d] ring-1 ring-[#dfe8dd]">
                {message.status}
              </span>
            </div>
            <p className="mt-4 max-w-[920px] text-[15px] font-medium leading-7 text-[#4c5b50]">
              {message.message}
            </p>
            <p className="mt-3 text-[13px] font-bold text-[#9aa69c]">
              {formatDate(message.created_at)}
            </p>
          </article>
        ))}
        {!isLoading && messages.length === 0 ? (
          <p className="px-5 py-8 text-center text-[15px] font-medium text-[#667167]">
            No messages in the database yet.
          </p>
        ) : null}
        {isLoading ? (
          <p className="px-5 py-8 text-center text-[15px] font-bold text-[#31583d]">
            Loading messages...
          </p>
        ) : null}
      </div>
    </section>
  );
}
