import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Package,
  ShieldCheck,
  ShoppingBag,
  Users,
} from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* ============================================================
          BACKGROUND EFFECTS
      ============================================================ */}

      <div className="pointer-events-none absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-red-600/10 blur-[120px]" />

      <div className="pointer-events-none absolute -right-40 top-20 h-[500px] w-[500px] rounded-full bg-red-500/10 blur-[130px]" />

      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500/5 blur-[120px]" />

      {/* ============================================================
          MAIN HERO
      ============================================================ */}

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-28">

        {/* ==========================================================
            LEFT CONTENT
        ========================================================== */}

        <div>
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-red-100 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600">
            <span className="h-2 w-2 rounded-full bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.5)]" />

            Built for modern sellers
          </div>

          {/* Heading */}
          <h1 className="mt-7 max-w-2xl text-5xl font-extrabold leading-[1.05] tracking-tight text-gray-950 sm:text-6xl lg:text-7xl">
            Run your business.

            <span className="block text-red-600">
              All in one place.
            </span>
          </h1>

          {/* Description */}
          <p className="mt-7 max-w-xl text-base leading-7 text-gray-500 sm:text-lg">
            MYSMME gives sellers one powerful platform to manage products,
            orders, inventory, customers and business performance with ease.
          </p>

          {/* ========================================================
              CTA BUTTONS
          ======================================================== */}

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/auth/login"
              className="group flex h-12 items-center justify-center gap-2 rounded-xl bg-red-600 px-7 text-sm font-bold text-white shadow-xl shadow-red-600/20 transition-all hover:bg-red-700 hover:shadow-2xl hover:shadow-red-600/25 active:scale-[0.98]"
            >
              Login to Portal

              <ArrowRight
                size={17}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>

            <Link
              href="/auth/register"
              className="flex h-12 items-center justify-center rounded-xl border border-gray-200 bg-white px-7 text-sm font-bold text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm active:scale-[0.98]"
            >
              Create an Account
            </Link>
          </div>

          {/* ========================================================
              TRUST POINTS
          ======================================================== */}

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <CheckCircle2
                size={17}
                className="text-red-600"
              />
              Easy to use
            </div>

            <div className="flex items-center gap-2">
              <CheckCircle2
                size={17}
                className="text-red-600"
              />
              Secure
            </div>

            <div className="flex items-center gap-2">
              <CheckCircle2
                size={17}
                className="text-red-600"
              />
              Built for sellers
            </div>
          </div>

          {/* ========================================================
              STATS
          ======================================================== */}

          <div className="mt-12 flex flex-wrap gap-x-10 gap-y-6 border-t border-gray-100 pt-8">
            <Stat
              value="10K+"
              label="Products"
            />

            <Stat
              value="5K+"
              label="Orders"
            />

            <Stat
              value="99%"
              label="Reliability"
            />
          </div>
        </div>

        {/* ==========================================================
            DASHBOARD PREVIEW
        ========================================================== */}

        <div className="relative lg:pl-4">
          {/* Outer glow */}
          <div className="absolute -inset-6 rounded-[40px] bg-red-600/10 blur-3xl" />

          <div className="relative overflow-hidden rounded-[28px] border border-gray-800 bg-[#111111] p-4 shadow-2xl shadow-red-900/10 sm:p-6">

            {/* ======================================================
                BROWSER HEADER
            ====================================================== */}

            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
              </div>

              <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] text-gray-500">
                seller.mysmme.com
              </div>
            </div>

            {/* ======================================================
                DASHBOARD
            ====================================================== */}

            <div className="rounded-2xl bg-[#181818] p-5 sm:p-6">

              {/* Sales Header */}
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500">
                    Total Sales
                  </p>

                  <h2 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    ₹2,45,000
                  </h2>

                  <div className="mt-2 flex items-center gap-2 text-xs">
                    <span className="font-semibold text-green-400">
                      +24.8%
                    </span>

                    <span className="text-gray-600">
                      vs last month
                    </span>
                  </div>
                </div>

                <div className="rounded-xl bg-green-500/10 px-3 py-2 text-xs font-semibold text-green-400">
                  +24%
                </div>
              </div>

              {/* ====================================================
                  CHART
              ==================================================== */}

              <div className="mt-8">
                <div className="mb-3 flex items-center justify-between text-[10px] text-gray-600">
                  <span>Sales overview</span>

                  <span>Last 6 months</span>
                </div>

                <div className="flex h-40 items-end gap-2 sm:gap-3">
                  {[35, 55, 45, 72, 60, 88, 75, 100].map(
                    (height, index) => (
                      <div
                        key={index}
                        className="group relative flex h-full flex-1 items-end"
                      >
                        <div
                          style={{
                            height: `${ height }% `,
                          }}
                          className="w-full rounded-t-lg bg-gradient-to-t from-red-600 to-red-400 transition-all duration-300 group-hover:from-red-500 group-hover:to-red-300"
                        />
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* ====================================================
                  MINI CARDS
              ==================================================== */}

              <div className="mt-6 grid grid-cols-3 gap-3">
                <DashboardCard
                  icon={<ShoppingBag size={15} />}
                  title="Orders"
                  value="320"
                />

                <DashboardCard
                  icon={<Package size={15} />}
                  title="Stock"
                  value="850"
                />

                <DashboardCard
                  icon={<Users size={15} />}
                  title="Customers"
                  value="540"
                />
              </div>
            </div>

            {/* ======================================================
                STATUS BAR
            ====================================================== */}

            <div className="mt-4 flex items-center justify-between px-1">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />

                All systems operational
              </div>

              <ShieldCheck
                size={16}
                className="text-gray-600"
              />
            </div>
          </div>

          {/* Floating notification */}
          <div className="absolute -bottom-5 -left-3 hidden rounded-2xl border border-gray-200 bg-white p-4 shadow-xl sm:block lg:-left-8">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-50 text-green-600">
                <CheckCircle2 size={18} />
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-900">
                  New order received
                </p>

                <p className="mt-0.5 text-[11px] text-gray-400">
                  Order #MYS-2481
                </p>
              </div>
            </div>
          </div>

          {/* Floating sales badge */}
          <div className="absolute -right-3 -top-5 hidden rounded-2xl border border-red-100 bg-white p-4 shadow-xl sm:block lg:-right-8">
            <p className="text-[11px] font-medium text-gray-400">
              Today&apos;s sales
            </p>

            <p className="mt-1 text-lg font-bold text-gray-900">
              ₹18,420
            </p>

            <p className="mt-0.5 text-[11px] font-semibold text-green-600">
              +18.4%
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   STAT COMPONENT
================================================================ */

function Stat({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div>
      <p className="text-2xl font-extrabold tracking-tight text-gray-950 sm:text-3xl">
        {value}
      </p>

      <p className="mt-1 text-xs font-medium text-gray-500 sm:text-sm">
        {label}
      </p>
    </div>
  );
}

/* ================================================================
   DASHBOARD CARD
================================================================ */

function DashboardCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.04] p-3 transition hover:border-red-500/20 hover:bg-white/[0.06]">
      <div className="flex items-center gap-2 text-gray-500">
        {icon}

        <span className="text-[10px] font-medium sm:text-xs">
          {title}
        </span>
      </div>

      <p className="mt-2 text-lg font-bold text-white sm:text-xl">
        {value}
      </p>
    </div>
  );
}