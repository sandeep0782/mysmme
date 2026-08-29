
import Link from "next/link";
import type { ReactNode } from "react";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-[#0b0b0b] text-gray-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ============================================================
                    TOP CTA
                ============================================================ */}

        <div className="border-b border-white/10 py-10 sm:py-12">
          <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">

            <div className="max-w-2xl">
              <div className="mb-3 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-red-500" />

                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-red-400">
                  MYSMME Marketplace
                </span>
              </div>

              <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Built for sellers.
                <span className="text-red-500"> Designed for growth.</span>
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-gray-500 sm:text-base">
                Manage your products, orders and customers from
                one simple marketplace platform.
              </p>
            </div>

            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <Link
                href="/auth/register"
                className="inline-flex h-11 items-center justify-center rounded-xl bg-red-600 px-6 text-sm font-semibold text-white shadow-lg shadow-red-600/10 transition hover:bg-red-700 hover:shadow-red-600/20"
              >
                Start Selling
              </Link>

              <Link
                href="/products"
                className="inline-flex h-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 px-6 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Explore Marketplace
              </Link>
            </div>

          </div>
        </div>


        {/* ============================================================
                    MAIN FOOTER
                ============================================================ */}

        <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">

          {/* BRAND */}

          <div className="sm:col-span-2 lg:col-span-4">

            <Link
              href="/"
              className="group inline-flex items-center gap-3"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-600 text-lg font-black text-white shadow-lg shadow-red-600/20 transition group-hover:scale-105">
                M
              </div>

              <div>
                <p className="text-lg font-bold tracking-tight text-white">
                  MYSMME
                </p>

                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-gray-600">
                  Seller Platform
                </p>
              </div>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-6 text-gray-500">
              A modern marketplace platform helping businesses
              sell smarter, manage operations and reach more
              customers across India.
            </p>

            {/* Social */}

            <div className="mt-6 flex items-center gap-2">
              <SocialButton label="Instagram">
                <InstagramIcon />
              </SocialButton>

              <SocialButton label="Facebook">
                <FacebookIcon />
              </SocialButton>

              <SocialButton label="LinkedIn">
                <LinkedInIcon />
              </SocialButton>

              <SocialButton label="Twitter">
                <TwitterIcon />
              </SocialButton>
            </div>

          </div>


          {/* MARKETPLACE */}

          <FooterColumn
            title="Marketplace"
            links={[
              ["Browse Products", "/products"],
              ["Categories", "/categories"],
              ["Featured Sellers", "/featured"],
              ["Deals & Offers", "/deals"],
            ]}
          />


          {/* SELLERS */}

          <FooterColumn
            title="For Sellers"
            links={[
              ["Become a Seller", "/auth/register"],
              ["Seller Dashboard", "/seller"],
              ["Seller Guide", "/seller-guide"],
              ["Seller Support", "/seller-support"],
            ]}
          />


          {/* SUPPORT */}

          <FooterColumn
            title="Support"
            links={[
              ["Help Center", "/support"],
              ["Contact Us", "/contact"],
              ["Shipping Information", "/shipping"],
              ["Returns & Refunds", "/returns"],
            ]}
          />


          {/* COMPANY */}

          <FooterColumn
            title="Company"
            links={[
              ["About MYSMME", "/about"],
              ["Careers", "/careers"],
              ["Contact", "/contact"],
              ["Become a Partner", "/partners"],
            ]}
          />

        </div>


        {/* ============================================================
                    NEWSLETTER
                ============================================================ */}

        <div className="border-y border-white/10 py-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 text-red-500">
                  <MailIcon />
                </div>

                <h3 className="text-sm font-semibold text-white">
                  Stay in the loop
                </h3>
              </div>

              <p className="mt-2 text-xs leading-5 text-gray-600 sm:text-sm">
                Get seller tips, marketplace updates and new
                features in your inbox.
              </p>
            </div>

            <form className="flex w-full max-w-lg gap-2">
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                aria-label="Email address"
                required
                className="h-11 min-w-0 flex-1 rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm text-white outline-none transition placeholder:text-gray-700 focus:border-red-500/60 focus:bg-white/[0.05] focus:ring-4 focus:ring-red-500/10"
              />

              <button
                type="submit"
                className="h-11 shrink-0 rounded-xl bg-red-600 px-5 text-sm font-semibold text-white transition hover:bg-red-700 active:scale-[0.98]"
              >
                Subscribe
              </button>
            </form>

          </div>
        </div>


        {/* ============================================================
                    TRUST FEATURES
                ============================================================ */}

        <div className="flex flex-col gap-6 py-8 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">

          <div className="flex flex-wrap gap-x-7 gap-y-4">

            <TrustItem
              icon={<ShieldIcon />}
              text="Secure Platform"
            />

            <TrustItem
              icon={<TruckIcon />}
              text="Reliable Delivery"
            />

            <TrustItem
              icon={<HeadphonesIcon />}
              text="Dedicated Support"
            />

            <TrustItem
              icon={<BadgeIcon />}
              text="Verified Sellers"
            />

          </div>

          <span className="text-xs text-gray-700">
            Made for businesses across India
          </span>

        </div>


        {/* ============================================================
                    BOTTOM BAR
                ============================================================ */}

        <div className="flex flex-col gap-5 border-t border-white/10 py-6 text-xs md:flex-row md:items-center md:justify-between">

          <p className="text-gray-600">
            © 2026 MYSMME. All rights reserved.
          </p>

          <div className="flex flex-wrap gap-x-6 gap-y-3">
            <Link
              href="/privacy"
              className="transition-colors hover:text-white"
            >
              Privacy
            </Link>

            <Link
              href="/terms"
              className="transition-colors hover:text-white"
            >
              Terms
            </Link>

            <Link
              href="/cookies"
              className="transition-colors hover:text-white"
            >
              Cookies
            </Link>

            <Link
              href="/support"
              className="transition-colors hover:text-white"
            >
              Support
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
      <h3 className="text-sm font-semibold text-white">
        {title}
      </h3>

      <ul className="mt-5 space-y-3">
        {links.map(([label, href]) => (
          <li key={href}>
            <Link
              href={href}
              className="group inline-flex items-center text-sm text-gray-500 transition-colors hover:text-white"
            >
              <span>{label}</span>

              <span className="ml-1 max-w-0 overflow-hidden text-red-500 opacity-0 transition-all duration-200 group-hover:max-w-3 group-hover:opacity-100">
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}


/* ================================================================
   SOCIAL BUTTON
================================================================ */

function SocialButton({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <a
      href="#"
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-gray-500 transition-all duration-200 hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-500"
    >
      {children}
    </a>
  );
}


/* ================================================================
   TRUST ITEM
================================================================ */

function TrustItem({
  icon,
  text,
}: {
  icon: ReactNode;
  text: string;
}) {
  return (
    <div className="flex items-center gap-2 text-xs text-gray-600">
      <span className="text-red-500">
        {icon}
      </span>

      <span>{text}</span>
    </div>
  );
}


/* ================================================================
   ICONS
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
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle
        cx="17.5"
        cy="6.5"
        r="1"
        fill="currentColor"
        stroke="none"
      />
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
    >
      <path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3l-4.9-6.4L6.4 22H3.3l7.2-8.3L2.8 2h6.4l4.4 5.8L18.9 2Zm-1.1 17.8h1.7L8.3 4.1H6.5l11.3 15.7Z" />
    </svg>
  );
}


function MailIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}


function ShieldIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
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
    >
      <path d="m12 3 2.1 1.7 2.7-.2.9 2.5 2.3 1.4-.9 2.5.9 2.5-2.3 1.4-.9 2.5-2.7-.2L12 21l-2.1-1.7-2.7.2-.9-2.5L4 15.6l.9-2.5L4 10.6l2.3-1.4.9-2.5 2.7.2L12 3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}