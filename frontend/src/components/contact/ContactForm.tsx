"use client";

import { FormEvent, useState } from "react";

import { CheckCircle2, Loader2, Mail, Send, XCircle } from "lucide-react";

import {
  useCreateContactInquiryMutation,
  type ContactInquiryType,
  type ContactPayload,
} from "@/store/api/contactApi";

/* ================================================================
   TYPES
================================================================ */

type FormStatus = "idle" | "success" | "error";

/* ================================================================
   COMPONENT
================================================================ */

export default function ContactForm() {
  const [status, setStatus] = useState<FormStatus>("idle");

  const [errorMessage, setErrorMessage] = useState("");

  const [createContactInquiry, { isLoading }] =
    useCreateContactInquiryMutation();

  /* ================================================================
     SUBMIT
  ================================================================ */

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isLoading) {
      return;
    }

    setStatus("idle");
    setErrorMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload: ContactPayload = {
      name: String(formData.get("name") || "").trim(),

      email: String(formData.get("email") || "")
        .trim()
        .toLowerCase(),

      phone: String(formData.get("phone") || "").trim(),

      type: String(formData.get("type") || "") as ContactInquiryType,

      reference: String(formData.get("reference") || "").trim(),

      subject: String(formData.get("subject") || "").trim(),

      message: String(formData.get("message") || "").trim(),

      consent: formData.get("consent") === "on",

      website: String(formData.get("website") || "").trim(),
    };

    const result = await createContactInquiry(payload);

    console.log("CONTACT MUTATION RESULT:", result);

    /* =============================================================
     ERROR
  ============================================================= */

    if ("error" in result) {
      const err = result.error as {
        status?: number | string;
        data?: unknown;
        error?: string;
        originalStatus?: number;
      };

      console.log("CONTACT ERROR STATUS:", err.status);
      console.log("CONTACT ERROR MESSAGE:", err.error);
      console.log("CONTACT ERROR DATA:", err.data);
      console.log("CONTACT ORIGINAL STATUS:", err.originalStatus);

      setStatus("error");

      if (
        typeof err.data === "object" &&
        err.data !== null &&
        "message" in err.data &&
        typeof (err.data as { message?: unknown }).message === "string"
      ) {
        setErrorMessage((err.data as { message: string }).message);
        return;
      }

      if (typeof err.data === "string" && err.data.trim()) {
        setErrorMessage(err.data);
        return;
      }

      if (err.status === "FETCH_ERROR") {
        setErrorMessage(err.error || "Could not connect to the MYSMME API.");
        return;
      }

      if (err.status === "PARSING_ERROR") {
        setErrorMessage(
          `API returned a non-JSON response${
            err.originalStatus ? ` (${err.originalStatus})` : ""
          }.`,
        );
        return;
      }

      if (err.status === 404) {
        setErrorMessage("Contact API route was not found.");
        return;
      }

      if (err.status === 500) {
        setErrorMessage("Server error while submitting the enquiry.");
        return;
      }

      if (err.status) {
        setErrorMessage(`Request failed with status ${err.status}.`);
        return;
      }

      setErrorMessage("Unable to send your message. Please try again.");

      return;
    }
    /* =============================================================
     SUCCESS
  ============================================================= */

    console.log("CONTACT SUCCESS:", result.data);

    setStatus("success");

    form.reset();
  };

  /* ================================================================
     UI
  ================================================================ */

  return (
    <div className="relative">
      <div className="absolute -inset-5 rounded-[2.5rem] bg-[#c99a45]/10 blur-2xl" />

      <div className="relative rounded-[2rem] border border-[#eadfd6] bg-white p-6 shadow-2xl shadow-[#6f5145]/10 sm:p-8 lg:p-10">
        {/* =========================================================
            HEADER
        ========================================================= */}

        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#a51c30] text-white shadow-lg shadow-[#a51c30]/20">
            <Mail className="h-5 w-5" />
          </div>

          <div>
            <p className="text-xl font-extrabold text-[#241b18] sm:text-2xl">
              Send us a message
            </p>

            <p className="mt-1 text-sm leading-6 text-[#756860]">
              Fill in the details below and tell us how we can help.
            </p>
          </div>
        </div>

        {/* =========================================================
            SUCCESS
        ========================================================= */}

        {status === "success" && (
          <div
            role="status"
            className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-5"
          >
            <div className="flex gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />

              <div>
                <p className="font-bold text-emerald-900">Message received</p>

                <p className="mt-1 text-sm leading-6 text-emerald-800">
                  Thank you for contacting MYSMME. Your enquiry has been
                  submitted successfully.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            ERROR
        ========================================================= */}

        {status === "error" && (
          <div
            role="alert"
            className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5"
          >
            <div className="flex gap-3">
              <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

              <div>
                <p className="font-bold text-red-900">Message not sent</p>

                <p className="mt-1 text-sm leading-6 text-red-800">
                  {errorMessage}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            FORM
        ========================================================= */}

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {/* HONEYPOT */}

          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="hidden"
          />

          {/* =======================================================
              NAME + EMAIL
          ======================================================= */}

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              label="Full Name"
              name="name"
              placeholder="Enter your full name"
              type="text"
              autoComplete="name"
              required
              maxLength={120}
              disabled={isLoading}
            />

            <FormField
              label="Email Address"
              name="email"
              placeholder="Enter your email"
              type="email"
              autoComplete="email"
              required
              maxLength={180}
              disabled={isLoading}
            />
          </div>

          {/* =======================================================
              PHONE + ENQUIRY TYPE
          ======================================================= */}

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              label="Phone Number"
              name="phone"
              placeholder="Enter phone number"
              type="tel"
              autoComplete="tel"
              maxLength={30}
              disabled={isLoading}
            />

            <div>
              <label
                htmlFor="type"
                className="mb-2 block text-sm font-bold text-[#3c302b]"
              >
                Enquiry Type
                <span className="ml-1 text-[#a51c30]">*</span>
              </label>

              <select
                id="type"
                name="type"
                required
                defaultValue=""
                disabled={isLoading}
                className="h-[50px] w-full rounded-xl border border-[#dfd2ca] bg-[#fffdfb] px-4 text-sm text-[#443732] outline-none transition focus:border-[#a51c30] focus:ring-4 focus:ring-[#a51c30]/5 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <option value="" disabled>
                  Select enquiry type
                </option>

                <option value="customer-support">Customer Support</option>

                <option value="order-support">Order Support</option>

                <option value="seller-support">Seller Support</option>

                <option value="catalogue-support">Catalogue Support</option>

                <option value="business">Business & Partnerships</option>

                <option value="technical">Technical Support</option>

                <option value="feedback">Feedback & Suggestions</option>

                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* =======================================================
              REFERENCE
          ======================================================= */}

          <div>
            <label
              htmlFor="reference"
              className="mb-2 block text-sm font-bold text-[#3c302b]"
            >
              Order / Seller / Reference ID
              <span className="ml-1 font-normal text-[#998b84]">
                (optional)
              </span>
            </label>

            <input
              id="reference"
              name="reference"
              type="text"
              maxLength={150}
              disabled={isLoading}
              placeholder="Example: Order number or Seller ID"
              className="h-[50px] w-full rounded-xl border border-[#dfd2ca] bg-[#fffdfb] px-4 text-sm text-[#443732] outline-none transition placeholder:text-[#aa9d96] focus:border-[#a51c30] focus:ring-4 focus:ring-[#a51c30]/5 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          {/* =======================================================
              SUBJECT
          ======================================================= */}

          <FormField
            label="Subject"
            name="subject"
            placeholder="Briefly describe your enquiry"
            type="text"
            required
            maxLength={250}
            disabled={isLoading}
          />

          {/* =======================================================
              MESSAGE
          ======================================================= */}

          <div>
            <label
              htmlFor="message"
              className="mb-2 block text-sm font-bold text-[#3c302b]"
            >
              Message
              <span className="ml-1 text-[#a51c30]">*</span>
            </label>

            <textarea
              id="message"
              name="message"
              required
              minLength={10}
              maxLength={5000}
              rows={7}
              disabled={isLoading}
              placeholder="Please provide details about your question or issue..."
              className="w-full resize-none rounded-xl border border-[#dfd2ca] bg-[#fffdfb] px-4 py-3.5 text-sm leading-6 text-[#443732] outline-none transition placeholder:text-[#aa9d96] focus:border-[#a51c30] focus:ring-4 focus:ring-[#a51c30]/5 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          {/* =======================================================
              CONSENT
          ======================================================= */}

          <div className="flex items-start gap-3 rounded-xl bg-[#fbf4ef] p-4">
            <input
              id="consent"
              name="consent"
              type="checkbox"
              required
              disabled={isLoading}
              className="mt-1 h-4 w-4 rounded border-[#ccbcb3] accent-[#a51c30] disabled:cursor-not-allowed disabled:opacity-60"
            />

            <label
              htmlFor="consent"
              className="text-xs leading-5 text-[#756860]"
            >
              I understand that MYSMME may use the information provided here to
              respond to my enquiry.
            </label>
          </div>

          {/* =======================================================
              SUBMIT
          ======================================================= */}

          <button
            type="submit"
            disabled={isLoading}
            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#a51c30] px-6 py-4 text-sm font-bold text-white shadow-xl shadow-[#a51c30]/20 transition-all hover:-translate-y-0.5 hover:bg-[#8e1729] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                Send Message
                <Send className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>

          <p className="text-center text-[11px] leading-5 text-[#998b84]">
            Please do not share passwords, OTPs, card PINs, or other sensitive
            financial information.
          </p>
        </form>
      </div>
    </div>
  );
}

/* ================================================================
   FORM FIELD
================================================================ */

function FormField({
  label,
  name,
  type,
  placeholder,
  required = false,
  maxLength,
  autoComplete,
  disabled = false,
}: {
  label: string;
  name: string;
  type: string;
  placeholder: string;
  required?: boolean;
  maxLength?: number;
  autoComplete?: string;
  disabled?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-bold text-[#3c302b]"
      >
        {label}

        {required && <span className="ml-1 text-[#a51c30]">*</span>}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        required={required}
        maxLength={maxLength}
        autoComplete={autoComplete}
        disabled={disabled}
        placeholder={placeholder}
        className="h-[50px] w-full rounded-xl border border-[#dfd2ca] bg-[#fffdfb] px-4 text-sm text-[#443732] outline-none transition placeholder:text-[#aa9d96] focus:border-[#a51c30] focus:ring-4 focus:ring-[#a51c30]/5 disabled:cursor-not-allowed disabled:opacity-60"
      />
    </div>
  );
}

/* ================================================================
   API ERROR MESSAGE
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

  return "Unable to send your message. Please try again.";
}
