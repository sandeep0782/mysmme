"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Hash,
  Loader2,
  Mail,
  MessageSquareText,
  Phone,
  Tag,
  User,
  XCircle,
} from "lucide-react";

import {
  type ContactInquiryStatus,
  useGetAdminContactInquiryByIdQuery,
  useUpdateAdminContactInquiryStatusMutation,
} from "@/store/api/contactApi";
import Spinner from "@/lib/Spinner";

/* ================================================================
   PAGE
================================================================ */

export default function ContactEnquiryDetailPage() {
  const params = useParams<{ id: string }>();

  const id = params?.id;

  const [successMessage, setSuccessMessage] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const {
    data: inquiry,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetAdminContactInquiryByIdQuery(id, {
    skip: !id,
  });

  const [updateStatus, { isLoading: isUpdatingStatus }] =
    useUpdateAdminContactInquiryStatusMutation();

  /* ================================================================
     UPDATE STATUS
  ================================================================ */

  const handleStatusChange = async (status: ContactInquiryStatus) => {
    if (!id) {
      return;
    }

    setSuccessMessage("");
    setErrorMessage("");

    try {
      await updateStatus({
        id,
        status,
      }).unwrap();

      setSuccessMessage("Enquiry status updated successfully.");
    } catch (error: unknown) {
      console.error("UPDATE CONTACT STATUS ERROR:", error);

      setErrorMessage(getApiErrorMessage(error));
    }
  };

  /* ================================================================
     LOADING
  ================================================================ */

  if (isLoading) {
    return <Spinner />;
  }

  /* ================================================================
     ERROR
  ================================================================ */

  if (isError || !inquiry) {
    return (
      <div className="min-h-screen bg-[#f7f7f8] p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/platform/admin/contact-enquiries"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#52525b] transition hover:text-[#a51c30]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to enquiries
          </Link>

          <div className="mt-6 rounded-2xl border border-red-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
              <XCircle className="h-6 w-6" />
            </div>

            <h1 className="mt-4 text-xl font-bold text-[#18181b]">
              Unable to load enquiry
            </h1>

            <p className="mt-2 text-sm text-[#71717a]">
              The contact enquiry could not be loaded.
            </p>

            <button
              type="button"
              onClick={() => refetch()}
              className="mt-6 rounded-xl bg-[#a51c30] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#8e1729]"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ================================================================
     PAGE
  ================================================================ */

  return (
    <div className="min-h-screen bg-[#f7f7f8] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        {/* =========================================================
            BACK
        ========================================================= */}

        <div className="flex items-center justify-between gap-4">
          <Link
            href="/platform/admin/contact-enquiries"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#52525b] transition hover:text-[#a51c30]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to enquiries
          </Link>

          {isFetching && (
            <span className="text-xs font-medium text-[#a1a1aa]">
              Updating...
            </span>
          )}
        </div>

        {/* =========================================================
            HEADER
        ========================================================= */}

        <div className="mt-6 rounded-2xl border border-[#e4e4e7] bg-white p-6 shadow-sm lg:p-8">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={inquiry.status} />

                <TypeBadge type={inquiry.type} />
              </div>

              <h1 className="mt-4 break-words text-2xl font-extrabold tracking-tight text-[#18181b] sm:text-3xl">
                {inquiry.subject}
              </h1>

              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[#71717a]">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4" />
                  Received {formatDate(inquiry.createdAt)}
                </span>

                {inquiry.reference && (
                  <span className="inline-flex items-center gap-1.5">
                    <Hash className="h-4 w-4" />

                    {inquiry.reference}
                  </span>
                )}
              </div>
            </div>

            {/* STATUS SELECT */}

            <div className="w-full shrink-0 lg:w-[220px]">
              <label
                htmlFor="contact-status"
                className="mb-2 block text-[11px] font-bold uppercase tracking-[0.12em] text-[#71717a]"
              >
                Enquiry Status
              </label>

              <select
                id="contact-status"
                value={inquiry.status}
                disabled={isUpdatingStatus}
                onChange={(event) =>
                  handleStatusChange(event.target.value as ContactInquiryStatus)
                }
                className="h-11 w-full rounded-xl border border-[#e4e4e7] bg-white px-3 text-sm font-semibold text-[#27272a] outline-none transition focus:border-[#a51c30] focus:ring-4 focus:ring-[#a51c30]/5 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <option value="new">New</option>

                <option value="in-progress">In Progress</option>

                <option value="resolved">Resolved</option>

                <option value="closed">Closed</option>
              </select>

              {isUpdatingStatus && (
                <div className="mt-3 flex items-center gap-2">
                  <Spinner />
                  <span className="text-xs text-[#71717a]">
                    Updating status...
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* SUCCESS */}

          {successMessage && (
            <div
              role="status"
              className="mt-6 flex gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4"
            >
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />

              <p className="text-sm font-medium text-emerald-800">
                {successMessage}
              </p>
            </div>
          )}

          {/* ERROR */}

          {errorMessage && (
            <div
              role="alert"
              className="mt-6 flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4"
            >
              <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

              <p className="text-sm font-medium text-red-800">{errorMessage}</p>
            </div>
          )}
        </div>

        {/* =========================================================
            BODY
        ========================================================= */}

        <div className="mt-6 grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
          {/* =======================================================
              LEFT COLUMN
          ======================================================= */}

          <div className="space-y-6">
            {/* CONTACT DETAILS */}

            <section className="rounded-2xl border border-[#e4e4e7] bg-white p-6 shadow-sm">
              <h2 className="text-base font-bold text-[#18181b]">
                Contact Details
              </h2>

              <p className="mt-1 text-xs leading-5 text-[#71717a]">
                Customer information submitted with this enquiry.
              </p>

              <div className="mt-6 space-y-5">
                <DetailRow
                  icon={<User className="h-4 w-4" />}
                  label="Name"
                  value={inquiry.name}
                />

                <DetailRow
                  icon={<Mail className="h-4 w-4" />}
                  label="Email"
                  value={inquiry.email}
                />

                <DetailRow
                  icon={<Phone className="h-4 w-4" />}
                  label="Phone"
                  value={inquiry.phone || "Not provided"}
                />

                <DetailRow
                  icon={<Tag className="h-4 w-4" />}
                  label="Enquiry Type"
                  value={formatType(inquiry.type)}
                />

                <DetailRow
                  icon={<Hash className="h-4 w-4" />}
                  label="Reference"
                  value={inquiry.reference || "Not provided"}
                />
              </div>
            </section>

            {/* META */}

            <section className="rounded-2xl border border-[#e4e4e7] bg-white p-6 shadow-sm">
              <h2 className="text-base font-bold text-[#18181b]">
                Enquiry Information
              </h2>

              <div className="mt-5 space-y-5">
                <DetailRow
                  icon={<CalendarDays className="h-4 w-4" />}
                  label="Created"
                  value={formatDate(inquiry.createdAt)}
                />

                <DetailRow
                  icon={<Clock3 className="h-4 w-4" />}
                  label="Last Updated"
                  value={formatDate(inquiry.updatedAt)}
                />

                <DetailRow
                  icon={<MessageSquareText className="h-4 w-4" />}
                  label="Source"
                  value={
                    inquiry.source === "website"
                      ? "MYSMME Website"
                      : inquiry.source
                  }
                />
              </div>
            </section>
          </div>

          {/* =======================================================
              MESSAGE
          ======================================================= */}

          <section className="rounded-2xl border border-[#e4e4e7] bg-white p-6 shadow-sm lg:p-8">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#fff2ed] text-[#a51c30]">
                <MessageSquareText className="h-5 w-5" />
              </div>

              <div>
                <p className="text-xs font-medium text-[#71717a]">
                  Customer Message
                </p>

                <h2 className="mt-1 text-lg font-bold text-[#18181b]">
                  {inquiry.subject}
                </h2>
              </div>
            </div>

            <div className="mt-6 whitespace-pre-wrap break-words rounded-2xl border border-[#f1f1f2] bg-[#fafafa] p-5 text-sm leading-7 text-[#3f3f46] sm:p-6">
              {inquiry.message}
            </div>

            {/* =====================================================
                REPLY
            ===================================================== */}

            <div className="mt-8 border-t border-[#f1f1f2] pt-6">
              <p className="text-sm font-bold text-[#27272a]">
                Reply to customer
              </p>

              <p className="mt-1 text-xs leading-5 text-[#71717a]">
                Open your default email application with the customer email and
                subject pre-filled.
              </p>

              <a
                href={buildMailTo(inquiry.email, inquiry.subject)}
                className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-[#a51c30] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#a51c30]/15 transition hover:bg-[#8e1729]"
              >
                <Mail className="h-4 w-4" />
                Reply by Email
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   DETAIL ROW
================================================================ */

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#f4f4f5] text-[#52525b]">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-[#a1a1aa]">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-semibold text-[#27272a]">
          {value}
        </p>
      </div>
    </div>
  );
}

/* ================================================================
   STATUS BADGE
================================================================ */

function StatusBadge({ status }: { status: ContactInquiryStatus }) {
  const styles: Record<ContactInquiryStatus, string> = {
    new: "border-blue-100 bg-blue-50 text-blue-700",

    "in-progress": "border-amber-100 bg-amber-50 text-amber-700",

    resolved: "border-emerald-100 bg-emerald-50 text-emerald-700",

    closed: "border-[#e4e4e7] bg-[#f4f4f5] text-[#52525b]",
  };

  const labels: Record<ContactInquiryStatus, string> = {
    new: "New",
    "in-progress": "In Progress",
    resolved: "Resolved",
    closed: "Closed",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-bold ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}

/* ================================================================
   TYPE BADGE
================================================================ */

function TypeBadge({ type }: { type: string }) {
  return (
    <span className="inline-flex rounded-full border border-[#e4e4e7] bg-[#fafafa] px-2.5 py-1 text-[11px] font-semibold text-[#52525b]">
      {formatType(type)}
    </span>
  );
}

/* ================================================================
   FORMAT TYPE
================================================================ */

function formatType(value: string) {
  return value
    .split("-")
    .filter(Boolean)
    .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
    .join(" ");
}

/* ================================================================
   FORMAT DATE
================================================================ */

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

/* ================================================================
   MAILTO
================================================================ */

function buildMailTo(email: string, subject: string) {
  const replySubject = subject.toLowerCase().startsWith("re:")
    ? subject
    : `Re: ${subject}`;

  return `mailto:${email}?subject=${encodeURIComponent(replySubject)}`;
}

/* ================================================================
   ERROR MESSAGE
================================================================ */

function getApiErrorMessage(error: unknown): string {
  if (typeof error === "object" && error !== null) {
    const err = error as {
      status?: number | string;

      error?: string;

      data?:
        | {
            success?: boolean;
            message?: string;
          }
        | string;
    };

    if (
      typeof err.data === "object" &&
      err.data !== null &&
      typeof err.data.message === "string"
    ) {
      return err.data.message;
    }

    if (typeof err.data === "string" && err.data.trim()) {
      return err.data;
    }

    if (typeof err.error === "string" && err.error.trim()) {
      return err.error;
    }

    if (err.status) {
      return `Request failed with status ${err.status}.`;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Unable to update the enquiry status.";
}
