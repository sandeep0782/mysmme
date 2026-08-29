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
        {/* Background decoration */}
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#a51c30]/10 blur-[120px]" />
        <div className="absolute -right-40 top-20 h-[450px] w-[450px] rounded-full bg-[#c99a45]/15 blur-[120px]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 py-16 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">
          {/* Hero Content */}
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#c99a45]/30 bg-white/75 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[#8d2635] shadow-sm backdrop-blur">
              <Sparkles className="h-4 w-4" />
              India's Saree Marketplace
            </div>

            <h1 className="max-w-3xl text-4xl font-extrabold leading-[1.05] tracking-tight text-[#241b18] sm:text-5xl lg:text-[4.4rem]">
              Discover the beauty of
              <span className="block bg-gradient-to-r from-[#a51c30] via-[#b62b3f] to-[#8d1729] bg-clip-text text-transparent">
                Indian sarees.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-8 text-[#6f625c] sm:text-lg">
              MYSMME is a modern marketplace created to bring saree lovers,
              sellers, boutiques, and Indian fashion businesses together in one
              beautiful shopping experience.
            </p>

            <p className="mt-4 max-w-xl text-sm leading-7 text-[#81736c]">
              From timeless traditional sarees to contemporary styles, we are
              building a place where discovering something beautiful feels
              simple, personal, and trustworthy.
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
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#d8c8bd] bg-white px-6 py-3.5 text-sm font-bold text-[#4e403a] transition hover:border-[#a51c30] hover:text-[#a51c30]"
              >
                Get in Touch
              </Link>
            </div>

            {/* Trust highlights */}
            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3">
              <TrustItem text="Marketplace focused on Indian fashion" />
              <TrustItem text="Built for customers & sellers" />
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute -inset-5 rounded-[2.5rem] bg-[#c99a45]/15 blur-2xl" />

            <div className="relative overflow-hidden rounded-[2.25rem] border border-white/80 bg-white p-3 shadow-2xl shadow-[#6f5145]/15">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-[#ead8cc]">
                <Image
                  src="/images/about-saree.jpg"
                  alt="Beautiful Indian saree collection"
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
                    Every saree has a story.
                  </p>

                  <p className="mt-1 text-sm text-white/70">
                    We are here to help you discover yours.
                  </p>
                </div>
              </div>
            </div>

            {/* Floating card */}
            <div className="absolute -bottom-6 -left-4 hidden rounded-2xl border border-[#eadfd6] bg-white p-4 shadow-xl sm:block lg:-left-8">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff3e5] text-[#b27a25]">
                  <Heart className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-[11px] text-[#887a73]">Made with</p>

                  <p className="text-sm font-bold text-[#332723]">
                    Love for Indian fashion
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
      INTRODUCTION
  ========================================================= */}

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#a51c30]">
            Who We Are
          </p>

          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#241b18] sm:text-4xl">
            A marketplace created around the saree.
          </h2>

          <p className="mt-6 text-base leading-8 text-[#6f625c] sm:text-lg">
            A saree is more than something you wear. It can represent a
            celebration, a memory, a family tradition, a craft, or simply a
            personal sense of style.
          </p>

          <p className="mt-4 text-base leading-8 text-[#6f625c]">
            MYSMME brings that richness into a modern digital marketplace,
            making it easier for customers to discover beautiful products while
            helping sellers and businesses reach a wider audience.
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          <InfoCard
            icon={<ShoppingBag className="h-5 w-5" />}
            title="Discover"
            description="Explore sarees and Indian fashion products from a growing marketplace of sellers and businesses."
          />

          <InfoCard
            icon={<ShieldCheck className="h-5 w-5" />}
            title="Shop With Confidence"
            description="We are building a transparent and dependable marketplace experience for customers and sellers."
          />

          <InfoCard
            icon={<Store className="h-5 w-5" />}
            title="Empower Sellers"
            description="We help sellers bring their collections online and connect with customers beyond their local markets."
          />
        </div>
      </section>

      {/* =========================================================
      STATS / BRAND STRIP
  ========================================================= */}

      <section className="border-y border-[#eadfd6] bg-[#fbf4ef]">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-[#e4d6cc] px-6 py-10 sm:grid-cols-4 lg:px-8">
          <BrandStat
            icon={<ShoppingBag className="h-5 w-5" />}
            title="Marketplace"
            text="Built for Indian fashion"
          />

          <BrandStat
            icon={<Store className="h-5 w-5" />}
            title="For Sellers"
            text="Grow your digital presence"
          />

          <BrandStat
            icon={<Users className="h-5 w-5" />}
            title="For Customers"
            text="Discover unique collections"
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

      <section className="border-b border-[#eadfd6] bg-white">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-20 lg:grid-cols-2 lg:px-8 lg:py-24">
          {/* Image */}
          <div className="relative">
            <div className="absolute -left-5 -top-5 h-32 w-32 rounded-full bg-[#a51c30]/10 blur-2xl" />

            <div className="relative overflow-hidden rounded-[2rem] border border-[#e6d6ca] bg-white p-3 shadow-xl">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-[#ead8cc]">
                <Image
                  src="/images/about-marketplace.jpg"
                  alt="Indian fashion marketplace"
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
              Connecting beautiful products with the people who love them.
            </h2>

            <p className="mt-6 text-base leading-8 text-[#6f625c]">
              The idea behind MYSMME is simple: talented sellers and Indian
              fashion businesses deserve a place where their products can be
              discovered by customers beyond their immediate surroundings.
            </p>

            <p className="mt-4 text-base leading-8 text-[#6f625c]">
              We are building MYSMME as a marketplace where traditional
              craftsmanship and modern technology can come together — giving
              customers more choice and sellers more opportunity.
            </p>

            <div className="mt-8 space-y-4">
              <StoryPoint>
                Making saree discovery easier and more enjoyable.
              </StoryPoint>

              <StoryPoint>
                Helping sellers showcase their collections online.
              </StoryPoint>

              <StoryPoint>
                Creating a marketplace built around trust and convenience.
              </StoryPoint>

              <StoryPoint>
                Celebrating the diversity of Indian fashion.
              </StoryPoint>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
      VALUES
  ========================================================= */}

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
        <div className="text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#a51c30]">
            What We Believe
          </p>

          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#241b18] sm:text-4xl">
            Built around people, products & trust.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#6f625c]">
            We do not want MYSMME to feel like just another online store. Our
            goal is to create an ecosystem where customers, sellers, creators,
            and businesses can grow together.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <ValueCard
            icon={<Heart className="h-5 w-5" />}
            title="Passion"
            text="We appreciate the artistry, culture, craftsmanship, and beauty behind Indian fashion."
          />

          <ValueCard
            icon={<Users className="h-5 w-5" />}
            title="Community"
            text="Customers, sellers, creators, and businesses are all part of the marketplace we are building."
          />

          <ValueCard
            icon={<ShieldCheck className="h-5 w-5" />}
            title="Trust"
            text="A marketplace becomes meaningful when customers and sellers can rely on the experience."
          />

          <ValueCard
            icon={<PackageCheck className="h-5 w-5" />}
            title="Experience"
            text="Every part of MYSMME is designed to make discovering and buying products simpler."
          />
        </div>
      </section>

      {/* =========================================================
      DARK MARKETPLACE SECTION
  ========================================================= */}

      <section className="relative overflow-hidden bg-[#241b18] text-white">
        <div className="absolute -left-40 top-0 h-[400px] w-[400px] rounded-full bg-[#a51c30]/20 blur-[120px]" />
        <div className="absolute -right-40 bottom-0 h-[400px] w-[400px] rounded-full bg-[#c99a45]/10 blur-[120px]" />

        <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-2 lg:px-8 lg:py-24">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#e6bd72]">
              More Than Shopping
            </p>

            <h2 className="mt-4 max-w-xl text-3xl font-extrabold tracking-tight sm:text-4xl">
              A place where Indian fashion can grow.
            </h2>

            <p className="mt-6 max-w-xl text-base leading-8 text-white/65">
              MYSMME is designed to bring customers and sellers onto one
              marketplace. Whether you are searching for your next saree or
              building your fashion business, we want the platform to work for
              you.
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
              text="Discover products from different sellers in one convenient marketplace."
            />

            <DarkFeature
              icon={<Store className="h-5 w-5" />}
              title="For Sellers"
              text="Showcase your products and reach customers through a digital storefront."
            />

            <DarkFeature
              icon={<MapPin className="h-5 w-5" />}
              title="Indian Fashion"
              text="Celebrate styles, traditions, and products from different parts of India."
            />

            <DarkFeature
              icon={<Sparkles className="h-5 w-5" />}
              title="Always Evolving"
              text="We continue improving the marketplace as our customers and sellers grow."
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
                alt="Sandeep Kumar - Founder of MYSMME"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />

              <div className="absolute inset-x-5 bottom-5 rounded-2xl border border-white/20 bg-black/40 p-5 text-white backdrop-blur-xl">
                <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/65">
                  Founder
                </p>

                <p className="mt-1 text-xl font-bold">Sandeep Kumar</p>

                <p className="mt-1 text-sm text-white/65">Building MYSMME</p>
              </div>
            </div>

            {/* Founder Content */}
            <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-14">
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#a51c30]">
                Meet the Founder
              </p>

              <h2 className="mt-4 max-w-2xl text-3xl font-extrabold tracking-tight text-[#241b18] sm:text-4xl">
                Building MYSMME with a vision for modern Indian commerce.
              </h2>

              <p className="mt-6 max-w-2xl text-base leading-8 text-[#6f625c]">
                MYSMME is built on a simple belief: technology should help
                businesses reach more people while making shopping easier, more
                transparent, and more enjoyable for customers.
              </p>

              <p className="mt-4 max-w-2xl text-base leading-8 text-[#6f625c]">
                The vision is to create a marketplace that brings together
                products, sellers, customers, and the rich heritage of Indian
                fashion in one digital ecosystem.
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
              Your next saree might be waiting for you.
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[#6f625c]">
              Explore collections, discover sellers, and find something that
              feels uniquely yours.
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
                href="/"
                className="inline-flex items-center justify-center rounded-xl border border-[#d8c8bd] bg-white px-7 py-3.5 text-sm font-bold text-[#4e403a] transition hover:border-[#a51c30] hover:text-[#a51c30]"
              >
                Back to Home
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
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#a51c30] shadow-sm">
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
