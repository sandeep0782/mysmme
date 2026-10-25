"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, LockKeyhole } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim()) return;

    setLoading(true);
    setMessage("");

    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to process request");
      }

      setMessage(
        "If this email is registered, you will receive a password reset link shortly.",
      );
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
          <LockKeyhole size={26} />
        </div>

        <h1 className="text-2xl font-bold text-slate-900">Forgot Password?</h1>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Enter your registered email address to request a password reset link.
        </p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Email Address
            </label>

            <div className="relative">
              <Mail
                size={18}
                className="absolute left-3 top-3 text-slate-400"
              />

              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-rose-500"
              />
            </div>
          </div>

          {message && (
            <p
              role="status"
              className="rounded-lg bg-slate-100 p-3 text-sm text-slate-700"
            >
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:opacity-50"
          >
            {loading ? "Please wait..." : "Request Reset Link"}
          </button>
        </form>

        <Link
          href="/auth/login"
          className="mt-6 flex items-center justify-center gap-2 text-sm font-medium text-rose-600 hover:text-rose-700"
        >
          <ArrowLeft size={16} />
          Back to Login
        </Link>
      </div>
    </div>
  );
}
