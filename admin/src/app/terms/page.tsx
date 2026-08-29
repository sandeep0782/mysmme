import Link from "next/link";
import {
    ArrowLeft,
    FileText,
    ShieldCheck,
    UserCheck,
    AlertTriangle,
    Scale,
    ArrowRight,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-[#fafafa] text-gray-900">

            {/* ============================================================
          NAVBAR
      ============================================================ */}
            <Header />
            {/* <header className="border-b border-gray-200 bg-white">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

                    <Link href="/" className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 font-bold text-white shadow-lg shadow-red-600/20">
                            M
                        </div>

                        <div>
                            <h1 className="text-xl font-bold tracking-tight text-gray-900">
                                MYSMME
                            </h1>

                            <p className="text-[10px] font-medium uppercase tracking-widest text-gray-400">
                                Seller Platform
                            </p>
                        </div>
                    </Link>

                    <Link
                        href="/"
                        className="flex items-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-red-600"
                    >
                        <ArrowLeft size={16} />
                        Back to Home
                    </Link>

                </div>
            </header> */}


            {/* ============================================================
          HERO
      ============================================================ */}
            <section className="relative overflow-hidden border-b border-gray-200 bg-white">

                <div className="absolute -left-40 -top-40 h-[450px] w-[450px] rounded-full bg-red-500/10 blur-[120px]" />

                <div className="absolute -right-40 top-20 h-[400px] w-[400px] rounded-full bg-red-500/5 blur-[120px]" />

                <div className="relative mx-auto max-w-4xl px-6 py-20 text-center">

                    <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                        <FileText size={28} />
                    </div>

                    <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
                        Terms & Conditions
                    </h1>

                    <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-500">
                        These terms govern your use of the MYSMME seller platform.
                        Please read them carefully before using our services.
                    </p>

                    <p className="mt-5 text-sm text-gray-400">
                        Last updated: August 2026
                    </p>

                </div>

            </section>


            {/* ============================================================
          CONTENT
      ============================================================ */}
            <section className="mx-auto max-w-5xl px-6 py-16">

                <div className="grid gap-10 lg:grid-cols-[220px_1fr]">

                    {/* Sidebar */}
                    <aside className="hidden lg:block">
                        <div className="sticky top-8 rounded-2xl border border-gray-200 bg-white p-5">

                            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-gray-400">
                                On this page
                            </p>

                            <nav className="space-y-3 text-sm">

                                <a href="#acceptance" className="block text-gray-500 hover:text-red-600">
                                    Acceptance
                                </a>

                                <a href="#account" className="block text-gray-500 hover:text-red-600">
                                    User Accounts
                                </a>

                                <a href="#platform" className="block text-gray-500 hover:text-red-600">
                                    Platform Usage
                                </a>

                                <a href="#content" className="block text-gray-500 hover:text-red-600">
                                    User Content
                                </a>

                                <a href="#payments" className="block text-gray-500 hover:text-red-600">
                                    Payments
                                </a>

                                <a href="#prohibited" className="block text-gray-500 hover:text-red-600">
                                    Prohibited Activities
                                </a>

                                <a href="#termination" className="block text-gray-500 hover:text-red-600">
                                    Termination
                                </a>

                                <a href="#liability" className="block text-gray-500 hover:text-red-600">
                                    Liability
                                </a>

                                <a href="#changes" className="block text-gray-500 hover:text-red-600">
                                    Changes
                                </a>

                                <a href="#contact" className="block text-gray-500 hover:text-red-600">
                                    Contact
                                </a>

                            </nav>

                        </div>
                    </aside>


                    {/* Main Content */}
                    <article className="space-y-12">

                        {/* Introduction */}
                        <div className="rounded-2xl border border-red-100 bg-red-50 p-6">

                            <div className="flex gap-4">

                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-600 text-white">
                                    <ShieldCheck size={20} />
                                </div>

                                <div>
                                    <h2 className="font-bold text-gray-900">
                                        Please read these terms carefully
                                    </h2>

                                    <p className="mt-2 text-sm leading-6 text-gray-600">
                                        By accessing or using MYSMME, you agree to be bound by
                                        these Terms & Conditions. If you do not agree with these
                                        terms, please do not use the platform.
                                    </p>
                                </div>

                            </div>

                        </div>


                        {/* Acceptance */}
                        <section id="acceptance">

                            <SectionTitle
                                number="01"
                                title="Acceptance of Terms"
                            />

                            <p>
                                By creating an account, accessing the MYSMME platform, or
                                using any of our services, you acknowledge that you have read,
                                understood, and agreed to these Terms & Conditions.
                            </p>

                            <p className="mt-4">
                                These terms apply to all users of the platform, including
                                sellers, administrators, business representatives, and other
                                authorized users.
                            </p>

                        </section>


                        {/* Account */}
                        <section id="account">

                            <SectionTitle
                                number="02"
                                title="User Accounts"
                            />

                            <p>
                                You may need to create an account to access certain features
                                of MYSMME. You are responsible for providing accurate and
                                current information during registration.
                            </p>

                            <div className="mt-5 rounded-xl border border-gray-200 bg-white p-5">

                                <div className="flex gap-3">
                                    <UserCheck className="mt-0.5 text-red-600" size={20} />

                                    <div>
                                        <h3 className="font-semibold">
                                            Account responsibility
                                        </h3>

                                        <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-600">
                                            <li>• Keep your login credentials confidential.</li>
                                            <li>• Do not share your account with unauthorized users.</li>
                                            <li>• Provide accurate registration information.</li>
                                            <li>• Notify us if you believe your account has been compromised.</li>
                                        </ul>
                                    </div>
                                </div>

                            </div>

                        </section>


                        {/* Platform */}
                        <section id="platform">

                            <SectionTitle
                                number="03"
                                title="Use of the Platform"
                            />

                            <p>
                                MYSMME provides tools that may help sellers manage products,
                                inventory, orders, customers, analytics, shipping information,
                                and related business activities.
                            </p>

                            <p className="mt-4">
                                You agree to use the platform only for legitimate business
                                purposes and in accordance with applicable laws and
                                regulations.
                            </p>

                        </section>


                        {/* Content */}
                        <section id="content">

                            <SectionTitle
                                number="04"
                                title="User Content and Information"
                            />

                            <p>
                                You may submit product information, images, descriptions,
                                business information, customer information, and other content
                                through the platform.
                            </p>

                            <p className="mt-4">
                                You are responsible for ensuring that the information you
                                submit is accurate, lawful, and does not infringe the rights
                                of any third party.
                            </p>

                        </section>


                        {/* Payments */}
                        <section id="payments">

                            <SectionTitle
                                number="05"
                                title="Payments and Transactions"
                            />

                            <p>
                                Where payment-related services are provided through MYSMME,
                                transactions may be subject to additional terms, fees, and
                                conditions.
                            </p>

                            <p className="mt-4">
                                Any applicable charges will be communicated through the
                                platform or relevant service documentation.
                            </p>

                        </section>


                        {/* Prohibited */}
                        <section id="prohibited">

                            <SectionTitle
                                number="06"
                                title="Prohibited Activities"
                            />

                            <p>
                                You must not use MYSMME to engage in unlawful, fraudulent, or
                                abusive activities.
                            </p>

                            <div className="mt-5 rounded-2xl border border-red-100 bg-red-50 p-6">

                                <div className="flex gap-4">

                                    <AlertTriangle
                                        className="shrink-0 text-red-600"
                                        size={22}
                                    />

                                    <ul className="space-y-2 text-sm leading-6 text-gray-600">
                                        <li>• Attempting to gain unauthorized access to the platform.</li>
                                        <li>• Uploading malicious software or harmful content.</li>
                                        <li>• Using the platform for fraudulent transactions.</li>
                                        <li>• Impersonating another person or business.</li>
                                        <li>• Violating applicable laws or regulations.</li>
                                        <li>• Interfering with the operation or security of the platform.</li>
                                    </ul>

                                </div>

                            </div>

                        </section>


                        {/* Termination */}
                        <section id="termination">

                            <SectionTitle
                                number="07"
                                title="Account Suspension and Termination"
                            />

                            <p>
                                We may suspend or terminate access to an account where we
                                reasonably believe that the user has violated these terms,
                                applicable laws, or platform security requirements.
                            </p>

                            <p className="mt-4">
                                You may also request closure of your account by contacting
                                our support team.
                            </p>

                        </section>


                        {/* Liability */}
                        <section id="liability">

                            <SectionTitle
                                number="08"
                                title="Disclaimer and Limitation of Liability"
                            />

                            <p>
                                MYSMME is provided on an “as available” basis. While we aim to
                                provide reliable and secure services, we cannot guarantee that
                                the platform will always be uninterrupted, error-free, or
                                available.
                            </p>

                            <p className="mt-4">
                                To the extent permitted by applicable law, MYSMME shall not
                                be responsible for indirect, incidental, or consequential
                                losses arising from your use of the platform.
                            </p>

                        </section>


                        {/* Intellectual Property */}
                        <section>

                            <SectionTitle
                                number="09"
                                title="Intellectual Property"
                            />

                            <p>
                                The MYSMME name, branding, platform design, software,
                                interfaces, graphics, and other platform materials may be
                                protected by intellectual property laws.
                            </p>

                            <p className="mt-4">
                                You may not reproduce, modify, distribute, or commercially
                                exploit platform materials without appropriate authorization.
                            </p>

                        </section>


                        {/* Changes */}
                        <section id="changes">

                            <SectionTitle
                                number="10"
                                title="Changes to These Terms"
                            />

                            <p>
                                We may update these Terms & Conditions from time to time to
                                reflect changes to our services, business practices, or legal
                                requirements.
                            </p>

                            <p className="mt-4">
                                Updated terms will be posted on this page with a revised
                                effective date. Your continued use of MYSMME after changes
                                become effective constitutes acceptance of the updated terms.
                            </p>

                        </section>


                        {/* Governing Law */}
                        <section>

                            <SectionTitle
                                number="11"
                                title="Governing Law"
                            />

                            <p>
                                These terms shall be interpreted and governed in accordance
                                with the applicable laws and regulations governing the
                                operation of the MYSMME platform.
                            </p>

                        </section>


                        {/* Contact */}
                        <section id="contact">

                            <SectionTitle
                                number="12"
                                title="Contact Us"
                            />

                            <div className="rounded-2xl border border-gray-200 bg-white p-7">

                                <div className="flex items-start gap-4">

                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
                                        <Scale size={21} />
                                    </div>

                                    <div>

                                        <h3 className="font-bold text-gray-900">
                                            Questions about these terms?
                                        </h3>

                                        <p className="mt-2 text-sm leading-6 text-gray-500">
                                            If you have questions regarding these Terms &
                                            Conditions, please contact the MYSMME support team.
                                        </p>

                                        <Link
                                            href="/support"
                                            className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-red-600 transition hover:text-red-700"
                                        >
                                            Contact Support
                                            <ArrowRight size={16} />
                                        </Link>

                                    </div>

                                </div>

                            </div>

                        </section>

                    </article>

                </div>

            </section>


            <Footer />

        </main>
    );
}


/* ================================================================
   SECTION TITLE
================================================================ */

function SectionTitle({
    number,
    title,
}: {
    number: string;
    title: string;
}) {
    return (
        <div className="mb-5 flex items-center gap-4">

            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-xs font-bold text-red-600">
                {number}
            </span>

            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                {title}
            </h2>

        </div>
    );
}