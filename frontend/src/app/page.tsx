import Brand from "@/components/Brand";
import CategorySlider from "@/components/CategorySlider";
import TrustFeatures from "@/components/TrustFeatures";
import Cta from "@/components/Cta";
import FeaturedCollection from "@/components/FeaturedCollection";
import Hero from "@/components/Hero";
import NewSarees from "@/components/NewSarees";
import ShopByOccasion from "@/components/ShopByOccasion";
import Reels from "@/components/Reels";

export default function Home() {
  return (
    <main>
      <Hero />
      <CategorySlider />
      <NewSarees />
      <TrustFeatures />
      <FeaturedCollection />
      <Reels />
      <Brand />
      <ShopByOccasion />
      <Cta />
    </main>
  );
}
