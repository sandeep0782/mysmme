import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  BriefcaseBusiness,
  CheckCircle2,
  FileText,
  ShieldCheck,
} from "lucide-react";

import JobApplicationForm from "@/components/careers/JobApplicationForm";

export const metadata: Metadata = {
  title: "Apply for a Career at MYSMME",
  description:
    "Apply for technology, marketing and freelance opportunities at MYSMME, India's dedicated saree marketplace.",
  robots: {
    index: false,
    follow: true,
  },
};

type ApplyPageProps = {
  searchParams: Promise<{
    role?: string;
  }>;
};

const roles: Record<
  string,
  {
    title: string;
    type: string;
  }
> = {
  "technology-developer": {
    title: "Technology / Full-Stack Developer",
    type: "Full-time / Freelance",
  },

  "marketing-manager": {
    title: "Marketing Manager",
    type: "Full-time",
  },

  freelancers: {
    title: "Freelancers & Creative Partners",
    type: "Freelance / Project-based",
  },
};

export default async function ApplyPage({ searchParams }: ApplyPageProps) {
  const params = await searchParams;

  const selectedRole = params.role && roles[params.role] ? params.role : "";

  return (
    <main className="min-h-screen bg-[#fcfaf9]">
      {/* ============================================================
          HEADER
      ============================================================ */}

      <section className="border-b border-[#eadfd6] bg-white">
        <div className="mx-auto max-w-7xl px-5 py-6 sm:px-6 lg:px-8">
          <Link
            href="/careers"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-red-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Careers
          </Link>
        </div>
      </section>

      {/* ============================================================
          PAGE
      ============================================================ */}

      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-red-200/20 blur-[120px]"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-amber-200/20 blur-[120px]"
        />

        <div className="relative mx-auto max-w-7xl px-5 py-14 sm:px-6 lg:px-8 lg:py-20">
          {/* Heading */}

          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-red-100 bg-white px-4 py-2 shadow-sm">
              <BriefcaseBusiness className="h-4 w-4 text-red-600" />

              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-red-600">
                Join MYSMME
              </span>
            </div>

            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-gray-950 sm:text-5xl">
              Apply to join MYSMME
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-gray-500 sm:text-base">
              Tell us about yourself, your experience and what you can bring to
              MYSMME. We&apos;ll review your application and contact shortlisted
              candidates.
            </p>
          </div>

          {/* ========================================================
              CONTENT
          ======================================================== */}

          <div className="mx-auto mt-12 grid max-w-6xl gap-8 lg:grid-cols-[0.72fr_1.28fr]">
            {/* LEFT */}

            <aside className="space-y-5">
              <div className="rounded-[1.5rem] border border-[#eadfd6] bg-[#241b18] p-7 text-white">
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-red-400">
                  Careers at MYSMME
                </p>

                <h2 className="mt-4 text-2xl font-extrabold">
                  Help build India&apos;s dedicated saree marketplace.
                </h2>

                <p className="mt-4 text-sm leading-7 text-white/55">
                  We&apos;re building technology, marketing and creative
                  experiences that connect saree shoppers, sellers and brands.
                </p>

                <div className="mt-7 space-y-4">
                  <Benefit text="Work on real marketplace challenges" />

                  <Benefit text="Build products used by shoppers and sellers" />

                  <Benefit text="Contribute ideas and take ownership" />

                  <Benefit text="Grow with an emerging marketplace" />
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-[#eadfd6] bg-white p-6">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
                    <FileText className="h-5 w-5" />
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-gray-950">
                      Before you apply
                    </h3>

                    <p className="mt-2 text-xs leading-6 text-gray-500">
                      Keep your latest resume ready. You can also provide your
                      LinkedIn, GitHub or portfolio where relevant.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-[#eadfd6] bg-white p-6">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-600">
                    <ShieldCheck className="h-5 w-5" />
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-gray-950">
                      Your information
                    </h3>

                    <p className="mt-2 text-xs leading-6 text-gray-500">
                      Information submitted through this form should only be
                      used for recruitment and evaluating your application.
                    </p>
                  </div>
                </div>
              </div>
            </aside>

            {/* RIGHT — APPLICATION FORM */}

            <JobApplicationForm roles={roles} selectedRole={selectedRole} />
          </div>
        </div>
      </section>
    </main>
  );
}

function Benefit({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3">
      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />

      <span className="text-xs leading-6 text-white/65">{text}</span>
    </div>
  );
}
