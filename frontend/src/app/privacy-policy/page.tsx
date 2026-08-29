import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  Lock,
  ShieldCheck,
  Cookie,
  Database,
  Eye,
  UserCheck,
  RefreshCw,
  Mail,
  CheckCircle2,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
const sections = [
  { id: "information", number: "01", title: "Information We Collect" },
  { id: "usage", number: "02", title: "How We Use Information" },
  { id: "sharing", number: "03", title: "Information Sharing" },
  { id: "security", number: "04", title: "Data Security" },
  { id: "cookies", number: "05", title: "Cookies" },
  { id: "retention", number: "06", title: "Data Retention" },
  { id: "rights", number: "07", title: "Your Rights" },
  { id: "changes", number: "08", title: "Changes to This Policy" },
  { id: "contact", number: "09", title: "Contact Us" },
];
export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#fffdf9] text-[#241b18]">
      {/* ========================================================= HERO ========================================================= */}{" "}
      <section className="relative overflow-hidden border-b border-[#eadfd6] bg-[#f8eee7]">
        {" "}
        {/* Soft decorative glow */}{" "}
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#a51c30]/10 blur-[120px]" />{" "}
        <div className="absolute -right-40 top-10 h-[500px] w-[500px] rounded-full bg-[#c99a45]/15 blur-[130px]" />{" "}
        {/* Decorative lotus */}{" "}
        <div className="absolute left-8 top-20 hidden text-[#a51c30]/5 lg:block">
          {" "}
          <LotusDecoration />{" "}
        </div>{" "}
        <div className="absolute bottom-0 right-10 hidden rotate-12 text-[#c99a45]/10 lg:block">
          {" "}
          <LotusDecoration />{" "}
        </div>{" "}
        <div className="relative mx-auto max-w-7xl px-6 py-14 lg:px-8 lg:py-20">
          {" "}
          {/* Back */}{" "}
          <Link
            href="/"
            className="group mb-10 inline-flex items-center gap-2 rounded-full border border-[#dfcfc5] bg-white/70 px-4 py-2 text-sm font-medium text-[#756860] backdrop-blur transition hover:border-[#a51c30]/30 hover:bg-white hover:text-[#a51c30]"
          >
            {" "}
            <ArrowLeft
              size={15}
              className="transition-transform group-hover:-translate-x-0.5"
            />{" "}
            Back to home{" "}
          </Link>{" "}
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_280px]">
            {" "}
            <div>
              {" "}
              {/* Badge */}{" "}
              <div className="inline-flex items-center gap-2 rounded-full border border-[#c99a45]/30 bg-white/70 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.25em] text-[#a51c30] shadow-sm">
                {" "}
                <ShieldCheck className="h-4 w-4 text-[#b27a25]" /> Privacy &
                Security{" "}
              </div>{" "}
              <h1 className="mt-6 max-w-4xl text-4xl font-extrabold leading-[1.08] tracking-tight text-[#241b18] sm:text-5xl lg:text-[4.3rem]">
                {" "}
                Your privacy,{" "}
                <span className="block bg-gradient-to-r from-[#a51c30] via-[#b72c40] to-[#8d1729] bg-clip-text text-transparent">
                  {" "}
                  our responsibility.{" "}
                </span>{" "}
              </h1>{" "}
              <div className="mt-7 flex items-center gap-4">
                {" "}
                <div className="h-px w-14 bg-[#c99a45]/60" />{" "}
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#c99a45]/30 bg-white text-[#b27a25]">
                  {" "}
                  <Lock className="h-4 w-4" />{" "}
                </div>{" "}
                <div className="h-px w-14 bg-[#c99a45]/60" />{" "}
              </div>{" "}
              <p className="mt-7 max-w-2xl text-base leading-8 text-[#6f625c] sm:text-lg">
                {" "}
                We respect your privacy and are committed to protecting the
                information you provide while using the MYSMME seller
                platform.{" "}
              </p>{" "}
              <div className="mt-7 inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-xs font-medium text-[#81736c] shadow-sm">
                {" "}
                <RefreshCw className="h-3.5 w-3.5 text-[#a51c30]" /> Last
                updated: August 8, 2026{" "}
              </div>{" "}
            </div>{" "}
            {/* Security card */}{" "}
            <div className="hidden lg:block">
              {" "}
              <div className="relative overflow-hidden rounded-[2rem] border border-[#eadfd6] bg-white/80 p-7 shadow-xl shadow-[#6d4535]/5 backdrop-blur">
                {" "}
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#c99a45]/10 blur-2xl" />{" "}
                <div className="relative">
                  {" "}
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff2ed] text-[#a51c30]">
                    {" "}
                    <ShieldCheck className="h-7 w-7" />{" "}
                  </div>{" "}
                  <h3 className="mt-6 text-lg font-extrabold text-[#241b18]">
                    {" "}
                    Built around trust{" "}
                  </h3>{" "}
                  <p className="mt-3 text-sm leading-6 text-[#6f625c]">
                    {" "}
                    We aim to handle your information responsibly and use
                    reasonable safeguards to protect it.{" "}
                  </p>{" "}
                  <div className="mt-6 h-px bg-[#eadfd6]" />{" "}
                  <div className="mt-5 flex items-center gap-3 text-xs font-semibold text-[#756860]">
                    {" "}
                    <CheckCircle2 className="h-4 w-4 text-[#a51c30]" />{" "}
                    Privacy-focused platform{" "}
                  </div>{" "}
                </div>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </section>{" "}
      {/* ========================================================= MAIN CONTENT ========================================================= */}{" "}
      <section className="mx-auto max-w-7xl px-6 py-14 lg:px-8 lg:py-20">
        {" "}
        <div className="grid gap-10 lg:grid-cols-[240px_1fr]">
          {" "}
          {/* ===================================================== SIDEBAR ===================================================== */}{" "}
          <aside className="hidden lg:block">
            {" "}
            <div className="sticky top-28 overflow-hidden rounded-3xl border border-[#eadfd6] bg-white shadow-sm">
              {" "}
              <div className="border-b border-[#eadfd6] bg-[#fbf4ef] p-5">
                {" "}
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#a51c30]">
                  {" "}
                  Quick Navigation{" "}
                </p>{" "}
                <p className="mt-2 text-sm font-semibold text-[#332723]">
                  {" "}
                  On this page{" "}
                </p>{" "}
              </div>{" "}
              <nav className="p-4">
                {" "}
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="group flex items-center justify-between rounded-xl px-3 py-2.5 transition hover:bg-[#fbf4ef]"
                  >
                    {" "}
                    <span className="flex items-center gap-3">
                      {" "}
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#fff2ed] text-[9px] font-bold text-[#a51c30] transition group-hover:bg-[#a51c30] group-hover:text-white">
                        {" "}
                        {section.number}{" "}
                      </span>{" "}
                      <span className="text-xs font-medium text-[#756860] transition group-hover:text-[#a51c30]">
                        {" "}
                        {section.title}{" "}
                      </span>{" "}
                    </span>{" "}
                    <ChevronRight
                      size={14}
                      className="text-[#b9aaa2] opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100"
                    />{" "}
                  </a>
                ))}{" "}
              </nav>{" "}
              <div className="m-4 rounded-2xl bg-[#241b18] p-5 text-white">
                {" "}
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#a51c30]">
                  {" "}
                  <Lock className="h-5 w-5" />{" "}
                </div>{" "}
                <p className="text-sm font-bold"> Your privacy matters. </p>{" "}
                <p className="mt-2 text-xs leading-5 text-white/55">
                  {" "}
                  We aim to provide a secure and transparent marketplace
                  experience.{" "}
                </p>{" "}
              </div>{" "}
            </div>{" "}
          </aside>{" "}
          {/* ===================================================== CONTENT ===================================================== */}{" "}
          <article className="min-w-0">
            {" "}
            {/* Intro */}{" "}
            <div className="relative overflow-hidden rounded-[2rem] border border-[#eadfd6] bg-[#fbf4ef] p-7 shadow-sm sm:p-9">
              {" "}
              <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[#c99a45]/10 blur-2xl" />{" "}
              <div className="relative flex gap-5">
                {" "}
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#a51c30] text-white shadow-lg shadow-[#a51c30]/15">
                  {" "}
                  <Lock className="h-6 w-6" />{" "}
                </div>{" "}
                <div>
                  {" "}
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#a51c30]">
                    {" "}
                    Important information{" "}
                  </p>{" "}
                  <h2 className="mt-2 text-xl font-extrabold text-[#241b18] sm:text-2xl">
                    {" "}
                    Your privacy matters to us{" "}
                  </h2>{" "}
                  <p className="mt-3 max-w-3xl text-sm leading-7 text-[#6f625c]">
                    {" "}
                    This Privacy Policy explains what information MYSMME may
                    collect, how we use it, and the choices available to you
                    when using our platform.{" "}
                  </p>{" "}
                </div>{" "}
              </div>{" "}
            </div>{" "}
            <div className="mt-14 space-y-14">
              {" "}
              {/* 01 */}{" "}
              <PrivacySection
                id="information"
                number="01"
                title="Information We Collect"
                icon={<Database className="h-5 w-5" />}
              >
                {" "}
                <p>
                  {" "}
                  When you use MYSMME, we may collect information that you
                  provide directly to us, information generated through your use
                  of the platform, and technical information required to operate
                  and secure our services.{" "}
                </p>{" "}
                <SubTitle>Information you provide</SubTitle>{" "}
                <div className="grid gap-3 sm:grid-cols-2">
                  {" "}
                  <InfoItem text="Name and contact information." />{" "}
                  <InfoItem text="Email address and account credentials." />{" "}
                  <InfoItem text="Business and seller information." />{" "}
                  <InfoItem text="Product, inventory and order information." />{" "}
                  <InfoItem text="Information you provide when contacting support." />{" "}
                </div>{" "}
                <SubTitle>Automatically collected information</SubTitle>{" "}
                <p>
                  {" "}
                  We may collect technical information such as browser type,
                  device information, IP address, approximate location,
                  operating system, pages visited and information about how you
                  interact with the platform.{" "}
                </p>{" "}
              </PrivacySection>{" "}
              {/* 02 */}{" "}
              <PrivacySection
                id="usage"
                number="02"
                title="How We Use Information"
                icon={<Eye className="h-5 w-5" />}
              >
                {" "}
                <p>
                  {" "}
                  We use collected information only for legitimate business and
                  operational purposes, including:{" "}
                </p>{" "}
                <div className="space-y-3">
                  {" "}
                  <InfoItem text="Creating and maintaining your MYSMME account." />{" "}
                  <InfoItem text="Providing seller and business management features." />{" "}
                  <InfoItem text="Processing and managing products and orders." />{" "}
                  <InfoItem text="Providing customer and technical support." />{" "}
                  <InfoItem text="Improving platform performance and usability." />{" "}
                  <InfoItem text="Detecting fraud, abuse and security threats." />{" "}
                  <InfoItem text="Communicating important service information." />{" "}
                  <InfoItem text="Complying with applicable legal obligations." />{" "}
                </div>{" "}
              </PrivacySection>{" "}
              {/* 03 */}{" "}
              <PrivacySection
                id="sharing"
                number="03"
                title="Information Sharing"
                icon={<UserCheck className="h-5 w-5" />}
              >
                {" "}
                <div className="rounded-2xl border border-[#dce9df] bg-[#f4faf5] p-6">
                  {" "}
                  <div className="flex gap-4">
                    {" "}
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e2f1e5] text-[#357447]">
                      {" "}
                      <ShieldCheck className="h-5 w-5" />{" "}
                    </div>{" "}
                    <div>
                      {" "}
                      <h3 className="font-bold text-[#263b2b]">
                        {" "}
                        We do not sell your personal information.{" "}
                      </h3>{" "}
                      <p className="mt-2 text-sm leading-6 text-[#617064]">
                        {" "}
                        We may share information when reasonably necessary to
                        provide the service, protect our platform, or comply
                        with legal requirements.{" "}
                      </p>{" "}
                    </div>{" "}
                  </div>{" "}
                </div>{" "}
                <SubTitle>Service providers</SubTitle>{" "}
                <p>
                  {" "}
                  We may work with trusted third-party providers for services
                  such as hosting, email delivery, authentication, analytics,
                  security and infrastructure.{" "}
                </p>{" "}
                <SubTitle>Legal requirements</SubTitle>{" "}
                <p>
                  {" "}
                  Information may be disclosed when required by applicable law,
                  regulation, legal process or governmental request.{" "}
                </p>{" "}
              </PrivacySection>{" "}
              {/* 04 */}{" "}
              <PrivacySection
                id="security"
                number="04"
                title="Data Security"
                icon={<ShieldCheck className="h-5 w-5" />}
              >
                {" "}
                <p>
                  {" "}
                  We use reasonable technical and organizational safeguards
                  designed to protect information against unauthorized access,
                  alteration, disclosure or destruction.{" "}
                </p>{" "}
                <p>
                  {" "}
                  Security measures may include encrypted connections,
                  authentication controls, access restrictions, monitoring and
                  other appropriate safeguards.{" "}
                </p>{" "}
                <div className="mt-6 rounded-2xl border border-[#eadfd6] bg-white p-6 shadow-sm">
                  {" "}
                  <div className="flex gap-4">
                    {" "}
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#fff2ed] text-[#a51c30]">
                      {" "}
                      <Lock className="h-5 w-5" />{" "}
                    </div>{" "}
                    <div>
                      {" "}
                      <h3 className="font-bold text-[#241b18]">
                        {" "}
                        Security reminder{" "}
                      </h3>{" "}
                      <p className="mt-2 text-sm leading-6 text-[#6f625c]">
                        {" "}
                        Never share your password, verification codes or other
                        account credentials with anyone claiming to represent
                        MYSMME.{" "}
                      </p>{" "}
                    </div>{" "}
                  </div>{" "}
                </div>{" "}
              </PrivacySection>{" "}
              {/* 05 */}{" "}
              <PrivacySection
                id="cookies"
                number="05"
                title="Cookies"
                icon={<Cookie className="h-5 w-5" />}
              >
                {" "}
                <p>
                  {" "}
                  MYSMME may use cookies and similar technologies to maintain
                  sessions, remember preferences, improve functionality,
                  understand platform usage and support security.{" "}
                </p>{" "}
                <p>
                  {" "}
                  You can control cookies through your browser settings.
                  Disabling certain cookies may affect some platform
                  functionality.{" "}
                </p>{" "}
              </PrivacySection>{" "}
              {/* 06 */}{" "}
              <PrivacySection
                id="retention"
                number="06"
                title="Data Retention"
                icon={<Database className="h-5 w-5" />}
              >
                {" "}
                <p>
                  {" "}
                  We retain information for as long as reasonably necessary to
                  provide our services, maintain business records, resolve
                  disputes, enforce agreements and comply with applicable legal
                  obligations.{" "}
                </p>{" "}
                <p>
                  {" "}
                  When information is no longer required, we may delete it or
                  securely anonymize it, subject to applicable
                  requirements.{" "}
                </p>{" "}
              </PrivacySection>{" "}
              {/* 07 */}{" "}
              <PrivacySection
                id="rights"
                number="07"
                title="Your Rights"
                icon={<UserCheck className="h-5 w-5" />}
              >
                {" "}
                <p>
                  {" "}
                  Depending on your location and applicable law, you may have
                  rights relating to your personal information, including the
                  right to:{" "}
                </p>{" "}
                <div className="grid gap-3 sm:grid-cols-2">
                  {" "}
                  <InfoItem text="Request access to information we hold about you." />{" "}
                  <InfoItem text="Request correction of inaccurate information." />{" "}
                  <InfoItem text="Request deletion where legally permitted." />{" "}
                  <InfoItem text="Object to or restrict certain processing." />{" "}
                  <InfoItem text="Request a copy of certain information." />{" "}
                </div>{" "}
                <p>
                  {" "}
                  To make a privacy-related request, please contact our support
                  team.{" "}
                </p>{" "}
              </PrivacySection>{" "}
              {/* 08 */}{" "}
              <PrivacySection
                id="changes"
                number="08"
                title="Changes to This Policy"
                icon={<RefreshCw className="h-5 w-5" />}
              >
                {" "}
                <p>
                  {" "}
                  We may update this Privacy Policy from time to time to reflect
                  changes to our services, technology, legal requirements or
                  business practices.{" "}
                </p>{" "}
                <p>
                  {" "}
                  When we make changes, we will update the date displayed at the
                  beginning of this policy. We encourage you to review this page
                  periodically.{" "}
                </p>{" "}
              </PrivacySection>{" "}
              {/* 09 */}{" "}
              <PrivacySection
                id="contact"
                number="09"
                title="Contact Us"
                icon={<Mail className="h-5 w-5" />}
              >
                {" "}
                <p>
                  {" "}
                  If you have questions about this Privacy Policy or want to
                  make a privacy-related request, please contact the MYSMME
                  support team.{" "}
                </p>{" "}
                <div className="mt-6 overflow-hidden rounded-[2rem] border border-[#eadfd6] bg-[#fbf4ef] p-7 sm:p-8">
                  {" "}
                  <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                    {" "}
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#a51c30] text-white shadow-lg shadow-[#a51c30]/15">
                      {" "}
                      <Mail className="h-6 w-6" />{" "}
                    </div>{" "}
                    <div className="flex-1">
                      {" "}
                      <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#a51c30]">
                        {" "}
                        MYSMME Support{" "}
                      </p>{" "}
                      <h3 className="mt-2 text-xl font-extrabold text-[#241b18]">
                        {" "}
                        Have a privacy question?{" "}
                      </h3>{" "}
                      <p className="mt-2 text-sm text-[#6f625c]">
                        {" "}
                        Email: support@mysmme.com{" "}
                      </p>{" "}
                      <Link
                        href="/support"
                        className="group mt-5 inline-flex items-center gap-2 rounded-xl bg-[#a51c30] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#a51c30]/15 transition hover:-translate-y-0.5 hover:bg-[#8e1729]"
                      >
                        {" "}
                        Contact Support{" "}
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />{" "}
                      </Link>{" "}
                    </div>{" "}
                  </div>{" "}
                </div>{" "}
              </PrivacySection>{" "}
            </div>{" "}
            {/* Bottom CTA */}{" "}
            <div className="mt-16 overflow-hidden rounded-[2rem] bg-[#241b18] p-8 text-center text-white sm:p-10">
              {" "}
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#a51c30]">
                {" "}
                <ShieldCheck className="h-6 w-6" />{" "}
              </div>{" "}
              <h2 className="mt-5 text-2xl font-extrabold sm:text-3xl">
                {" "}
                Your trust is important to us.{" "}
              </h2>{" "}
              <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-white/55">
                {" "}
                We are committed to building a marketplace experience that is
                transparent, secure and respectful of your information.{" "}
              </p>{" "}
              <Link
                href="/"
                className="group mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-[#241b18] transition hover:-translate-y-0.5 hover:bg-[#f8eee7]"
              >
                {" "}
                Back to MYSMME{" "}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />{" "}
              </Link>{" "}
            </div>{" "}
          </article>{" "}
        </div>{" "}
      </section>{" "}
      <Footer />{" "}
    </main>
  );
}
/* ========================================================= PRIVACY SECTION ========================================================= */ function PrivacySection({
  id,
  number,
  title,
  icon,
  children,
}: {
  id: string;
  number: string;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-28">
      {" "}
      <div className="mb-6 flex items-start gap-4">
        {" "}
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#fff2ed] text-[#a51c30]">
          {" "}
          {icon}{" "}
        </div>{" "}
        <div>
          {" "}
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#b27a25]">
            {" "}
            Section {number}{" "}
          </p>{" "}
          <h2 className="text-2xl font-extrabold tracking-tight text-[#241b18] sm:text-3xl">
            {" "}
            {title}{" "}
          </h2>{" "}
        </div>{" "}
      </div>{" "}
      <div className="space-y-5 text-sm leading-7 text-[#6f625c] sm:pl-[60px]">
        {" "}
        {children}{" "}
      </div>{" "}
    </section>
  );
}
/* ========================================================= SUB TITLE ========================================================= */ function SubTitle({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <h3 className="!mt-7 text-base font-extrabold text-[#332723]">
      {" "}
      {children}{" "}
    </h3>
  );
}
/* ========================================================= INFO ITEM ========================================================= */ function InfoItem({
  text,
}: {
  text: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-[#eadfd6] bg-white px-4 py-3.5 shadow-sm">
      {" "}
      <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[#a51c30]" />{" "}
      <span>{text}</span>{" "}
    </div>
  );
}
/* ========================================================= LOTUS DECORATION ========================================================= */ function LotusDecoration() {
  return (
    <svg
      width="130"
      height="130"
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
