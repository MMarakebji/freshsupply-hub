import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getString, requireAdmin } from "./adminUserRouteHelpers";

export async function POST(request: NextRequest) {
  const adminCheck = await requireAdmin(request);

  if (adminCheck.error) {
    return adminCheck.error;
  }

  const body = await request.json();
  const fullName = getString(body.full_name);
  const email = getString(body.email).toLowerCase();
  const phone = getString(body.phone);
  const password = getString(body.password);

  if (!fullName || !email || !password) {
    return NextResponse.json(
      { error: "Full name, email, and password are required." },
      { status: 400 }
    );
  }

  const { data: createdUser, error: createError } =
    await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
      },
    });

  if (createError || !createdUser.user) {
    return NextResponse.json(
      { error: createError?.message ?? "Unable to create admin user." },
      { status: 400 }
    );
  }

  const { error: profileError } = await supabaseAdmin.from("profiles").insert({
    id: createdUser.user.id,
    full_name: fullName,
    email,
    phone: phone || null,
    role: "admin",
  });

  if (profileError) {
    await supabaseAdmin.auth.admin.deleteUser(createdUser.user.id);

    return NextResponse.json({ error: profileError.message }, { status: 400 });
  }

  return NextResponse.json({ id: createdUser.user.id });
}
