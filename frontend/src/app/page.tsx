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
  const storeSchema = {
    "@context": "https://schema.org",
    "@type": "OnlineStore",
    name: "MYSMME",
    alternateName: "MYSMME Saree Marketplace",
    description:
      "Online marketplace for buying and selling sarees and Indian ethnic wear.",
    url: "https://mysmme.com",
    areaServed: "India",
    knowsAbout: [
      "Sarees",
      "Silk sarees",
      "Cotton sarees",
      "Indian ethnic wear",
      "Women's fashion",
      "Traditional Indian clothing",
      "Online saree shopping",
      "Saree marketplace",
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(storeSchema),
        }}
      />

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
    </>
  );
}
