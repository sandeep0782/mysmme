import Link from "next/link";
import type { ReactNode } from "react";

/* ================================================================
   FOOTER
================================================================ */

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-[#0b0b0b] text-gray-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ============================================================
            TOP CTA
        ============================================================ */}

        <div className="border-b border-white/10 py-10 sm:py-12">
          <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
            {/* LEFT */}

            <div className="max-w-2xl">
              <div className="mb-3 flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="h-2 w-2 rounded-full bg-red-500"
                />

                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-red-400">
                  MYSMME Saree Marketplace
                </span>
              </div>

              <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Love sarees?
                <span className="text-red-500">
                  {" "}
                  You&apos;re in the right place.
                </span>
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-gray-500 sm:text-base">
                Discover beautiful sarees from brands and sellers across India,
                or join MYSMME and start selling your saree collection online.
              </p>
            </div>

            {/* ACTIONS */}

            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <Link
                href="/sarees"
                className="
                  inline-flex
                  h-11
                  items-center
                  justify-center
                  rounded-xl
                  bg-red-600
                  px-6
                  text-sm
                  font-semibold
                  text-white
                  shadow-lg
                  shadow-red-600/10
                  transition
                  hover:bg-red-700
                  hover:shadow-red-600/20
                  focus:outline-none
                  focus:ring-2
                  focus:ring-red-500
                  focus:ring-offset-2
                  focus:ring-offset-[#0b0b0b]
                "
              >
                Shop Sarees
              </Link>

              <a
                href="https://admin.mysmme.com/auth/register"
                className="
                  inline-flex
                  h-11
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-white/10
                  bg-white/5
                  px-6
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:bg-white/10
                  focus:outline-none
                  focus:ring-2
                  focus:ring-red-500
                  focus:ring-offset-2
                  focus:ring-offset-[#0b0b0b]
                "
              >
                Start Selling
              </a>
            </div>
          </div>
        </div>

        {/* ============================================================
            MAIN FOOTER
        ============================================================ */}

        <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* ==========================================================
              MYSMME
          ========================================================== */}

          <div className="sm:col-span-2 lg:col-span-4">
            <Link href="/" className="group inline-flex items-center gap-3">
              <div
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-xl
                  bg-red-600
                  text-lg
                  font-black
                  text-white
                  shadow-lg
                  shadow-red-600/20
                  transition
                  group-hover:scale-105
                "
              >
                M
              </div>

              <div>
                <p className="text-lg font-bold tracking-tight text-white">
                  MYSMME
                </p>

                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-gray-600">
                  Saree Marketplace
                </p>
              </div>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-6 text-gray-500">
              MYSMME is India&apos;s dedicated saree marketplace, bringing saree
              shoppers, brands and sellers together in one place.
            </p>

            {/* SELLER CTA */}

            <div className="mt-6">
              <p className="text-xs font-semibold text-gray-300">
                Have a saree business?
              </p>

              <a
                href="https://admin.mysmme.com/auth/register"
                className="
                  group
                  mt-3
                  inline-flex
                  items-center
                  gap-2
                  text-sm
                  font-semibold
                  text-red-400
                  transition
                  hover:text-red-300
                "
              >
                Sell on MYSMME
                <span
                  aria-hidden="true"
                  className="transition-transform group-hover:translate-x-1"
                >
                  →
                </span>
              </a>
            </div>

            {/*
              =========================================================
              SOCIAL MEDIA

              Add this block once you have the REAL MYSMME profile URLs.

              Example:

              <div className="mt-6 flex items-center gap-2">
                <SocialButton
                  label="Instagram"
                  href="YOUR_REAL_INSTAGRAM_URL"
                >
                  <InstagramIcon />
                </SocialButton>

                <SocialButton
                  label="Facebook"
                  href="YOUR_REAL_FACEBOOK_URL"
                >
                  <FacebookIcon />
                </SocialButton>

                <SocialButton
                  label="LinkedIn"
                  href="YOUR_REAL_LINKEDIN_URL"
                >
                  <LinkedInIcon />
                </SocialButton>

                <SocialButton
                  label="X"
                  href="YOUR_REAL_X_URL"
                >
                  <TwitterIcon />
                </SocialButton>
              </div>
              =========================================================
            */}
          </div>

          {/* ==========================================================
              SHOP
          ========================================================== */}

          <FooterColumn
            title="Shop Sarees"
            links={[
              ["All Sarees", "/sarees"],
              ["Shop by Category", "/category"],
              ["Shop by Brand", "/brands"],
              ["Deals & Offers", "/deals"],
            ]}
          />

          {/* ==========================================================
              SELLERS
          ========================================================== */}

          <FooterColumn
            title="For Sellers"
            links={[
              ["Become a Seller", "https://admin.mysmme.com/auth/register"],
              ["Seller Dashboard", "https://admin.mysmme.com/auth/login"],
              ["Seller Guide", "/seller-guide"],
              ["Seller Support", "https://admin.mysmme.com/support"],
            ]}
          />

          {/* ==========================================================
              SUPPORT
          ========================================================== */}

          <FooterColumn
            title="Customer Care"
            links={[
              ["Contact Us", "/contact"],
              ["Shipping Information", "/shipping"],
              ["Returns & Refunds", "/returns"],
              ["FAQ", "/faq"],
            ]}
          />

          {/* ==========================================================
              COMPANY
          ========================================================== */}

          <FooterColumn
            title="MYSMME"
            links={[
              ["About MYSMME", "/about-us"],
              ["Featured Brands", "/brands"],
              ["Careers", "/careers"],
              ["Become a Partner", "/partners"],
            ]}
          />
        </div>

        {/* ============================================================
            DISCOVERY STRIP
        ============================================================ */}

        <div className="border-y border-white/10 py-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-400">
                Discover MYSMME
              </p>

              <h3 className="mt-2 text-lg font-bold text-white">
                Sarees for every style and occasion
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Explore sarees by category, brand and occasion and discover
                styles from sellers across India.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <FooterPill href="/sarees">All Sarees</FooterPill>

              <FooterPill href="/category">Categories</FooterPill>

              <FooterPill href="/brands">Saree Brands</FooterPill>
            </div>
          </div>
        </div>

        {/* ============================================================
            TRUST FEATURES
        ============================================================ */}

        <div className="flex flex-col gap-6 py-8 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-x-7 gap-y-4">
            <TrustItem icon={<ShieldIcon />} text="Secure Payments" />

            <TrustItem icon={<TruckIcon />} text="Delivery Across India" />

            <TrustItem icon={<HeadphonesIcon />} text="Customer Support" />

            <TrustItem icon={<BadgeIcon />} text="Verified Sellers" />
          </div>

          <span className="text-xs text-gray-600">
            India&apos;s Dedicated Saree Marketplace
          </span>
        </div>

        {/* ============================================================
            BOTTOM BAR
        ============================================================ */}

        <div className="flex flex-col gap-5 border-t border-white/10 py-6 text-xs md:flex-row md:items-center md:justify-between">
          <p className="text-gray-600">
            © {new Date().getFullYear()} MYSMME. All rights reserved.
          </p>

          <div className="flex flex-wrap gap-x-6 gap-y-3">
            <Link
              href="/privacy"
              className="transition-colors hover:text-white"
            >
              Privacy
            </Link>

            <Link href="/terms" className="transition-colors hover:text-white">
              Terms
            </Link>

            <Link
              href="/cookies"
              className="transition-colors hover:text-white"
            >
              Cookies
            </Link>

            <Link
              href="/contact"
              className="transition-colors hover:text-white"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ================================================================
   FOOTER COLUMN
================================================================ */

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: [string, string][];
}) {
  return (
    <div className="lg:col-span-2">
      <h3 className="text-sm font-semibold text-white">{title}</h3>

      <ul className="mt-5 space-y-3">
        {links.map(([label, href]) => {
          const isExternal = href.startsWith("http");

          return (
            <li key={`${label}-${href}`}>
              {isExternal ? (
                <a
                  href={href}
                  className="
                    group
                    inline-flex
                    items-center
                    text-sm
                    text-gray-500
                    transition-colors
                    hover:text-white
                  "
                >
                  <span>{label}</span>

                  <span
                    aria-hidden="true"
                    className="
                      ml-1
                      max-w-0
                      overflow-hidden
                      text-red-500
                      opacity-0
                      transition-all
                      duration-200
                      group-hover:max-w-3
                      group-hover:opacity-100
                    "
                  >
                    →
                  </span>
                </a>
              ) : (
                <Link
                  href={href}
                  className="
                    group
                    inline-flex
                    items-center
                    text-sm
                    text-gray-500
                    transition-colors
                    hover:text-white
                  "
                >
                  <span>{label}</span>

                  <span
                    aria-hidden="true"
                    className="
                      ml-1
                      max-w-0
                      overflow-hidden
                      text-red-500
                      opacity-0
                      transition-all
                      duration-200
                      group-hover:max-w-3
                      group-hover:opacity-100
                    "
                  >
                    →
                  </span>
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ================================================================
   FOOTER PILL
================================================================ */

function FooterPill({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="
        rounded-full
        border
        border-white/10
        bg-white/[0.03]
        px-4
        py-2
        text-xs
        font-semibold
        text-gray-400
        transition-all
        hover:border-red-500/30
        hover:bg-red-500/10
        hover:text-red-400
      "
    >
      {children}
    </Link>
  );
}

/* ================================================================
   SOCIAL BUTTON

   Keep this helper ready. Add actual social links in the footer
   once you have the real profile URLs.
================================================================ */

function SocialButton({
  label,
  href,
  children,
}: {
  label: string;
  href: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="
        flex
        h-9
        w-9
        items-center
        justify-center
        rounded-lg
        border
        border-white/10
        bg-white/[0.03]
        text-gray-500
        transition-all
        duration-200
        hover:border-red-500/30
        hover:bg-red-500/10
        hover:text-red-500
      "
    >
      {children}
    </a>
  );
}

/* ================================================================
   TRUST ITEM
================================================================ */

function TrustItem({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 text-xs text-gray-600">
      <span className="text-red-500">{icon}</span>

      <span>{text}</span>
    </div>
  );
}

/* ================================================================
   SOCIAL ICONS
================================================================ */

function InstagramIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />

      <circle cx="12" cy="12" r="4" />

      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M14 8h3V4h-3c-3.3 0-5 2-5 5v3H6v4h3v8h4v-8h3.5l.5-4H13V9c0-.7.3-1 1-1Z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M5 3.5A2.5 2.5 0 1 1 5 8a2.5 2.5 0 0 1 0-4.5ZM3 9h4v12H3V9Zm6 0h3.8v1.7h.1c.5-1 1.8-2.1 3.8-2.1 4 0 4.7 2.6 4.7 6v6.4h-4v-5.7c0-1.4 0-3.2-2-3.2s-2.3 1.5-2.3 3.1V21H9V9Z" />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3l-4.9-6.4L6.4 22H3.3l7.2-8.3L2.8 2h6.4l4.4 5.8L18.9 2Zm-1.1 17.8h1.7L8.3 4.1H6.5l11.3 15.7Z" />
    </svg>
  );
}

/* ================================================================
   TRUST ICONS
================================================================ */

function ShieldIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="M12 3 20 6v5c0 5-3.3 8.5-8 10-4.7-1.5-8-5-8-10V6l8-3Z" />

      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="M3 6h11v11H3z" />

      <path d="M14 10h4l3 3v4h-7z" />

      <circle cx="7" cy="19" r="2" />

      <circle cx="18" cy="19" r="2" />
    </svg>
  );
}

function HeadphonesIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="M4 14a8 8 0 0 1 16 0" />

      <path d="M4 14h3v6H5a1 1 0 0 1-1-1v-5Z" />

      <path d="M20 14h-3v6h2a1 1 0 0 0 1-1v-5Z" />
    </svg>
  );
}

function BadgeIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="m12 3 2.1 1.7 2.7-.2.9 2.5 2.3 1.4-.9 2.5.9 2.5-2.3 1.4-.9 2.5-2.7-.2L12 21l-2.1-1.7-2.7.2-.9-2.5L4 15.6l.9-2.5L4 10.6l2.3-1.4.9-2.5 2.7.2L12 3Z" />

      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
