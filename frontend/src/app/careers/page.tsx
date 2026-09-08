import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  CheckCircle2,
  Code2,
  Heart,
  Lightbulb,
  MapPin,
  Megaphone,
  Palette,
  Rocket,
  Sparkles,
  Store,
  Users,
} from "lucide-react";

/* ================================================================
   METADATA
================================================================ */

export const metadata: Metadata = {
  title: "Careers at MYSMME | Join India's Dedicated Saree Marketplace",
  description:
    "Explore career and freelance opportunities at MYSMME. Join us in technology, marketing, design, content and growth as we build India's dedicated saree marketplace.",
  alternates: {
    canonical: "/careers",
  },
  openGraph: {
    title: "Careers at MYSMME",
    description:
      "Join MYSMME and help us build India's dedicated saree marketplace.",
    url: "/careers",
    type: "website",
  },
};

/* ================================================================
   JOB DATA
================================================================ */

const jobOpenings = [
  {
    id: "technology-developer",
    icon: Code2,
    title: "Technology / Full-Stack Developer",
    type: "Full-time / Freelance",
    category: "Technology",
    description:
      "Help build and improve the MYSMME marketplace, seller platform and customer shopping experience.",
    skills: ["Next.js / React", "Node.js", "APIs & Databases", "E-commerce"],
    responsibilities: [
      "Build and improve customer-facing marketplace features.",
      "Develop and maintain seller-side tools and workflows.",
      "Work with APIs, databases and marketplace integrations.",
      "Improve website performance, reliability and user experience.",
    ],
  },
  {
    id: "marketing-manager",
    icon: Megaphone,
    title: "Marketing Manager",
    type: "Full-time",
    category: "Marketing",
    description:
      "Help grow MYSMME by building our brand, customer acquisition strategy and digital presence across India.",
    skills: [
      "Digital Marketing",
      "Social Media",
      "SEO & Content",
      "Performance Marketing",
    ],
    responsibilities: [
      "Plan and execute digital marketing campaigns.",
      "Grow MYSMME's presence across relevant social platforms.",
      "Develop SEO, content and customer acquisition strategies.",
      "Track campaign performance and identify growth opportunities.",
    ],
  },
  {
    id: "freelancers",
    icon: Palette,
    title: "Freelancers & Creative Partners",
    type: "Freelance / Project-based",
    category: "Creative & Growth",
    description:
      "We're looking for talented freelancers who can help MYSMME create compelling content, campaigns and digital experiences.",
    skills: [
      "Graphic Design",
      "Content Creation",
      "Photography & Video",
      "Social Media",
    ],
    responsibilities: [
      "Create visual content for campaigns and social media.",
      "Support product, fashion and saree-related content creation.",
      "Contribute to photography, video, design or marketing projects.",
      "Collaborate with MYSMME on project-based creative requirements.",
    ],
  },
];

/* ================================================================
   CAREERS PAGE
================================================================ */

export default function CareersPage() {
  return (
    <main className="min-h-screen bg-[#fcfaf9] text-[#241b18]">
      {/* ============================================================
          HERO
      ============================================================ */}

      <section className="relative overflow-hidden border-b border-[#eadfd6] bg-gradient-to-br from-[#fffaf7] via-[#fdf4ef] to-[#f7e8e4]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-red-200/30 blur-[110px]"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 top-10 h-[500px] w-[500px] rounded-full bg-amber-200/20 blur-[120px]"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-10 top-20 hidden h-80 w-80 rounded-full border border-red-200/40 lg:block"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-20 top-32 hidden h-60 w-60 rounded-full border border-red-200/30 lg:block"
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

            <span aria-hidden="true">/</span>

            <span className="font-semibold text-gray-800">Careers</span>
          </nav>

          {/* Hero content */}

          <div className="mx-auto max-w-4xl pt-16 text-center sm:pt-20 lg:pt-24">
            <div className="inline-flex items-center gap-2 rounded-full border border-red-100 bg-white/80 px-4 py-2 shadow-sm backdrop-blur">
              <Sparkles className="h-4 w-4 text-amber-500" />

              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-red-600">
                Careers at MYSMME
              </span>
            </div>

            <h1 className="mt-7 text-4xl font-extrabold leading-[1.05] tracking-tight text-gray-950 sm:text-5xl lg:text-7xl">
              Build the future of
              <span className="mt-2 block bg-gradient-to-r from-red-600 via-red-500 to-amber-500 bg-clip-text text-transparent">
                saree shopping in India.
              </span>
            </h1>

            <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-gray-600 sm:text-lg">
              Join MYSMME and help us build a marketplace dedicated to sarees,
              bringing shoppers, sellers and brands together in one beautiful
              digital destination.
            </p>

            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href="#open-positions"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-red-600 px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-red-600/20 transition hover:-translate-y-0.5 hover:bg-red-700"
              >
                View Open Positions
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>

              <a
                href="#life-at-mysmme"
                className="inline-flex items-center justify-center rounded-full border border-gray-200 bg-white px-7 py-3.5 text-sm font-bold text-gray-700 transition hover:border-red-200 hover:text-red-600"
              >
                Life at MYSMME
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          WHY MYSMME
      ============================================================ */}

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-red-600">
              Why MYSMME
            </p>

            <h2 className="mt-4 text-3xl font-extrabold leading-tight text-gray-950 sm:text-4xl">
              More than an online marketplace.
            </h2>

            <div className="mt-5 h-1 w-14 rounded-full bg-red-500" />
          </div>

          <div>
            <p className="text-base leading-8 text-gray-600 sm:text-lg">
              Sarees are an extraordinary part of Indian fashion, culture and
              craftsmanship. MYSMME is building a marketplace focused entirely
              on helping people discover and shop sarees online.
            </p>

            <p className="mt-5 text-sm leading-7 text-gray-500 sm:text-base">
              We&apos;re building technology that helps saree sellers and brands
              reach customers while making discovery easier for shoppers. That
              means solving interesting problems across technology, e-commerce,
              design, operations, marketing and customer experience.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================
          LIFE AT MYSMME
      ============================================================ */}

      <section
        id="life-at-mysmme"
        className="border-y border-[#eadfd6] bg-white"
      >
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-red-600">
              Life at MYSMME
            </p>

            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-gray-950 sm:text-4xl">
              Build with purpose.
            </h2>

            <p className="mt-4 text-sm leading-7 text-gray-500 sm:text-base">
              We want to build a thoughtful, ambitious team focused on creating
              a better marketplace for India&apos;s saree ecosystem.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <ValueCard
              icon={<Rocket className="h-5 w-5" />}
              title="Build & Improve"
              description="Turn ideas into useful products, learn from customers and keep improving."
            />

            <ValueCard
              icon={<Heart className="h-5 w-5" />}
              title="Care About Customers"
              description="Create experiences that make shopping and selling on MYSMME simple and enjoyable."
            />

            <ValueCard
              icon={<Lightbulb className="h-5 w-5" />}
              title="Think Creatively"
              description="Challenge assumptions and find better ways to solve marketplace problems."
            />

            <ValueCard
              icon={<Users className="h-5 w-5" />}
              title="Grow Together"
              description="Share ideas, communicate clearly and help the people around you succeed."
            />
          </div>
        </div>
      </section>

      {/* ============================================================
          WORK AREAS
      ============================================================ */}

      <section className="bg-[#fcfaf9]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-red-600">
                Make an impact
              </p>

              <h2 className="mt-4 text-3xl font-extrabold leading-tight text-gray-950 sm:text-4xl">
                Help build every side of the marketplace.
              </h2>

              <p className="mt-5 max-w-xl text-sm leading-7 text-gray-500 sm:text-base">
                MYSMME brings together customers, sellers, products, brands and
                technology. There are meaningful problems to solve throughout
                the marketplace.
              </p>

              <div className="mt-8 space-y-4">
                <ImpactItem text="Build fast and reliable shopping experiences" />

                <ImpactItem text="Help customers discover the right sarees" />

                <ImpactItem text="Create better tools for sellers and brands" />

                <ImpactItem text="Improve marketplace operations and customer experience" />

                <ImpactItem text="Grow awareness of MYSMME across India" />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <WorkAreaCard
                icon={<BriefcaseBusiness className="h-5 w-5" />}
                title="Technology"
                text="Engineering, product and platform development."
              />

              <WorkAreaCard
                icon={<Sparkles className="h-5 w-5" />}
                title="Design"
                text="Create beautiful and intuitive customer experiences."
              />

              <WorkAreaCard
                icon={<Store className="h-5 w-5" />}
                title="Marketplace"
                text="Work with sellers, brands and marketplace operations."
              />

              <WorkAreaCard
                icon={<Rocket className="h-5 w-5" />}
                title="Growth"
                text="Help more shoppers and sellers discover MYSMME."
              />
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          OPEN POSITIONS
      ============================================================ */}

      <section
        id="open-positions"
        className="scroll-mt-24 border-y border-[#eadfd6] bg-white"
      >
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-6 lg:px-8 lg:py-24">
          {/* Heading */}

          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-red-600">
              Join the team
            </p>

            <h2 className="mt-4 text-3xl font-extrabold text-gray-950 sm:text-4xl">
              Open Positions
            </h2>

            <p className="mt-4 text-sm leading-7 text-gray-500 sm:text-base">
              We&apos;re looking for talented people who want to help us build
              and grow India&apos;s dedicated saree marketplace.
            </p>
          </div>

          {/* Jobs */}

          <div className="mt-12 space-y-5">
            {jobOpenings.map((job) => {
              const Icon = job.icon;

              return (
                <article
                  key={job.id}
                  id={job.id}
                  className="scroll-mt-24 rounded-[1.5rem] border border-[#eadfd6] bg-[#fcfaf9] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-red-200 hover:shadow-xl hover:shadow-red-900/5 sm:p-8"
                >
                  <div className="flex flex-col gap-7 lg:flex-row lg:items-start lg:justify-between">
                    {/* LEFT */}

                    <div className="max-w-3xl">
                      <div className="flex items-start gap-4">
                        <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600 sm:flex">
                          <Icon className="h-5 w-5" />
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full bg-red-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-red-600">
                              {job.category}
                            </span>

                            <span className="rounded-full border border-gray-200 bg-white px-3 py-1 text-[10px] font-semibold text-gray-500">
                              {job.type}
                            </span>
                          </div>

                          <h3 className="mt-4 text-xl font-extrabold text-gray-950 sm:text-2xl">
                            {job.title}
                          </h3>

                          <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-500">
                            {job.description}
                          </p>
                        </div>
                      </div>

                      {/* Skills */}

                      <div className="mt-6 flex flex-wrap gap-2 sm:ml-16">
                        {job.skills.map((skill) => (
                          <span
                            key={skill}
                            className="rounded-lg border border-gray-100 bg-white px-3 py-1.5 text-xs font-medium text-gray-500"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>

                      {/* Responsibilities */}

                      <div className="mt-7 border-t border-gray-200/70 pt-6 sm:ml-16">
                        <p className="text-xs font-bold uppercase tracking-[0.15em] text-gray-400">
                          What you&apos;ll work on
                        </p>

                        <div className="mt-4 grid gap-3 md:grid-cols-2">
                          {job.responsibilities.map((responsibility) => (
                            <div
                              key={responsibility}
                              className="flex items-start gap-2.5"
                            >
                              <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />

                              <p className="text-xs leading-6 text-gray-500">
                                {responsibility}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* APPLY */}

                    <div className="shrink-0 lg:pt-1">
                      <Link
                        href={`/careers/apply?role=${encodeURIComponent(job.id)}`}
                        className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-red-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-red-700 lg:w-auto"
                      >
                        Apply Now
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* GENERAL APPLICATION */}

          <div className="mt-10 rounded-2xl border border-dashed border-red-200 bg-red-50/50 px-6 py-8 text-center sm:px-10">
            <h3 className="text-lg font-extrabold text-gray-950">
              Don&apos;t see the right role?
            </h3>

            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-gray-500">
              We&apos;re always interested in meeting talented people who can
              contribute to technology, marketing, content, design and
              marketplace growth.
            </p>

            <Link
              href="/contact?subject=Career%20Opportunity"
              className="group mt-5 inline-flex items-center gap-2 text-sm font-bold text-red-600 transition hover:text-red-700"
            >
              Introduce Yourself
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================
          WORKING AT MYSMME
      ============================================================ */}

      <section className="bg-[#fcfaf9]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-3xl rounded-[2rem] border border-[#eadfd6] bg-white p-7 shadow-sm sm:p-10">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                <MapPin className="h-5 w-5" />
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-red-600">
                  Working at MYSMME
                </p>

                <h2 className="mt-3 text-2xl font-extrabold text-gray-950">
                  Help us build something meaningful.
                </h2>

                <p className="mt-3 text-sm leading-7 text-gray-500">
                  Location and working arrangements may vary by role. Details
                  can be discussed during the application process based on the
                  position and project requirements.
                </p>
              </div>
            </div>
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
            <Heart className="h-6 w-6" />
          </div>

          <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Build something
            <span className="block text-[#e0b96b]">beautifully Indian.</span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/55 sm:text-base">
            Help us create a marketplace where sarees, sellers, brands and
            shoppers can come together.
          </p>

          <a
            href="#open-positions"
            className="group mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-red-600 px-7 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-red-500"
          >
            Explore Opportunities
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </section>
    </main>
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
   IMPACT ITEM
================================================================ */

function ImpactItem({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3">
      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />

      <p className="text-sm leading-6 text-gray-600">{text}</p>
    </div>
  );
}

/* ================================================================
   WORK AREA CARD
================================================================ */

function WorkAreaCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-[#eadfd6] bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
        {icon}
      </div>

      <h3 className="mt-5 text-base font-extrabold text-gray-950">{title}</h3>

      <p className="mt-2 text-xs leading-6 text-gray-500">{text}</p>
    </div>
  );
}
