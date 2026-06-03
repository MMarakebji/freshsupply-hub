import AdminAuthGuard from "@/components/admin/AdminAuthGuard";
import AdminShell from "@/components/admin/AdminShell";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AdminAuthGuard>
      <AdminShell>{children}</AdminShell>
    </AdminAuthGuard>
  );
}
