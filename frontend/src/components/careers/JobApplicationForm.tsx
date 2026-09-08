"use client";

import {
  AlertCircle,
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  FileText,
  Link2,
  Loader2,
  Upload,
  User,
  X,
} from "lucide-react";
import { ChangeEvent, FormEvent, useRef, useState } from "react";

/* ================================================================
   TYPES
================================================================ */

type Role = {
  title: string;
  type: string;
};

type Roles = Record<string, Role>;

type JobApplicationFormProps = {
  roles: Roles;
  selectedRole?: string;
};

type FormData = {
  role: string;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  experience: string;
  workStatus: string;
  linkedin: string;
  portfolio: string;
  message: string;
  consent: boolean;
};

type FormErrors = Partial<Record<keyof FormData | "resume", string>>;

/* ================================================================
   CONSTANTS
================================================================ */

const EXPERIENCE_OPTIONS = [
  "Fresher / Less than 1 year",
  "1-2 years",
  "3-5 years",
  "5-8 years",
  "8+ years",
];

const WORK_STATUS_OPTIONS = [
  "Employed",
  "Self-employed",
  "Freelancer",
  "Student",
  "Not currently working",
  "Other",
];

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const ACCEPTED_EXTENSIONS = [".pdf", ".doc", ".docx"];

/* ================================================================
   COMPONENT
================================================================ */

export default function JobApplicationForm({
  roles,
  selectedRole = "",
}: JobApplicationFormProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [formData, setFormData] = useState<FormData>({
    role: selectedRole,
    fullName: "",
    email: "",
    phone: "",
    location: "",
    experience: "",
    workStatus: "",
    linkedin: "",
    portfolio: "",
    message: "",
    consent: false,
  });

  const [resume, setResume] = useState<File | null>(null);

  const [errors, setErrors] = useState<FormErrors>({});

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  /* ==============================================================
     INPUT CHANGE
  ============================================================== */

  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = event.target;

    const nextValue =
      event.target instanceof HTMLInputElement &&
      event.target.type === "checkbox"
        ? event.target.checked
        : value;

    setFormData((current) => ({
      ...current,
      [name]: nextValue,
    }));

    setErrors((current) => ({
      ...current,
      [name]: undefined,
    }));

    setSubmitMessage(null);
  };

  /* ==============================================================
     RESUME
  ============================================================== */

  const handleResumeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setSubmitMessage(null);

    const fileName = file.name.toLowerCase();

    const hasValidExtension = ACCEPTED_EXTENSIONS.some((extension) =>
      fileName.endsWith(extension),
    );

    const hasValidMimeType =
      !file.type || ACCEPTED_FILE_TYPES.includes(file.type);

    if (!hasValidExtension || !hasValidMimeType) {
      setResume(null);

      setErrors((current) => ({
        ...current,
        resume: "Please upload a PDF, DOC or DOCX file.",
      }));

      event.target.value = "";

      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setResume(null);

      setErrors((current) => ({
        ...current,
        resume: "Resume must be smaller than 5 MB.",
      }));

      event.target.value = "";

      return;
    }

    setResume(file);

    setErrors((current) => ({
      ...current,
      resume: undefined,
    }));
  };

  const removeResume = () => {
    setResume(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setErrors((current) => ({
      ...current,
      resume: undefined,
    }));
  };

  /* ==============================================================
     VALIDATION
  ============================================================== */

  const validateForm = () => {
    const nextErrors: FormErrors = {};

    if (!formData.role) {
      nextErrors.role = "Please select a position.";
    }

    if (!formData.fullName.trim()) {
      nextErrors.fullName = "Please enter your full name.";
    }

    if (!formData.email.trim()) {
      nextErrors.email = "Please enter your email address.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (!formData.phone.trim()) {
      nextErrors.phone = "Please enter your phone number.";
    } else {
      const digits = formData.phone.replace(/\D/g, "");

      if (digits.length < 10 || digits.length > 15) {
        nextErrors.phone = "Please enter a valid phone number.";
      }
    }

    if (!formData.location.trim()) {
      nextErrors.location = "Please enter your current location.";
    }

    if (!formData.experience) {
      nextErrors.experience = "Please select your experience.";
    }

    if (!formData.workStatus) {
      nextErrors.workStatus = "Please select your work status.";
    }

    if (formData.linkedin && !isValidUrl(formData.linkedin)) {
      nextErrors.linkedin = "Please enter a valid LinkedIn URL.";
    }

    if (formData.portfolio && !isValidUrl(formData.portfolio)) {
      nextErrors.portfolio = "Please enter a valid portfolio or GitHub URL.";
    }

    if (!resume) {
      nextErrors.resume = "Please upload your resume.";
    }

    if (!formData.message.trim()) {
      nextErrors.message = "Please tell us a little about yourself.";
    } else if (formData.message.trim().length < 30) {
      nextErrors.message = "Please write at least 30 characters.";
    }

    if (!formData.consent) {
      nextErrors.consent = "Please agree before submitting your application.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  /* ==============================================================
     SUBMIT
  ============================================================== */

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSubmitMessage(null);

    if (!validateForm()) {
      return;
    }

    if (!resume) {
      return;
    }

    setIsSubmitting(true);

    try {
      /*
       * ============================================================
       * BACKEND CONNECTION
       * ============================================================
       *
       * We will replace this block with the real MYSMME careers API.
       *
       * Example payload:
       *
       * const payload = new FormData();
       *
       * payload.append("role", formData.role);
       * payload.append("fullName", formData.fullName);
       * payload.append("email", formData.email);
       * payload.append("phone", formData.phone);
       * payload.append("location", formData.location);
       * payload.append("experience", formData.experience);
       * payload.append("workStatus", formData.workStatus);
       * payload.append("linkedin", formData.linkedin);
       * payload.append("portfolio", formData.portfolio);
       * payload.append("message", formData.message);
       * payload.append("resume", resume);
       *
       * const response = await fetch(
       *   `${process.env.NEXT_PUBLIC_API_URL}/careers/applications`,
       *   {
       *     method: "POST",
       *     body: payload,
       *   },
       * );
       *
       * if (!response.ok) {
       *   throw new Error("Unable to submit application.");
       * }
       */

      setSubmitMessage(
        "The application form is ready, but the careers API still needs to be connected before applications can be submitted.",
      );
    } catch (error) {
      console.error("Job application error:", error);

      setSubmitMessage(
        "We couldn't submit your application. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ==============================================================
     RENDER
  ============================================================== */

  return (
    <div className="overflow-hidden rounded-[2rem] border border-[#eadfd6] bg-white shadow-xl shadow-[#6d4535]/5">
      {/* ============================================================
          FORM HEADER
      ============================================================ */}

      <div className="border-b border-gray-100 px-6 py-6 sm:px-8">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
            <BriefcaseBusiness className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-xl font-extrabold text-gray-950">
              Job Application
            </h2>

            <p className="mt-1 text-xs leading-5 text-gray-500">
              Fields marked with{" "}
              <span className="font-bold text-red-500">*</span> are required.
            </p>
          </div>
        </div>
      </div>

      {/* ============================================================
          FORM
      ============================================================ */}

      <form onSubmit={handleSubmit} noValidate className="space-y-8 p-6 sm:p-8">
        {/* ==========================================================
            POSITION
        ========================================================== */}

        <FormSection
          icon={<BriefcaseBusiness className="h-4 w-4" />}
          title="Position"
        >
          <FormField
            label="Position you're applying for"
            required
            error={errors.role}
          >
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className={selectClass(Boolean(errors.role))}
            >
              <option value="">Select a position</option>

              {Object.entries(roles).map(([key, role]) => (
                <option key={key} value={key}>
                  {role.title} — {role.type}
                </option>
              ))}
            </select>
          </FormField>
        </FormSection>

        {/* ==========================================================
            PERSONAL DETAILS
        ========================================================== */}

        <FormSection
          icon={<User className="h-4 w-4" />}
          title="Personal Details"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label="Full Name" required error={errors.fullName}>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Your full name"
                autoComplete="name"
                className={inputClass(Boolean(errors.fullName))}
              />
            </FormField>

            <FormField label="Email Address" required error={errors.email}>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
                className={inputClass(Boolean(errors.email))}
              />
            </FormField>

            <FormField label="Phone Number" required error={errors.phone}>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                autoComplete="tel"
                className={inputClass(Boolean(errors.phone))}
              />
            </FormField>

            <FormField
              label="Current Location"
              required
              error={errors.location}
            >
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="City, State"
                autoComplete="address-level2"
                className={inputClass(Boolean(errors.location))}
              />
            </FormField>
          </div>
        </FormSection>

        {/* ==========================================================
            PROFESSIONAL DETAILS
        ========================================================== */}

        <FormSection
          icon={<BriefcaseBusiness className="h-4 w-4" />}
          title="Professional Details"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label="Experience" required error={errors.experience}>
              <select
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className={selectClass(Boolean(errors.experience))}
              >
                <option value="">Select experience</option>

                {EXPERIENCE_OPTIONS.map((experience) => (
                  <option key={experience} value={experience}>
                    {experience}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField
              label="Current Work Status"
              required
              error={errors.workStatus}
            >
              <select
                name="workStatus"
                value={formData.workStatus}
                onChange={handleChange}
                className={selectClass(Boolean(errors.workStatus))}
              >
                <option value="">Select work status</option>

                {WORK_STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </FormField>
          </div>
        </FormSection>

        {/* ==========================================================
            PROFESSIONAL LINKS
        ========================================================== */}

        <FormSection
          icon={<Link2 className="h-4 w-4" />}
          title="Professional Links"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label="LinkedIn" error={errors.linkedin}>
              <input
                type="url"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/..."
                className={inputClass(Boolean(errors.linkedin))}
              />
            </FormField>

            <FormField label="Portfolio / GitHub" error={errors.portfolio}>
              <input
                type="url"
                name="portfolio"
                value={formData.portfolio}
                onChange={handleChange}
                placeholder="https://github.com/..."
                className={inputClass(Boolean(errors.portfolio))}
              />
            </FormField>
          </div>
        </FormSection>

        {/* ==========================================================
            RESUME
        ========================================================== */}

        <FormSection icon={<FileText className="h-4 w-4" />} title="Resume">
          <FormField label="Resume / CV" required error={errors.resume}>
            {!resume ? (
              <label
                className={`
                  group
                  flex
                  cursor-pointer
                  flex-col
                  items-center
                  justify-center
                  rounded-2xl
                  border-2
                  border-dashed
                  px-6
                  py-9
                  text-center
                  transition
                  ${
                    errors.resume
                      ? "border-red-300 bg-red-50/40"
                      : "border-gray-200 bg-gray-50/50 hover:border-red-300 hover:bg-red-50/30"
                  }
                `}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-red-600 shadow-sm transition group-hover:-translate-y-0.5">
                  <Upload className="h-5 w-5" />
                </div>

                <p className="mt-4 text-sm font-bold text-gray-800">
                  Upload your resume
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  PDF, DOC or DOCX · Maximum 5 MB
                </p>

                <span className="mt-4 rounded-full bg-red-600 px-5 py-2 text-xs font-bold text-white transition group-hover:bg-red-700">
                  Choose File
                </span>

                <input
                  ref={fileInputRef}
                  type="file"
                  name="resume"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeChange}
                  className="sr-only"
                />
              </label>
            ) : (
              <div className="flex items-center gap-4 rounded-2xl border border-green-200 bg-green-50/50 p-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-green-600 shadow-sm">
                  <FileText className="h-5 w-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-green-600" />

                    <p className="truncate text-sm font-bold text-gray-800">
                      {resume.name}
                    </p>
                  </div>

                  <p className="mt-1 text-xs text-gray-400">
                    {formatFileSize(resume.size)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={removeResume}
                  aria-label="Remove resume"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-400 transition hover:bg-red-50 hover:text-red-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </FormField>
        </FormSection>

        {/* ==========================================================
            ABOUT YOU
        ========================================================== */}

        <FormSection icon={<User className="h-4 w-4" />} title="About You">
          <FormField
            label="Tell us about yourself"
            required
            error={errors.message}
          >
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={6}
              maxLength={2000}
              placeholder="Tell us about your experience, what you're good at and why you'd like to work with MYSMME..."
              className={`${inputClass(
                Boolean(errors.message),
              )} min-h-[150px] resize-y py-3`}
            />

            <div className="mt-2 flex justify-end">
              <span className="text-[10px] text-gray-400">
                {formData.message.length} / 2000
              </span>
            </div>
          </FormField>
        </FormSection>

        {/* ==========================================================
            CONSENT
        ========================================================== */}

        <div>
          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-100 bg-gray-50/60 p-4">
            <input
              type="checkbox"
              name="consent"
              checked={formData.consent}
              onChange={handleChange}
              className="mt-0.5 h-4 w-4 shrink-0 accent-red-600"
            />

            <span className="text-xs leading-6 text-gray-500">
              I agree that MYSMME may use the information provided in this
              application for recruitment and evaluating my application.
              <span className="font-bold text-red-500"> *</span>
            </span>
          </label>

          {errors.consent && <ErrorMessage message={errors.consent} />}
        </div>

        {/* ==========================================================
            SUBMIT MESSAGE
        ========================================================== */}

        {submitMessage && (
          <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />

            <p className="text-xs leading-6 text-amber-800">{submitMessage}</p>
          </div>
        )}

        {/* ==========================================================
            SUBMIT
        ========================================================== */}

        <div className="border-t border-gray-100 pt-7">
          <button
            type="submit"
            disabled={isSubmitting}
            className="
              group
              inline-flex
              w-full
              items-center
              justify-center
              gap-2
              rounded-full
              bg-red-600
              px-7
              py-3.5
              text-sm
              font-bold
              text-white
              shadow-lg
              shadow-red-600/15
              transition
              hover:bg-red-700
              disabled:cursor-not-allowed
              disabled:opacity-60
              sm:w-auto
            "
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                Submit Application
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>

          <p className="mt-3 text-[10px] leading-5 text-gray-400">
            Please review your information before submitting your application.
          </p>
        </div>
      </form>
    </div>
  );
}

/* ================================================================
   FORM SECTION
================================================================ */

function FormSection({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-5 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-600">
          {icon}
        </span>

        <h3 className="text-sm font-extrabold text-gray-900">{title}</h3>
      </div>

      {children}
    </section>
  );
}

/* ================================================================
   FORM FIELD
================================================================ */

function FormField({
  label,
  required = false,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-bold text-gray-700">
        {label}

        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      {children}

      {error && <ErrorMessage message={error} />}
    </div>
  );
}

/* ================================================================
   ERROR
================================================================ */

function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="mt-2 flex items-start gap-1.5">
      <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-500" />

      <p className="text-xs leading-5 text-red-600">{message}</p>
    </div>
  );
}

/* ================================================================
   STYLES
================================================================ */

function inputClass(hasError: boolean) {
  return `
    h-11
    w-full
    rounded-xl
    border
    bg-white
    px-4
    text-sm
    text-gray-800
    outline-none
    transition
    placeholder:text-gray-300
    ${
      hasError
        ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
        : "border-gray-200 focus:border-red-400 focus:ring-4 focus:ring-red-500/10"
    }
  `;
}

function selectClass(hasError: boolean) {
  return `
    h-11
    w-full
    cursor-pointer
    rounded-xl
    border
    bg-white
    px-4
    text-sm
    text-gray-700
    outline-none
    transition
    ${
      hasError
        ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
        : "border-gray-200 focus:border-red-400 focus:ring-4 focus:ring-red-500/10"
    }
  `;
}

/* ================================================================
   HELPERS
================================================================ */

function isValidUrl(value: string) {
  try {
    const url = new URL(value);

    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
