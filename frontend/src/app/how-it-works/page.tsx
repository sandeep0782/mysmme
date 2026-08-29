"use client";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Crown,
  IndianRupee,
  Package,
  Search,
  ShoppingBag,
  ShoppingCart,
  Store,
  Truck,
  UserPlus,
  Users,
  BarChart3,
  ShieldCheck,
  Sparkles,
  Zap,
  CircleCheck,
} from "lucide-react";

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#fffdf9] text-[#241b18]">
      {/* ========================================================= HERO ========================================================= */}{" "}
      <section className="relative overflow-hidden border-b border-[#eadfd6] bg-[#f8eee7]">
        {" "}
        {/* Background glow */}{" "}
        <div className="absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-[#a51c30]/10 blur-[120px]" />{" "}
        <div className="absolute -right-40 top-10 h-[520px] w-[520px] rounded-full bg-[#c99a45]/15 blur-[130px]" />{" "}
        {/* Decorative lotus */}{" "}
        <div className="absolute left-0 top-24 hidden text-[#a51c30]/5 lg:block">
          {" "}
          <LotusDecoration size={190} />{" "}
        </div>{" "}
        <div className="absolute bottom-0 right-0 hidden rotate-12 text-[#c99a45]/10 lg:block">
          {" "}
          <LotusDecoration size={190} />{" "}
        </div>{" "}
        <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
          {" "}
          <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_.95fr]">
            {" "}
            {/* Hero copy */}{" "}
            <div>
              {" "}
              <div className="inline-flex items-center gap-2 rounded-full border border-[#c99a45]/30 bg-white/75 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.25em] text-[#a51c30] shadow-sm backdrop-blur">
                {" "}
                <Sparkles className="h-4 w-4 text-[#b27a25]" /> How MYSMME
                Works{" "}
              </div>{" "}
              <h1 className="mt-7 max-w-3xl text-4xl font-extrabold leading-[1.04] tracking-tight text-[#241b18] sm:text-5xl lg:text-[4.5rem]">
                {" "}
                From your{" "}
                <span className="block bg-gradient-to-r from-[#a51c30] via-[#b72c40] to-[#8d1729] bg-clip-text text-transparent">
                  {" "}
                  products to customers.{" "}
                </span>{" "}
              </h1>{" "}
              <p className="mt-7 max-w-2xl text-base leading-8 text-[#6f625c] sm:text-lg">
                {" "}
                MYSMME brings sellers and shoppers together in one simple
                marketplace. List your products, reach customers, manage orders
                and build your business—all from one platform.{" "}
              </p>{" "}
              {/* CTA */}{" "}
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                {" "}
                <Link
                  href="/register"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#a51c30] px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-[#a51c30]/20 transition hover:-translate-y-0.5 hover:bg-[#8e1729]"
                >
                  {" "}
                  Start Selling{" "}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />{" "}
                </Link>{" "}
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#d9c9c0] bg-white/80 px-6 py-3.5 text-sm font-bold text-[#332723] transition hover:border-[#a51c30]/30 hover:bg-white hover:text-[#a51c30]"
                >
                  {" "}
                  Explore Products <ShoppingBag className="h-4 w-4" />{" "}
                </Link>{" "}
              </div>{" "}
              {/* Trust points */}{" "}
              <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-xs font-semibold text-[#756860]">
                {" "}
                <TrustPoint text="Simple onboarding" />{" "}
                <TrustPoint text="Marketplace visibility" />{" "}
                <TrustPoint text="Easy order management" />{" "}
              </div>{" "}
            </div>{" "}
            {/* Hero visual */}{" "}
            <div className="relative mx-auto w-full max-w-[530px]">
              {" "}
              {/* Main card */}{" "}
              <div className="relative rounded-[2.5rem] border border-[#eadfd6] bg-white p-5 shadow-2xl shadow-[#6d4535]/10 sm:p-6">
                {" "}
                {/* Top bar */}{" "}
                <div className="flex items-center justify-between border-b border-[#eee4de] pb-5">
                  {" "}
                  <div className="flex items-center gap-3">
                    {" "}
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff2ed] text-[#a51c30]">
                      {" "}
                      <Store className="h-5 w-5" />{" "}
                    </div>{" "}
                    <div>
                      {" "}
                      <p className="text-xs font-bold text-[#241b18]">
                        {" "}
                        Your MYSMME Store{" "}
                      </p>{" "}
                      <p className="text-[10px] text-[#968982]">
                        {" "}
                        Everything in one place{" "}
                      </p>{" "}
                    </div>{" "}
                  </div>{" "}
                  <div className="rounded-full bg-[#f1f8f2] px-3 py-1 text-[9px] font-bold text-[#397348]">
                    {" "}
                    ACTIVE{" "}
                  </div>{" "}
                </div>{" "}
                {/* Flow */}{" "}
                <div className="relative py-8">
                  {" "}
                  <div className="absolute left-[31px] top-12 bottom-12 w-px bg-gradient-to-b from-[#a51c30]/20 via-[#c99a45]/50 to-[#a51c30]/20" />{" "}
                  <MiniFlow
                    number="01"
                    icon={<UserPlus className="h-5 w-5" />}
                    title="Create your account"
                    text="Set up your seller profile"
                  />{" "}
                  <MiniFlow
                    number="02"
                    icon={<Package className="h-5 w-5" />}
                    title="List your products"
                    text="Add products, images & pricing"
                  />{" "}
                  <MiniFlow
                    number="03"
                    icon={<ShoppingCart className="h-5 w-5" />}
                    title="Receive orders"
                    text="Customers discover & purchase"
                  />{" "}
                  <MiniFlow
                    number="04"
                    icon={<Truck className="h-5 w-5" />}
                    title="Ship & grow"
                    text="Fulfil orders and build your business"
                  />{" "}
                </div>{" "}
                {/* Bottom stats */}{" "}
                <div className="grid grid-cols-3 gap-3 border-t border-[#eee4de] pt-5">
                  {" "}
                  <HeroStat value="01" label="Platform" />{" "}
                  <HeroStat value="04" label="Simple steps" />{" "}
                  <HeroStat value="∞" label="Possibilities" />{" "}
                </div>{" "}
              </div>{" "}
              {/* Floating card */}{" "}
              <div className="absolute -bottom-5 -left-5 hidden w-52 rounded-2xl border border-[#eadfd6] bg-white p-4 shadow-xl sm:block">
                {" "}
                <div className="flex items-center gap-3">
                  {" "}
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#a51c30] text-white">
                    {" "}
                    <IndianRupee className="h-5 w-5" />{" "}
                  </div>{" "}
                  <div>
                    {" "}
                    <p className="text-[9px] uppercase tracking-wider text-[#968982]">
                      {" "}
                      Business{" "}
                    </p>{" "}
                    <p className="text-sm font-extrabold text-[#241b18]">
                      {" "}
                      Keep growing{" "}
                    </p>{" "}
                  </div>{" "}
                </div>{" "}
              </div>{" "}
              <div className="absolute -right-4 -top-5 hidden rounded-2xl border border-[#eadfd6] bg-white px-4 py-3 shadow-xl sm:block">
                {" "}
                <div className="flex items-center gap-2">
                  {" "}
                  <CircleCheck className="h-4 w-4 text-[#397348]" />{" "}
                  <span className="text-xs font-bold text-[#332723]">
                    {" "}
                    Order received{" "}
                  </span>{" "}
                </div>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </section>{" "}
      {/* ========================================================= SIMPLE STEPS ========================================================= */}{" "}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
        {" "}
        <div className="mx-auto max-w-2xl text-center">
          {" "}
          <div className="inline-flex items-center gap-2 rounded-full bg-[#fff2ed] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.24em] text-[#a51c30]">
            {" "}
            <Zap className="h-4 w-4" /> Simple by design{" "}
          </div>{" "}
          <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-[#241b18] sm:text-4xl lg:text-5xl">
            {" "}
            Four simple steps to get started{" "}
          </h2>{" "}
          <p className="mt-5 text-sm leading-7 text-[#756860] sm:text-base">
            {" "}
            Whether you are an established business or starting something new,
            MYSMME keeps the process straightforward.{" "}
          </p>{" "}
        </div>{" "}
        <div className="relative mt-16">
          {" "}
          {/* Connecting line */}{" "}
          <div className="absolute left-[12.5%] right-[12.5%] top-[55px] hidden h-px bg-gradient-to-r from-[#a51c30]/10 via-[#c99a45]/50 to-[#a51c30]/10 lg:block" />{" "}
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {" "}
            <StepCard
              number="01"
              icon={<UserPlus className="h-6 w-6" />}
              title="Create Your Account"
              text="Register on MYSMME and create your seller profile with the essential business information."
              points={[
                "Quick registration",
                "Create your profile",
                "Set up your store",
              ]}
            />{" "}
            <StepCard
              number="02"
              icon={<Package className="h-6 w-6" />}
              title="Add Your Products"
              text="Showcase your products with images, descriptions, pricing and the information customers need."
              points={[
                "Add product details",
                "Upload product images",
                "Manage pricing",
              ]}
            />{" "}
            <StepCard
              number="03"
              icon={<ShoppingCart className="h-6 w-6" />}
              title="Get Discovered"
              text="Your products become available to customers looking for fashion and products they love."
              points={[
                "Customer discovery",
                "Receive orders",
                "Manage your catalogue",
              ]}
            />{" "}
            <StepCard
              number="04"
              icon={<BarChart3 className="h-6 w-6" />}
              title="Sell & Grow"
              text="Manage your orders, monitor your business and continue building your presence on MYSMME."
              points={[
                "Track your orders",
                "Monitor performance",
                "Grow your business",
              ]}
            />{" "}
          </div>{" "}
        </div>{" "}
      </section>{" "}
      {/* ========================================================= ORDER JOURNEY ========================================================= */}{" "}
      <section className="relative overflow-hidden border-y border-[#eadfd6] bg-[#f8eee7]">
        {" "}
        <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-[#a51c30]/10 blur-[100px]" />{" "}
        <div className="absolute -right-32 bottom-0 h-72 w-72 rounded-full bg-[#c99a45]/10 blur-[100px]" />{" "}
        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          {" "}
          <div className="mx-auto max-w-2xl text-center">
            {" "}
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#a51c30]">
              {" "}
              The order journey{" "}
            </p>{" "}
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#241b18] sm:text-4xl">
              {" "}
              What happens after a customer orders?{" "}
            </h2>{" "}
            <p className="mt-4 text-sm leading-7 text-[#756860] sm:text-base">
              {" "}
              A clear journey from discovery to delivery.{" "}
            </p>{" "}
          </div>{" "}
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-6">
            {" "}
            <JourneyCard
              number="01"
              icon={<ShoppingCart className="h-5 w-5" />}
              title="Customer orders"
            />{" "}
            <JourneyCard
              number="02"
              icon={<Store className="h-5 w-5" />}
              title="Seller receives order"
            />{" "}
            <JourneyCard
              number="03"
              icon={<Package className="h-5 w-5" />}
              title="Product is packed"
            />{" "}
            <JourneyCard
              number="04"
              icon={<Truck className="h-5 w-5" />}
              title="Shipment begins"
            />{" "}
            <JourneyCard
              number="05"
              icon={<CheckCircle2 className="h-5 w-5" />}
              title="Customer receives"
            />{" "}
            <JourneyCard
              number="06"
              icon={<IndianRupee className="h-5 w-5" />}
              title="Business grows"
            />{" "}
          </div>{" "}
        </div>{" "}
      </section>{" "}
      {/* ========================================================= BUYER / SELLER ========================================================= */}{" "}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
        {" "}
        <div className="mx-auto max-w-2xl text-center">
          {" "}
          <div className="inline-flex items-center gap-2 rounded-full bg-[#fff2ed] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.24em] text-[#a51c30]">
            {" "}
            <Users className="h-4 w-4" /> One marketplace{" "}
          </div>{" "}
          <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-[#241b18] sm:text-4xl">
            {" "}
            Built for both sides of the marketplace{" "}
          </h2>{" "}
          <p className="mt-4 text-sm leading-7 text-[#756860] sm:text-base">
            {" "}
            MYSMME connects customers looking for products with businesses ready
            to sell them.{" "}
          </p>{" "}
        </div>{" "}
        <div className="mt-14 grid gap-7 lg:grid-cols-2">
          {" "}
          {/* Buyer */}{" "}
          <AudienceCard
            type="For Buyers"
            title="Discover products you will love."
            description="Browse products, discover new sellers and find fashion that fits your style."
            icon={<ShoppingBag className="h-7 w-7" />}
            points={[
              "Explore a growing product catalogue",
              "Discover different sellers and brands",
              "Find products by category",
              "Place orders easily",
              "Track your purchases",
            ]}
            buttonText="Start Shopping"
            href="/products"
          />{" "}
          {/* Seller */}{" "}
          <AudienceCard
            type="For Sellers"
            title="Turn your products into a growing business."
            description="Get your products in front of customers while managing your catalogue and orders from one place."
            icon={<Store className="h-7 w-7" />}
            points={[
              "Create your seller profile",
              "List and manage products",
              "Reach marketplace customers",
              "Manage incoming orders",
              "Build your brand presence",
            ]}
            buttonText="Start Selling"
            href="/register"
            dark
          />{" "}
        </div>{" "}
      </section>{" "}
      {/* ========================================================= SELLER BENEFITS ========================================================= */}{" "}
      <section className="border-y border-[#eadfd6] bg-white">
        {" "}
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          {" "}
          <div className="grid gap-14 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
            {" "}
            <div>
              {" "}
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#a51c30]">
                {" "}
                Why MYSMME{" "}
              </p>{" "}
              <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-[#241b18] sm:text-4xl">
                {" "}
                Everything you need to move your business forward.{" "}
              </h2>{" "}
              <p className="mt-5 text-sm leading-7 text-[#756860] sm:text-base">
                {" "}
                We are building MYSMME to make marketplace selling easier, more
                accessible and more useful for growing businesses.{" "}
              </p>{" "}
              <Link
                href="/about-us"
                className="group mt-7 inline-flex items-center gap-2 text-sm font-bold text-[#a51c30]"
              >
                {" "}
                Learn more about MYSMME{" "}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />{" "}
              </Link>{" "}
            </div>{" "}
            <div className="grid gap-4 sm:grid-cols-2">
              {" "}
              <BenefitCard
                icon={<Users className="h-5 w-5" />}
                title="Reach Customers"
                text="Put your products in front of shoppers actively discovering new products."
              />{" "}
              <BenefitCard
                icon={<Package className="h-5 w-5" />}
                title="Manage Products"
                text="Keep your product catalogue organised and easier to manage."
              />{" "}
              <BenefitCard
                icon={<ClipboardList className="h-5 w-5" />}
                title="Manage Orders"
                text="Stay on top of incoming orders and fulfilment activities."
              />{" "}
              <BenefitCard
                icon={<BarChart3 className="h-5 w-5" />}
                title="Track Growth"
                text="Understand your business activity and identify opportunities to grow."
              />{" "}
              <BenefitCard
                icon={<Crown className="h-5 w-5" />}
                title="Build Your Brand"
                text="Create a stronger marketplace presence for your products and business."
              />{" "}
              <BenefitCard
                icon={<ShieldCheck className="h-5 w-5" />}
                title="Built for Trust"
                text="A marketplace experience designed around reliable interactions."
              />{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </section>{" "}
      {/* ========================================================= FAQ STYLE MINI SECTION ========================================================= */}{" "}
      <section className="mx-auto max-w-5xl px-6 py-20 lg:px-8 lg:py-24">
        {" "}
        <div className="text-center">
          {" "}
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#a51c30]">
            {" "}
            Getting started{" "}
          </p>{" "}
          <h2 className="mt-4 text-3xl font-extrabold text-[#241b18] sm:text-4xl">
            {" "}
            MYSMME in a nutshell{" "}
          </h2>{" "}
        </div>{" "}
        <div className="mt-12 divide-y divide-[#eadfd6] overflow-hidden rounded-[2rem] border border-[#eadfd6] bg-white shadow-sm">
          {" "}
          <QuickAnswer
            question="Do I need to be an established business?"
            answer="No. MYSMME is designed to help businesses and sellers build their presence and showcase products on a marketplace."
          />{" "}
          <QuickAnswer
            question="What can sellers do on MYSMME?"
            answer="Sellers can create their profile, add products, manage catalogue information, receive orders and manage their marketplace activity."
          />{" "}
          <QuickAnswer
            question="How do customers find products?"
            answer="Customers can browse the MYSMME catalogue, explore categories and discover products from participating sellers."
          />{" "}
          <QuickAnswer
            question="What is the goal of MYSMME?"
            answer="To create a marketplace that makes it easier for businesses to reach customers and for shoppers to discover products from sellers."
          />{" "}
        </div>{" "}
      </section>{" "}
      {/* ========================================================= FINAL CTA ========================================================= */}{" "}
      <section className="relative overflow-hidden bg-[#241b18]">
        {" "}
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#a51c30]/20 blur-[100px]" />{" "}
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-[#c99a45]/10 blur-[100px]" />{" "}
        <div className="relative mx-auto max-w-4xl px-6 py-20 text-center lg:px-8 lg:py-24">
          {" "}
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#a51c30] text-white shadow-xl shadow-[#a51c30]/20">
            {" "}
            <Sparkles className="h-6 w-6" />{" "}
          </div>{" "}
          <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            {" "}
            Your products deserve{" "}
            <span className="block text-[#e0b96b]">
              {" "}
              a bigger audience.{" "}
            </span>{" "}
          </h2>{" "}
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/55 sm:text-base">
            {" "}
            Start your MYSMME journey today and take the next step toward
            building your online marketplace presence.{" "}
          </p>{" "}
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            {" "}
            <Link
              href="/register"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#a51c30] px-7 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#bc2940]"
            >
              {" "}
              Start Selling{" "}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />{" "}
            </Link>{" "}
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-7 py-3.5 text-sm font-bold text-white transition hover:bg-white/10"
            >
              {" "}
              Explore Products <ShoppingBag className="h-4 w-4" />{" "}
            </Link>{" "}
          </div>{" "}
        </div>{" "}
      </section>{" "}
    </main>
  );
}
/* ========================================================= STEP CARD ========================================================= */ function StepCard({
  number,
  icon,
  title,
  text,
  points,
}: {
  number: string;
  icon: React.ReactNode;
  title: string;
  text: string;
  points: string[];
}) {
  return (
    <div className="group relative rounded-[2rem] border border-[#eadfd6] bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#6d4535]/8">
      {" "}
      <div className="relative z-10 mb-6 flex items-center justify-between">
        {" "}
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff2ed] text-[#a51c30] transition group-hover:bg-[#a51c30] group-hover:text-white">
          {" "}
          {icon}{" "}
        </div>{" "}
        <span className="text-4xl font-black text-[#eee3dd]">
          {" "}
          {number}{" "}
        </span>{" "}
      </div>{" "}
      <h3 className="text-lg font-extrabold text-[#241b18]"> {title} </h3>{" "}
      <p className="mt-3 text-sm leading-6 text-[#756860]"> {text} </p>{" "}
      <div className="mt-6 space-y-2.5 border-t border-[#eee4de] pt-5">
        {" "}
        {points.map((point) => (
          <div
            key={point}
            className="flex items-center gap-2 text-xs font-medium text-[#6f625c]"
          >
            {" "}
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[#a51c30]" />{" "}
            {point}{" "}
          </div>
        ))}{" "}
      </div>{" "}
    </div>
  );
}
/* ========================================================= JOURNEY CARD ========================================================= */ function JourneyCard({
  number,
  icon,
  title,
}: {
  number: string;
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="group relative rounded-2xl border border-[#eadfd6] bg-white p-5 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      {" "}
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#fff2ed] text-[#a51c30] transition group-hover:bg-[#a51c30] group-hover:text-white">
        {" "}
        {icon}{" "}
      </div>{" "}
      <p className="mt-4 text-[9px] font-bold uppercase tracking-[0.2em] text-[#b27a25]">
        {" "}
        Step {number}{" "}
      </p>{" "}
      <p className="mt-2 text-sm font-bold leading-5 text-[#332723]">
        {" "}
        {title}{" "}
      </p>{" "}
    </div>
  );
}
/* ========================================================= AUDIENCE CARD ========================================================= */ function AudienceCard({
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
      className={`relative overflow-hidden rounded-[2rem] border p-8 sm:p-10 ${dark ? "border-[#241b18] bg-[#241b18] text-white" : "border-[#eadfd6] bg-[#fbf4ef]"}`}
    >
      {" "}
      <div
        className={`absolute -right-20 -top-20 h-52 w-52 rounded-full blur-3xl ${dark ? "bg-[#a51c30]/20" : "bg-[#c99a45]/10"}`}
      />{" "}
      <div className="relative">
        {" "}
        <div className="flex items-start justify-between gap-6">
          {" "}
          <div
            className={`flex h-14 w-14 items-center justify-center rounded-2xl ${dark ? "bg-[#a51c30] text-white" : "bg-white text-[#a51c30]"}`}
          >
            {" "}
            {icon}{" "}
          </div>{" "}
          <span
            className={`rounded-full px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.18em] ${dark ? "bg-white/10 text-[#e0b96b]" : "bg-white text-[#a51c30]"}`}
          >
            {" "}
            {type}{" "}
          </span>{" "}
        </div>{" "}
        <h3
          className={`mt-7 text-2xl font-extrabold leading-tight ${dark ? "text-white" : "text-[#241b18]"}`}
        >
          {" "}
          {title}{" "}
        </h3>{" "}
        <p
          className={`mt-4 text-sm leading-7 ${dark ? "text-white/55" : "text-[#6f625c]"}`}
        >
          {" "}
          {description}{" "}
        </p>{" "}
        <div className="mt-7 space-y-3">
          {" "}
          {points.map((point) => (
            <div
              key={point}
              className={`flex items-center gap-3 text-sm ${dark ? "text-white/75" : "text-[#5f534d]"}`}
            >
              {" "}
              <CheckCircle2
                className={`h-4 w-4 shrink-0 ${dark ? "text-[#d5aa58]" : "text-[#a51c30]"}`}
              />{" "}
              {point}{" "}
            </div>
          ))}{" "}
        </div>{" "}
        <Link
          href={href}
          className={`group mt-8 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition ${dark ? "bg-white text-[#241b18] hover:bg-[#f8eee7]" : "bg-[#a51c30] text-white hover:bg-[#8e1729]"}`}
        >
          {" "}
          {buttonText}{" "}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />{" "}
        </Link>{" "}
      </div>{" "}
    </div>
  );
}
/* ========================================================= BENEFIT CARD ========================================================= */ function BenefitCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="group rounded-2xl border border-[#eadfd6] bg-[#fffdf9] p-6 transition hover:-translate-y-0.5 hover:bg-[#fbf4ef]">
      {" "}
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff2ed] text-[#a51c30] transition group-hover:bg-[#a51c30] group-hover:text-white">
        {" "}
        {icon}{" "}
      </div>{" "}
      <h3 className="mt-5 text-sm font-extrabold text-[#241b18]"> {title} </h3>{" "}
      <p className="mt-2 text-xs leading-6 text-[#756860]"> {text} </p>{" "}
    </div>
  );
}
/* ========================================================= QUICK ANSWER ========================================================= */ function QuickAnswer({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  return (
    <div className="flex gap-5 p-6 sm:p-7">
      {" "}
      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#fff2ed] text-[#a51c30]">
        {" "}
        <CheckCircle2 className="h-4 w-4" />{" "}
      </div>{" "}
      <div>
        {" "}
        <h3 className="text-sm font-extrabold text-[#241b18] sm:text-base">
          {" "}
          {question}{" "}
        </h3>{" "}
        <p className="mt-2 text-sm leading-6 text-[#756860]"> {answer} </p>{" "}
      </div>{" "}
    </div>
  );
}
/* ========================================================= MINI FLOW ========================================================= */ function MiniFlow({
  number,
  icon,
  title,
  text,
}: {
  number: string;
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="relative z-10 flex items-center gap-4 py-3">
      {" "}
      <div className="flex h-[62px] w-[62px] shrink-0 items-center justify-center rounded-2xl border border-[#eadfd6] bg-white text-[#a51c30] shadow-sm">
        {" "}
        {icon}{" "}
      </div>{" "}
      <div>
        {" "}
        <div className="flex items-center gap-2">
          {" "}
          <span className="text-[9px] font-bold tracking-[0.2em] text-[#b27a25]">
            {" "}
            {number}{" "}
          </span>{" "}
          <h3 className="text-sm font-extrabold text-[#241b18]">
            {" "}
            {title}{" "}
          </h3>{" "}
        </div>{" "}
        <p className="mt-1 text-[11px] text-[#8b7d76]"> {text} </p>{" "}
      </div>{" "}
    </div>
  );
}
/* ========================================================= HERO STAT ========================================================= */ function HeroStat({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="text-center">
      {" "}
      <p className="text-lg font-black text-[#a51c30]">{value}</p>{" "}
      <p className="mt-1 text-[9px] font-medium uppercase tracking-wider text-[#9a8c84]">
        {" "}
        {label}{" "}
      </p>{" "}
    </div>
  );
}
/* ========================================================= TRUST POINT ========================================================= */ function TrustPoint({
  text,
}: {
  text: string;
}) {
  return (
    <div className="flex items-center gap-2">
      {" "}
      <CheckCircle2 className="h-4 w-4 text-[#a51c30]" /> {text}{" "}
    </div>
  );
}
/* ========================================================= LOTUS ========================================================= */ function LotusDecoration({
  size = 130,
}: {
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {" "}
      <path
        d="M60 91C60 91 34 80 30 55C30 55 47 58 60 74C73 58 90 55 90 55C86 80 60 91 60 91Z"
        stroke="currentColor"
        strokeWidth="2"
      />{" "}
      <path
        d="M60 74C60 74 45 58 48 38C48 38 59 43 60 61C61 43 72 38 72 38C75 58 60 74 60 74Z"
        stroke="currentColor"
        strokeWidth="2"
      />{" "}
      <path
        d="M30 55C38 51 48 52 60 61"
        stroke="currentColor"
        strokeWidth="2"
      />{" "}
      <path
        d="M90 55C82 51 72 52 60 61"
        stroke="currentColor"
        strokeWidth="2"
      />{" "}
    </svg>
  );
}
