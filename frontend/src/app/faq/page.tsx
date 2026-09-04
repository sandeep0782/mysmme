"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  ClipboardList,
  Crown,
  IndianRupee,
  Package,
  Search,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Store,
  Truck,
  UserPlus,
  Users,
  WalletCards,
  X,
} from "lucide-react";

type FAQ = {
  question: string;
  answer: string;
  category: string;
};

const FAQS: FAQ[] = [
  // =========================================================
  // GENERAL
  // =========================================================
  {
    category: "General",
    question: "What is MYSMME?",
    answer:
      "MYSMME is an independent online e-commerce marketplace where customers can discover and shop for sarees, ethnic wear, fashion, lifestyle products and other products offered by participating sellers.",
  },
  {
    category: "General",
    question: "Is MYSMME a saree marketplace?",
    answer:
      "Yes. Sarees are an important part of the MYSMME marketplace. Customers can discover sarees and other traditional, ethnic and fashion products from participating sellers.",
  },
  {
    category: "General",
    question: "Is MYSMME an online shopping website?",
    answer:
      "Yes. MYSMME provides an online marketplace where shoppers can browse products, discover sellers and purchase products available on the platform.",
  },
  {
    category: "General",
    question: "What products can I find on MYSMME?",
    answer:
      "Depending on the categories and sellers available on the platform, MYSMME may offer sarees, ethnic wear, women's fashion, men's fashion, kids' fashion, accessories, lifestyle products and other marketplace products.",
  },
  {
    category: "General",
    question: "Who is MYSMME for?",
    answer:
      "MYSMME is built for both sides of the marketplace: customers looking to discover and purchase products, and sellers or businesses looking to showcase their products online.",
  },

  // =========================================================
  // MSME CLARIFICATION
  // =========================================================
  {
    category: "MYSMME vs MSME",
    question: "Is MYSMME related to MSME (Ministry of MSME)?",
    answer:
      "No. MYSMME is not the Ministry of MSME, is not a government department and is not an official Government of India MSME portal. MYSMME is an independent e-commerce marketplace focused on sarees, fashion, lifestyle and other products. The names MYSMME and MSME may look similar, but they refer to different things.",
  },
  {
    category: "MYSMME vs MSME",
    question: "Is MYSMME affiliated with the Government of India?",
    answer:
      "No. MYSMME is an independent e-commerce marketplace and should not be considered a Government of India website, ministry, department or official government portal.",
  },
  {
    category: "MYSMME vs MSME",
    question: "Is MYSMME the official MSME website?",
    answer:
      "No. MYSMME is not the official website of the Ministry of Micro, Small & Medium Enterprises. MYSMME is a private online marketplace for shopping and selling products.",
  },
  {
    category: "MYSMME vs MSME",
    question: "What does MSME mean?",
    answer:
      "MSME stands for Micro, Small and Medium Enterprises. In India, the term is also associated with the Government of India's Ministry of Micro, Small & Medium Enterprises.",
  },
  {
    category: "MYSMME vs MSME",
    question: "Why does MYSMME sound similar to MSME?",
    answer:
      "The names can look or sound similar when searched online, which can naturally create confusion. However, MYSMME and MSME are separate. MYSMME is an e-commerce marketplace, while MSME refers to Micro, Small and Medium Enterprises and the government ministry associated with MSME-related policies and programmes.",
  },

  // =========================================================
  // SHOPPING
  // =========================================================
  {
    category: "Shopping",
    question: "How can I shop on MYSMME?",
    answer:
      "Browse the available products, explore categories or use search to find something you like. Open a product listing to review its details and then follow the available checkout process to place your order.",
  },
  {
    category: "Shopping",
    question: "How do I find a saree on MYSMME?",
    answer:
      "You can use the search functionality, browse relevant categories or explore the saree products available on the marketplace. Product filters may also be available depending on the category.",
  },
  {
    category: "Shopping",
    question: "Can I search for products by category?",
    answer:
      "Yes. MYSMME is designed to help shoppers discover products through categories, search and other available marketplace navigation features.",
  },
  {
    category: "Shopping",
    question: "Can I compare products from different sellers?",
    answer:
      "Where product information is available, you can review listings from different sellers and compare relevant details such as product description, pricing, images and other information shown on the marketplace.",
  },
  {
    category: "Shopping",
    question: "How do I know the product size or dimensions?",
    answer:
      "Product-specific size, measurements and specifications should be checked on the individual product listing. Available information can vary depending on the product and seller.",
  },
  {
    category: "Shopping",
    question: "Are product images accurate?",
    answer:
      "Product images are provided to help customers understand the appearance of an item. Colours and appearance may vary slightly because of photography, lighting and individual screen settings.",
  },

  // =========================================================
  // ORDERS
  // =========================================================
  {
    category: "Orders",
    question: "How do I place an order?",
    answer:
      "Select a product you want to purchase, review the available product information, add it to your cart where applicable and follow the instructions shown during checkout.",
  },
  {
    category: "Orders",
    question: "Do I need an account to place an order?",
    answer:
      "Account requirements may depend on the checkout flow available on MYSMME. If an account is required, you can register or sign in using the options provided on the platform.",
  },
  {
    category: "Orders",
    question: "Where can I see my order details?",
    answer:
      "If order management is available through your MYSMME account, you can sign in and review your order information. Order-related information may also be provided through your registered contact details.",
  },
  {
    category: "Orders",
    question: "Can I cancel my order?",
    answer:
      "Cancellation depends on the order status and the applicable cancellation policy. If cancellation is available for your order, follow the cancellation instructions provided through the platform.",
  },
  {
    category: "Orders",
    question: "What should I do if I receive the wrong product?",
    answer:
      "Contact MYSMME support as soon as possible with your order details and information about the issue. You may be asked to provide photographs or other relevant evidence.",
  },

  // =========================================================
  // PAYMENTS
  // =========================================================
  {
    category: "Payments",
    question: "What payment methods are available?",
    answer:
      "Available payment methods can vary. The payment options displayed during checkout are the methods currently available for the applicable order.",
  },
  {
    category: "Payments",
    question: "Is online payment secure?",
    answer:
      "MYSMME takes reasonable measures to support secure transactions and protect customer information. Customers should also keep passwords, OTPs and payment credentials private.",
  },
  {
    category: "Payments",
    question: "Will I receive payment confirmation?",
    answer:
      "Payment and order confirmation information may be provided through the checkout process or the contact details associated with your order.",
  },
  {
    category: "Payments",
    question: "What happens if my payment fails?",
    answer:
      "If a payment does not complete successfully, check the payment status before trying again. If an amount has been debited but the order was not successfully placed, contact the relevant support team with your transaction and order information.",
  },

  // =========================================================
  // DELIVERY
  // =========================================================
  {
    category: "Delivery",
    question: "Does MYSMME offer delivery?",
    answer:
      "Delivery availability depends on the product, seller, destination and applicable shipping arrangements.",
  },
  {
    category: "Delivery",
    question: "How long does delivery take?",
    answer:
      "Delivery times can vary based on product availability, seller location, destination, shipping method and other logistical factors. The estimated delivery information shown during shopping or checkout should be used as the primary reference.",
  },
  {
    category: "Delivery",
    question: "Can I track my order?",
    answer:
      "Where shipment tracking is available, tracking information may be provided after your order has been shipped.",
  },
  {
    category: "Delivery",
    question: "Does MYSMME deliver across India?",
    answer:
      "Delivery coverage may vary by product and seller. Enter your delivery location during shopping or checkout to determine whether delivery is available for a particular product.",
  },
  {
    category: "Delivery",
    question: "What should I do if my order is delayed?",
    answer:
      "Check your latest order or shipment information first. If the order has exceeded the estimated delivery period, contact MYSMME support with your order details.",
  },

  // =========================================================
  // RETURNS
  // =========================================================
  {
    category: "Returns & Refunds",
    question: "Can I return a product?",
    answer:
      "Return eligibility depends on the product, seller and applicable MYSMME return policy. Check the return information associated with the specific product before placing an order.",
  },
  {
    category: "Returns & Refunds",
    question: "How do I request a return?",
    answer:
      "Follow the return instructions provided with your order or through your MYSMME account, where available. You may need to provide order information and details about the reason for the return.",
  },
  {
    category: "Returns & Refunds",
    question: "When will I receive my refund?",
    answer:
      "Refund processing times can vary depending on the reason for the refund, order status, payment method, seller and applicable refund policy.",
  },
  {
    category: "Returns & Refunds",
    question: "What if my product arrives damaged?",
    answer:
      "Contact MYSMME support as soon as possible and provide your order details along with information about the damage. Photographs may be requested where appropriate.",
  },

  // =========================================================
  // SELLERS
  // =========================================================
  {
    category: "Selling",
    question: "Can I sell products on MYSMME?",
    answer:
      "Yes. MYSMME is designed as a marketplace that allows participating sellers and businesses to showcase products and reach customers online, subject to the platform's seller requirements.",
  },
  {
    category: "Selling",
    question: "Can small businesses sell on MYSMME?",
    answer:
      "Yes. MYSMME is intended to provide sellers and businesses with an online marketplace where they can showcase products and build their presence.",
  },
  {
    category: "Selling",
    question: "How do I become a seller?",
    answer:
      "Start by registering through the seller or registration options available on MYSMME. Follow the onboarding instructions and provide the required business and account information.",
  },
  {
    category: "Selling",
    question: "What can sellers do on MYSMME?",
    answer:
      "Depending on the seller features available to your account, sellers can create a profile, add and manage products, maintain catalogue information, receive orders and manage marketplace activity.",
  },
  {
    category: "Selling",
    question: "Can sellers manage their products online?",
    answer:
      "MYSMME is designed to provide sellers with tools for managing their marketplace product catalogue, including product information, images and pricing where applicable.",
  },
  {
    category: "Selling",
    question: "Can sellers manage orders?",
    answer:
      "Yes. Seller functionality can include receiving and managing incoming orders and carrying out the activities required to fulfil those orders.",
  },

  // =========================================================
  // ACCOUNT
  // =========================================================
  {
    category: "Account",
    question: "How do I create a MYSMME account?",
    answer:
      "Use the registration option available on the MYSMME website and follow the instructions to create your account.",
  },
  {
    category: "Account",
    question: "I forgot my password. What should I do?",
    answer:
      "Use the password recovery or reset option available on the MYSMME login page and follow the instructions provided.",
  },
  {
    category: "Account",
    question: "Can I update my account information?",
    answer:
      "Where account-management features are available, you can update relevant information through your account settings. Some information may require additional verification.",
  },
  {
    category: "Account",
    question: "How can I contact MYSMME?",
    answer:
      "For questions about orders, products, accounts, sellers, returns or other marketplace matters, use the customer-support or contact options available on the MYSMME website.",
  },

  // =========================================================
  // PRIVACY
  // =========================================================
  {
    category: "Privacy & Security",
    question: "How does MYSMME use my information?",
    answer:
      "MYSMME may collect and process information necessary to provide website, marketplace, account, order, payment, customer-support and related services. Please review the Privacy Policy for detailed information.",
  },
  {
    category: "Privacy & Security",
    question: "Does MYSMME share my personal information?",
    answer:
      "Information may be shared with relevant service providers, sellers, logistics partners, payment providers or other parties where necessary to provide marketplace services and as described in the applicable Privacy Policy.",
  },
  {
    category: "Privacy & Security",
    question: "Where can I read the MYSMME Privacy Policy?",
    answer:
      "You can read the MYSMME Privacy Policy to understand how information is collected, used and handled on the platform.",
  },
];

const CATEGORIES = [
  "All",
  "General",
  "Shopping",
  "Orders",
  "Payments",
  "Delivery",
  "Returns & Refunds",
  "Selling",
  "Account",
  "Privacy & Security",
  "MYSMME vs MSME",
];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);

  const filteredFAQs = useMemo(() => {
    const query = search.trim().toLowerCase();

    return FAQS.filter((faq) => {
      const categoryMatch =
        activeCategory === "All" || faq.category === activeCategory;

      const searchMatch =
        !query ||
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query) ||
        faq.category.toLowerCase().includes(query);

      return categoryMatch && searchMatch;
    });
  }, [activeCategory, search]);

  const clearSearch = () => {
    setSearch("");
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#fffdf9] text-[#241b18]">
      {/* =========================================================
          HERO
      ========================================================= */}
      <section className="relative overflow-hidden border-b border-[#eadfd6] bg-[#f8eee7]">
        {/* Background glow */}
        <div className="absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-[#a51c30]/10 blur-[120px]" />
        <div className="absolute -right-40 top-10 h-[520px] w-[520px] rounded-full bg-[#c99a45]/15 blur-[130px]" />
        <div className="absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-white/40 blur-[100px]" />

        {/* Decorative lotus */}
        <div className="absolute left-0 top-24 hidden text-[#a51c30]/5 lg:block">
          <LotusDecoration size={210} />
        </div>

        <div className="absolute bottom-0 right-0 hidden rotate-12 text-[#c99a45]/10 lg:block">
          <LotusDecoration size={210} />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-4xl text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#c99a45]/30 bg-white/75 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.25em] text-[#a51c30] shadow-sm backdrop-blur">
              <CircleHelp className="h-4 w-4 text-[#b27a25]" />
              MYSMME Help Centre
            </div>

            {/* Heading */}
            <h1 className="mt-7 text-4xl font-extrabold leading-[1.04] tracking-tight text-[#241b18] sm:text-5xl lg:text-[4.5rem]">
              Everything you need to know
              <span className="block bg-gradient-to-r from-[#a51c30] via-[#b72c40] to-[#8d1729] bg-clip-text text-transparent">
                about MYSMME.
              </span>
            </h1>

            <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-[#6f625c] sm:text-lg">
              Find quick answers about shopping, sarees, orders, delivery,
              returns, selling on MYSMME and the difference between MYSMME and
              MSME.
            </p>

            {/* Search */}
            <div className="relative mx-auto mt-9 max-w-2xl">
              <div className="flex items-center rounded-2xl border border-[#dfd0c7] bg-white p-2 shadow-xl shadow-[#6d4535]/10 transition focus-within:border-[#a51c30]/40 focus-within:ring-4 focus-within:ring-[#a51c30]/5">
                <Search className="ml-4 h-5 w-5 shrink-0 text-[#9a8c84]" />

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search your question..."
                  className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm font-medium text-[#241b18] outline-none placeholder:text-[#a99b93]"
                />

                {search && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="mr-1 flex h-9 w-9 items-center justify-center rounded-xl text-[#8b7d76] transition hover:bg-[#f8eee7] hover:text-[#a51c30]"
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}

                <div className="hidden rounded-xl bg-[#a51c30] px-5 py-3 text-xs font-bold text-white sm:block">
                  Search
                </div>
              </div>
            </div>

            {/* Hero stats */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-xs font-semibold text-[#756860]">
              <TrustPoint text="Shopping help" />
              <TrustPoint text="Seller support" />
              <TrustPoint text="Order information" />
              <TrustPoint text="MSME clarification" />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          CATEGORY NAVIGATION
      ========================================================= */}
      <section className="border-b border-[#eadfd6] bg-white">
        <div className="mx-auto max-w-7xl px-6 py-5 lg:px-8">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map((category) => {
              const active = activeCategory === category;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => {
                    setActiveCategory(category);
                    setOpenFAQ(0);
                  }}
                  className={`whitespace-nowrap rounded-full px-4 py-2.5 text-xs font-bold transition ${
                    active
                      ? "bg-[#a51c30] text-white shadow-md shadow-[#a51c30]/15"
                      : "border border-[#eadfd6] bg-[#fffdf9] text-[#6f625c] hover:border-[#a51c30]/25 hover:bg-[#fff7f2] hover:text-[#a51c30]"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================
          MSME CLARIFICATION FEATURE
      ========================================================= */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-[#e4d2c5] bg-[#241b18] p-8 shadow-2xl shadow-[#6d4535]/10 sm:p-10 lg:p-14">
          {/* Glow */}
          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#a51c30]/25 blur-[100px]" />
          <div className="absolute -bottom-40 left-1/3 h-80 w-80 rounded-full bg-[#c99a45]/10 blur-[100px]" />

          <div className="relative grid gap-10 lg:grid-cols-[1.15fr_.85fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.24em] text-[#e0b96b]">
                <Sparkles className="h-4 w-4" />
                Important clarification
              </div>

              <h2 className="mt-6 max-w-3xl text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                Is MYSMME related to
                <span className="block text-[#e0b96b]">
                  MSME / Ministry of MSME?
                </span>
              </h2>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-white/60 sm:text-base">
                No. MYSMME is an independent e-commerce marketplace focused on
                sarees, fashion, lifestyle and other products. MYSMME is not the
                Ministry of MSME, is not a government department and is not an
                official Government of India MSME portal.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => {
                    setActiveCategory("MYSMME vs MSME");
                    setSearch("");
                    window.scrollTo({
                      top: document.body.scrollHeight * 0.55,
                      behavior: "smooth",
                    });
                  }}
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#a51c30] px-6 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#bc2940]"
                >
                  Read MSME FAQs
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>

                <Link
                  href="/about-us"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/10"
                >
                  About MYSMME
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Difference card */}
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 backdrop-blur sm:p-7">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#e0b96b]">
                Simple distinction
              </p>

              <div className="mt-6 space-y-4">
                <CompareRow
                  icon={<ShoppingBag className="h-5 w-5" />}
                  title="MYSMME"
                  text="Independent e-commerce marketplace"
                  maroon
                />

                <div className="flex items-center gap-3 px-2">
                  <div className="h-px flex-1 bg-white/10" />
                  <span className="text-[9px] font-bold uppercase tracking-widest text-white/30">
                    different
                  </span>
                  <div className="h-px flex-1 bg-white/10" />
                </div>

                <CompareRow
                  icon={<BuildingIcon className="h-5 w-5" />}
                  title="MSME"
                  text="Micro, Small & Medium Enterprises"
                />

                <p className="pt-2 text-xs leading-6 text-white/40">
                  Similar-looking names do not mean the two are the same
                  organization or service.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          QUICK TOPICS
      ========================================================= */}
      <section className="mx-auto max-w-7xl px-6 pb-16 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <TopicCard
            icon={<ShoppingBag className="h-5 w-5" />}
            title="For Buyers"
            text="Shopping, products and orders"
            onClick={() => setActiveCategory("Shopping")}
          />

          <TopicCard
            icon={<Store className="h-5 w-5" />}
            title="For Sellers"
            text="Selling and marketplace tools"
            onClick={() => setActiveCategory("Selling")}
          />

          <TopicCard
            icon={<Truck className="h-5 w-5" />}
            title="Delivery"
            text="Shipping and tracking"
            onClick={() => setActiveCategory("Delivery")}
          />

          <TopicCard
            icon={<ShieldCheck className="h-5 w-5" />}
            title="Privacy"
            text="Security and information"
            onClick={() => setActiveCategory("Privacy & Security")}
          />
        </div>
      </section>

      {/* =========================================================
          FAQ CONTENT
      ========================================================= */}
      <section className="border-y border-[#eadfd6] bg-[#fbf4ef]">
        <div className="mx-auto max-w-5xl px-6 py-20 lg:px-8 lg:py-24">
          {/* Header */}
          <div className="text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#a51c30]">
              {activeCategory === "All"
                ? "Frequently asked questions"
                : activeCategory}
            </p>

            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#241b18] sm:text-4xl lg:text-5xl">
              {search
                ? "Search results"
                : activeCategory === "All"
                  ? "How can we help?"
                  : `${activeCategory} questions`}
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#756860] sm:text-base">
              {search
                ? `Showing questions matching “${search}”.`
                : "Browse common questions and find the information you need about MYSMME."}
            </p>
          </div>

          {/* Results count */}
          <div className="mt-10 flex items-center justify-between">
            <p className="text-xs font-semibold text-[#968982]">
              {filteredFAQs.length}{" "}
              {filteredFAQs.length === 1 ? "question" : "questions"}
            </p>

            {(activeCategory !== "All" || search) && (
              <button
                type="button"
                onClick={() => {
                  setActiveCategory("All");
                  setSearch("");
                  setOpenFAQ(0);
                }}
                className="text-xs font-bold text-[#a51c30] hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>

          {/* FAQ accordion */}
          <div className="mt-5 overflow-hidden rounded-[2rem] border border-[#eadfd6] bg-white shadow-sm">
            {filteredFAQs.length > 0 ? (
              filteredFAQs.map((faq, index) => {
                const isOpen = openFAQ === index;

                return (
                  <FAQItem
                    key={`${faq.category}-${faq.question}`}
                    faq={faq}
                    isOpen={isOpen}
                    onClick={() => setOpenFAQ(isOpen ? null : index)}
                  />
                );
              })
            ) : (
              <EmptyState search={search} clearSearch={clearSearch} />
            )}
          </div>
        </div>
      </section>

      {/* =========================================================
          BUYER / SELLER CARDS
      ========================================================= */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#fff2ed] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.24em] text-[#a51c30]">
            <Users className="h-4 w-4" />
            One marketplace
          </div>

          <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-[#241b18] sm:text-4xl">
            Built for shoppers and sellers
          </h2>

          <p className="mt-4 text-sm leading-7 text-[#756860] sm:text-base">
            Whether you are here to discover products or grow your business,
            MYSMME brings both sides together.
          </p>
        </div>

        <div className="mt-14 grid gap-7 lg:grid-cols-2">
          <AudienceCard
            type="For Buyers"
            title="Discover products you will love."
            description="Browse sarees, ethnic wear, fashion and lifestyle products from participating sellers."
            icon={<ShoppingBag className="h-7 w-7" />}
            points={[
              "Explore marketplace products",
              "Discover different sellers",
              "Find products by category",
              "Place orders online",
              "Track your purchases",
            ]}
            buttonText="Start Shopping"
            href="/products"
          />

          <AudienceCard
            type="For Sellers"
            title="Put your products in front of more customers."
            description="Create your marketplace presence, showcase products and manage your seller activity from one place."
            icon={<Store className="h-7 w-7" />}
            points={[
              "Create your seller profile",
              "List and manage products",
              "Reach marketplace customers",
              "Manage incoming orders",
              "Build your online presence",
            ]}
            buttonText="Start Selling"
            href="/register"
            dark
          />
        </div>
      </section>

      {/* =========================================================
          SUPPORT CTA
      ========================================================= */}
      <section className="relative overflow-hidden border-t border-[#eadfd6] bg-[#f8eee7]">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#a51c30]/10 blur-[100px]" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-[#c99a45]/10 blur-[100px]" />

        <div className="relative mx-auto max-w-4xl px-6 py-20 text-center lg:px-8 lg:py-24">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#a51c30] text-white shadow-xl shadow-[#a51c30]/20">
            <CircleHelp className="h-6 w-6" />
          </div>

          <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-[#241b18] sm:text-4xl lg:text-5xl">
            Still have a question?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#756860] sm:text-base">
            If you cannot find the answer you are looking for, reach out to the
            MYSMME support team through the available contact options.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/contact-us"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#a51c30] px-7 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#8e1729]"
            >
              Contact MYSMME
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#d9c9c0] bg-white px-7 py-3.5 text-sm font-bold text-[#332723] transition hover:border-[#a51c30]/30 hover:text-[#a51c30]"
            >
              Explore Products
              <ShoppingBag className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================
          FOOTER NOTE
      ========================================================= */}
      <section className="bg-[#241b18]">
        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
            <div>
              <p className="text-sm font-extrabold text-white">
                MYSMME — Online Marketplace
              </p>
              <p className="mt-1 text-xs text-white/40">
                Sarees, fashion, lifestyle and products from participating
                sellers.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-5 text-xs font-semibold text-white/45">
              <Link href="/about-us" className="transition hover:text-white">
                About
              </Link>
              <Link
                href="/privacy-policy"
                className="transition hover:text-white"
              >
                Privacy
              </Link>
              <Link href="/contact-us" className="transition hover:text-white">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

/* =========================================================
   FAQ ITEM
========================================================= */

function FAQItem({
  faq,
  isOpen,
  onClick,
}: {
  faq: FAQ;
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <div className="border-b border-[#eee4de] last:border-b-0">
      <button
        type="button"
        onClick={onClick}
        className="flex w-full items-center gap-4 p-5 text-left transition hover:bg-[#fffaf7] sm:p-6 lg:p-7"
        aria-expanded={isOpen}
      >
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition ${
            isOpen ? "bg-[#a51c30] text-white" : "bg-[#fff2ed] text-[#a51c30]"
          }`}
        >
          <CircleHelp className="h-4 w-4" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex flex-wrap items-center gap-2">
            <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#b27a25]">
              {faq.category}
            </span>
          </div>

          <h3 className="text-sm font-extrabold leading-6 text-[#241b18] sm:text-base">
            {faq.question}
          </h3>
        </div>

        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#eadfd6] bg-white text-[#756860] transition ${
            isOpen ? "rotate-180 bg-[#fff2ed] text-[#a51c30]" : ""
          }`}
        >
          <ChevronDown className="h-4 w-4" />
        </div>
      </button>

      <div
        className={`grid transition-all duration-300 ${
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-5 pb-6 pl-[76px] pr-6 sm:px-6 sm:pb-7 sm:pl-[86px] lg:px-7 lg:pb-8 lg:pl-[91px]">
            <p className="max-w-3xl text-sm leading-7 text-[#756860]">
              {faq.answer}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   TOPIC CARD
========================================================= */

function TopicCard({
  icon,
  title,
  text,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex items-center gap-4 rounded-2xl border border-[#eadfd6] bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-[#d9c5b8] hover:shadow-lg"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#fff2ed] text-[#a51c30] transition group-hover:bg-[#a51c30] group-hover:text-white">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-extrabold text-[#241b18]">{title}</p>
        <p className="mt-1 text-xs text-[#8b7d76]">{text}</p>
      </div>

      <ChevronRight className="h-4 w-4 shrink-0 text-[#b8a9a1] transition group-hover:translate-x-1 group-hover:text-[#a51c30]" />
    </button>
  );
}

/* =========================================================
   AUDIENCE CARD
========================================================= */

function AudienceCard({
  type,
  title,
  description,
  icon,
  points,
  buttonText,
  href,
  dark = false,
}: {
  type: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  points: string[];
  buttonText: string;
  href: string;
  dark?: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-[2rem] border p-8 sm:p-10 ${
        dark
          ? "border-[#241b18] bg-[#241b18] text-white"
          : "border-[#eadfd6] bg-[#fbf4ef]"
      }`}
    >
      <div
        className={`absolute -right-20 -top-20 h-52 w-52 rounded-full blur-3xl ${
          dark ? "bg-[#a51c30]/20" : "bg-[#c99a45]/10"
        }`}
      />

      <div className="relative">
        <div className="flex items-start justify-between gap-6">
          <div
            className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
              dark ? "bg-[#a51c30] text-white" : "bg-white text-[#a51c30]"
            }`}
          >
            {icon}
          </div>

          <span
            className={`rounded-full px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.18em] ${
              dark ? "bg-white/10 text-[#e0b96b]" : "bg-white text-[#a51c30]"
            }`}
          >
            {type}
          </span>
        </div>

        <h3
          className={`mt-7 text-2xl font-extrabold leading-tight ${
            dark ? "text-white" : "text-[#241b18]"
          }`}
        >
          {title}
        </h3>

        <p
          className={`mt-4 text-sm leading-7 ${
            dark ? "text-white/55" : "text-[#6f625c]"
          }`}
        >
          {description}
        </p>

        <div className="mt-7 space-y-3">
          {points.map((point) => (
            <div
              key={point}
              className={`flex items-center gap-3 text-sm ${
                dark ? "text-white/75" : "text-[#5f534d]"
              }`}
            >
              <CheckCircle2
                className={`h-4 w-4 shrink-0 ${
                  dark ? "text-[#d5aa58]" : "text-[#a51c30]"
                }`}
              />
              {point}
            </div>
          ))}
        </div>

        <Link
          href={href}
          className={`group mt-8 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition ${
            dark
              ? "bg-white text-[#241b18] hover:bg-[#f8eee7]"
              : "bg-[#a51c30] text-white hover:bg-[#8e1729]"
          }`}
        >
          {buttonText}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}

/* =========================================================
   COMPARE ROW
========================================================= */

function CompareRow({
  icon,
  title,
  text,
  maroon = false,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  maroon?: boolean;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.05] p-4">
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
          maroon ? "bg-[#a51c30] text-white" : "bg-[#c99a45]/10 text-[#e0b96b]"
        }`}
      >
        {icon}
      </div>

      <div>
        <p className="text-sm font-extrabold text-white">{title}</p>
        <p className="mt-1 text-xs leading-5 text-white/45">{text}</p>
      </div>
    </div>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyState({
  search,
  clearSearch,
}: {
  search: string;
  clearSearch: () => void;
}) {
  return (
    <div className="px-6 py-16 text-center sm:px-10">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff2ed] text-[#a51c30]">
        <Search className="h-6 w-6" />
      </div>

      <h3 className="mt-5 text-lg font-extrabold text-[#241b18]">
        No questions found
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#756860]">
        We could not find an FAQ matching{" "}
        <span className="font-bold text-[#241b18]">
          {search ? `"${search}"` : "your selection"}
        </span>
        .
      </p>

      <button
        type="button"
        onClick={clearSearch}
        className="mt-6 rounded-xl bg-[#a51c30] px-5 py-3 text-xs font-bold text-white transition hover:bg-[#8e1729]"
      >
        Clear Search
      </button>
    </div>
  );
}

/* =========================================================
   TRUST POINT
========================================================= */

function TrustPoint({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2">
      <CheckCircle2 className="h-4 w-4 text-[#a51c30]" />
      {text}
    </div>
  );
}

/* =========================================================
   BUILDING ICON
========================================================= */

function BuildingIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 21h18" />
      <path d="M5 21V7l7-4 7 4v14" />
      <path d="M9 21v-5h6v5" />
      <path d="M8 10h1" />
      <path d="M15 10h1" />
      <path d="M8 13h1" />
      <path d="M15 13h1" />
    </svg>
  );
}

/* =========================================================
   LOTUS DECORATION
========================================================= */

function LotusDecoration({ size = 130 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
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
