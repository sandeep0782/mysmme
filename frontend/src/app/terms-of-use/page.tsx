import Link from "next/link";
import {
  ArrowRight,
  FileText,
  ShieldCheck,
  UserCheck,
  AlertTriangle,
  Scale,
  ArrowLeft,
  CheckCircle2,
  LockKeyhole,
  CreditCard,
  Gavel,
  RefreshCw,
} from "lucide-react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#fffdf9] text-[#241b18]">
      <section className="relative overflow-hidden border-b border-[#eadfd6] bg-[#f8eee7]">
        {/* Decorative background */}
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#a51c30]/10 blur-[120px]" />
        <div className="absolute -right-40 top-20 h-[450px] w-[450px] rounded-full bg-[#c99a45]/15 blur-[120px]" />

        <div className="absolute left-10 top-20 hidden text-[#a51c30]/5 lg:block">
          <LotusDecoration />
        </div>

        <div className="absolute bottom-0 right-10 hidden rotate-12 text-[#c99a45]/10 lg:block">
          <LotusDecoration />
        </div>

        <div className="relative mx-auto max-w-5xl px-6 py-16 text-center sm:py-20 lg:px-8 lg:py-24">
          {/* Badge */}
          <div className="mx-auto mb-7 inline-flex items-center gap-2 rounded-full border border-[#c99a45]/30 bg-white/75 px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.24em] text-[#8d2635] shadow-sm backdrop-blur">
            <FileText className="h-4 w-4 text-[#b27a25]" />
            MYSMME Legal
          </div>

          {/* Heading */}
          <h1 className="mx-auto max-w-4xl text-4xl font-extrabold leading-[1.08] tracking-tight text-[#241b18] sm:text-5xl lg:text-[4.2rem]">
            Terms &
            <span className="block bg-gradient-to-r from-[#a51c30] via-[#b62b3f] to-[#8d1729] bg-clip-text text-transparent">
              Conditions
            </span>
          </h1>

          {/* Decorative divider */}
          <div className="mx-auto mt-7 flex items-center justify-center gap-4">
            <div className="h-px w-16 bg-[#c99a45]/50" />
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#c99a45]/30 bg-white text-[#b27a25]">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div className="h-px w-16 bg-[#c99a45]/50" />
          </div>

          <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-[#6f625c] sm:text-lg">
            These terms govern your use of the MYSMME platform and services.
            Please take a moment to understand your rights and responsibilities
            before using our marketplace.
          </p>

          <div className="mt-7 inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-xs font-medium text-[#81736c] shadow-sm">
            <RefreshCw className="h-3.5 w-3.5 text-[#a51c30]" />
            Last updated: August 2026
          </div>
        </div>
      </section>

      {/* =========================================================
          CONTENT
      ========================================================= */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[230px_1fr]">
          {/* =====================================================
              SIDEBAR
          ===================================================== */}
          <aside className="hidden lg:block">
            <div className="sticky top-8 overflow-hidden rounded-3xl border border-[#eadfd6] bg-white shadow-sm">
              <div className="border-b border-[#eadfd6] bg-[#fbf4ef] p-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#a51c30]">
                  Quick Navigation
                </p>

                <p className="mt-2 text-sm font-semibold text-[#332723]">
                  On this page
                </p>
              </div>

              <nav className="p-4">
                <SideLink href="#acceptance" number="01" label="Acceptance" />
                <SideLink href="#account" number="02" label="User Accounts" />
                <SideLink href="#platform" number="03" label="Platform Usage" />
                <SideLink href="#content" number="04" label="User Content" />
                <SideLink href="#payments" number="05" label="Payments" />
                <SideLink
                  href="#prohibited"
                  number="06"
                  label="Prohibited Activities"
                />
                <SideLink href="#termination" number="07" label="Termination" />
                <SideLink href="#liability" number="08" label="Liability" />
                <SideLink
                  href="#intellectual-property"
                  number="09"
                  label="Intellectual Property"
                />
                <SideLink href="#changes" number="10" label="Changes" />
                <SideLink
                  href="#governing-law"
                  number="11"
                  label="Governing Law"
                />
                <SideLink href="#contact" number="12" label="Contact" />
              </nav>

              <div className="m-4 rounded-2xl bg-[#241b18] p-5 text-white">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#a51c30]">
                  <LockKeyhole className="h-5 w-5" />
                </div>

                <p className="text-sm font-bold">Your trust matters.</p>

                <p className="mt-2 text-xs leading-5 text-white/55">
                  We aim to build a transparent and dependable marketplace
                  experience.
                </p>
              </div>
            </div>
          </aside>

          {/* =====================================================
              MAIN CONTENT
          ===================================================== */}
          <article className="min-w-0">
            {/* Introduction */}
            <div className="relative mb-12 overflow-hidden rounded-[2rem] border border-[#eadfd6] bg-[#fbf4ef] p-7 shadow-sm sm:p-9">
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#c99a45]/10 blur-2xl" />

              <div className="relative flex gap-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#a51c30] text-white shadow-lg shadow-[#a51c30]/15">
                  <ShieldCheck className="h-6 w-6" />
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#a51c30]">
                    Before you continue
                  </p>

                  <h2 className="mt-2 text-xl font-extrabold text-[#241b18] sm:text-2xl">
                    Please read these terms carefully
                  </h2>

                  <p className="mt-3 max-w-3xl text-sm leading-7 text-[#6f625c]">
                    By accessing or using MYSMME, you agree to be bound by these
                    Terms & Conditions. If you do not agree with these terms,
                    please do not use the platform.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-14">
              {/* 01 */}
              <LegalSection
                id="acceptance"
                number="01"
                title="Acceptance of Terms"
                icon={<Gavel className="h-5 w-5" />}
              >
                <p>
                  By creating an account, accessing the MYSMME platform, or
                  using any of our services, you acknowledge that you have read,
                  understood, and agreed to these Terms & Conditions.
                </p>

                <p>
                  These terms apply to all users of the platform, including
                  sellers, administrators, business representatives, and other
                  authorized users.
                </p>
              </LegalSection>

              {/* 02 */}
              <LegalSection
                id="account"
                number="02"
                title="User Accounts"
                icon={<UserCheck className="h-5 w-5" />}
              >
                <p>
                  You may need to create an account to access certain features
                  of MYSMME. You are responsible for providing accurate and
                  current information during registration.
                </p>

                <HighlightCard
                  icon={<UserCheck className="h-5 w-5" />}
                  title="Account responsibility"
                >
                  <Bullet text="Keep your login credentials confidential." />
                  <Bullet text="Do not share your account with unauthorized users." />
                  <Bullet text="Provide accurate registration information." />
                  <Bullet text="Notify us if you believe your account has been compromised." />
                </HighlightCard>
              </LegalSection>

              {/* 03 */}
              <LegalSection
                id="platform"
                number="03"
                title="Use of the Platform"
                icon={<FileText className="h-5 w-5" />}
              >
                <p>
                  MYSMME provides tools that may help sellers manage products,
                  inventory, orders, customers, analytics, shipping information,
                  and related business activities.
                </p>

                <p>
                  You agree to use the platform only for legitimate business
                  purposes and in accordance with applicable laws and
                  regulations.
                </p>
              </LegalSection>

              {/* 04 */}
              <LegalSection
                id="content"
                number="04"
                title="User Content and Information"
                icon={<FileText className="h-5 w-5" />}
              >
                <p>
                  You may submit product information, images, descriptions,
                  business information, customer information, and other content
                  through the platform.
                </p>

                <p>
                  You are responsible for ensuring that the information you
                  submit is accurate, lawful, and does not infringe the rights
                  of any third party.
                </p>
              </LegalSection>

              {/* 05 */}
              <LegalSection
                id="payments"
                number="05"
                title="Payments and Transactions"
                icon={<CreditCard className="h-5 w-5" />}
              >
                <p>
                  Where payment-related services are provided through MYSMME,
                  transactions may be subject to additional terms, fees, and
                  conditions.
                </p>

                <p>
                  Any applicable charges will be communicated through the
                  platform or relevant service documentation.
                </p>
              </LegalSection>

              {/* 06 */}
              <LegalSection
                id="prohibited"
                number="06"
                title="Prohibited Activities"
                icon={<AlertTriangle className="h-5 w-5" />}
              >
                <p>
                  You must not use MYSMME to engage in unlawful, fraudulent, or
                  abusive activities.
                </p>

                <div className="mt-6 rounded-2xl border border-[#efd7d7] bg-[#fff6f5] p-6">
                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#a51c30] text-white">
                      <AlertTriangle className="h-5 w-5" />
                    </div>

                    <div className="space-y-3 text-sm leading-6 text-[#6f625c]">
                      <Bullet text="Attempting to gain unauthorized access to the platform." />
                      <Bullet text="Uploading malicious software or harmful content." />
                      <Bullet text="Using the platform for fraudulent transactions." />
                      <Bullet text="Impersonating another person or business." />
                      <Bullet text="Violating applicable laws or regulations." />
                      <Bullet text="Interfering with the operation or security of the platform." />
                    </div>
                  </div>
                </div>
              </LegalSection>

              {/* 07 */}
              <LegalSection
                id="termination"
                number="07"
                title="Account Suspension and Termination"
                icon={<ShieldCheck className="h-5 w-5" />}
              >
                <p>
                  We may suspend or terminate access to an account where we
                  reasonably believe that the user has violated these terms,
                  applicable laws, or platform security requirements.
                </p>

                <p>
                  You may also request closure of your account by contacting our
                  support team.
                </p>
              </LegalSection>

              {/* 08 */}
              <LegalSection
                id="liability"
                number="08"
                title="Disclaimer and Limitation of Liability"
                icon={<Scale className="h-5 w-5" />}
              >
                <p>
                  MYSMME is provided on an “as available” basis. While we aim to
                  provide reliable and secure services, we cannot guarantee that
                  the platform will always be uninterrupted, error-free, or
                  available.
                </p>

                <p>
                  To the extent permitted by applicable law, MYSMME shall not be
                  responsible for indirect, incidental, or consequential losses
                  arising from your use of the platform.
                </p>
              </LegalSection>

              {/* 09 */}
              <LegalSection
                id="intellectual-property"
                number="09"
                title="Intellectual Property"
                icon={<FileText className="h-5 w-5" />}
              >
                <p>
                  The MYSMME name, branding, platform design, software,
                  interfaces, graphics, and other platform materials may be
                  protected by intellectual property laws.
                </p>

                <p>
                  You may not reproduce, modify, distribute, or commercially
                  exploit platform materials without appropriate authorization.
                </p>
              </LegalSection>

              {/* 10 */}
              <LegalSection
                id="changes"
                number="10"
                title="Changes to These Terms"
                icon={<RefreshCw className="h-5 w-5" />}
              >
                <p>
                  We may update these Terms & Conditions from time to time to
                  reflect changes to our services, business practices, or legal
                  requirements.
                </p>

                <p>
                  Updated terms will be posted on this page with a revised
                  effective date. Your continued use of MYSMME after changes
                  become effective constitutes acceptance of the updated terms.
                </p>
              </LegalSection>

              {/* 11 */}
              <LegalSection
                id="governing-law"
                number="11"
                title="Governing Law"
                icon={<Gavel className="h-5 w-5" />}
              >
                <p>
                  These terms shall be interpreted and governed in accordance
                  with the applicable laws and regulations governing the
                  operation of the MYSMME platform.
                </p>
              </LegalSection>

              {/* 12 */}
              <LegalSection
                id="contact"
                number="12"
                title="Contact Us"
                icon={<Scale className="h-5 w-5" />}
              >
                <div className="rounded-[2rem] border border-[#eadfd6] bg-[#fbf4ef] p-7 sm:p-8">
                  <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#a51c30] text-white shadow-lg shadow-[#a51c30]/15">
                      <Scale className="h-6 w-6" />
                    </div>

                    <div className="flex-1">
                      <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#a51c30]">
                        Need help?
                      </p>

                      <h3 className="mt-2 text-xl font-extrabold text-[#241b18]">
                        Questions about these terms?
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-[#6f625c]">
                        If you have questions regarding these Terms &
                        Conditions, please contact the MYSMME support team.
                      </p>

                      <Link
                        href="/support"
                        className="group mt-5 inline-flex items-center gap-2 rounded-xl bg-[#a51c30] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#a51c30]/15 transition hover:-translate-y-0.5 hover:bg-[#8e1729]"
                      >
                        Contact Support
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              </LegalSection>
            </div>

            {/* Bottom CTA */}
            <div className="mt-16 overflow-hidden rounded-[2rem] bg-[#241b18] p-8 text-center text-white sm:p-10">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#a51c30]">
                <ShieldCheck className="h-6 w-6" />
              </div>

              <h2 className="mt-5 text-2xl font-extrabold sm:text-3xl">
                Shop with confidence.
              </h2>

              <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-white/55">
                MYSMME is building a marketplace where customers and sellers can
                discover, connect, and grow together.
              </p>

              <Link
                href="/sarees"
                className="group mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-[#241b18] transition hover:-translate-y-0.5 hover:bg-[#f8eee7]"
              >
                Explore MYSMME
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </article>
        </div>
      </section>

      <Footer />
    </main>
  );
}

/* =========================================================
   LEGAL SECTION
========================================================= */

function LegalSection({
  id,
  number,
  title,
  icon,
  children,
}: {
  id: string;
  number: string;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="mb-5 flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#fff2ed] text-[#a51c30]">
          {icon}
        </div>

        <div>
          <div className="mb-1 flex items-center gap-2">
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#b27a25]">
              SECTION {number}
            </span>
          </div>

          <h2 className="text-2xl font-extrabold tracking-tight text-[#241b18] sm:text-3xl">
            {title}
          </h2>
        </div>
      </div>

      <div className="space-y-4 pl-0 text-sm leading-7 text-[#6f625c] sm:pl-[60px]">
        {children}
      </div>
    </section>
  );
}

/* =========================================================
   HIGHLIGHT CARD
========================================================= */

function HighlightCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-6 rounded-2xl border border-[#eadfd6] bg-white p-6 shadow-sm">
      <div className="flex gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fff2ed] text-[#a51c30]">
          {icon}
        </div>

        <div className="flex-1">
          <h3 className="font-bold text-[#241b18]">{title}</h3>

          <div className="mt-4 space-y-3">{children}</div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   BULLET
========================================================= */

function Bullet({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3">
      <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[#a51c30]" />
      <span>{text}</span>
    </div>
  );
}

/* =========================================================
   SIDEBAR LINK
========================================================= */

function SideLink({
  href,
  number,
  label,
}: {
  href: string;
  number: string;
  label: string;
}) {
  return (
    <a
      href={href}
      className="group flex items-center gap-3 rounded-xl px-3 py-2.5 transition hover:bg-[#fbf4ef]"
    >
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#fff2ed] text-[9px] font-bold text-[#a51c30] transition group-hover:bg-[#a51c30] group-hover:text-white">
        {number}
      </span>

      <span className="text-xs font-medium text-[#756860] transition group-hover:text-[#a51c30]">
        {label}
      </span>
    </a>
  );
}

/* =========================================================
   LOTUS DECORATION
========================================================= */

function LotusDecoration() {
  return (
    <svg
      width="120"
      height="120"
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M60 91C60 91 34 80 30 55C30 55 47 58 60 74C73 58 90 55 90 55C86 80 60 91 60 91Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M60 74C60 74 45 58 48 38C48 38 59 43 60 61C61 43 72 38 72 38C75 58 60 74 60 74Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M30 55C38 51 48 52 60 61"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M90 55C82 51 72 52 60 61"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}
