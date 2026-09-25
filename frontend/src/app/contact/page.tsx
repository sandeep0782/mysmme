import type { Metadata } from "next";

import Link from "next/link";

import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  HelpCircle,
  Mail,
  MapPin,
  MessageCircle,
  PackageCheck,
  Send,
  ShoppingBag,
  Sparkles,
  Store,
  Users,
} from "lucide-react";

import Footer from "@/components/Footer";
import ContactForm from "@/components/contact/ContactForm";

/* ================================================================
   SEO
================================================================ */

const title = "Contact Us";

const fullTitle = "Contact MYSMME | Customer, Seller & Business Support";

const description =
  "Contact MYSMME for customer support, seller assistance, order questions, business enquiries, partnerships, and help with the MYSMME saree marketplace.";

export const metadata: Metadata = {
  title,
  description,

  alternates: {
    canonical: "/contact",
  },

  openGraph: {
    title: fullTitle,
    description,
    url: "/contact",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: fullTitle,
    description,
  },
};

/* ================================================================
   FAQ
================================================================ */

const CONTACT_FAQS = [
  {
    question: "How can I contact MYSMME customer support?",
    answer:
      "You can send us a message through the contact form on this page. Please select the appropriate enquiry type and provide as much information as possible so our team can understand your request.",
  },
  {
    question:
      "I have a question about my order. What information should I provide?",
    answer:
      "For order-related enquiries, please include your order number, registered name or contact details, and a short description of the issue. This helps us identify the order and respond more efficiently.",
  },
  {
    question: "How can sellers contact MYSMME?",
    answer:
      "Sellers, boutiques, designers, manufacturers, and Indian fashion businesses can use this page for seller support, onboarding questions, catalogue assistance, and marketplace-related enquiries.",
  },
  {
    question: "Can I contact MYSMME for partnerships or business enquiries?",
    answer:
      "Yes. Brands, businesses, service providers, creators, and potential partners can choose Business & Partnerships in the contact form and provide details about their proposal.",
  },
  {
    question: "How long does it take to receive a response?",
    answer:
      "Response times may vary depending on the type and volume of enquiries. Providing complete information in your first message can help our team review your request more efficiently.",
  },
];

/* ================================================================
   PAGE
================================================================ */

export default function ContactPage() {
  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact MYSMME",
    url: "https://mysmme.com/contact",
    description,
    mainEntity: {
      "@type": "Organization",
      name: "MYSMME",
      alternateName: "MYSMME Saree Marketplace",
      url: "https://mysmme.com",
      areaServed: {
        "@type": "Country",
        name: "India",
      },
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: CONTACT_FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      {/* =========================================================
          STRUCTURED DATA
      ========================================================= */}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(contactSchema),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />

      <main className="min-h-screen bg-[#fffdf9] text-[#241b18]">
        {/* =========================================================
            HERO
        ========================================================= */}

        <section className="relative overflow-hidden border-b border-[#eadfd6] bg-[#f8eee7]">
          <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#a51c30]/10 blur-[120px]" />

          <div className="absolute -right-40 top-10 h-[450px] w-[450px] rounded-full bg-[#c99a45]/15 blur-[120px]" />

          <div className="relative mx-auto max-w-7xl px-6 py-16 sm:py-20 lg:px-8 lg:py-24">
            <div className="mx-auto max-w-4xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#c99a45]/30 bg-white/75 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[#8d2635] shadow-sm backdrop-blur">
                <MessageCircle className="h-4 w-4" />
                We&apos;re Here to Help
              </div>

              <h1 className="mt-7 text-4xl font-extrabold leading-[1.05] tracking-tight text-[#241b18] sm:text-5xl lg:text-[4.4rem]">
                Get in touch with{" "}
                <span className="bg-gradient-to-r from-[#a51c30] via-[#b62b3f] to-[#8d1729] bg-clip-text text-transparent">
                  MYSMME.
                </span>
              </h1>

              <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-[#6f625c] sm:text-lg">
                Have a question about an order, selling on MYSMME, your
                catalogue, a business opportunity, or something else? Send us a
                message and choose the enquiry type that best matches your
                request.
              </p>

              <div className="mt-9 flex flex-wrap justify-center gap-x-6 gap-y-3">
                <TrustItem text="Customer support" />
                <TrustItem text="Seller assistance" />
                <TrustItem text="Business enquiries" />
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            CONTACT OPTIONS + FORM
        ========================================================= */}

        <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-14">
            {/* =====================================================
                LEFT
            ===================================================== */}

            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#a51c30]">
                Contact MYSMME
              </p>

              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#241b18] sm:text-4xl">
                How can we help?
              </h2>

              <p className="mt-5 max-w-xl text-base leading-8 text-[#6f625c]">
                Choose the most relevant category when sending your message.
                This helps your enquiry reach the right team.
              </p>

              <div className="mt-9 space-y-4">
                <ContactOption
                  icon={<ShoppingBag className="h-5 w-5" />}
                  title="Customer Support"
                  text="Questions about shopping, orders, products, payments, delivery, returns, or your MYSMME account."
                />

                <ContactOption
                  icon={<Store className="h-5 w-5" />}
                  title="Seller Support"
                  text="Help with seller onboarding, catalogue listings, products, orders, marketplace operations, and seller accounts."
                />

                <ContactOption
                  icon={<BriefcaseBusiness className="h-5 w-5" />}
                  title="Business & Partnerships"
                  text="For brands, businesses, collaborations, technology partners, creators, agencies, and other commercial enquiries."
                />
              </div>

              {/* LOCATION */}

              <div className="mt-7 rounded-2xl border border-[#eadfd6] bg-[#fbf4ef] p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#a51c30] shadow-sm">
                    <MapPin className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="font-bold text-[#241b18]">
                      Serving customers across India
                    </p>

                    <p className="mt-1.5 text-sm leading-6 text-[#756860]">
                      MYSMME is an online marketplace focused on connecting
                      customers with saree and Indian fashion businesses.
                    </p>
                  </div>
                </div>
              </div>

              {/* RESPONSE */}

              <div className="mt-4 rounded-2xl border border-[#eadfd6] bg-white p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#fff2ed] text-[#a51c30]">
                    <Clock3 className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="font-bold text-[#241b18]">
                      Help us respond faster
                    </p>

                    <p className="mt-1.5 text-sm leading-6 text-[#756860]">
                      Include your order number, seller details, product
                      information, or any other relevant reference when
                      applicable.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* =====================================================
                FORM
            ===================================================== */}

            <div className="relative">
              <div className="absolute -inset-5 rounded-[2.5rem] bg-[#c99a45]/10 blur-2xl" />

              <div className="relative rounded-[2rem] border border-[#eadfd6] bg-white p-6 shadow-2xl shadow-[#6f5145]/10 sm:p-8 lg:p-10">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#a51c30] text-white shadow-lg shadow-[#a51c30]/20">
                    <Mail className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-xl font-extrabold text-[#241b18] sm:text-2xl">
                      Send us a message
                    </p>

                    <p className="mt-1 text-sm leading-6 text-[#756860]">
                      Fill in the details below and tell us how we can help.
                    </p>
                  </div>
                </div>
                <ContactForm />
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            BEFORE CONTACTING
        ========================================================= */}

        <section className="border-y border-[#eadfd6] bg-[#fbf4ef]">
          <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#a51c30]">
                Before You Contact Us
              </p>

              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#241b18] sm:text-4xl">
                A few details can help us help you faster.
              </h2>
            </div>

            <div className="mt-12 grid gap-5 md:grid-cols-3">
              <HelpCard
                icon={<PackageCheck className="h-5 w-5" />}
                title="Order Questions"
                text="Include your MYSMME order number and explain the issue you are experiencing."
              />

              <HelpCard
                icon={<Store className="h-5 w-5" />}
                title="Seller Questions"
                text="Include your seller details and relevant catalogue, product, listing, or order information."
              />

              <HelpCard
                icon={<Users className="h-5 w-5" />}
                title="Business Enquiries"
                text="Tell us about your company, proposal, collaboration idea, and how you would like to work with MYSMME."
              />
            </div>
          </div>
        </section>

        {/* =========================================================
            SUPPORT ROUTES
        ========================================================= */}

        <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
          <div className="grid gap-5 lg:grid-cols-2">
            {/* CUSTOMER */}

            <div className="relative overflow-hidden rounded-[2rem] border border-[#eadfd6] bg-white p-8 shadow-sm sm:p-10">
              <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-[#a51c30]/5 blur-[70px]" />

              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff2ed] text-[#a51c30]">
                  <ShoppingBag className="h-6 w-6" />
                </div>

                <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.25em] text-[#a51c30]">
                  For Shoppers
                </p>

                <h3 className="mt-2 text-2xl font-extrabold text-[#241b18]">
                  Looking for your next saree?
                </h3>

                <p className="mt-4 max-w-xl text-sm leading-7 text-[#756860]">
                  Explore sarees and collections available from marketplace
                  sellers across MYSMME.
                </p>

                <Link
                  href="/products"
                  className="group mt-7 inline-flex items-center gap-2 text-sm font-bold text-[#a51c30]"
                >
                  Explore Sarees
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            {/* SELLER */}

            <div className="relative overflow-hidden rounded-[2rem] bg-[#241b18] p-8 text-white shadow-xl sm:p-10">
              <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-[#c99a45]/10 blur-[70px]" />

              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#a51c30] text-white">
                  <Store className="h-6 w-6" />
                </div>

                <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.25em] text-[#e6bd72]">
                  For Sellers
                </p>

                <h3 className="mt-2 text-2xl font-extrabold">
                  Want to sell on MYSMME?
                </h3>

                <p className="mt-4 max-w-xl text-sm leading-7 text-white/60">
                  Build your marketplace presence and showcase your saree and
                  Indian fashion collections to online customers.
                </p>

                <Link
                  href="/seller"
                  className="group mt-7 inline-flex items-center gap-2 text-sm font-bold text-[#e6bd72]"
                >
                  Become a Seller
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            FAQ
        ========================================================= */}

        <section className="border-t border-[#eadfd6] bg-[#fbf4ef]">
          <div className="mx-auto max-w-4xl px-6 py-16 lg:px-8 lg:py-24">
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#a51c30] shadow-sm">
                <HelpCircle className="h-5 w-5" />
              </div>

              <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.28em] text-[#a51c30]">
                Frequently Asked Questions
              </p>

              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#241b18] sm:text-4xl">
                Contact & Support
              </h2>

              <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#756860]">
                Find quick answers about contacting MYSMME for customer, seller,
                and business support.
              </p>
            </div>

            <div className="mt-12 space-y-4">
              {CONTACT_FAQS.map((faq) => (
                <FaqItem
                  key={faq.question}
                  question={faq.question}
                  answer={faq.answer}
                />
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================
            FINAL CTA
        ========================================================= */}

        <section className="border-t border-[#eadfd6] bg-[#f8eee7]">
          <div className="relative mx-auto max-w-4xl overflow-hidden px-6 py-16 text-center lg:py-20">
            <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#c99a45]/10 blur-[90px]" />

            <div className="relative">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#a51c30] text-white shadow-lg shadow-[#a51c30]/20">
                <Sparkles className="h-6 w-6" />
              </div>

              <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.28em] text-[#a51c30]">
                MYSMME
              </p>

              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#241b18] sm:text-4xl">
                Indian fashion, brought together.
              </h2>

              <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[#6f625c]">
                Discover sarees, explore new sellers, and experience a
                marketplace built around Indian fashion.
              </p>

              <Link
                href="/products"
                className="group mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-[#a51c30] px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#a51c30]/20 transition hover:bg-[#8e1729]"
              >
                Explore MYSMME
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}

/* ================================================================
   TRUST ITEM
================================================================ */

function TrustItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 text-xs font-medium text-[#665852]">
      <CheckCircle2 className="h-4 w-4 text-[#a51c30]" />

      {text}
    </div>
  );
}

/* ================================================================
   CONTACT OPTION
================================================================ */

function ContactOption({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="group rounded-2xl border border-[#eadfd6] bg-white p-5 transition duration-300 hover:-translate-y-1 hover:border-[#ddc7ba] hover:shadow-xl hover:shadow-[#6f5145]/5">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#fff2ed] text-[#a51c30] transition group-hover:bg-[#a51c30] group-hover:text-white">
          {icon}
        </div>

        <div>
          <h3 className="font-bold text-[#241b18]">{title}</h3>

          <p className="mt-1.5 text-sm leading-6 text-[#756860]">{text}</p>
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   FORM FIELD
================================================================ */

function FormField({
  label,
  name,
  type,
  placeholder,
  required = false,
}: {
  label: string;
  name: string;
  type: string;
  placeholder: string;
  required?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-bold text-[#3c302b]"
      >
        {label}

        {required && <span className="ml-1 text-[#a51c30]">*</span>}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="h-[50px] w-full rounded-xl border border-[#dfd2ca] bg-[#fffdfb] px-4 text-sm text-[#443732] outline-none transition placeholder:text-[#aa9d96] focus:border-[#a51c30] focus:ring-4 focus:ring-[#a51c30]/5"
      />
    </div>
  );
}

/* ================================================================
   HELP CARD
================================================================ */

function HelpCard({
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
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff2ed] text-[#a51c30]">
        {icon}
      </div>

      <h3 className="mt-5 text-lg font-bold text-[#241b18]">{title}</h3>

      <p className="mt-2 text-sm leading-7 text-[#756860]">{text}</p>
    </div>
  );
}

/* ================================================================
   FAQ
================================================================ */

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
