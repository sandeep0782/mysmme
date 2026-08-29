import Link from "next/link";
import {
  ArrowRight,
  Package,
  ShoppingBag,
  BarChart3,
  Truck,
  Users,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Feature";
import WhyMysmme from "@/components/WhyMysmme";
import Cta from "@/components/Cta";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fafafa] text-gray-900">
      <Header />
      <Hero />
      <Features />
      <WhyMysmme />
      <Cta />
      <Footer />

    </main>
  );
}


/* ==========================================================================
   STAT
========================================================================== */

function Stat({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div>
      <p className="text-2xl font-bold text-gray-950 sm:text-3xl">
        {value}
      </p>

      <p className="mt-1 text-sm text-gray-500">
        {label}
      </p>
    </div>
  );
}


/* ==========================================================================
   DASHBOARD CARD
========================================================================== */

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
    <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3">

      <div className="flex items-center gap-2 text-gray-500">
        {icon}

        <span className="text-[10px]">
          {title}
        </span>
      </div>

      <p className="mt-2 text-lg font-bold text-white">
        {value}
      </p>

    </div>
  );
}


/* ==========================================================================
   FEATURE
========================================================================== */

function Feature({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group rounded-2xl border border-gray-200 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-red-100 hover:shadow-xl hover:shadow-red-600/5">

      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600 transition group-hover:bg-red-600 group-hover:text-white">
        {icon}
      </div>

      <h3 className="mt-5 text-lg font-bold text-gray-900">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-gray-500">
        {description}
      </p>

    </div>
  );
}


/* ==========================================================================
   BENEFIT
========================================================================== */

function Benefit({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4">

      <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
        <CheckCircle2 size={15} />
      </div>

      <div>

        <h3 className="font-bold text-gray-900">
          {title}
        </h3>

        <p className="mt-1 text-sm leading-6 text-gray-500">
          {description}
        </p>

      </div>

    </div>
  );
}


/* ==========================================================================
   DARK STAT
========================================================================== */

function DarkStat({
  title,
  value,
  change,
}: {
  title: string;
  value: string;
  change: string;
}) {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">

      <p className="text-xs text-gray-500">
        {title}
      </p>

      <div className="mt-2 flex items-end justify-between gap-2">

        <p className="text-xl font-bold text-white">
          {value}
        </p>

        <span className="text-[10px] font-semibold text-green-400">
          {change}
        </span>

      </div>

    </div>
  );
}
