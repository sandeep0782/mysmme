"use client";

import React, { useState } from "react";
import {
  Search,
  UserRound,
  Mail,
  ShieldCheck,
  Loader2,
  UserPlus,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

type UserRole = "user" | "freelancer" | "seller" | "admin" | "super-admin";

type User = {
  _id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  profilePicture?: string;
  role: UserRole;
  isVerified?: boolean;
  isActive?: boolean;
  createdAt?: string;
};

const Page = () => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<User[]>([]);

  const [isSearching, setIsSearching] = useState(false);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  // ============================================================
  // SEARCH USERS
  // ============================================================

  const handleSearch = async () => {
    const value = search.trim();

    if (!value) {
      setError("Please enter name, email or user ID");
      setUsers([]);
      return;
    }

    try {
      setIsSearching(true);
      setError("");
      setMessage("");

      const searchUrl = `${API_URL}/admin/users/search?q=${encodeURIComponent(value)}`;

      console.log("SEARCH URL:", searchUrl);

      const res = await fetch(searchUrl, {
        method: "GET",
        credentials: "include",
      });

      const text = await res.text();

      let data: any;

      try {
        data = JSON.parse(text);
      } catch {
        setUsers([]);
        setError(`Server returned invalid response. Status: ${res.status}`);
        return;
      }

      if (!res.ok || data?.success === false) {
        setUsers([]);

        setError(
          data?.message || `Unable to search users. Status: ${res.status}`,
        );

        return;
      }

      const result = data?.data ?? data?.users ?? [];

      setUsers(Array.isArray(result) ? result : result ? [result] : []);
    } catch (err: any) {
      setUsers([]);

      setError(err?.message || "Unable to search users");
    } finally {
      setIsSearching(false);
    }
  };

  // ============================================================
  // UPGRADE TO FREELANCER
  // ============================================================

  const upgradeToFreelancer = async (userId: string) => {
    try {
      setUpdatingUserId(userId);
      setError("");
      setMessage("");

      const res = await fetch(`${API_URL}/admin/users/${userId}/role`, {
        method: "PATCH",

        credentials: "include",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          role: "freelancer",
        }),
      });

      const text = await res.text();

      let data: any;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(
          `Server returned invalid response. Status: ${res.status}`,
        );
      }

      if (!res.ok || data.success === false) {
        throw new Error(data.message || "Unable to update user role");
      }

      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user._id === userId
            ? {
                ...user,
                role: "freelancer",
              }
            : user,
        ),
      );

      setMessage("User successfully upgraded to freelancer.");
    } catch (err: any) {
      console.error("UPDATE ROLE ERROR:", err);

      setError(err.message || "Unable to update user role");
    } finally {
      setUpdatingUserId(null);
    }
  };

  // ============================================================
  // ROLE STYLE
  // ============================================================

  const getRoleStyle = (role: UserRole) => {
    switch (role) {
      case "admin":
        return "bg-purple-50 text-purple-700 border-purple-200";

      case "super-admin":
        return "bg-red-50 text-red-700 border-red-200";

      case "seller":
        return "bg-blue-50 text-blue-700 border-blue-200";

      case "freelancer":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";

      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="px-4 py-6 sm:px-6 lg:px-8">
        {/* HEADER */}

        <div className="mb-8">
          <div className="mb-2 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-blue-600" />

            <span className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              User Management
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Upgrade Freelancer
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Search registered users by name, email or user ID and upgrade
            approved users to freelancer accounts.
          </p>
        </div>

        {/* SEARCH */}

        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Search User
          </label>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                value={search}
                placeholder="Name, email or user ID..."
                onChange={(event) => setSearch(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleSearch();
                  }
                }}
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <button
              type="button"
              onClick={handleSearch}
              disabled={isSearching}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSearching ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  Search
                </>
              )}
            </button>
          </div>
        </div>

        {/* SUCCESS */}

        {message && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            <CheckCircle2 className="h-5 w-5" />
            {message}
          </div>
        )}

        {/* ERROR */}

        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle className="h-5 w-5" />
            {error}
          </div>
        )}

        {/* RESULTS */}

        {users.length > 0 && (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4">
              <h2 className="font-semibold text-slate-900">Search Results</h2>

              <p className="mt-1 text-sm text-slate-500">
                {users.length} {users.length === 1 ? "user" : "users"} found
              </p>
            </div>

            <div className="divide-y divide-slate-100">
              {users.map((user) => {
                const updating = updatingUserId === user._id;

                const protectedRole =
                  user.role === "admin" || user.role === "super-admin";

                return (
                  <div
                    key={user._id}
                    className="p-5 transition hover:bg-slate-50"
                  >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-100">
                          {user.profilePicture ? (
                            <img
                              src={user.profilePicture}
                              alt={user.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <UserRound className="h-6 w-6 text-slate-400" />
                          )}
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-semibold text-slate-900">
                              {user.name}
                            </h3>

                            <span
                              className={`rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${getRoleStyle(
                                user.role,
                              )}`}
                            >
                              {user.role}
                            </span>
                          </div>

                          <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                            <Mail className="h-4 w-4" />

                            <span>{user.email}</span>
                          </div>

                          {user.phoneNumber && (
                            <p className="mt-1 text-sm text-slate-500">
                              Phone: {user.phoneNumber}
                            </p>
                          )}

                          <p className="mt-2 font-mono text-xs text-slate-400">
                            ID: {user._id}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {user.role === "freelancer" ? (
                          <div className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700">
                            <CheckCircle2 className="h-4 w-4" />
                            Freelancer
                          </div>
                        ) : protectedRole ? (
                          <div className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-500">
                            <ShieldCheck className="h-4 w-4" />
                            Protected Role
                          </div>
                        ) : (
                          <button
                            type="button"
                            disabled={updating}
                            onClick={() => upgradeToFreelancer(user._id)}
                            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {updating ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Updating...
                              </>
                            ) : (
                              <>
                                <UserPlus className="h-4 w-4" />
                                Upgrade to Freelancer
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Page;
