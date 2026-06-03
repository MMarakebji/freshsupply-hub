import CategoryForm from "@/components/forms/CategoryForm";

type EditCategoryPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
  const { id } = await params;

  return <CategoryForm mode="edit" categoryId={id} />;
}
