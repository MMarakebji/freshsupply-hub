import AdminUserForm from "@/components/forms/AdminUserForm";

type EditAdminUserPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditAdminUserPage({
  params,
}: EditAdminUserPageProps) {
  const { id } = await params;

  return <AdminUserForm mode="edit" userId={id} />;
}
