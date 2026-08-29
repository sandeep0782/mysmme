import Link from "next/link";
import {
    ArrowLeft,
    ChevronRight,
    Lock,
    ShieldCheck,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const sections = [
    {
        id: "information",
        title: "Information We Collect",
    },
    {
        id: "usage",
        title: "How We Use Information",
    },
    {
        id: "sharing",
        title: "Information Sharing",
    },
    {
        id: "security",
        title: "Data Security",
    },
    {
        id: "cookies",
        title: "Cookies",
    },
    {
        id: "retention",
        title: "Data Retention",
    },
    {
        id: "rights",
        title: "Your Rights",
    },
    {
        id: "changes",
        title: "Changes to This Policy",
    },
    {
        id: "contact",
        title: "Contact Us",
    },
];

export default function PrivacyPage() {
    return (
        <main className="min-h-screen bg-[#fafafa] text-gray-900">

            <Header />

            {/*  HERO */}

            <section className="relative overflow-hidden bg-[#111111]">

                <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-red-600/20 blur-[120px]" />

                <div className="absolute -bottom-60 -right-40 h-[600px] w-[600px] rounded-full bg-red-500/10 blur-[140px]" />

                <div className="relative mx-auto max-w-7xl px-6 py-16 sm:py-20">

                    <Link
                        href="/"
                        className="mb-8 inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-white"
                    >
                        <ArrowLeft size={16} />
                        Back to home
                    </Link>

                    <div className="flex items-start gap-5">

                        <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-red-600/10 text-red-400 ring-1 ring-red-500/20 sm:flex">
                            <ShieldCheck size={28} />
                        </div>

                        <div>

                            <span className="inline-flex rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-300">
                                Privacy & Security
                            </span>

                            <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl">
                                Privacy Policy
                            </h1>

                            <p className="mt-5 max-w-2xl text-base leading-7 text-gray-400">
                                We respect your privacy and are committed to protecting
                                the information you provide while using the MYSMME seller
                                platform.
                            </p>

                            <p className="mt-5 text-sm text-gray-500">
                                Last updated: August 8, 2026
                            </p>

                        </div>

                    </div>

                </div>

            </section>

            {/* MAIN CONTENT */}

            <div className="mx-auto grid max-w-7xl gap-12 px-6 py-14 lg:grid-cols-[240px_1fr]">

                {/* SIDEBAR */}

                <aside className="hidden lg:block">

                    <div className="sticky top-28 rounded-2xl border border-gray-200 bg-white p-5">

                        <p className="mb-4 text-xs font-bold uppercase tracking-widest text-gray-400">
                            On this page
                        </p>

                        <nav className="space-y-1">

                            {sections.map((section) => (
                                <a
                                    key={section.id}
                                    href={`#${section.id} `}
                                    className="group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm text-gray-600 transition hover:bg-red-50 hover:text-red-600"
                                >
                                    <span>{section.title}</span>

                                    <ChevronRight
                                        size={14}
                                        className="opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100"
                                    />
                                </a>
                            ))}

                        </nav>

                    </div>

                </aside>

                {/* CONTENT */}

                <article className="min-w-0">

                    {/* Intro */}

                    <div className="rounded-2xl border border-red-100 bg-red-50/60 p-6 sm:p-8">

                        <div className="flex gap-4">

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
                                <Lock size={19} />
                            </div>

                            <div>

                                <h2 className="font-bold text-gray-900">
                                    Your privacy matters to us
                                </h2>

                                <p className="mt-2 text-sm leading-6 text-gray-600">
                                    This Privacy Policy explains what information MYSMME
                                    may collect, how we use it, and the choices available
                                    to you when using our platform.
                                </p>

                            </div>

                        </div>

                    </div>

                    {/* Information */}

                    <section id="information" className="scroll-mt-28 pt-12">

                        <SectionNumber number="01" title="Information We Collect" />

                        <p className="mt-5">
                            When you use MYSMME, we may collect information that you
                            provide directly to us, information generated through your
                            use of the platform, and technical information required to
                            operate and secure our services.
                        </p>

                        <h3>Information you provide</h3>

                        <ul>
                            <li>Name and contact information.</li>
                            <li>Email address and account credentials.</li>
                            <li>Business and seller information.</li>
                            <li>Product, inventory and order information.</li>
                            <li>Information you provide when contacting support.</li>
                        </ul>

                        <h3>Automatically collected information</h3>

                        <p>
                            We may collect technical information such as browser type,
                            device information, IP address, approximate location,
                            operating system, pages visited and information about how
                            you interact with the platform.
                        </p>

                    </section>

                    {/* Usage */}

                    <section id="usage" className="scroll-mt-28 pt-12">

                        <SectionNumber number="02" title="How We Use Information" />

                        <p className="mt-5">
                            We use collected information only for legitimate business
                            and operational purposes, including:
                        </p>

                        <ul>
                            <li>Creating and maintaining your MYSMME account.</li>
                            <li>Providing seller and business management features.</li>
                            <li>Processing and managing products and orders.</li>
                            <li>Providing customer and technical support.</li>
                            <li>Improving platform performance and usability.</li>
                            <li>Detecting fraud, abuse and security threats.</li>
                            <li>Communicating important service information.</li>
                            <li>Complying with applicable legal obligations.</li>
                        </ul>

                    </section>

                    {/* Sharing */}

                    <section id="sharing" className="scroll-mt-28 pt-12">

                        <SectionNumber number="03" title="Information Sharing" />

                        <p className="mt-5">
                            We do not sell your personal information. We may share
                            information when reasonably necessary to provide the
                            service, protect our platform, or comply with legal
                            requirements.
                        </p>

                        <h3>Service providers</h3>

                        <p>
                            We may work with trusted third-party providers for services
                            such as hosting, email delivery, authentication, analytics,
                            security and infrastructure.
                        </p>

                        <h3>Legal requirements</h3>

                        <p>
                            Information may be disclosed when required by applicable
                            law, regulation, legal process or governmental request.
                        </p>

                    </section>

                    {/* Security */}

                    <section id="security" className="scroll-mt-28 pt-12">

                        <SectionNumber number="04" title="Data Security" />

                        <p className="mt-5">
                            We use reasonable technical and organizational safeguards
                            designed to protect information against unauthorized
                            access, alteration, disclosure or destruction.
                        </p>

                        <p>
                            Security measures may include encrypted connections,
                            authentication controls, access restrictions, monitoring
                            and other appropriate safeguards.
                        </p>

                        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6">

                            <div className="flex gap-4">

                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
                                    <ShieldCheck size={20} />
                                </div>

                                <div>

                                    <h3 className="!mt-0">
                                        Security reminder
                                    </h3>

                                    <p className="!mt-2">
                                        Never share your password, verification codes or
                                        other account credentials with anyone claiming to
                                        represent MYSMME.
                                    </p>

                                </div>

                            </div>

                        </div>

                    </section>

                    {/* Cookies */}

                    <section id="cookies" className="scroll-mt-28 pt-12">

                        <SectionNumber number="05" title="Cookies" />

                        <p className="mt-5">
                            MYSMME may use cookies and similar technologies to maintain
                            sessions, remember preferences, improve functionality,
                            understand platform usage and support security.
                        </p>

                        <p>
                            You can control cookies through your browser settings.
                            Disabling certain cookies may affect some platform
                            functionality.
                        </p>

                    </section>

                    {/* Retention */}

                    <section id="retention" className="scroll-mt-28 pt-12">

                        <SectionNumber number="06" title="Data Retention" />

                        <p className="mt-5">
                            We retain information for as long as reasonably necessary
                            to provide our services, maintain business records,
                            resolve disputes, enforce agreements and comply with
                            applicable legal obligations.
                        </p>

                        <p>
                            When information is no longer required, we may delete it
                            or securely anonymize it, subject to applicable
                            requirements.
                        </p>

                    </section>

                    {/* Rights */}

                    <section id="rights" className="scroll-mt-28 pt-12">

                        <SectionNumber number="07" title="Your Rights" />

                        <p className="mt-5">
                            Depending on your location and applicable law, you may have
                            rights relating to your personal information, including
                            the right to:
                        </p>

                        <ul>
                            <li>Request access to information we hold about you.</li>
                            <li>Request correction of inaccurate information.</li>
                            <li>Request deletion where legally permitted.</li>
                            <li>Object to or restrict certain processing.</li>
                            <li>Request a copy of certain information.</li>
                        </ul>

                        <p>
                            To make a privacy-related request, please contact our
                            support team.
                        </p>

                    </section>

                    {/* Changes */}

                    <section id="changes" className="scroll-mt-28 pt-12">

                        <SectionNumber number="08" title="Changes to This Policy" />

                        <p className="mt-5">
                            We may update this Privacy Policy from time to time to
                            reflect changes to our services, technology, legal
                            requirements or business practices.
                        </p>

                        <p>
                            When we make changes, we will update the date displayed at
                            the beginning of this policy. We encourage you to review
                            this page periodically.
                        </p>

                    </section>

                    {/* Contact */}

                    <section id="contact" className="scroll-mt-28 pb-6 pt-12">

                        <SectionNumber number="09" title="Contact Us" />

                        <p className="mt-5">
                            If you have questions about this Privacy Policy or want to
                            make a privacy-related request, please contact the MYSMME
                            support team.
                        </p>

                        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6">

                            <p className="text-sm font-semibold text-gray-900">
                                MYSMME Support
                            </p>

                            <p className="mt-2 text-sm text-gray-500">
                                Email: support@mysmme.com
                            </p>

                            <Link
                                href="/support"
                                className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-red-600 transition hover:text-red-700"
                            >
                                Contact Support
                                <ChevronRight size={16} />
                            </Link>

                        </div>

                    </section>

                </article>

            </div>

            {/* CTA */}

            <section className="bg-[#111111]">

                <div className="mx-auto max-w-7xl px-6 py-16 text-center">

                    <h2 className="text-3xl font-bold text-white">
                        Have questions about your privacy?
                    </h2>

                    <p className="mx-auto mt-4 max-w-xl text-gray-400">
                        Our support team is available to help you understand how
                        your information is handled.
                    </p>

                    <Link
                        href="/support"
                        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-red-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-700"
                    >
                        Contact Support
                        <ChevronRight size={17} />
                    </Link>

                </div>

            </section>

            <Footer />
        </main>
    );
}

/* 
   SECTION HEADER
 */

function SectionNumber({
    number,
    title,
}: {
    number: string;
    title: string;
}) {
    return (
        <div className="flex items-center gap-4">

            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50 text-xs font-bold text-red-600">
                {number}
            </span>

            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                {title}
            </h2>

        </div>
    );
}