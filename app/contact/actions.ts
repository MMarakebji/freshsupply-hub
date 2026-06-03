"use server";

import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function submitContactMessage(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const subject = String(formData.get("subject") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email || !message) {
    throw new Error("Name, email, and message are required.");
  }

  const { error } = await supabaseAdmin.from("contact_messages").insert({
    name,
    email,
    subject: subject || "Contact message",
    message,
  });

  if (error) {
    throw new Error(error.message);
  }
}
