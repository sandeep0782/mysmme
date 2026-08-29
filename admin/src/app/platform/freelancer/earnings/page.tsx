"use client";

import React from "react";
import {
  ArrowDownToLine,
  ArrowRight,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  IndianRupee,
  ShoppingBag,
  Sparkles,
  TrendingUp,
  Wallet,
  Zap,
} from "lucide-react";

const payments = [
  {
    id: "PAY-1001",
    date: "Aug 26, 2026",
    campaign: "Royal Banarasi Collection",
    product: "Banarasi Silk Saree",
    saleAmount: 4999,
    royalty: 10,
    earning: 499.9,
    status: "Paid",
  },
  {
    id: "PAY-1002",
    date: "Aug 24, 2026",
    campaign: "Festive Saree Edit",
    product: "Kanjivaram Silk Saree",
    saleAmount: 6999,
    royalty: 10,
    earning: 699.9,
    status: "Pending",
  },
  {
    id: "PAY-1003",
    date: "Aug 22, 2026",
    campaign: "Wedding Collection",
    product: "Designer Organza Saree",
    saleAmount: 3999,
    royalty: 8,
    earning: 319.92,
    status: "Paid",
  },
];

const totalEarnings = payments.reduce(
  (sum, payment) => sum + payment.earning,
  0,
);

const pendingEarnings = payments
  .filter((payment) => payment.status === "Pending")
  .reduce((sum, payment) => sum + payment.earning, 0);

const paidEarnings = payments
  .filter((payment) => payment.status === "Paid")
  .reduce((sum, payment) => sum + payment.earning, 0);

const totalSales = payments.reduce(
  (sum, payment) => sum + payment.saleAmount,
  0,
);

const totalOrders = payments.length;

const averageRoyalty =
  payments.length > 0
    ? payments.reduce((sum, payment) => sum + payment.royalty, 0) /
      payments.length
    : 0;

const bestPayment =
  payments.length > 0
    ? payments.reduce((best, payment) =>
        payment.earning > best.earning ? payment : best,
      )
    : null;

const FreelancerEarnings = () => {
  return (
    <div className="min-h-full bg-[#f7f7fa]">
      <div className="mx-auto max-w-[1600px] p-5 sm:p-7 lg:p-8">
        {/* =====================================================
            HEADER
        ===================================================== */}

        <section className="mb-7">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-violet-700">
                <Sparkles size={12} />
                Creator Wallet
              </div>

              <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Earnings Overview
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Turn your content into earnings. Track your saree sales,
                royalties and payment activity in one place.
              </p>
            </div>

            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-violet-300 hover:text-violet-600"
            >
              <ArrowDownToLine size={16} />
              Download Statement
            </button>
          </div>
        </section>

        {/* =====================================================
            PREMIUM WALLET
        ===================================================== */}

        <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#171221] via-[#26163d] to-[#542063] p-6 text-white shadow-xl sm:p-8">
          {/* Decorative glow */}

          <div className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-violet-400/20 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-40 left-1/3 h-80 w-80 rounded-full bg-fuchsia-400/10 blur-3xl" />

          <div className="relative grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
            {/* LEFT */}

            <div>
              <div className="flex items-center gap-2 text-violet-200">
                <Wallet size={17} />

                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
                  Total Creator Earnings
                </span>
              </div>

              <div className="mt-4 flex items-end gap-2">
                <span className="text-4xl font-bold tracking-tight sm:text-5xl">
                  ₹
                  {totalEarnings.toLocaleString("en-IN", {
                    maximumFractionDigits: 0,
                  })}
                </span>
              </div>

              <p className="mt-2 max-w-lg text-sm text-violet-200/75">
                Royalty earned from customers purchasing sarees through your
                assigned campaigns.
              </p>

              {/* Mini balances */}

              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                <WalletMini
                  label="Paid"
                  value={`₹${paidEarnings.toLocaleString("en-IN", {
                    maximumFractionDigits: 0,
                  })}`}
                />

                <WalletMini
                  label="Pending"
                  value={`₹${pendingEarnings.toLocaleString("en-IN", {
                    maximumFractionDigits: 0,
                  })}`}
                />

                <WalletMini
                  label="Sales Generated"
                  value={`₹${totalSales.toLocaleString("en-IN")}`}
                />
              </div>
            </div>

            {/* RIGHT WALLET CARD */}

            <div className="relative">
              <div className="rounded-2xl border border-white/10 bg-white/[0.08] p-5 backdrop-blur-xl">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-violet-200">Average royalty</p>

                    <p className="mt-1 text-3xl font-bold">
                      {averageRoyalty.toFixed(1)}%
                    </p>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                    <CircleDollarSign size={22} className="text-emerald-300" />
                  </div>
                </div>

                <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-400"
                    style={{
                      width: `${Math.min(averageRoyalty * 10, 100)}%`,
                    }}
                  />
                </div>

                <div className="mt-5 flex items-center gap-2 text-xs text-violet-200/70">
                  <Zap size={13} className="text-amber-300" />

                  <span>
                    Keep creating — every eligible sale can increase your
                    royalty earnings.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            QUICK STATS
        ===================================================== */}

        <section className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <PremiumStat
            icon={<ShoppingBag size={19} />}
            label="Attributed Orders"
            value={String(totalOrders)}
            description="Customer orders"
            color="blue"
          />

          <PremiumStat
            icon={<TrendingUp size={19} />}
            label="Attributed Sales"
            value={`₹${totalSales.toLocaleString("en-IN")}`}
            description="Revenue generated"
            color="emerald"
          />

          <PremiumStat
            icon={<Clock3 size={19} />}
            label="Pending Royalty"
            value={`₹${pendingEarnings.toLocaleString("en-IN")}`}
            description="Awaiting payment"
            color="amber"
          />

          <PremiumStat
            icon={<CheckCircle2 size={19} />}
            label="Paid Royalty"
            value={`₹${paidEarnings.toLocaleString("en-IN")}`}
            description="Successfully paid"
            color="violet"
          />
        </section>

        {/* =====================================================
            PERFORMANCE
        ===================================================== */}

        <section className="mt-5 grid gap-5 xl:grid-cols-[1.45fr_1fr]">
          {/* =================================================
              EARNINGS ACTIVITY
          ================================================= */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                    <TrendingUp size={19} />
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Earnings Activity
                    </h2>

                    <p className="mt-1 text-xs text-slate-400">
                      Recent royalty performance
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-bold text-emerald-600">
                Updated recently
              </div>
            </div>

            {/* SUMMARY */}

            <div className="mt-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-medium text-slate-400">
                  Total royalty
                </p>

                <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
                  ₹
                  {totalEarnings.toLocaleString("en-IN", {
                    maximumFractionDigits: 0,
                  })}
                </p>
              </div>

              <div className="rounded-xl bg-emerald-50 px-4 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-emerald-600">
                  Best earning
                </p>

                <p className="mt-1 text-lg font-bold text-emerald-700">
                  ₹
                  {bestPayment
                    ? bestPayment.earning.toLocaleString("en-IN", {
                        maximumFractionDigits: 0,
                      })
                    : "0"}
                </p>
              </div>
            </div>

            {/* CHART */}

            <div className="mt-8">
              {payments.length > 0 ? (
                <>
                  <div className="flex h-56 items-end gap-4 sm:gap-7">
                    {payments.map((payment) => {
                      const maxEarning = Math.max(
                        ...payments.map((item) => item.earning),
                      );

                      const height =
                        maxEarning > 0
                          ? Math.max((payment.earning / maxEarning) * 100, 18)
                          : 18;

                      return (
                        <div
                          key={payment.id}
                          className="group flex h-full flex-1 flex-col items-center justify-end"
                        >
                          <div className="relative flex h-full w-full items-end justify-center">
                            {/* Tooltip */}

                            <div className="absolute -top-9 z-10 rounded-lg bg-slate-900 px-2.5 py-1.5 text-[10px] font-bold text-white opacity-0 shadow-lg transition group-hover:opacity-100">
                              ₹
                              {payment.earning.toLocaleString("en-IN", {
                                maximumFractionDigits: 0,
                              })}
                            </div>

                            {/* Bar */}

                            <div
                              className="w-full max-w-16 rounded-t-xl bg-gradient-to-t from-violet-600 via-violet-500 to-fuchsia-400 shadow-sm transition-all duration-300 group-hover:from-violet-500 group-hover:to-fuchsia-300"
                              style={{
                                height: `${height}%`,
                              }}
                            />
                          </div>

                          <p className="mt-3 text-[10px] font-medium text-slate-400">
                            {payment.date.split(" ")[1]?.replace(",", "")}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-5 border-t border-slate-100 pt-4">
                    <p className="text-xs text-slate-400">
                      Showing your latest attributed royalty transactions.
                    </p>
                  </div>
                </>
              ) : (
                <EmptyChart />
              )}
            </div>
          </div>

          {/* =================================================
              TOP CAMPAIGN
          ================================================= */}

          <div className="relative overflow-hidden rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 p-6">
            <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-violet-200/40 blur-3xl" />

            <div className="relative">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-violet-600">
                    Top Opportunity
                  </p>

                  <h2 className="mt-2 text-xl font-bold text-slate-900">
                    Your Best Earning
                  </h2>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-sm">
                  <Sparkles size={19} className="text-violet-600" />
                </div>
              </div>

              {bestPayment ? (
                <>
                  <div className="mt-7 rounded-2xl bg-white p-5 shadow-sm">
                    <p className="text-xs text-slate-400">Campaign</p>

                    <p className="mt-1 text-lg font-bold text-slate-900">
                      {bestPayment.campaign}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {bestPayment.product}
                    </p>

                    <div className="mt-6">
                      <p className="text-xs text-slate-400">Sale generated</p>

                      <p className="mt-1 text-3xl font-bold text-slate-900">
                        ₹{bestPayment.saleAmount.toLocaleString("en-IN")}
                      </p>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <div className="rounded-xl bg-violet-50 p-3">
                        <p className="text-[11px] text-violet-500">Royalty</p>

                        <p className="mt-1 text-lg font-bold text-violet-700">
                          {bestPayment.royalty}%
                        </p>
                      </div>

                      <div className="rounded-xl bg-emerald-50 p-3">
                        <p className="text-[11px] text-emerald-500">
                          You earned
                        </p>

                        <p className="mt-1 text-lg font-bold text-emerald-700">
                          ₹
                          {bestPayment.earning.toLocaleString("en-IN", {
                            maximumFractionDigits: 0,
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-violet-200 bg-white px-4 py-3 text-sm font-semibold text-violet-700 transition hover:bg-violet-50"
                  >
                    View Campaign
                    <ArrowRight size={15} />
                  </button>
                </>
              ) : (
                <div className="mt-6 rounded-2xl bg-white p-8 text-center shadow-sm">
                  <Sparkles size={25} className="mx-auto text-violet-300" />

                  <p className="mt-3 text-sm font-semibold text-slate-700">
                    Your top campaign will appear here
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* =====================================================
            PAYMENT HISTORY
        ===================================================== */}

        <section className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-6 sm:flex-row sm:items-center">
            <div>
              <div className="flex items-center gap-2">
                <Wallet size={18} className="text-violet-600" />

                <h2 className="text-lg font-bold text-slate-900">
                  Payment History
                </h2>
              </div>

              <p className="mt-1 text-sm text-slate-500">
                Your latest royalty earnings from attributed saree sales.
              </p>
            </div>

            <button
              type="button"
              className="inline-flex items-center gap-1 text-sm font-semibold text-violet-600 hover:text-violet-700"
            >
              View all
              <ArrowRight size={15} />
            </button>
          </div>

          {/* MOBILE */}

          <div className="divide-y divide-slate-100 md:hidden">
            {payments.slice(0, 10).map((payment) => (
              <div
                key={payment.id}
                className="p-5 transition hover:bg-slate-50"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-900">
                      {payment.campaign}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {payment.product}
                    </p>
                  </div>

                  <PaymentStatus status={payment.status} />
                </div>

                <div className="mt-5 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-slate-400">
                      Sale
                    </p>

                    <p className="mt-1 font-semibold text-slate-700">
                      ₹{payment.saleAmount.toLocaleString("en-IN")}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-wide text-slate-400">
                      Your earning
                    </p>

                    <p className="mt-1 text-lg font-bold text-emerald-600">
                      ₹
                      {payment.earning.toLocaleString("en-IN", {
                        maximumFractionDigits: 0,
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* DESKTOP */}

          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-left">
                  <TableHead>Date</TableHead>
                  <TableHead>Campaign</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Sale</TableHead>
                  <TableHead>Royalty</TableHead>
                  <TableHead>Your Earnings</TableHead>
                  <TableHead>Status</TableHead>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {payments.slice(0, 10).map((payment) => (
                  <tr
                    key={payment.id}
                    className="transition hover:bg-violet-50/30"
                  >
                    <td className="px-6 py-5 text-sm text-slate-500">
                      {payment.date}
                    </td>

                    <td className="px-6 py-5">
                      <p className="text-sm font-semibold text-slate-900">
                        {payment.campaign}
                      </p>

                      <p className="mt-1 text-[10px] font-medium text-slate-400">
                        {payment.id}
                      </p>
                    </td>

                    <td className="px-6 py-5 text-sm text-slate-600">
                      {payment.product}
                    </td>

                    <td className="px-6 py-5 text-sm font-semibold text-slate-900">
                      ₹{payment.saleAmount.toLocaleString("en-IN")}
                    </td>

                    <td className="px-6 py-5">
                      <span className="rounded-full bg-violet-50 px-2.5 py-1 text-xs font-bold text-violet-600">
                        {payment.royalty}%
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <span className="font-bold text-emerald-600">
                        ₹
                        {payment.earning.toLocaleString("en-IN", {
                          maximumFractionDigits: 0,
                        })}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <PaymentStatus status={payment.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* EMPTY */}

          {payments.length === 0 && (
            <div className="flex min-h-64 items-center justify-center">
              <div className="max-w-sm text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50">
                  <IndianRupee size={24} className="text-violet-500" />
                </div>

                <p className="mt-4 font-semibold text-slate-700">
                  Your first royalty is waiting
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-400">
                  Once customers purchase products through your assigned
                  campaigns, your royalty earnings will appear here.
                </p>
              </div>
            </div>
          )}
        </section>

        {/* =====================================================
            HOW IT WORKS
        ===================================================== */}

        <section className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <CircleDollarSign size={20} />
            </div>

            <div>
              <h2 className="font-bold text-slate-900">How you earn</h2>

              <p className="text-xs text-slate-400">
                Simple, transparent and based on actual saree sales.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <EarningStep
              number="01"
              title="Create content"
              description="Create reels and content for the campaigns assigned to you."
            />

            <EarningStep
              number="02"
              title="Customer purchases"
              description="Customers purchase the saree connected to your campaign."
            />

            <EarningStep
              number="03"
              title="You earn royalty"
              description="Your configured royalty percentage is calculated on eligible sales."
            />
          </div>
        </section>
      </div>
    </div>
  );
};

/* =============================================================
   WALLET MINI
============================================================= */

function WalletMini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.08] px-4 py-3 backdrop-blur">
      <p className="text-[10px] font-medium text-violet-200">{label}</p>

      <p className="mt-1 text-lg font-bold">{value}</p>
    </div>
  );
}

/* =============================================================
   PREMIUM STAT
============================================================= */

function PremiumStat({
  icon,
  label,
  value,
  description,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  description: string;
  color: "blue" | "emerald" | "amber" | "violet";
}) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    violet: "bg-violet-50 text-violet-600",
  };

  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400">{label}</p>

          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            {value}
          </p>

          <p className="mt-1 text-[11px] text-slate-400">{description}</p>
        </div>

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${colors[color]} transition group-hover:scale-105`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

/* =============================================================
   TABLE HEAD
============================================================= */

function TableHead({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
      {children}
    </th>
  );
}

/* =============================================================
   PAYMENT STATUS
============================================================= */

function PaymentStatus({ status }: { status: string }) {
  if (status === "Paid") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-600">
        <CheckCircle2 size={12} />
        Paid
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-600">
      <Clock3 size={12} />
      Pending
    </span>
  );
}

/* =============================================================
   EARNING STEP
============================================================= */

function EarningStep({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-5 transition hover:border-violet-100 hover:bg-violet-50/40">
      <span className="text-[10px] font-bold tracking-[0.18em] text-violet-500">
        {number}
      </span>

      <h3 className="mt-3 text-sm font-bold text-slate-900">{title}</h3>

      <p className="mt-2 text-xs leading-5 text-slate-500">{description}</p>
    </div>
  );
}

/* =============================================================
   EMPTY CHART
============================================================= */

function EmptyChart() {
  return (
    <div className="flex h-56 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50">
      <div className="text-center">
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-sm">
          <TrendingUp size={20} className="text-violet-400" />
        </div>

        <p className="mt-3 text-sm font-semibold text-slate-600">
          Your earnings activity will appear here
        </p>

        <p className="mt-1 text-xs text-slate-400">
          Generate your first attributed sale to start tracking performance.
        </p>
      </div>
    </div>
  );
}

export default FreelancerEarnings;
