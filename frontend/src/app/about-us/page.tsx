"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Heart,
  MapPin,
  PackageCheck,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Store,
  Users,
} from "lucide-react";

import Footer from "@/components/Footer";

export default function AboutUsPage() {
  return (
    <main className="min-h-screen bg-[#fffdf9] text-[#241b18]">
      {/* =========================================================
      HERO
      ========================================================= */}

      <section className="relative overflow-hidden border-b border-[#eadfd6] bg-[#f8eee7]">
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#a51c30]/10 blur-[120px]" />
        <div className="absolute -right-40 top-20 h-[450px] w-[450px] rounded-full bg-[#c99a45]/15 blur-[120px]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 py-16 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">
          {/* Hero Content */}
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#c99a45]/30 bg-white/75 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[#8d2635] shadow-sm backdrop-blur">
              <Sparkles className="h-4 w-4" />
              Indian Saree & Fashion Marketplace
            </div>

            <h1 className="max-w-3xl text-4xl font-extrabold leading-[1.05] tracking-tight text-[#241b18] sm:text-5xl lg:text-[4.4rem]">
              Discover Indian sarees, fashion &{" "}
              <span className="block bg-gradient-to-r from-[#a51c30] via-[#b62b3f] to-[#8d1729] bg-clip-text text-transparent">
                beautiful collections.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-8 text-[#6f625c] sm:text-lg">
              MYSMME is an Indian fashion marketplace connecting customers with
              saree sellers, boutiques, fashion businesses, and independent
              sellers. Our goal is to make it easier to discover traditional and
              contemporary Indian clothing online.
            </p>

            <p className="mt-4 max-w-xl text-sm leading-7 text-[#81736c]">
              From everyday sarees and festive collections to traditional
              designs and modern styles, MYSMME brings different sellers and
              Indian fashion products together in one convenient marketplace.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/products"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#a51c30] px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-[#a51c30]/20 transition-all hover:-translate-y-0.5 hover:bg-[#8e1729]"
              >
                Explore Sarees
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href="/seller"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#d8c8bd] bg-white px-6 py-3.5 text-sm font-bold text-[#4e403a] transition hover:border-[#a51c30] hover:text-[#a51c30]"
              >
                Become a Seller
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3">
              <TrustItem text="Indian fashion marketplace" />
              <TrustItem text="Built for customers & sellers" />
              <TrustItem text="Sarees & ethnic fashion" />
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute -inset-5 rounded-[2.5rem] bg-[#c99a45]/15 blur-2xl" />

            <div className="relative overflow-hidden rounded-[2.25rem] border border-white/80 bg-white p-3 shadow-2xl shadow-[#6f5145]/15">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-[#ead8cc]">
                <Image
                  src="/images/about-saree.jpg"
                  alt="Indian saree collection available through MYSMME"
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 45vw"
                />

                <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/20 bg-black/40 p-5 text-white backdrop-blur-xl">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/70">
                    Tradition • Craftsmanship • Style
                  </p>

                  <p className="mt-2 text-xl font-bold">
                    Indian fashion, brought together.
                  </p>

                  <p className="mt-1 text-sm text-white/70">
                    Discover sarees and collections from marketplace sellers.
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 -left-4 hidden rounded-2xl border border-[#eadfd6] bg-white p-4 shadow-xl sm:block lg:-left-8">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff3e5] text-[#b27a25]">
                  <Heart className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-[11px] text-[#887a73]">Our focus</p>

                  <p className="text-sm font-bold text-[#332723]">
                    Indian fashion & craftsmanship
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
      WHAT IS MYSMME
      ========================================================= */}

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#a51c30]">
            What Is MYSMME?
          </p>

          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#241b18] sm:text-4xl">
            An online marketplace for Indian sarees and fashion.
          </h2>

          <p className="mt-6 text-base leading-8 text-[#6f625c] sm:text-lg">
            MYSMME is a digital marketplace designed to connect shoppers with
            sellers offering sarees, ethnic wear, traditional Indian clothing,
            and other fashion products.
          </p>

          <p className="mt-4 text-base leading-8 text-[#6f625c]">
            Instead of searching across many individual stores and websites,
            customers can use one marketplace to discover different collections,
            compare products, find new sellers, and shop for Indian fashion
            online.
          </p>

          <p className="mt-4 text-base leading-8 text-[#6f625c]">
            At the same time, MYSMME gives saree sellers, boutiques, designers,
            and Indian fashion businesses an opportunity to create an online
            presence and reach customers beyond their local market.
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          <InfoCard
            icon={<ShoppingBag className="h-5 w-5" />}
            title="Discover Indian Fashion"
            description="Browse sarees, ethnic wear, traditional styles, and fashion collections from different marketplace sellers."
          />

          <InfoCard
            icon={<ShieldCheck className="h-5 w-5" />}
            title="A Convenient Shopping Experience"
            description="MYSMME is designed to make discovering products and shopping from different sellers simpler and more convenient."
          />

          <InfoCard
            icon={<Store className="h-5 w-5" />}
            title="A Marketplace for Sellers"
            description="Saree sellers, boutiques, designers, and fashion businesses can showcase their products to a wider online audience."
          />
        </div>
      </section>

      {/* =========================================================
      CATEGORIES / SEARCH INTENT
      ========================================================= */}

      <section className="border-y border-[#eadfd6] bg-[#fbf4ef]">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#a51c30]">
                Explore Indian Fashion
              </p>

              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#241b18] sm:text-4xl">
                Find sarees and styles for every occasion.
              </h2>

              <p className="mt-6 text-base leading-8 text-[#6f625c]">
                Indian sarees come in countless fabrics, weaving traditions,
                colors, patterns, and regional styles. MYSMME aims to make this
                variety easier to discover online.
              </p>

              <p className="mt-4 text-base leading-8 text-[#6f625c]">
                Whether you are looking for a saree for a wedding, festival,
                celebration, office, family occasion, or everyday wear, our
                marketplace is built to help you discover collections from
                different sellers.
              </p>

              <Link
                href="/products"
                className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-[#a51c30] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#a51c30]/15 transition hover:bg-[#8e1729]"
              >
                Browse Collections
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FashionCategory
                title="Traditional Sarees"
                text="Discover sarees inspired by India's rich textile and cultural traditions."
              />

              <FashionCategory
                title="Wedding & Festive Sarees"
                text="Explore statement styles for weddings, festivals, celebrations, and special occasions."
              />

              <FashionCategory
                title="Everyday Sarees"
                text="Find comfortable and versatile sarees suited for regular wear and everyday style."
              />

              <FashionCategory
                title="Contemporary Styles"
                text="Discover modern interpretations of Indian saree fashion and changing trends."
              />

              <FashionCategory
                title="Ethnic Fashion"
                text="Explore Indian clothing and fashion products beyond the traditional saree."
              />

              <FashionCategory
                title="Regional Craftsmanship"
                text="Discover the diversity of Indian textiles, patterns, techniques, and regional fashion."
              />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
      HOW IT WORKS
      ========================================================= */}

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#a51c30]">
            How MYSMME Works
          </p>

          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#241b18] sm:text-4xl">
            Bringing customers and sellers together.
          </h2>

          <p className="mt-5 text-base leading-7 text-[#6f625c]">
            MYSMME is designed around a simple marketplace model: sellers bring
            their products to the platform, and customers discover collections
            from different businesses in one place.
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          <StepCard
            number="01"
            icon={<Store className="h-5 w-5" />}
            title="Sellers List Products"
            text="Saree sellers, boutiques, designers, and fashion businesses can showcase their collections through their marketplace presence."
          />

          <StepCard
            number="02"
            icon={<ShoppingBag className="h-5 w-5" />}
            title="Customers Discover"
            text="Shoppers can explore sarees and Indian fashion products from different sellers and discover collections that match their style."
          />

          <StepCard
            number="03"
            icon={<PackageCheck className="h-5 w-5" />}
            title="Shop With Convenience"
            text="Customers can find products in one marketplace while sellers gain another digital channel to reach potential buyers."
          />
        </div>
      </section>

      {/* =========================================================
      STATS / BRAND STRIP
      ========================================================= */}

      <section className="border-y border-[#eadfd6] bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-[#e4d6cc] px-6 py-10 sm:grid-cols-4 lg:px-8">
          <BrandStat
            icon={<ShoppingBag className="h-5 w-5" />}
            title="Marketplace"
            text="Focused on Indian fashion"
          />

          <BrandStat
            icon={<Store className="h-5 w-5" />}
            title="For Sellers"
            text="Build an online presence"
          />

          <BrandStat
            icon={<Users className="h-5 w-5" />}
            title="For Customers"
            text="Discover new collections"
          />

          <BrandStat
            icon={<Heart className="h-5 w-5" />}
            title="Our Focus"
            text="Fashion with a human touch"
          />
        </div>
      </section>

      {/* =========================================================
      OUR STORY
      ========================================================= */}

      <section className="border-b border-[#eadfd6] bg-[#fffdf9]">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-20 lg:grid-cols-2 lg:px-8 lg:py-24">
          {/* Image */}
          <div className="relative">
            <div className="absolute -left-5 -top-5 h-32 w-32 rounded-full bg-[#a51c30]/10 blur-2xl" />

            <div className="relative overflow-hidden rounded-[2rem] border border-[#e6d6ca] bg-white p-3 shadow-xl">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-[#ead8cc]">
                <Image
                  src="/images/about-marketplace.jpg"
                  alt="Indian fashion marketplace and saree sellers"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>

          {/* Content */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#a51c30]">
              Our Story
            </p>

            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#241b18] sm:text-4xl">
              Making Indian fashion easier to discover online.
            </h2>

            <p className="mt-6 text-base leading-8 text-[#6f625c]">
              Indian fashion has an incredible range of styles, fabrics,
              craftsmanship, and regional traditions. Yet discovering products
              from smaller sellers and independent fashion businesses online can
              sometimes be difficult.
            </p>

            <p className="mt-4 text-base leading-8 text-[#6f625c]">
              MYSMME was created to help solve that problem by bringing
              customers and sellers together through a dedicated Indian fashion
              marketplace.
            </p>

            <p className="mt-4 text-base leading-8 text-[#6f625c]">
              Our focus begins with sarees because they represent one of the
              most diverse and enduring parts of Indian fashion. Over time, our
              vision is to create a broader marketplace for Indian clothing,
              ethnic fashion, accessories, and related products.
            </p>

            <div className="mt-8 space-y-4">
              <StoryPoint>
                Make saree and Indian fashion discovery easier online.
              </StoryPoint>

              <StoryPoint>
                Give sellers and boutiques another way to reach customers.
              </StoryPoint>

              <StoryPoint>
                Bring different Indian fashion collections together.
              </StoryPoint>

              <StoryPoint>
                Support the growth of digital commerce for fashion businesses.
              </StoryPoint>

              <StoryPoint>
                Celebrate India's diverse fashion traditions and craftsmanship.
              </StoryPoint>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
      WHY MYSMME
      ========================================================= */}

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
        <div className="text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#a51c30]">
            Why MYSMME?
          </p>

          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#241b18] sm:text-4xl">
            More than an online store.
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-base leading-7 text-[#6f625c]">
            MYSMME is being developed as a marketplace ecosystem for customers
            and Indian fashion businesses. The goal is to make discovery easier
            for shoppers while creating more opportunities for sellers.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <ValueCard
            icon={<Heart className="h-5 w-5" />}
            title="Indian Fashion"
            text="We are focused on the beauty, diversity, craftsmanship, and evolving style of Indian fashion."
          />

          <ValueCard
            icon={<Users className="h-5 w-5" />}
            title="Community"
            text="Customers, sellers, boutiques, designers, and fashion businesses are all part of the marketplace."
          />

          <ValueCard
            icon={<ShieldCheck className="h-5 w-5" />}
            title="Trust"
            text="We believe a successful marketplace should provide a clear, dependable, and convenient shopping experience."
          />

          <ValueCard
            icon={<Sparkles className="h-5 w-5" />}
            title="Discovery"
            text="Our goal is to help shoppers discover products and sellers they may not find through traditional shopping alone."
          />
        </div>
      </section>

      {/* =========================================================
      FOR CUSTOMERS + SELLERS
      ========================================================= */}

      <section className="relative overflow-hidden bg-[#241b18] text-white">
        <div className="absolute -left-40 top-0 h-[400px] w-[400px] rounded-full bg-[#a51c30]/20 blur-[120px]" />
        <div className="absolute -right-40 bottom-0 h-[400px] w-[400px] rounded-full bg-[#c99a45]/10 blur-[120px]" />

        <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-2 lg:px-8 lg:py-24">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#e6bd72]">
              For Customers & Sellers
            </p>

            <h2 className="mt-4 max-w-xl text-3xl font-extrabold tracking-tight sm:text-4xl">
              A marketplace where both sides can grow.
            </h2>

            <p className="mt-6 max-w-xl text-base leading-8 text-white/65">
              Customers want choice, discovery, convenience, and confidence when
              shopping online. Sellers want visibility, reach, and a digital
              platform for their products.
            </p>

            <p className="mt-4 max-w-xl text-base leading-8 text-white/65">
              MYSMME is designed to bring these needs together through one
              marketplace focused on Indian fashion.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/products"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#a51c30] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#c1243d]"
              >
                Start Exploring
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href="/seller"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/10"
              >
                Become a Seller
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <DarkFeature
              icon={<ShoppingBag className="h-5 w-5" />}
              title="For Customers"
              text="Discover sarees and Indian fashion products from different sellers in one marketplace."
            />

            <DarkFeature
              icon={<Store className="h-5 w-5" />}
              title="For Sellers"
              text="Create a digital presence, showcase products, and connect with customers beyond your local market."
            />

            <DarkFeature
              icon={<MapPin className="h-5 w-5" />}
              title="Indian Fashion"
              text="Explore styles, traditions, textiles, and products representing India's diverse fashion culture."
            />

            <DarkFeature
              icon={<Sparkles className="h-5 w-5" />}
              title="Growing Marketplace"
              text="MYSMME continues to evolve as more customers, sellers, and Indian fashion businesses join the platform."
            />
          </div>
        </div>
      </section>

      {/* =========================================================
      FOUNDER
      ========================================================= */}

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
        <div className="overflow-hidden rounded-[2rem] border border-[#eadfd6] bg-white shadow-xl shadow-[#6f5145]/5">
          <div className="grid items-stretch lg:grid-cols-[0.8fr_1.2fr]">
            {/* Founder Image */}
            <div className="relative min-h-[420px] bg-[#f3e5db]">
              <Image
                src="/images/sandeep-kumar.jpg"
                alt="Sandeep Kumar, Founder of MYSMME"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />

              <div className="absolute inset-x-5 bottom-5 rounded-2xl border border-white/20 bg-black/40 p-5 text-white backdrop-blur-xl">
                <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/65">
                  Founder
                </p>

                <p className="mt-1 text-xl font-bold">Sandeep Kumar</p>

                <p className="mt-1 text-sm text-white/65">Founder of MYSMME</p>
              </div>
            </div>

            {/* Founder Content */}
            <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-14">
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#a51c30]">
                Meet the Founder
              </p>

              <h2 className="mt-4 max-w-2xl text-3xl font-extrabold tracking-tight text-[#241b18] sm:text-4xl">
                Building a digital marketplace for Indian fashion.
              </h2>

              <p className="mt-6 max-w-2xl text-base leading-8 text-[#6f625c]">
                MYSMME is built around a straightforward idea: technology can
                help Indian fashion businesses reach more customers while making
                product discovery easier for shoppers.
              </p>

              <p className="mt-4 max-w-2xl text-base leading-8 text-[#6f625c]">
                The long-term vision is to create a marketplace that connects
                customers, sellers, boutiques, designers, and Indian fashion
                businesses in one digital ecosystem.
              </p>

              <p className="mt-4 max-w-2xl text-base leading-8 text-[#6f625c]">
                Starting with sarees and expanding into broader Indian fashion,
                MYSMME aims to combine the reach of modern technology with the
                heritage and diversity of India's fashion industry.
              </p>

              <div className="mt-8 rounded-2xl border border-[#eadfd6] bg-[#fbf4ef] p-5">
                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#a51c30] shadow-sm">
                    <Sparkles className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="font-bold text-[#241b18]">The vision</p>

                    <p className="mt-1 text-sm leading-6 text-[#6f625c]">
                      Build a trusted digital marketplace where Indian fashion
                      businesses can grow and customers can discover products
                      they genuinely love.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="https://www.linkedin.com/in/sandeep-kumar-182b8a23a/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Connect with Sandeep Kumar on LinkedIn"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#0A66C2] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#084f96]"
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-sm bg-white text-[11px] font-black text-[#0A66C2]">
                    in
                  </span>
                  Connect on LinkedIn
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>

                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#d8c8bd] px-5 py-3 text-sm font-bold text-[#4e403a] transition hover:border-[#a51c30] hover:text-[#a51c30]"
                >
                  Contact MYSMME
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
      FAQ / INDEXABLE CONTENT
      ========================================================= */}

      <section className="border-t border-[#eadfd6] bg-[#fbf4ef]">
        <div className="mx-auto max-w-4xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#a51c30]">
              Frequently Asked Questions
            </p>

            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#241b18] sm:text-4xl">
              About MYSMME
            </h2>
          </div>

          <div className="mt-12 space-y-4">
            <FaqItem
              question="What is MYSMME?"
              answer="MYSMME is an Indian fashion marketplace connecting customers with saree sellers, boutiques, designers, and fashion businesses. The platform is designed to make it easier to discover and shop for sarees and other Indian fashion products online."
            />

            <FaqItem
              question="What can I buy on MYSMME?"
              answer="MYSMME focuses on sarees and Indian fashion. Customers can discover traditional sarees, contemporary saree styles, festive and wedding collections, everyday sarees, ethnic wear, and other fashion products offered by marketplace sellers."
            />

            <FaqItem
              question="Is MYSMME a saree marketplace?"
              answer="Yes. Sarees are a core focus of MYSMME. The marketplace is being built to help customers discover sarees from different sellers while giving saree businesses a digital platform to showcase their collections."
            />

            <FaqItem
              question="Who can sell on MYSMME?"
              answer="MYSMME is designed for saree sellers, boutiques, designers, retailers, independent sellers, and Indian fashion businesses that want to showcase their products and reach customers through an online marketplace."
            />

            <FaqItem
              question="Why was MYSMME created?"
              answer="MYSMME was created to make Indian fashion easier to discover online and to help sellers reach customers beyond their immediate local markets. The broader vision is to build a digital ecosystem around Indian fashion and commerce."
            />

            <FaqItem
              question="Where can I explore MYSMME products?"
              answer="Customers can browse available products and collections through the MYSMME marketplace. Visit the products section to explore the current range of sarees and Indian fashion products."
            />
          </div>
        </div>
      </section>

      {/* =========================================================
      FINAL CTA
      ========================================================= */}

      <section className="border-t border-[#eadfd6] bg-[#f8eee7]">
        <div className="relative mx-auto max-w-4xl overflow-hidden px-6 py-20 text-center lg:py-24">
          <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#c99a45]/10 blur-[90px]" />

          <div className="relative">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#a51c30] text-white shadow-lg shadow-[#a51c30]/20">
              <ShoppingBag className="h-6 w-6" />
            </div>

            <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.28em] text-[#a51c30]">
              Discover MYSMME
            </p>

            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#241b18] sm:text-4xl">
              Discover your next saree.
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[#6f625c]">
              Explore Indian sarees, discover new sellers, and find fashion
              collections that match your style and occasion.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/products"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#a51c30] px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#a51c30]/20 transition hover:bg-[#8e1729]"
              >
                Shop the Collection
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href="/seller"
                className="inline-flex items-center justify-center rounded-xl border border-[#d8c8bd] bg-white px-7 py-3.5 text-sm font-bold text-[#4e403a] transition hover:border-[#a51c30] hover:text-[#a51c30]"
              >
                Sell on MYSMME
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

/* =========================================================
TRUST ITEM
========================================================= */

function TrustItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 text-xs font-medium text-[#665852]">
      <CheckCircle2 className="h-4 w-4 text-[#a51c30]" />
      {text}
    </div>
  );
}

/* =========================================================
BRAND STAT
========================================================= */

function BrandStat({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="flex items-center gap-3 px-3 py-2 sm:px-6">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fff2ed] text-[#a51c30] shadow-sm">
        {icon}
      </div>

      <div>
        <p className="text-sm font-bold text-[#302521]">{title}</p>

        <p className="mt-0.5 text-xs text-[#80716a]">{text}</p>
      </div>
    </div>
  );
}

/* =========================================================
INFO CARD
========================================================= */

function InfoCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group rounded-2xl border border-[#eadfd6] bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#ddc7ba] hover:shadow-xl hover:shadow-[#6f5145]/10">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff2ed] text-[#a51c30] transition group-hover:bg-[#a51c30] group-hover:text-white">
        {icon}
      </div>

      <h3 className="mt-5 text-lg font-bold text-[#241b18]">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-[#756860]">{description}</p>
    </div>
  );
}

/* =========================================================
FASHION CATEGORY
========================================================= */

function FashionCategory({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-[#eadfd6] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#fff2ed] text-[#a51c30]">
          <CheckCircle2 className="h-4 w-4" />
        </div>

        <div>
          <h3 className="font-bold text-[#241b18]">{title}</h3>

          <p className="mt-1.5 text-sm leading-6 text-[#756860]">{text}</p>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
STEP CARD
========================================================= */

function StepCard({
  number,
  icon,
  title,
  text,
}: {
  number: string;
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="relative rounded-2xl border border-[#eadfd6] bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff2ed] text-[#a51c30]">
          {icon}
        </div>

        <span className="text-3xl font-black text-[#a51c30]/10">{number}</span>
      </div>

      <h3 className="mt-6 text-lg font-bold text-[#241b18]">{title}</h3>

      <p className="mt-2 text-sm leading-7 text-[#756860]">{text}</p>
    </div>
  );
}

/* =========================================================
VALUE CARD
========================================================= */

function ValueCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-[#eadfd6] bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff2ed] text-[#a51c30]">
        {icon}
      </div>

      <h3 className="mt-5 font-bold text-[#241b18]">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-[#756860]">{text}</p>
    </div>
  );
}

/* =========================================================
STORY POINT
========================================================= */

function StoryPoint({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#a51c30]" />

      <p className="text-sm leading-6 text-[#5f514b]">{children}</p>
    </div>
  );
}

/* =========================================================
DARK FEATURE
========================================================= */

function DarkFeature({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-6 transition duration-300 hover:-translate-y-1 hover:bg-white/[0.1]">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#a51c30] text-white">
        {icon}
      </div>

      <h3 className="mt-5 font-bold text-white">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-white/55">{text}</p>
    </div>
  );
}

/* =========================================================
FAQ ITEM
========================================================= */

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="group rounded-2xl border border-[#eadfd6] bg-white p-5 shadow-sm">
      <summary className="cursor-pointer list-none pr-8 font-bold text-[#241b18] marker:hidden">
        <div className="flex items-center justify-between gap-4">
          <span>{question}</span>

          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#fff2ed] text-[#a51c30] transition group-open:rotate-45">
            +
          </span>
        </div>
      </summary>

      <p className="mt-4 border-t border-[#eadfd6] pt-4 text-sm leading-7 text-[#6f625c]">
        {answer}
      </p>
    </details>
  );
}
