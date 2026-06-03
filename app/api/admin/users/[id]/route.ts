import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getString, requireAdmin } from "../adminUserRouteHelpers";

type AdminUserRouteProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(request: NextRequest, { params }: AdminUserRouteProps) {
  const adminCheck = await requireAdmin(request);

  if (adminCheck.error) {
    return adminCheck.error;
  }

  const { id } = await params;
  const body = await request.json();
  const fullName = getString(body.full_name);
  const email = getString(body.email).toLowerCase();
  const phone = getString(body.phone);
  const password = getString(body.password);

  if (!fullName || !email) {
    return NextResponse.json(
      { error: "Full name and email are required." },
      { status: 400 }
    );
  }

  const authUpdates: { email: string; password?: string; user_metadata: object } =
    {
      email,
      user_metadata: {
        full_name: fullName,
      },
    };

  if (password) {
    authUpdates.password = password;
  }

  const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(
    id,
    authUpdates
  );

  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 400 });
  }

  const { error: profileError } = await supabaseAdmin
    .from("profiles")
    .update({
      full_name: fullName,
      email,
      phone: phone || null,
      role: "admin",
    })
    .eq("id", id);

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 400 });
  }

  return NextResponse.json({ id });
}

export async function DELETE(
  request: NextRequest,
  { params }: AdminUserRouteProps
) {
  const adminCheck = await requireAdmin(request);

  if (adminCheck.error) {
    return adminCheck.error;
  }

  const { id } = await params;

  if (adminCheck.user?.id === id) {
    return NextResponse.json(
      { error: "You cannot delete your own admin account." },
      { status: 400 }
    );
  }

  const { error } = await supabaseAdmin.auth.admin.deleteUser(id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const { error: profileError } = await supabaseAdmin
    .from("profiles")
    .delete()
    .eq("id", id);

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 400 });
  }

  return NextResponse.json({ id });
}
