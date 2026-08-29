"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useLoginMutation } from "@/store/api/userApi";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { authStatus } from "@/store/slice/userSlice";

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [login] = useLoginMutation();
  const dispatch = useDispatch();
  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginError },
  } = useForm<LoginFormData>();

  const onLogin = async (data: LoginFormData) => {
    setLoginLoading(true);

    try {
      const result = await login(data).unwrap();

      if (result.success) {
        const role = result.data.user.role;
        
        dispatch(authStatus());

        // Block normal users from this application
        if (role === "user") {
          toast.error("You are not authorized to access this portal.");
          return;
        }

        toast.success("Login Successful");

        if (role === "admin" || role === "super-admin") {
          window.location.href = `${process.env.NEXT_PUBLIC_ADMIN_URL}/platform/admin`;
          return;
        }

        if (role === "seller") {
          window.location.href = `${process.env.NEXT_PUBLIC_ADMIN_URL}/platform/seller`;
          return;
        }

        if (role === "freelancer") {
          window.location.href = `${process.env.NEXT_PUBLIC_ADMIN_URL}/platform/freelancer`;
          return;
        }
      }
    } catch (error: any) {
      console.log("LOGIN ERROR:", error);

      toast.error(
        error?.data?.message || "Something went wrong. Please try again.",
      );
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#fafafa]">
      <div className="flex min-h-screen">
        {/* ================================================================
            LEFT BRANDING PANEL
        ================================================================= */}

        <section className="relative hidden overflow-hidden bg-[#111111] lg:flex lg:w-1/2">
          <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-red-600/25 blur-[120px]" />
          <div className="absolute -bottom-48 -right-40 h-[600px] w-[600px] rounded-full bg-red-500/15 blur-[140px]" />
          <div className="absolute right-[-120px] top-[25%] h-[350px] w-[350px] rounded-full border border-red-500/10" />
          <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">
            {/* Logo */}
            <div>
              <Link
                href="/"
                className="inline-flex items-center gap-3 text-white"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-600 text-lg font-bold text-white shadow-lg shadow-red-600/30">
                  M
                </div>
                <span className="text-xl font-bold tracking-tight">MYSMME</span>
              </Link>
            </div>

            {/* Main branding content */}
            <div className="max-w-xl">
              {/* Badge */}
              <div className="mb-7 inline-flex items-center rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm text-red-300">
                <span className="mr-2 h-2 w-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
                Welcome back
              </div>

              {/* Heading */}
              <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-white xl:text-6xl">
                Everything you need.
                <br />
                <span className="text-red-500">All in one place.</span>
              </h1>

              <p className="mt-7 max-w-lg text-base leading-7 text-gray-400 xl:text-lg">
                Sign in to your account and continue managing your products,
                orders and business with Mysmme.
              </p>

              {/* Feature cards */}
              <div className="mt-10 grid max-w-lg grid-cols-3 gap-3">
                <div className="rounded-2xl border border-white/5 bg-white/[0.04] p-4 backdrop-blur">
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/10 text-red-400">
                    <ChartIcon />
                  </div>

                  <p className="text-sm font-semibold text-white">Manage</p>

                  <p className="mt-1 text-xs text-gray-500">Your business</p>
                </div>

                <div className="rounded-2xl border border-white/5 bg-white/[0.04] p-4 backdrop-blur">
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/10 text-red-400">
                    <BoxIcon />
                  </div>

                  <p className="text-sm font-semibold text-white">Products</p>

                  <p className="mt-1 text-xs text-gray-500">In one place</p>
                </div>

                <div className="rounded-2xl border border-white/5 bg-white/[0.04] p-4 backdrop-blur">
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/10 text-red-400">
                    <ShieldIcon />
                  </div>

                  <p className="text-sm font-semibold text-white">Secure</p>

                  <p className="mt-1 text-xs text-gray-500">Always protected</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>© 2026 Mysmme</span>

              <div className="flex gap-5">
                <Link
                  href="/privacy"
                  className="transition hover:text-gray-300"
                >
                  Privacy
                </Link>

                <Link href="/terms" className="transition hover:text-gray-300">
                  Terms
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================
            LOGIN SECTION
        ================================================================= */}

        <section className="flex w-full items-center justify-center px-5 py-10 sm:px-8 lg:w-1/2">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="mb-10 flex justify-center lg:hidden">
              <Link href="/" className="flex items-center gap-3 text-gray-900">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-600 text-lg font-bold text-white shadow-lg shadow-red-600/20">
                  S
                </div>

                <span className="text-xl font-bold">Mysmme</span>
              </Link>
            </div>

            {/* Header */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                Sign in
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Enter your details below to access your account.
              </p>
            </div>

            {/* ============================================================
                SOCIAL LOGIN
            ============================================================= */}

            <div className="flex justify-center">
              <button
                type="button"
                className="mx-auto flex h-12 w-full max-w-sm items-center justify-center gap-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm active:scale-[0.98] cursor-pointer"
              >
                <GoogleIcon />
                Continue with Google
              </button>
            </div>

            {/* Divider */}
            <div className="my-7 flex items-center gap-4">
              <div className="h-px flex-1 bg-gray-200" />

              <span className="text-[11px] font-medium uppercase tracking-widest text-gray-400">
                Or
              </span>

              <div className="h-px flex-1 bg-gray-200" />
            </div>

            {/* ============================================================
                LOGIN FORM
            ============================================================= */}

            <form onSubmit={handleLoginSubmit(onLogin)} className="space-y-5">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Email address
                </label>

                <div className="relative">
                  <MailIcon />

                  <input
                    {...registerLogin("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^\S+@\S+\.\S+$/,
                        message: "Please enter a valid email",
                      },
                    })}
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 hover:border-gray-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                  />
                </div>
                {loginError.email && (
                  <p className="mt-1 text-sm text-red-500">
                    {loginError.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Password
                  </label>

                  <Link
                    href="/forgot-password"
                    className="text-sm font-semibold text-red-600 transition hover:text-red-700"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="relative">
                  <LockIcon />

                  <input
                    {...registerLogin("password", {
                      required: "Password is required",
                    })}
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-12 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 hover:border-gray-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-gray-400 transition hover:bg-red-50 hover:text-red-600"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                  {loginError.password && (
                    <p className="mt-1 text-sm text-red-500">
                      {loginError.password.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Remember */}
              <div className="flex items-center">
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    name="remember"
                    className="h-4 w-4 rounded border-gray-300 text-red-600 accent-red-600 focus:ring-red-500"
                  />

                  <span className="text-sm text-gray-600">Remember me</span>
                </label>
              </div>
              {/* Submit */}
              <button
                type="submit"
                disabled={loginLoading}
                className="group relative flex h-12 w-full items-center justify-center overflow-hidden rounded-xl bg-red-600 text-sm font-bold text-white shadow-lg shadow-red-600/20 transition-all hover:bg-red-700 hover:shadow-xl hover:shadow-red-600/25 focus:outline-none focus:ring-4 focus:ring-red-500/20 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:bg-red-600 cursor-pointer"
              >
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                <span className="relative flex items-center gap-2">
                  {loginLoading && (
                    <svg
                      className="h-4 w-4 animate-spin "
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="9"
                        className="opacity-25"
                        stroke="currentColor"
                        strokeWidth="3"
                      />

                      <path
                        d="M21 12a9 9 0 0 0-9-9"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    </svg>
                  )}

                  {loginLoading ? "Signing in..." : "Sign in"}
                </span>
              </button>
            </form>

            {/* Register */}
            <p className="mt-8 text-center text-sm text-gray-500">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/register"
                className="font-bold text-red-600 transition hover:text-red-700"
              >
                Create an account
              </Link>
            </p>

            {/* Security */}
            <div className="mt-8 flex items-center justify-center gap-2 text-xs text-gray-400">
              <ShieldIcon />

              <span>Your information is securely encrypted</span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

/* ==========================================================================
   ICONS
============================================================================ */

function MailIcon() {
  return (
    <svg
      className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect x="4" y="10" width="16" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="m3 3 18 18" />
      <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
      <path d="M9.9 5.2A9.7 9.7 0 0 1 12 5c6.5 0 10 7 10 7a18.3 18.3 0 0 1-3.2 4.2" />
      <path d="M6.6 6.6C3.7 8.6 2 12 2 12s3.5 7 10 7c1.7 0 3.2-.4 4.5-1" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M12 3 20 6v5c0 5.2-3.4 8.7-8 10-4.6-1.3-8-4.8-8-10V6l8-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M4 19V9" />
      <path d="M10 19V5" />
      <path d="M16 19v-7" />
      <path d="M22 19V3" />
    </svg>
  );
}

function BoxIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="m12 3 9 5-9 5-9-5 9-5Z" />
      <path d="m3 8 9 5 9-5" />
      <path d="M3 8v9l9 5 9-5V8" />
      <path d="M12 13v9" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M21.35 12.23c0-.72-.06-1.42-.18-2.09H12v3.95h5.23a4.47 4.47 0 0 1-1.94 2.93v2.44h3.14c1.84-1.69 2.92-4.18 2.92-7.23Z"
      />
      <path
        fill="#34A853"
        d="M12 21.5c2.63 0 4.84-.87 6.45-2.34l-3.14-2.44c-.87.58-1.98.93-3.31.93-2.54 0-4.69-1.72-5.46-4.03H3.3v2.52A9.74 9.74 0 0 0 12 21.5Z"
      />
      <path
        fill="#FBBC05"
        d="M6.54 13.62A5.86 5.86 0 0 1 6.23 12c0-.56.1-1.1.31-1.62V7.86H3.3A9.74 9.74 0 0 0 2.25 12c0 1.57.38 3.06 1.05 4.14l3.24-2.52Z"
      />
      <path
        fill="#EA4335"
        d="M12 6.35c1.43 0 2.71.49 3.72 1.46l2.79-2.79C16.83 3.47 14.63 2.5 12 2.5a9.74 9.74 0 0 0-8.7 5.36l3.24 2.52C7.31 8.07 9.46 6.35 12 6.35Z"
      />
    </svg>
  );
}
