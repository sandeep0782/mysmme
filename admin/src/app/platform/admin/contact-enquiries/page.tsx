"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Inbox,
  Mail,
  Search,
  XCircle,
} from "lucide-react";
import {
  ContactInquiryStatus,
  ContactInquiryType,
  useGetAdminContactInquiriesQuery,
} from "@/store/api/contactApi";
import Spinner from "@/lib/Spinner";

/* ================================================================
   PAGE
================================================================ */

export default function ContactEnquiriesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const [status, setStatus] = useState<ContactInquiryStatus | "">("");

  const [type, setType] = useState<ContactInquiryType | "">("");

  const queryParams = useMemo(
    () => ({
      page,
      limit: 20,
      search,
      status,
      type,
    }),
    [page, search, status, type],
  );

  const { data, isLoading, isFetching, isError, refetch } =
    useGetAdminContactInquiriesQuery(queryParams);

  const inquiries = data?.inquiries ?? [];
  const pagination = data?.pagination;
  const summary = data?.summary;

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatusChange = (value: ContactInquiryStatus | "") => {
    setStatus(value);
    setPage(1);
  };

  const handleTypeChange = (value: ContactInquiryType | "") => {
    setType(value);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-[#f7f7f8] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1500px]">
        {/* =========================================================
            HEADER
        ========================================================= */}

        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#a51c30]">
              Customer Support
            </p>

            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[#18181b]">
              Contact Enquiries
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#71717a]">
              Manage customer, seller, catalogue, technical and business
              enquiries submitted through MYSMME.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isFetching && (
              <span className="text-xs font-medium text-[#a1a1aa]">
                Updating...
              </span>
            )}

            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              className="rounded-xl border border-[#e4e4e7] bg-white px-4 py-2.5 text-sm font-semibold text-[#3f3f46] shadow-sm transition hover:border-[#a51c30]/40 hover:text-[#a51c30] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* =========================================================
            SUMMARY
        ========================================================= */}

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <SummaryCard
            title="Total Enquiries"
            value={summary?.total ?? 0}
            icon={<Inbox className="h-5 w-5" />}
          />

          <SummaryCard
            title="New"
            value={summary?.new ?? 0}
            icon={<Mail className="h-5 w-5" />}
          />

          <SummaryCard
            title="In Progress"
            value={summary?.inProgress ?? 0}
            icon={<Clock3 className="h-5 w-5" />}
          />

          <SummaryCard
            title="Resolved"
            value={summary?.resolved ?? 0}
            icon={<CheckCircle2 className="h-5 w-5" />}
          />

          <SummaryCard
            title="Closed"
            value={summary?.closed ?? 0}
            icon={<XCircle className="h-5 w-5" />}
          />
        </div>

        {/* =========================================================
            FILTERS
        ========================================================= */}

        <div className="mt-6 rounded-2xl border border-[#e4e4e7] bg-white p-4 shadow-sm">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px_220px]">
            {/* SEARCH */}

            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#a1a1aa]" />

              <input
                type="search"
                value={search}
                onChange={(event) => handleSearchChange(event.target.value)}
                placeholder="Search name, email, subject, phone or reference..."
                className="h-11 w-full rounded-xl border border-[#e4e4e7] bg-white pl-10 pr-4 text-sm text-[#27272a] outline-none transition placeholder:text-[#a1a1aa] focus:border-[#a51c30] focus:ring-4 focus:ring-[#a51c30]/5"
              />
            </div>

            {/* STATUS */}

            <select
              value={status}
              onChange={(event) =>
                handleStatusChange(
                  event.target.value as ContactInquiryStatus | "",
                )
              }
              className="h-11 rounded-xl border border-[#e4e4e7] bg-white px-3 text-sm font-medium text-[#3f3f46] outline-none transition focus:border-[#a51c30] focus:ring-4 focus:ring-[#a51c30]/5"
            >
              <option value="">All Statuses</option>
              <option value="new">New</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>

            {/* TYPE */}

            <select
              value={type}
              onChange={(event) =>
                handleTypeChange(event.target.value as ContactInquiryType | "")
              }
              className="h-11 rounded-xl border border-[#e4e4e7] bg-white px-3 text-sm font-medium text-[#3f3f46] outline-none transition focus:border-[#a51c30] focus:ring-4 focus:ring-[#a51c30]/5"
            >
              <option value="">All Types</option>
              <option value="customer-support">Customer Support</option>
              <option value="order-support">Order Support</option>
              <option value="seller-support">Seller Support</option>
              <option value="catalogue-support">Catalogue Support</option>
              <option value="business">Business</option>
              <option value="technical">Technical</option>
              <option value="feedback">Feedback</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* =========================================================
            TABLE
        ========================================================= */}

        <div className="mt-6 overflow-hidden rounded-2xl border border-[#e4e4e7] bg-white shadow-sm">
          {isLoading ? (
            <Spinner />
          ) : isError ? (
            <ErrorState onRetry={refetch} />
          ) : inquiries.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[#e4e4e7]">
                <thead className="bg-[#fafafa]">
                  <tr>
                    <TableHead>Customer</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Received</TableHead>
                    <TableHead>Action</TableHead>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#f1f1f2] bg-white">
                  {inquiries.map((inquiry) => (
                    <tr
                      key={inquiry._id}
                      className="transition hover:bg-[#fafafa]"
                    >
                      {/* CUSTOMER */}

                      <td className="px-5 py-4 align-top">
                        <div className="min-w-[210px]">
                          <p className="font-semibold text-[#18181b]">
                            {inquiry.name}
                          </p>

                          <p className="mt-1 text-xs text-[#71717a]">
                            {inquiry.email}
                          </p>

                          {inquiry.phone && (
                            <p className="mt-1 text-xs text-[#a1a1aa]">
                              {inquiry.phone}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* SUBJECT */}

                      <td className="px-5 py-4 align-top">
                        <div className="max-w-[360px]">
                          <p className="line-clamp-1 text-sm font-semibold text-[#27272a]">
                            {inquiry.subject}
                          </p>

                          <p className="mt-1 line-clamp-2 text-xs leading-5 text-[#71717a]">
                            {inquiry.message}
                          </p>

                          {inquiry.reference && (
                            <p className="mt-2 text-[11px] font-medium text-[#a1a1aa]">
                              Ref: {inquiry.reference}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* TYPE */}

                      <td className="whitespace-nowrap px-5 py-4 align-top">
                        <TypeBadge type={inquiry.type} />
                      </td>

                      {/* STATUS */}

                      <td className="whitespace-nowrap px-5 py-4 align-top">
                        <StatusBadge status={inquiry.status} />
                      </td>

                      {/* DATE */}

                      <td className="whitespace-nowrap px-5 py-4 align-top">
                        <p className="text-sm text-[#52525b]">
                          {formatDate(inquiry.createdAt)}
                        </p>
                      </td>

                      {/* ACTION */}

                      <td className="whitespace-nowrap px-5 py-4 align-top">
                        <Link
                          href={`/platform/admin/contact-enquiries/${inquiry._id}`}
                          className="inline-flex items-center justify-center rounded-lg border border-[#e4e4e7] bg-white px-3.5 py-2 text-xs font-bold text-[#3f3f46] transition hover:border-[#a51c30] hover:text-[#a51c30]"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* =======================================================
              PAGINATION
          ======================================================= */}

          {pagination && pagination.total > 0 && (
            <div className="flex flex-col gap-4 border-t border-[#e4e4e7] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-[#71717a]">
                Showing page{" "}
                <span className="font-semibold text-[#27272a]">
                  {pagination.page}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-[#27272a]">
                  {pagination.totalPages}
                </span>
                {" · "}
                {pagination.total} enquiries
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={pagination.page <= 1 || isFetching}
                  onClick={() =>
                    setPage((currentPage) => Math.max(currentPage - 1, 1))
                  }
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#e4e4e7] bg-white px-3 text-xs font-semibold text-[#52525b] transition hover:bg-[#fafafa] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </button>

                <button
                  type="button"
                  disabled={
                    pagination.page >= pagination.totalPages || isFetching
                  }
                  onClick={() =>
                    setPage((currentPage) =>
                      Math.min(currentPage + 1, pagination.totalPages),
                    )
                  }
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#e4e4e7] bg-white px-3 text-xs font-semibold text-[#52525b] transition hover:bg-[#fafafa] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   SUMMARY CARD
================================================================ */

function SummaryCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[#e4e4e7] bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-[#71717a]">{title}</p>

          <p className="mt-2 text-2xl font-extrabold tracking-tight text-[#18181b]">
            {value}
          </p>
        </div>

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#fff2ed] text-[#a51c30]">
          {icon}
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   TABLE HEAD
================================================================ */

function TableHead({ children }: { children: React.ReactNode }) {
  return (
    <th className="whitespace-nowrap px-5 py-3 text-left text-[11px] font-bold uppercase tracking-[0.08em] text-[#71717a]">
      {children}
    </th>
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

function TypeBadge({ type }: { type: ContactInquiryType }) {
  const labels: Record<ContactInquiryType, string> = {
    "customer-support": "Customer",
    "order-support": "Order",
    "seller-support": "Seller",
    "catalogue-support": "Catalogue",
    business: "Business",
    technical: "Technical",
    feedback: "Feedback",
    other: "Other",
  };

  return (
    <span className="inline-flex rounded-full border border-[#e4e4e7] bg-[#fafafa] px-2.5 py-1 text-[11px] font-semibold text-[#52525b]">
      {labels[type]}
    </span>
  );
}

/* ================================================================
   EMPTY
================================================================ */

function EmptyState() {
  return (
    <div className="p-12 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f4f4f5] text-[#a1a1aa]">
        <Inbox className="h-6 w-6" />
      </div>

      <p className="mt-4 font-bold text-[#27272a]">No enquiries found</p>

      <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-[#71717a]">
        There are no contact enquiries matching the selected filters.
      </p>
    </div>
  );
}

/* ================================================================
   ERROR
================================================================ */

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="p-12 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
        <XCircle className="h-6 w-6" />
      </div>

      <p className="mt-4 font-bold text-[#27272a]">Unable to load enquiries</p>

      <p className="mt-1 text-sm text-[#71717a]">
        The contact enquiry API could not be loaded.
      </p>

      <button
        type="button"
        onClick={onRetry}
        className="mt-5 rounded-xl bg-[#a51c30] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#8e1729]"
      >
        Try Again
      </button>
    </div>
  );
}

/* ================================================================
   DATE
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
