import Link from "next/link";

import {
  ArrowRight,
  Banknote,
  Boxes,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  ImageIcon,
  PackageCheck,
  ShoppingBag,
  Sparkles,
  Store,
  Truck,
} from "lucide-react";

/* ================================================================
   SELLER GUIDE PAGE
================================================================ */

export default function SellerGuidePage() {
  return (
    <main className="min-h-screen bg-[#fbfaf8] text-[#24191b]">
      {/* =========================================================
          HERO
      ========================================================= */}

      <section className="relative overflow-hidden border-b border-[#ebe2dc] bg-[#f5eee9]">
        <div className="pointer-events-none absolute -right-28 -top-32 h-96 w-96 rounded-full bg-[#a51c30]/10 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-40 -left-28 h-96 w-96 rounded-full bg-[#d4af37]/10 blur-3xl" />

        <div className="relative mx-auto max-w-[1400px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#a51c30]/15 bg-white/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#a51c30] backdrop-blur">
              <Store className="h-4 w-4" />
              Sell on MYSMME
            </div>

            <h1 className="mt-6 text-4xl font-extrabold tracking-[-0.04em] text-[#24191b] sm:text-5xl lg:text-6xl">
              Your guide to selling
              <span className="text-[#a51c30]"> on MYSMME.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-[#736768] sm:text-lg">
              Learn how to create your seller account, prepare your catalogue,
              manage orders and build a strong presence on MYSMME.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="https://admin.mysmme.com/auth/register"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-[#a51c30] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#8e1729]"
              >
                Become a Seller
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="https://admin.mysmme.com/auth/login"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-[#d8cec8] bg-white px-6 py-3.5 text-sm font-bold text-[#4f4446] transition hover:border-[#a51c30]/40 hover:text-[#a51c30]"
              >
                Seller Login
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          HOW IT WORKS
      ========================================================= */}

      <section className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <SectionHeading
          eyebrow="Getting started"
          title="How selling on MYSMME works"
          description="A simple path from registration to receiving orders."
        />

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <StepCard
            number="01"
            icon={<Store className="h-5 w-5" />}
            title="Create your seller account"
            description="Register your seller profile and provide the required business information."
          />

          <StepCard
            number="02"
            icon={<Boxes className="h-5 w-5" />}
            title="Add your catalogue"
            description="Create saree listings with accurate details, pricing and product images."
          />

          <StepCard
            number="03"
            icon={<ClipboardCheck className="h-5 w-5" />}
            title="Catalogue review"
            description="Your catalogue is reviewed before products become available for customers."
          />

          <StepCard
            number="04"
            icon={<ShoppingBag className="h-5 w-5" />}
            title="Receive orders"
            description="Once approved and live, customers can discover and order your sarees."
          />

          <StepCard
            number="05"
            icon={<Truck className="h-5 w-5" />}
            title="Prepare and dispatch"
            description="Process orders carefully and follow the required fulfilment and dispatch steps."
          />

          <StepCard
            number="06"
            icon={<Banknote className="h-5 w-5" />}
            title="Receive payments"
            description="Track completed orders and settlements from your seller account."
          />
        </div>
      </section>

      {/* =========================================================
          WHAT YOU NEED
      ========================================================= */}

      <section className="border-y border-[#ebe3de] bg-white">
        <div className="mx-auto grid max-w-[1400px] gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8 lg:py-20">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#a51c30]">
              Before you start
            </p>

            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Keep your seller information ready
            </h2>

            <p className="mt-4 max-w-lg text-sm leading-7 text-[#756a6b]">
              Having your business and product information prepared makes the
              onboarding and catalogue process much easier.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <InfoCard
              icon={<FileText className="h-5 w-5" />}
              title="Business information"
              text="Keep your business name, contact information and applicable registration details ready."
            />

            <InfoCard
              icon={<Banknote className="h-5 w-5" />}
              title="Payment information"
              text="Provide valid settlement and bank information where required."
            />

            <InfoCard
              icon={<ImageIcon className="h-5 w-5" />}
              title="Product images"
              text="Prepare clear saree images that accurately represent the product being listed."
            />

            <InfoCard
              icon={<PackageCheck className="h-5 w-5" />}
              title="Product details"
              text="Keep fabric, colour, category, pricing and other saree information accurate."
            />
          </div>
        </div>
      </section>

      {/* =========================================================
          LISTING GUIDE
      ========================================================= */}

      <section className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <SectionHeading
          eyebrow="Catalogue"
          title="Create better product listings"
          description="Clear and accurate listings help customers understand exactly what they are buying."
        />

        <div className="mt-10 overflow-hidden rounded-2xl border border-[#e8e0db] bg-white">
          <GuideRow
            number="01"
            title="Use clear product images"
            description="Upload images that clearly show the saree colour, design, border, pallu and overall appearance."
          />

          <GuideRow
            number="02"
            title="Write an accurate title"
            description="Keep product titles clear and relevant to the saree instead of using unrelated promotional wording."
          />

          <GuideRow
            number="03"
            title="Choose the correct category"
            description="Select the category and fabric that best represent the actual product."
          />

          <GuideRow
            number="04"
            title="Enter correct pricing"
            description="Make sure the MRP and selling price are entered correctly before submitting the catalogue."
          />

          <GuideRow
            number="05"
            title="Complete saree attributes"
            description="Provide relevant saree, blouse, border, fabric and other product information where applicable."
          />
        </div>
      </section>

      {/* =========================================================
          APPROVAL
      ========================================================= */}

      <section className="bg-[#281719] text-white">
        <div className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <Sparkles className="h-6 w-6 text-[#e7bf93]" />

              <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.22em] text-[#e7bf93]">
                Catalogue approval
              </p>

              <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
                Quality listings create a better marketplace.
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-7 text-white/65">
                Catalogues may be reviewed before they are published. Make sure
                product information and images are complete and accurate before
                submitting them for approval.
              </p>
            </div>

            <div className="space-y-3">
              <ApprovalItem text="Product information is complete and accurate" />
              <ApprovalItem text="Images clearly represent the listed saree" />
              <ApprovalItem text="Pricing and product attributes are correct" />
              <ApprovalItem text="The listing follows MYSMME catalogue standards" />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          ORDER PROCESS
      ========================================================= */}

      <section className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <SectionHeading
          eyebrow="Orders"
          title="From order to delivery"
          description="Keep every order moving smoothly from confirmation to fulfilment."
        />

        <div className="mt-10 grid gap-4 lg:grid-cols-4">
          <ProcessCard
            title="Order received"
            number="1"
            text="Review the order details from your seller account."
          />

          <ProcessCard
            title="Prepare product"
            number="2"
            text="Verify the saree and prepare it carefully for fulfilment."
          />

          <ProcessCard
            title="Dispatch"
            number="3"
            text="Complete the required dispatch process within the applicable timeline."
          />

          <ProcessCard
            title="Settlement"
            number="4"
            text="Track completed orders and payment settlement from your account."
          />
        </div>
      </section>

      {/* =========================================================
          SELLER STANDARDS
      ========================================================= */}

      <section className="border-y border-[#e8e0db] bg-[#f5efeb]">
        <div className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeading
            eyebrow="Seller standards"
            title="Build trust with every order"
            description="A consistent customer experience helps strengthen your seller presence."
          />

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            <StandardItem text="List only products that accurately match the images and description." />

            <StandardItem text="Maintain accurate pricing, availability and catalogue information." />

            <StandardItem text="Prepare products carefully before dispatch." />

            <StandardItem text="Avoid unnecessary cancellations and fulfil accepted orders responsibly." />

            <StandardItem text="Respond promptly when seller action is required." />

            <StandardItem text="Maintain consistent product and service quality." />
          </div>
        </div>
      </section>

      {/* =========================================================
          FAQ
      ========================================================= */}

      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#a51c30]">
            Seller FAQ
          </p>

          <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Common questions
          </h2>
        </div>

        <div className="mt-10 divide-y divide-[#e9e1dc] border-y border-[#e9e1dc]">
          <FaqItem
            question="How do I start selling on MYSMME?"
            answer="Create your seller account, complete your seller information and begin preparing your catalogue."
          />

          <FaqItem
            question="When will my sarees appear on MYSMME?"
            answer="Listings become available after the required catalogue review and approval process is completed."
          />

          <FaqItem
            question="Can I edit my catalogue?"
            answer="Catalogue information can be managed from the seller platform according to the available catalogue controls."
          />

          <FaqItem
            question="Where can I manage my orders?"
            answer="Seller orders can be managed from the seller platform after signing in to your account."
          />
        </div>
      </section>

      {/* =========================================================
          CTA
      ========================================================= */}

      <section className="px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24">
        <div className="mx-auto max-w-[1400px] rounded-[28px] bg-[#a51c30] px-6 py-12 text-center text-white sm:px-10 lg:py-16">
          <Store className="mx-auto h-8 w-8" />

          <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-white/65">
            Sell with MYSMME
          </p>

          <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl">
            Ready to bring your sarees to MYSMME?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/70">
            Create your seller account and start building your catalogue.
          </p>

          <Link
            href="https://admin.mysmme.com/auth/register"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-[#a51c30] transition hover:bg-[#fff5f1]"
          >
            Become a Seller
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}

/* ================================================================
   SECTION HEADING
================================================================ */

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#a51c30]">
        {eyebrow}
      </p>

      <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#24191b] sm:text-4xl">
        {title}
      </h2>

      <p className="mt-3 max-w-2xl text-sm leading-7 text-[#756a6b]">
        {description}
      </p>
    </div>
  );
}

/* ================================================================
   STEP CARD
================================================================ */

function StepCard({
  number,
  icon,
  title,
  description,
}: {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-[#e7dfda] bg-white p-6 transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff1ed] text-[#a51c30]">
          {icon}
        </div>

        <span className="text-xs font-bold text-[#c6b8b3]">{number}</span>
      </div>

      <h3 className="mt-6 text-lg font-bold">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-[#776c6d]">{description}</p>
    </div>
  );
}

/* ================================================================
   INFO CARD
================================================================ */

function InfoCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-[#e8e0db] bg-[#fbfaf8] p-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#a51c30] shadow-sm">
        {icon}
      </div>

      <h3 className="mt-4 font-bold">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-[#786d6e]">{text}</p>
    </div>
  );
}

/* ================================================================
   GUIDE ROW
================================================================ */

function GuideRow({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="grid gap-4 border-b border-[#eee7e2] p-6 last:border-b-0 sm:grid-cols-[60px_220px_1fr] sm:items-start">
      <span className="text-xs font-bold text-[#b4a6a2]">{number}</span>

      <h3 className="font-bold text-[#2a2022]">{title}</h3>

      <p className="text-sm leading-6 text-[#776c6d]">{description}</p>
    </div>
  );
}

/* ================================================================
   APPROVAL ITEM
================================================================ */

function ApprovalItem({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.06] p-4">
      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#e8be8e]" />

      <p className="text-sm leading-6 text-white/75">{text}</p>
    </div>
  );
}

/* ================================================================
   PROCESS CARD
================================================================ */

function ProcessCard({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="border-t-2 border-[#a51c30] bg-white p-6 shadow-sm">
      <p className="text-xs font-bold text-[#a51c30]">STEP {number}</p>

      <h3 className="mt-4 text-lg font-bold">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-[#776c6d]">{text}</p>
    </div>
  );
}

/* ================================================================
   STANDARD
================================================================ */

function StandardItem({ text }: { text: string }) {
  return (
    <div className="flex gap-3 rounded-xl bg-white p-5">
      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#a51c30]" />

      <p className="text-sm leading-6 text-[#665b5c]">{text}</p>
    </div>
  );
}

/* ================================================================
   FAQ
================================================================ */

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="group py-5">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-5 font-bold text-[#2b2022]">
        {question}

        <span className="text-xl font-light text-[#a51c30] transition-transform group-open:rotate-45">
          +
        </span>
      </summary>

      <p className="max-w-2xl pt-3 text-sm leading-7 text-[#776c6d]">
        {answer}
      </p>
    </details>
  );
}
