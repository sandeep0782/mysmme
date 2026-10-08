"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  FileText,
  Loader2,
  ShieldCheck,
  AlertCircle,
  CalendarDays,
  BadgeCheck,
  LockKeyhole,
} from "lucide-react";

type AgreementData = {
  accepted: boolean;
  acceptedAt?: string | null;
  version?: string;
  acceptanceReference?: string | null;
};

const AGREEMENT_VERSION = "1.0";

export default function FreelancerSettingsPage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const [agreement, setAgreement] = useState<AgreementData>({
    accepted: false,
    acceptedAt: null,
    version: AGREEMENT_VERSION,
    acceptanceReference: null,
  });

  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [checked, setChecked] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const agreementSections = useMemo(
    () => [
      {
        title: "1. Independent Contractor Relationship",
        content: [
          "The Freelancer performs services as an independent contractor.",
          "Nothing in this Agreement creates an employer-employee relationship, partnership, joint venture, franchise, agency, or similar relationship between the Freelancer and MYSMME.",
          "Unless specifically authorized in writing, the Freelancer has no authority to enter into contracts, make commitments, incur liabilities, collect payments, provide warranties, negotiate on behalf of, or otherwise legally bind MYSMME.",
          "The Freelancer is responsible for their own working arrangements, equipment, internet connection, tools, software, insurance where applicable, taxes, registrations, and other obligations associated with operating as an independent professional.",
        ],
      },
      {
        title: "2. Non-Exclusive Relationship",
        content: [
          "Unless a particular assignment states otherwise, the Freelancer may provide services to other clients.",
          "However, the Freelancer must avoid conflicts of interest and must not use MYSMME confidential information, trade secrets, customer information, intellectual property, campaign information, commercial information, or business opportunities for another client or competitor.",
        ],
      },
      {
        title: "3. Professional Conduct",
        content: [
          "Freelancers must maintain professional conduct and communicate respectfully with MYSMME, customers, creators, sellers, employees, vendors, agencies, freelancers, and other collaborators.",
          "Harassment, threats, abusive communication, discrimination, intimidation, deliberate disruption, or other serious professional misconduct may result in suspension or termination of the collaboration.",
        ],
      },
      {
        title: "4. Assignment Acceptance",
        content: [
          "Each project, campaign, task, or assignment may contain separate requirements relating to scope of work, deliverables, deadlines, milestones, compensation, revision limits, content specifications, approval requirements, intellectual-property treatment, usage rights, platforms, confidentiality, and other project-specific conditions.",
          "Acceptance of an assignment confirms acceptance of its applicable project brief, payment conditions, deadlines, confidentiality requirements, intellectual-property requirements, and other stated conditions.",
          "If project-specific written terms conflict with this general Agreement, the project-specific terms will apply to that project to the extent of the conflict.",
        ],
      },
      {
        title: "5. Timelines and Deadlines",
        content: [
          "All assigned work must be completed within the mutually agreed timeline unless an extension is approved by MYSMME.",
          "The Freelancer must promptly notify MYSMME of any delay, technical problem, emergency, dependency, or other circumstance that may materially affect completion of an assignment.",
          "Freelancers should not wait until the deadline has passed before reporting a known problem.",
        ],
      },
      {
        title: "6. Project Brief and Quality Standards",
        content: [
          "Freelancers must follow the approved project brief, MYSMME brand guidelines, technical specifications, creative requirements, product information, platform requirements, formatting requirements, campaign instructions, and reasonable quality standards communicated for the assignment.",
          "Substantial deviation from the approved brief may require correction before the work is considered complete.",
        ],
      },
      {
        title: "7. Revisions and Corrections",
        content: [
          "Revisions included in the agreed scope must be completed within a reasonable period and according to the original assignment requirements.",
          "A revision that corrects non-compliance with the agreed brief, specifications, quality requirements, factual accuracy, or agreed deliverables will generally not be treated as additional work.",
          "Material work requested outside the original approved scope must be discussed and approved before being performed or invoiced.",
        ],
      },
      {
        title: "8. Originality and Lawful Content",
        content: [
          "All work submitted must be original to the Freelancer, appropriately licensed, supplied with necessary permissions, or otherwise legally authorized for the intended use.",
          "Freelancers must not knowingly infringe copyrights, trademarks, design rights, privacy rights, publicity rights, personality rights, contractual rights, or other third-party rights.",
        ],
      },
      {
        title: "9. Prohibition on Plagiarized or Unauthorized Work",
        content: [
          "Freelancers must not submit plagiarized content, stolen designs, copied photographs, unauthorized videos, fake engagement, manipulated evidence, fabricated testimonials, false reviews, misleading performance data, or other unauthorized material as their own legitimate work.",
        ],
      },
      {
        title: "10. Third-Party Materials",
        content: [
          "Before incorporating third-party photographs, videos, music, audio, fonts, graphics, templates, stock assets, software, models, identifiable persons, trademarks, or other protected materials, the Freelancer must ensure that the required permission or licence exists for MYSMME's intended use.",
          "Where requested, proof of licences, releases, permissions, or source information must be provided to MYSMME.",
        ],
      },
      {
        title: "11. Model, Talent and Location Permissions",
        content: [
          "Where an assignment includes identifiable individuals, models, creators, actors, private property, or restricted locations, the Freelancer is responsible for obtaining any releases or permissions required by the assignment unless MYSMME expressly agrees to arrange them.",
        ],
      },
      {
        title: "12. Artificial Intelligence and AI-Assisted Work",
        content: [
          "AI-generated or AI-assisted work may be used only where permitted by the project requirements.",
          "The Freelancer must not represent substantially AI-generated material as entirely manual or original human-created work where disclosure is requested or required.",
          "AI tools must not be used in a way that infringes third-party rights, creates unauthorized likenesses, generates deceptive endorsements, exposes MYSMME confidential information, uploads restricted customer or business information into unauthorized AI systems, creates misleading product representations, creates unlawful deepfakes or impersonations, or violates applicable laws or platform policies.",
          "When requested by MYSMME, the Freelancer must disclose material use of generative AI in a deliverable.",
        ],
      },
      {
        title: "13. Product and Advertising Accuracy",
        content: [
          "Product images, videos, descriptions, captions, advertisements, claims, promotional materials, before-and-after representations, demonstrations, testimonials, and other materials must accurately represent the relevant product, service, or campaign.",
          "Freelancers must not intentionally exaggerate, fabricate, conceal, or materially misrepresent product characteristics, pricing, offers, performance, availability, customer experiences, or campaign results.",
        ],
      },
      {
        title: "14. Advertising and Influencer Disclosures",
        content: [
          "Where content constitutes advertising, sponsorship, paid promotion, gifted collaboration, affiliate promotion, or another commercial relationship, the Freelancer must make disclosures required by applicable law, advertising standards, platform policies, and MYSMME campaign instructions.",
          "Disclosures must be clear, visible, understandable, and appropriately placed.",
          "The Freelancer must not intentionally conceal the commercial nature of sponsored content.",
        ],
      },
      {
        title: "15. Prohibited Content",
        content: [
          "Content created for MYSMME must not contain unlawful, hateful, discriminatory, defamatory, fraudulent, deceptive, sexually explicit, exploitative, threatening, malicious, or intentionally offensive material unless a legitimate project specifically requires lawful discussion of such material and MYSMME has approved it.",
        ],
      },
      {
        title: "16. Confidential Information",
        content: [
          "Freelancers must keep confidential all non-public information obtained through their relationship with MYSMME.",
          "Confidential information includes business plans, product information, unreleased products, seller information, customer information, creator information, supplier information, pricing, margins, commercial agreements, marketing strategies, campaign information, technical information, internal reports, credentials, internal documents, source code, designs, analytics, financial information, security information, and other information reasonably understood to be confidential.",
          "Confidential information may be used only for authorized MYSMME work.",
        ],
      },
      {
        title: "17. Credentials and Account Security",
        content: [
          "MYSMME passwords, login credentials, OTPs, API keys, secret keys, authentication tokens, access tokens, customer information, server credentials, administrator access, and other sensitive information must never be shared with unauthorized persons.",
          "The Freelancer must use reasonable security practices and protect devices and accounts used to access MYSMME systems.",
          "Where available or required, multi-factor authentication should be enabled.",
        ],
      },
      {
        title: "18. Security Incidents",
        content: [
          "Any suspected account compromise, password leak, unauthorized access, lost device, customer-data exposure, accidental disclosure, malware incident, API-key exposure, or other security incident involving MYSMME information must be reported to MYSMME as soon as reasonably possible.",
          "The Freelancer must cooperate with reasonable steps required to contain and investigate the incident.",
        ],
      },
      {
        title: "19. Authorized Use of MYSMME Systems",
        content: [
          "MYSMME systems, dashboards, databases, accounts, APIs, files, cloud resources, customer information, and internal tools may only be accessed for approved work.",
          "Freelancers must not, without authorization, scrape company systems, bulk-download information, duplicate databases, export customer lists, bypass permissions, access another user's account, probe systems for vulnerabilities, redistribute company data, or use company systems for unrelated commercial purposes.",
        ],
      },
      {
        title: "20. Data Protection and Privacy",
        content: [
          "Personal information accessed while performing MYSMME work must be handled only for the authorized purpose and only to the extent required for that assignment.",
          "Freelancers must comply with applicable privacy and data-protection requirements and reasonable MYSMME privacy and security instructions.",
          "Personal information must not be retained, copied, sold, profiled, transferred, or used for independent marketing or unrelated purposes without authorization.",
        ],
      },
      {
        title: "21. Data Minimisation and Retention",
        content: [
          "Freelancers should access and retain only the information reasonably necessary to perform the assignment.",
          "Copies of customer data, seller information, campaign lists, credentials, internal files, or other restricted data must not be retained longer than necessary.",
        ],
      },
      {
        title: "22. Return and Deletion of Information",
        content: [
          "When requested by MYSMME or when the Freelancer's collaboration or access ends, the Freelancer must promptly return, securely delete, or permanently destroy confidential MYSMME information in their possession or control, except where retention is legally required.",
          "If requested, the Freelancer may be required to confirm that the relevant information has been returned or deleted.",
        ],
      },
      {
        title: "23. Subcontracting",
        content: [
          "The Freelancer must not delegate or subcontract access to confidential MYSMME systems, customer information, restricted accounts, or material portions of an assignment to another person without appropriate authorization.",
          "Where subcontracting is approved, the Freelancer remains responsible for ensuring that the approved subcontractor follows applicable confidentiality, intellectual-property, security, quality, and legal requirements.",
        ],
      },
      {
        title: "24. Customer and Business Partner Contact",
        content: [
          "Freelancers must not use access obtained through MYSMME to contact MYSMME customers, sellers, creators, suppliers, employees, business partners, or other collaborators for unrelated personal or commercial business without prior authorization.",
          "Legitimate communication required to perform an assigned MYSMME project is permitted.",
        ],
      },
      {
        title: "25. Non-Solicitation Through Confidential Relationships",
        content: [
          "During an active MYSMME engagement, freelancers must not intentionally use confidential relationships, private customer lists, private seller lists, internal contact information, or project relationships obtained solely through MYSMME to divert MYSMME opportunities for competing work.",
          "Nothing in this clause prevents ordinary independent business activity that does not misuse MYSMME confidential information or contractual relationships.",
        ],
      },
      {
        title: "26. Conflicts of Interest",
        content: [
          "Freelancers must disclose material conflicts of interest that could reasonably affect the impartial performance of an assignment.",
          "A conflict may include working simultaneously on directly competing confidential campaigns where information from one engagement could improperly benefit another.",
        ],
      },
      {
        title: "27. Representation of Relationship",
        content: [
          "Freelancers must not represent themselves as employees, directors, officers, authorized agents, legal representatives, spokespersons, or official representatives of MYSMME unless expressly authorized.",
          "Freelancers may accurately describe themselves as an independent freelancer or contractor working on an MYSMME project where appropriate.",
        ],
      },
      {
        title: "28. Use of MYSMME Name, Brand and Logo",
        content: [
          "The MYSMME name, logo, trademarks, designs, trade dress, brand assets, marketing materials, and other identifiers may only be used for authorized work.",
          "Public announcements, press releases, partnership announcements, endorsements, domain registrations, advertisements, merchandise, or other public uses of MYSMME branding require prior authorization.",
        ],
      },
      {
        title: "29. Portfolio Use",
        content: [
          "A Freelancer may showcase completed MYSMME work in a personal professional portfolio only where doing so does not disclose confidential information, unreleased campaigns, private business information, customer information, embargoed content, or material that the applicable project terms prohibit from being shared.",
          "Where the confidentiality or publication status is uncertain, permission should be obtained before publishing the work.",
        ],
      },
      {
        title: "30. Intellectual Property",
        content: [
          "Ownership and licensing of work created for MYSMME will be governed by the applicable assignment or project terms.",
          "Unless otherwise agreed in writing, work specifically commissioned by MYSMME and fully paid for by MYSMME may be transferred, assigned, or licensed to MYSMME to the extent specified in the applicable project terms.",
          "Where intellectual-property ownership is intended to transfer, the Freelancer agrees to execute reasonable additional documents necessary to document that transfer.",
          "Pre-existing tools, templates, libraries, methods, or materials owned by the Freelancer remain the Freelancer's property unless otherwise agreed.",
          "If pre-existing Freelancer materials are incorporated into a deliverable, the Freelancer must ensure that MYSMME receives sufficient rights to use the final deliverable for its intended purpose.",
        ],
      },
      {
        title: "31. Source and Working Files",
        content: [
          "Where the project scope requires editable or source files, the Freelancer must provide the required project files, including applicable design files, raw assets, editable documents, code repositories, source files, exported media, or other specified materials.",
          "Files must be reasonably organized and usable for the agreed project purpose.",
        ],
      },
      {
        title: "32. Payment",
        content: [
          "Payments will be made according to the agreed project rate, campaign rate, milestone, approved deliverables, approval process, invoice requirements, and payment schedule.",
          "No payment is due solely because work was submitted if the applicable assignment expressly requires review and approval before payment eligibility.",
          "MYSMME will not unreasonably withhold approval for work that materially satisfies the agreed requirements.",
        ],
      },
      {
        title: "33. Additional Work",
        content: [
          "Work outside the approved scope must be discussed and approved before being started or invoiced.",
          "A Freelancer should not assume that additional services will automatically be paid unless an authorized MYSMME representative has approved the additional scope.",
        ],
      },
      {
        title: "34. Incomplete, Defective or Unauthorized Work",
        content: [
          "Subject to the applicable project terms, payment may be withheld or adjusted for work that is materially incomplete, fraudulent, unauthorized, substantially defective, plagiarized, unlawfully sourced, or materially inconsistent with the agreed project requirements until the relevant issue is reasonably resolved.",
          "This clause does not permit arbitrary withholding of properly earned compensation.",
        ],
      },
      {
        title: "35. Payment and Tax Information",
        content: [
          "Freelancers are responsible for maintaining accurate legal name, identity information, address, PAN or other applicable tax information, bank details, invoice information, and other information reasonably required to process payments.",
          "The Freelancer is responsible for their own tax obligations except for deductions or reporting that MYSMME is legally required to make.",
        ],
      },
      {
        title: "36. Expenses",
        content: [
          "Unless otherwise approved in advance, freelancers are responsible for their own ordinary business expenses.",
          "Expenses claimed from MYSMME must have prior authorization where required and may require valid receipts or supporting documentation.",
        ],
      },
      {
        title: "37. Records and Supporting Evidence",
        content: [
          "Where relevant to an assignment, freelancers must retain reasonable records supporting their work, such as licences, approvals, releases, expense receipts, campaign evidence, publication links, or deliverable records for a reasonable period.",
        ],
      },
      {
        title: "38. Fraud and Manipulation",
        content: [
          "Freelancers must not manipulate impressions, followers, views, clicks, engagement, conversions, reviews, testimonials, campaign evidence, invoices, expenses, timesheets, or other reporting metrics.",
          "Use of bots, fake accounts, purchased engagement, fabricated screenshots, or other deceptive techniques is prohibited unless a clearly authorized technical testing assignment specifically requires simulated activity.",
        ],
      },
      {
        title: "39. Anti-Bribery and Improper Payments",
        content: [
          "Freelancers must not offer, request, receive, or facilitate bribes, kickbacks, secret commissions, fraudulent payments, or other unlawful benefits in connection with MYSMME work.",
        ],
      },
      {
        title: "40. Compliance with Law and Platform Policies",
        content: [
          "Freelancers must comply with applicable Indian laws, privacy and data-protection requirements, intellectual-property laws, advertising requirements, consumer-protection requirements, tax requirements applicable to them, social-media platform rules, marketplace policies, messaging-platform policies, and other laws or regulations relevant to their assigned work.",
        ],
      },
      {
        title: "41. Social Media and Platform Accounts",
        content: [
          "Where a Freelancer is given access to an MYSMME social-media, marketplace, advertising, communication, or other third-party platform account, access may only be used for authorized MYSMME activities.",
          "The Freelancer must not change ownership, transfer administrators, remove authorized MYSMME users, change recovery information, make unauthorized purchases, connect unauthorized applications, or retain access after authorization ends.",
        ],
      },
      {
        title: "42. Public Statements",
        content: [
          "The Freelancer must not make statements to media, regulators, customers, partners, or the public claiming to speak officially on behalf of MYSMME without authorization.",
          "Nothing in this clause prevents a Freelancer from making statements that cannot legally be restricted.",
        ],
      },
      {
        title: "43. Warranties by Freelancer",
        content: [
          "The Freelancer represents that, to the best of their knowledge, they have authority to enter into this Agreement.",
          "Their work will comply with applicable project requirements.",
          "They will not knowingly supply infringing or unlawfully obtained material.",
          "Information provided for payment and identity verification will be materially accurate.",
          "They will not knowingly introduce malicious code, malware, hidden access mechanisms, or other harmful technology into MYSMME systems or deliverables.",
        ],
      },
      {
        title: "44. Responsibility for Freelancer-Caused Violations",
        content: [
          "A Freelancer may be responsible for direct losses, third-party claims, or reasonable costs arising from the Freelancer's intentional misconduct, fraud, knowing infringement, serious confidentiality breach, unauthorized disclosure of protected information, or deliberate violation of applicable law, to the extent permitted by applicable law and the applicable project terms.",
          "MYSMME should promptly inform the Freelancer of material third-party claims for which responsibility is sought.",
        ],
      },
      {
        title: "45. Suspension of Access",
        content: [
          "MYSMME may temporarily suspend platform, account, system, campaign, or confidential-information access where reasonably necessary to investigate suspected fraud, security incidents, confidentiality breaches, unauthorized account use, serious misconduct, material policy violations, or significant risks to MYSMME, customers, sellers, creators, or systems.",
        ],
      },
      {
        title: "46. Termination by MYSMME",
        content: [
          "MYSMME may terminate or discontinue a Freelancer relationship for serious or repeated issues including fraud, theft, serious misconduct, confidentiality breaches, data misuse, security violations, repeated unjustified missed deadlines, consistently unacceptable work, infringement, harassment, misuse of customer or seller relationships, misrepresentation, unauthorized account access, or violation of applicable law or material terms of this Agreement.",
          "Where appropriate, MYSMME may provide an opportunity to correct a non-serious issue before termination.",
        ],
      },
      {
        title: "47. Termination by Freelancer",
        content: [
          "The Freelancer may end an ongoing collaboration by providing reasonable notice where practicable.",
          "Before leaving an active assignment, the Freelancer should reasonably cooperate with MYSMME to complete agreed urgent obligations, communicate unfinished work, transfer relevant files, provide necessary handover information, and return or delete confidential information.",
        ],
      },
      {
        title: "48. Effect of Termination",
        content: [
          "Termination does not eliminate rights or obligations that arose before termination.",
          "Clauses relating to confidentiality, privacy, security, intellectual property, payment obligations, records, restrictions on misuse of information, dispute resolution, and other provisions intended by their nature to survive termination will continue after the relationship ends.",
        ],
      },
      {
        title: "49. Force Majeure",
        content: [
          "Neither party will be treated as breaching an obligation solely because performance is prevented by events genuinely outside that party's reasonable control, provided the affected party communicates the issue promptly and takes reasonable steps to reduce the impact.",
          "This may include severe outages, natural disasters, government restrictions, or other comparable events.",
          "Payment obligations for work already properly completed are not automatically cancelled because of such an event.",
        ],
      },
      {
        title: "50. Communication and Notices",
        content: [
          "Routine project communications may be delivered through the MYSMME freelancer platform, registered email, approved messaging channels, project-management systems, or another communication method designated by MYSMME.",
          "Freelancers are responsible for keeping their registered contact information reasonably current.",
        ],
      },
      {
        title: "51. Electronic Acceptance",
        content: [
          "The Freelancer agrees that acceptance through an electronic checkbox, button, digital confirmation, platform acceptance record, electronic signature, or other documented electronic acceptance method may be recorded as evidence of agreement.",
          "MYSMME may maintain records including Freelancer user ID, agreement version, date and time of acceptance, assignment ID, acceptance status, and other reasonable technical records associated with acceptance.",
        ],
      },
      {
        title: "52. Agreement Updates",
        content: [
          "MYSMME may update these Freelancer Terms from time to time.",
          "Materially revised versions may be assigned a new agreement version.",
          "Where MYSMME requires acceptance of a revised version, the Freelancer may be required to review and accept it before receiving new assignments or continuing to use designated freelancer functionality.",
          "Acceptance of one version does not automatically constitute acceptance of a later version where MYSMME expressly requires re-acceptance.",
        ],
      },
      {
        title: "53. Entire Agreement",
        content: [
          "This Agreement, together with applicable assignment briefs, statements of work, campaign terms, payment terms, confidentiality agreements, intellectual-property terms, and other expressly incorporated documents, forms the agreement governing the relevant freelance services.",
          "A project-specific written agreement may supplement or replace parts of these general terms.",
        ],
      },
      {
        title: "54. No Waiver",
        content: [
          "Failure by either party to enforce a provision on one occasion does not necessarily waive the right to enforce that provision later.",
        ],
      },
      {
        title: "55. Severability",
        content: [
          "If any provision of this Agreement is found unenforceable or invalid, the remaining provisions will continue to apply to the extent legally permitted.",
          "An invalid provision should, where legally possible, be interpreted or limited so that it most closely reflects its intended lawful purpose.",
        ],
      },
      {
        title: "56. Assignment of Agreement",
        content: [
          "The Freelancer may not transfer material obligations under an active assignment to another person without authorization.",
          "MYSMME may transfer or assign its rights and obligations in connection with a lawful corporate restructuring, business transfer, merger, acquisition, or related transaction, subject to applicable law.",
        ],
      },
      {
        title: "57. Governing Law",
        content: [
          "This Agreement will be governed by the laws of India.",
          "The parties will first attempt in good faith to resolve disputes through direct discussion.",
          "If a dispute cannot be resolved informally, it will be handled according to the dispute-resolution process specified in the applicable project agreement or other written MYSMME terms.",
          "Where no separate dispute-resolution provision applies, courts having appropriate jurisdiction in Gujarat, India will have jurisdiction, subject to applicable law.",
        ],
      },
      {
        title: "58. Freelancer Confirmation",
        content: [
          "By accepting this Agreement, the Freelancer confirms that they have read and understood the MYSMME Freelancer & Independent Contractor Agreement.",
          "The Freelancer agrees to comply with these terms while performing MYSMME assignments.",
          "The Freelancer understands that they are working as an independent freelancer and not as an employee of MYSMME unless a separate written employment agreement states otherwise.",
          "The Freelancer understands their confidentiality, data-security, intellectual-property, professional-conduct, and project obligations.",
          "The Freelancer understands that individual assignments may contain additional scope, deadline, payment, usage-right, and campaign-specific conditions.",
          "The Freelancer confirms that the identity, payment, and professional information supplied through their MYSMME account is accurate to the best of their knowledge.",
          "The Freelancer voluntarily accepts this Agreement electronically.",
        ],
      },
    ],
    [],
  );

  useEffect(() => {
    fetchAgreementStatus();
  }, []);

  async function fetchAgreementStatus() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/freelancer/agreement`, {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        console.error("AGREEMENT API ERROR:", response.status, result);

        throw new Error(
          result?.message ||
            `Unable to load agreement status. Status: ${response.status}`,
        );
      }

      if (!result?.success) {
        throw new Error(result?.message || "Unable to load agreement status.");
      }

      setAgreement({
        accepted: Boolean(result?.data?.accepted),
        acceptedAt: result?.data?.acceptedAt || null,
        version: result?.data?.version || AGREEMENT_VERSION,
        acceptanceReference: result?.data?.acceptanceReference || null,
      });
    } catch (err) {
      console.error("AGREEMENT FETCH ERROR:", err);

      setError(
        err instanceof Error ? err.message : "Unable to load agreement status.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleAcceptAgreement() {
    if (!checked || accepting) return;

    try {
      setAccepting(true);
      setError("");
      setSuccess("");

      const response = await fetch(`${API_URL}/freelancer/agreement`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accepted: true,
          version: AGREEMENT_VERSION,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result?.success) {
        throw new Error(result?.message || "Unable to accept agreement.");
      }

      setAgreement({
        accepted: true,
        acceptedAt: result?.data?.acceptedAt || new Date().toISOString(),
        version: result?.data?.version || AGREEMENT_VERSION,
        acceptanceReference: result?.data?.acceptanceReference || null,
      });

      setChecked(false);
      setSuccess("Agreement accepted successfully.");
    } catch (err) {
      console.error("AGREEMENT ACCEPT ERROR:", err);

      setError(
        err instanceof Error ? err.message : "Unable to accept agreement.",
      );
    } finally {
      setAccepting(false);
    }
  }

  function formatDate(value?: string | null) {
    if (!value) return "Not available";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "Not available";
    }

    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-100">
              <FileText className="h-5 w-5 text-violet-700" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Freelancer Aggrement
              </h1>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                Review and manage your MYSMME freelancer agreement.
              </p>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <StatusCard
            icon={<BadgeCheck className="h-5 w-5" />}
            label="Agreement Status"
            value={
              loading
                ? "Checking..."
                : agreement.accepted
                  ? "Accepted"
                  : "Pending"
            }
          />

          <StatusCard
            icon={<FileText className="h-5 w-5" />}
            label="Agreement Version"
            value={agreement.version || AGREEMENT_VERSION}
          />

          <StatusCard
            icon={<CalendarDays className="h-5 w-5" />}
            label="Accepted On"
            value={
              agreement.accepted
                ? formatDate(agreement.acceptedAt)
                : "Not accepted"
            }
          />
        </div>

        {/* Main agreement card */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-5 sm:px-7">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-600">
                  MYSMME
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-900">
                  Freelancer & Independent Contractor Agreement
                </h2>

                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                  This agreement applies to freelance assignments, campaigns,
                  projects, services, content creation, photography,
                  videography, design, marketing, social-media work, technical
                  work, consulting, and other services performed for MYSMME.
                </p>
              </div>

              {!loading &&
                (agreement.accepted ? (
                  <span className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-700">
                    <CheckCircle2 className="h-4 w-4" />
                    Accepted
                  </span>
                ) : (
                  <span className="inline-flex w-fit items-center gap-2 rounded-full bg-amber-50 px-3 py-1.5 text-sm font-semibold text-amber-700">
                    <AlertCircle className="h-4 w-4" />
                    Acceptance Required
                  </span>
                ))}
            </div>
          </div>

          <div className="p-5 sm:p-7">
            <div className="mb-5 rounded-xl border border-violet-100 bg-violet-50/70 p-4">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-violet-700" />

                <div>
                  <p className="font-semibold text-slate-900">
                    Agreement Version {AGREEMENT_VERSION}
                  </p>

                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Please read this agreement carefully before accepting. Your
                    agreement version, account, and acceptance timestamp may be
                    recorded for audit and compliance purposes.
                  </p>
                </div>
              </div>
            </div>

            {/* Terms */}
            <div className="max-h-[650px] overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
              <div className="mb-7">
                <h3 className="text-lg font-bold text-slate-900">
                  MYSMME Freelancer & Independent Contractor Agreement
                </h3>

                <p className="mt-2 text-sm leading-7 text-slate-700">
                  This Freelancer & Independent Contractor Agreement governs all
                  freelance assignments, campaigns, projects, services, content
                  creation, photography, videography, design, marketing,
                  social-media work, technical work, consulting, or other
                  services performed for MYSMME.
                </p>

                <p className="mt-3 text-sm leading-7 text-slate-700">
                  By accepting this Agreement electronically, accepting an
                  assignment through the MYSMME platform, or commencing work
                  after being provided with these terms, you acknowledge that
                  you have read, understood, and agreed to this Agreement
                  together with the specific requirements and commercial terms
                  of each assignment.
                </p>
              </div>

              <div className="space-y-7">
                {agreementSections.map((section) => (
                  <section key={section.title}>
                    <h4 className="text-base font-semibold text-slate-900">
                      {section.title}
                    </h4>

                    <div className="mt-2 space-y-2">
                      {section.content.map((paragraph, index) => (
                        <p
                          key={`${section.title}-${index}`}
                          className="text-sm leading-7 text-slate-700"
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </div>

            {/* Errors */}
            {error && (
              <div className="mt-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="mt-5 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
                <span>{success}</span>
              </div>
            )}

            {/* Accepted */}
            {agreement.accepted ? (
              <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-5">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-emerald-600" />

                  <div>
                    <p className="font-semibold text-emerald-900">
                      Agreement Accepted
                    </p>

                    <p className="mt-1 text-sm leading-6 text-emerald-700">
                      You accepted agreement version{" "}
                      <span className="font-semibold">
                        {agreement.version || AGREEMENT_VERSION}
                      </span>{" "}
                      on{" "}
                      <span className="font-semibold">
                        {formatDate(agreement.acceptedAt)}
                      </span>
                      .
                    </p>

                    {agreement.acceptanceReference && (
                      <p className="mt-2 text-xs text-emerald-700">
                        Acceptance Reference:{" "}
                        <span className="font-mono font-medium">
                          {agreement.acceptanceReference}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Confirmation */}
                <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-violet-300 hover:bg-violet-50/30">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => setChecked(e.target.checked)}
                    disabled={loading || accepting}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500 disabled:cursor-not-allowed"
                  />

                  <span className="text-sm leading-6 text-slate-700">
                    I confirm that I have read and understood the MYSMME
                    Freelancer & Independent Contractor Agreement. I voluntarily
                    agree to the terms, confidentiality obligations,
                    data-security requirements, intellectual-property
                    provisions, payment conditions, and project responsibilities
                    described above.
                  </span>
                </label>

                {/* Accept button */}
                <div className="mt-5 flex flex-col gap-4 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-2 text-xs leading-5 text-slate-500">
                    <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0" />

                    <p>
                      Your account ID, agreement version, acceptance date, and
                      acceptance reference may be stored as evidence of
                      electronic acceptance.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleAcceptAgreement}
                    disabled={loading || !checked || accepting}
                    className="inline-flex min-w-[190px] items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    {accepting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Accepting...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        Accept Agreement
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {label}
          </p>

          <p className="mt-1 break-words text-sm font-semibold text-slate-900">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}
