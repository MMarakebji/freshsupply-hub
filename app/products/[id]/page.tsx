import { notFound } from "next/navigation";
import { Fredoka } from "next/font/google";
import ProductDetails from "@/components/products/ProductDetails";
import {
  getProductCards,
  getProductDetailById,
} from "@/features/products/productApi";

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

type ProductPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateStaticParams() {
  const products = await getProductCards();

  return products.map((product) => ({
    id: product.href?.replace("/products/", "") ?? product.id,
  }));
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProductDetailById(id);

  if (!product) {
    notFound();
  }

  return (
    <main className={`${fredoka.className} bg-white`}>
      <ProductDetails product={product} />
    </main>
  );
}
