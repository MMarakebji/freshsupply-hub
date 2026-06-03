import AboutUs from "@/components/home/AboutUs";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import HomeHighlights from "@/components/home/HomeHighlights";
import HeroSection from "@/components/home/HeroSection";
import ProductPromotions from "@/components/home/ProductPromotions";
import { getProductCards } from "@/features/products/productApi";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const products = await getProductCards({
    featuredOnly: true,
    orderBy: "updated_at",
    limit: 4,
  });

  return (
    <main>
      <HeroSection />
      <HomeHighlights />
      <FeaturedProducts products={products} />
      <ProductPromotions />
      <AboutUs />
    </main>
  );
}
