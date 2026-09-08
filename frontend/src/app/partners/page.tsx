import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  BriefcaseBusiness,
  Building2,
  Camera,
  CheckCircle2,
  ChevronRight,
  Code2,
  Handshake,
  Heart,
  Lightbulb,
  Megaphone,
  Network,
  PackageCheck,
  Rocket,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Store,
  Truck,
  Users,
} from "lucide-react";

/* ================================================================
   METADATA
================================================================ */

export const metadata: Metadata = {
  title: "Partner with MYSMME | India's Dedicated Saree Marketplace",
  description:
    "Partner with MYSMME, India's dedicated saree marketplace. Explore opportunities for creators, affiliates, seller growth partners, technology providers, service companies, brands and strategic partners.",
  alternates: {
    canonical: "/partners",
  },
  openGraph: {
    title: "Partner with MYSMME",
    description:
      "Collaborate with MYSMME and help grow India's saree ecosystem.",
    url: "/partners",
    type: "website",
  },
};

/* ================================================================
   PARTNERSHIP PROGRAMS
================================================================ */

const partnerPrograms = [
  {
    id: "creator",
    icon: Megaphone,
    number: "01",
    title: "Creator & Affiliate Partners",
    shortTitle: "Creators & Affiliates",
    description:
      "For creators, influencers, bloggers and saree enthusiasts who want to introduce their audience to MYSMME.",
    suitableFor: [
      "Fashion creators",
      "Saree influencers",
      "Bloggers & publishers",
      "YouTube creators",
      "Social media creators",
    ],
    highlights: [
      "Collaborate on saree-focused campaigns",
      "Introduce your audience to MYSMME",
      "Explore content and promotional opportunities",
    ],
  },
  {
    id: "seller-growth",
    icon: Users,
    number: "02",
    title: "Seller Growth Partners",
    shortTitle: "Seller Growth",
    description:
      "For individuals and organisations that work with saree sellers, manufacturers, boutiques and textile businesses.",
    suitableFor: [
      "E-commerce consultants",
      "Seller onboarding agencies",
      "Saree wholesalers",
      "Textile associations",
      "Business consultants",
    ],
    highlights: [
      "Help sellers discover MYSMME",
      "Support marketplace onboarding",
      "Work together to grow seller participation",
    ],
  },
  {
    id: "technology",
    icon: Code2,
    number: "03",
    title: "Technology & Service Partners",
    shortTitle: "Technology & Services",
    description:
      "For companies and professionals providing technology or services that can improve the MYSMME commerce ecosystem.",
    suitableFor: [
      "Technology companies",
      "Logistics providers",
      "Photography services",
      "Cataloguing agencies",
      "Marketing & analytics teams",
    ],
    highlights: [
      "Explore technology integrations",
      "Support sellers with useful services",
      "Improve marketplace experiences together",
    ],
  },
  {
    id: "strategic",
    icon: Handshake,
    number: "04",
    title: "Brand & Strategic Partners",
    shortTitle: "Brand & Strategic",
    description:
      "For saree brands, designers, communities and organisations interested in meaningful collaborations with MYSMME.",
    suitableFor: [
      "Saree brands",
      "Designers",
      "Weaving communities",
      "Textile organisations",
      "Events & exhibitions",
    ],
    highlights: [
      "Explore co-marketing opportunities",
      "Create special saree campaigns",
      "Build meaningful industry collaborations",
    ],
  },
];

/* ================================================================
   PAGE
================================================================ */

export default function PartnersPage() {
  return (
    <main className="min-h-screen bg-[#fcfaf9] text-[#241b18]">
      {/* ============================================================
          HERO
      ============================================================ */}

      <section className="relative overflow-hidden border-b border-[#eadfd6] bg-gradient-to-br from-[#fffaf7] via-[#fdf4ef] to-[#f7e8e4]">
        {/* Decorative backgrounds */}

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-red-200/30 blur-[120px]"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 top-10 h-[520px] w-[520px] rounded-full bg-amber-200/20 blur-[120px]"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-10 top-24 hidden h-80 w-80 rounded-full border border-red-200/40 lg:block"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-20 top-36 hidden h-60 w-60 rounded-full border border-red-200/30 lg:block"
        />

        <div className="relative mx-auto max-w-7xl px-5 pb-20 pt-6 sm:px-6 lg:px-8 lg:pb-28">
          {/* Breadcrumb */}

          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs font-medium text-gray-500"
          >
            <Link href="/" className="transition hover:text-red-600">
              Home
            </Link>

            <ChevronRight
              aria-hidden="true"
              className="h-3.5 w-3.5 text-gray-300"
            />

            <span className="font-semibold text-gray-800">Partners</span>
          </nav>

          {/* Hero content */}

          <div className="mx-auto max-w-4xl pt-16 text-center sm:pt-20 lg:pt-24">
            <div className="inline-flex items-center gap-2 rounded-full border border-red-100 bg-white/80 px-4 py-2 shadow-sm backdrop-blur">
              <Handshake className="h-4 w-4 text-red-600" />

              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-red-600">
                Partner with MYSMME
              </span>
            </div>

            <h1 className="mt-7 text-4xl font-extrabold leading-[1.05] tracking-tight text-gray-950 sm:text-5xl lg:text-7xl">
              Let&apos;s grow India&apos;s
              <span className="mt-2 block bg-gradient-to-r from-red-600 via-red-500 to-amber-500 bg-clip-text text-transparent">
                saree ecosystem together.
              </span>
            </h1>

            <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-gray-600 sm:text-lg">
              Collaborate with MYSMME to help saree shoppers discover more,
              sellers grow their businesses and India&apos;s saree ecosystem
              reach more customers.
            </p>

            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/partners/apply"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-red-600 px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-red-600/20 transition hover:-translate-y-0.5 hover:bg-red-700"
              >
                Become a Partner
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <a
                href="#partner-programs"
                className="inline-flex items-center justify-center rounded-full border border-gray-200 bg-white px-7 py-3.5 text-sm font-bold text-gray-700 transition hover:border-red-200 hover:text-red-600"
              >
                Explore Programs
              </a>
            </div>
          </div>

          {/* Hero mini stats/features */}

          <div className="mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-3 lg:grid-cols-4">
            <HeroFeature
              icon={<ShoppingBag className="h-4 w-4" />}
              text="Saree Focused"
            />

            <HeroFeature
              icon={<Store className="h-4 w-4" />}
              text="Seller Ecosystem"
            />

            <HeroFeature
              icon={<Users className="h-4 w-4" />}
              text="Collaborations"
            />

            <HeroFeature
              icon={<Rocket className="h-4 w-4" />}
              text="Growth Focused"
            />
          </div>
        </div>
      </section>

      {/* ============================================================
          INTRO
      ============================================================ */}

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-red-600">
              Build with MYSMME
            </p>

            <h2 className="mt-4 text-3xl font-extrabold leading-tight text-gray-950 sm:text-4xl">
              Better partnerships.
              <span className="block text-red-600">Stronger ecosystem.</span>
            </h2>

            <div className="mt-5 h-1 w-14 rounded-full bg-red-500" />
          </div>

          <div>
            <p className="text-base leading-8 text-gray-600 sm:text-lg">
              MYSMME is building a marketplace dedicated to sarees. That creates
              opportunities to work with creators, technology providers, service
              companies, consultants, brands and organisations across India.
            </p>

            <p className="mt-5 text-sm leading-7 text-gray-500 sm:text-base">
              We&apos;re interested in partnerships that create real value for
              shoppers, sellers and the wider saree ecosystem. Whether you bring
              an audience, technology, services, industry expertise or a great
              collaboration idea, we&apos;d like to hear from you.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================
          WHY PARTNER
      ============================================================ */}

      <section className="border-y border-[#eadfd6] bg-white">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-red-600">
              Why partner with us
            </p>

            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-gray-950 sm:text-4xl">
              Grow through collaboration.
            </h2>

            <p className="mt-4 text-sm leading-7 text-gray-500 sm:text-base">
              Work with a marketplace built around one of India&apos;s most
              iconic fashion categories.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <ValueCard
              icon={<ShoppingBag className="h-5 w-5" />}
              title="Saree Focused"
              description="Collaborate with a marketplace focused specifically on sarees and their shoppers."
            />

            <ValueCard
              icon={<Store className="h-5 w-5" />}
              title="Support Sellers"
              description="Help saree sellers and brands build stronger digital commerce capabilities."
            />

            <ValueCard
              icon={<Lightbulb className="h-5 w-5" />}
              title="Build Together"
              description="Explore thoughtful partnerships designed around shared opportunities."
            />

            <ValueCard
              icon={<BarChart3 className="h-5 w-5" />}
              title="Create Growth"
              description="Develop collaborations that can create value for both organisations."
            />
          </div>
        </div>
      </section>

      {/* ============================================================
          PARTNER PROGRAMS
      ============================================================ */}

      <section id="partner-programs" className="scroll-mt-24 bg-[#fcfaf9]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-red-600">
              Partnership programs
            </p>

            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-gray-950 sm:text-4xl">
              Find the right way to partner.
            </h2>

            <p className="mt-4 text-sm leading-7 text-gray-500 sm:text-base">
              Explore partnership opportunities designed for different kinds of
              collaborators.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {partnerPrograms.map((program) => {
              const Icon = program.icon;

              return (
                <article
                  key={program.id}
                  className="group relative overflow-hidden rounded-[1.75rem] border border-[#eadfd6] bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-red-200 hover:shadow-xl hover:shadow-[#6d4535]/10 sm:p-8"
                >
                  {/* Number */}

                  <span className="absolute right-6 top-5 text-5xl font-black text-gray-100 transition group-hover:text-red-50 sm:right-8">
                    {program.number}
                  </span>

                  <div className="relative">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600 transition duration-300 group-hover:bg-red-600 group-hover:text-white">
                      <Icon className="h-5 w-5" />
                    </div>

                    <h3 className="mt-6 text-xl font-extrabold text-gray-950 sm:text-2xl">
                      {program.title}
                    </h3>

                    <p className="mt-3 max-w-xl text-sm leading-7 text-gray-500">
                      {program.description}
                    </p>

                    {/* Highlights */}

                    <div className="mt-6 space-y-3">
                      {program.highlights.map((highlight) => (
                        <div
                          key={highlight}
                          className="flex items-start gap-2.5"
                        >
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />

                          <p className="text-xs leading-6 text-gray-600">
                            {highlight}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Suitable for */}

                    <div className="mt-7 border-t border-gray-100 pt-6">
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400">
                        Suitable for
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {program.suitableFor.map((item) => (
                          <span
                            key={item}
                            className="rounded-lg border border-gray-100 bg-[#fcfaf9] px-3 py-1.5 text-[11px] font-medium text-gray-500"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* CTA */}

                    <Link
                      href={`/partners/apply?type=${program.id}`}
                      className="group/button mt-7 inline-flex items-center gap-2 text-sm font-bold text-red-600 transition hover:text-red-700"
                    >
                      Become a {program.shortTitle} Partner
                      <ArrowRight className="h-4 w-4 transition-transform group-hover/button:translate-x-1" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================
          HOW IT WORKS
      ============================================================ */}

      <section className="border-y border-[#eadfd6] bg-[#241b18] text-white">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-red-400">
              How it works
            </p>

            <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">
              From idea to partnership.
            </h2>

            <p className="mt-4 text-sm leading-7 text-white/50 sm:text-base">
              Start a conversation with MYSMME in four simple steps.
            </p>
          </div>

          <div className="relative mt-14 grid gap-5 md:grid-cols-4">
            <ProcessStep
              number="01"
              title="Choose"
              text="Select the partnership program that best fits you."
            />

            <ProcessStep
              number="02"
              title="Apply"
              text="Tell us about yourself, your organisation and your idea."
            />

            <ProcessStep
              number="03"
              title="Connect"
              text="Our team reviews the opportunity and connects where there's a fit."
            />

            <ProcessStep
              number="04"
              title="Collaborate"
              text="Define the partnership and start building together."
            />
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/partners/apply"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-red-600 px-7 py-3.5 text-sm font-bold text-white transition hover:bg-red-500"
            >
              Start Your Application
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================
          WHO CAN PARTNER
      ============================================================ */}

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-red-600">
                Who can partner?
              </p>

              <h2 className="mt-4 text-3xl font-extrabold leading-tight text-gray-950 sm:text-4xl">
                Great partnerships can come from anywhere.
              </h2>

              <p className="mt-5 max-w-xl text-sm leading-7 text-gray-500 sm:text-base">
                You don&apos;t need to be a large company to start a
                conversation. We&apos;re interested in individuals, startups,
                agencies, communities and established organisations with
                relevant ideas and capabilities.
              </p>

              <Link
                href="/partners/apply"
                className="group mt-7 inline-flex items-center gap-2 text-sm font-bold text-red-600 hover:text-red-700"
              >
                Tell Us Your Idea
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <PartnerType
                icon={<Megaphone className="h-5 w-5" />}
                title="Creators"
              />

              <PartnerType
                icon={<BriefcaseBusiness className="h-5 w-5" />}
                title="Agencies"
              />

              <PartnerType
                icon={<Code2 className="h-5 w-5" />}
                title="Technology"
              />

              <PartnerType
                icon={<Truck className="h-5 w-5" />}
                title="Logistics"
              />

              <PartnerType
                icon={<Camera className="h-5 w-5" />}
                title="Photography"
              />

              <PartnerType
                icon={<Building2 className="h-5 w-5" />}
                title="Consultants"
              />

              <PartnerType
                icon={<Store className="h-5 w-5" />}
                title="Saree Brands"
              />

              <PartnerType
                icon={<PackageCheck className="h-5 w-5" />}
                title="Manufacturers"
              />

              <PartnerType
                icon={<Network className="h-5 w-5" />}
                title="Communities"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          WHAT WE LOOK FOR
      ============================================================ */}

      <section className="border-y border-[#eadfd6] bg-[#fcfaf9]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div className="rounded-[2rem] border border-[#eadfd6] bg-white p-7 shadow-sm sm:p-10">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                <BadgeCheck className="h-5 w-5" />
              </div>

              <h2 className="mt-6 text-2xl font-extrabold text-gray-950 sm:text-3xl">
                What makes a strong partnership?
              </h2>

              <p className="mt-4 text-sm leading-7 text-gray-500">
                We&apos;re most interested in partnerships where both sides can
                contribute meaningful value and where the collaboration benefits
                the MYSMME ecosystem.
              </p>

              <div className="mt-7 space-y-4">
                <Checklist text="A clear and relevant partnership idea" />

                <Checklist text="Value for shoppers, sellers or the saree ecosystem" />

                <Checklist text="Professional and transparent collaboration" />

                <Checklist text="A long-term approach where appropriate" />
              </div>
            </div>

            <div className="px-0 lg:px-8">
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-red-600">
                Our approach
              </p>

              <h2 className="mt-4 text-3xl font-extrabold leading-tight text-gray-950 sm:text-4xl">
                Partnership should create value on both sides.
              </h2>

              <p className="mt-5 text-sm leading-7 text-gray-500 sm:text-base">
                Every partnership is different. We review proposals based on
                relevance, potential impact, capabilities and how well the
                opportunity aligns with MYSMME.
              </p>

              <div className="mt-7 flex items-start gap-3 rounded-2xl border border-amber-100 bg-amber-50/60 p-5">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />

                <p className="text-xs leading-6 text-amber-900/70">
                  Partnership structures, responsibilities and commercial terms,
                  where applicable, are discussed individually after an
                  opportunity has been reviewed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          FAQ
      ============================================================ */}

      <section className="bg-white">
        <div className="mx-auto max-w-4xl px-5 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-red-600">
              Frequently asked questions
            </p>

            <h2 className="mt-4 text-3xl font-extrabold text-gray-950 sm:text-4xl">
              Partnership FAQ
            </h2>
          </div>

          <div className="mt-12 divide-y divide-[#eadfd6] border-y border-[#eadfd6]">
            <FaqItem
              question="Who can apply to become a MYSMME partner?"
              answer="Individuals, creators, agencies, technology companies, service providers, brands, consultants, industry organisations and other businesses with a relevant partnership idea can submit an application."
            />

            <FaqItem
              question="Can individuals apply?"
              answer="Yes. You do not need to represent a large company. Creators, consultants, freelancers and other individuals can apply where their skills, audience or services are relevant to MYSMME."
            />

            <FaqItem
              question="Is there a joining fee?"
              answer="Submitting a partnership application does not itself create a partnership or commercial commitment. Any commercial terms, fees or other arrangements, where applicable, would be discussed for the specific opportunity."
            />

            <FaqItem
              question="What happens after I apply?"
              answer="MYSMME can review the information you provide and contact you if the opportunity appears relevant for further discussion."
            />

            <FaqItem
              question="Can I propose a partnership that is not listed here?"
              answer="Yes. The listed programs cover common partnership types, but you can submit another collaboration idea through the partner application."
            />
          </div>
        </div>
      </section>

      {/* ============================================================
          FINAL CTA
      ============================================================ */}

      <section className="relative overflow-hidden bg-[#241b18]">
        <div
          aria-hidden="true"
          className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-red-600/20 blur-[100px]"
        />

        <div
          aria-hidden="true"
          className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-amber-500/10 blur-[100px]"
        />

        <div className="relative mx-auto max-w-4xl px-5 py-20 text-center sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-600 text-white shadow-xl shadow-red-600/20">
            <Handshake className="h-6 w-6" />
          </div>

          <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Let&apos;s build something
            <span className="block text-[#e0b96b]">meaningful together.</span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/55 sm:text-base">
            If you have an audience, technology, service, network or
            collaboration idea that can add value to the saree ecosystem,
            we&apos;d like to hear from you.
          </p>

          <Link
            href="/partners/apply"
            className="group mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-red-600 px-7 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-red-500"
          >
            Become a Partner
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </main>
  );
}

/* ================================================================
   HERO FEATURE
================================================================ */

function HeroFeature({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center justify-center gap-2 rounded-xl border border-white/70 bg-white/60 px-3 py-3 text-xs font-bold text-gray-600 shadow-sm backdrop-blur">
      <span className="text-red-500">{icon}</span>

      <span>{text}</span>
    </div>
  );
}

/* ================================================================
   VALUE CARD
================================================================ */

function ValueCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group rounded-2xl border border-[#eadfd6] bg-[#fcfaf9] p-6 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#6d4535]/10">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600 transition group-hover:bg-red-600 group-hover:text-white">
        {icon}
      </div>

      <h3 className="mt-5 text-sm font-extrabold text-gray-950">{title}</h3>

      <p className="mt-2 text-xs leading-6 text-gray-500">{description}</p>
    </div>
  );
}

/* ================================================================
   PROCESS STEP
================================================================ */

function ProcessStep({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="relative rounded-2xl border border-white/10 bg-white/[0.04] p-6">
      <span className="text-3xl font-black text-red-500/30">{number}</span>

      <h3 className="mt-4 text-base font-extrabold text-white">{title}</h3>

      <p className="mt-2 text-xs leading-6 text-white/45">{text}</p>
    </div>
  );
}

/* ================================================================
   PARTNER TYPE
================================================================ */

function PartnerType({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="group flex min-h-[120px] flex-col items-center justify-center rounded-2xl border border-[#eadfd6] bg-[#fcfaf9] p-4 text-center transition duration-300 hover:-translate-y-1 hover:border-red-200 hover:bg-red-50/30">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-red-600 shadow-sm transition group-hover:bg-red-600 group-hover:text-white">
        {icon}
      </div>

      <span className="mt-3 text-xs font-bold text-gray-700">{title}</span>
    </div>
  );
}

/* ================================================================
   CHECKLIST
================================================================ */

function Checklist({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3">
      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />

      <p className="text-sm leading-6 text-gray-600">{text}</p>
    </div>
  );
}

/* ================================================================
   FAQ
================================================================ */

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="group py-5">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-sm font-extrabold text-gray-900">
        <span>{question}</span>

        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600 transition group-open:rotate-90">
          <ChevronRight className="h-4 w-4" />
        </span>
      </summary>

      <p className="max-w-3xl pr-10 pt-4 text-sm leading-7 text-gray-500">
        {answer}
      </p>
    </details>
  );
}
