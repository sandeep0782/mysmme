"use client";

import React, { useState } from "react";
import * as XLSX from "xlsx";
import {
  FileSpreadsheet,
  Upload,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { toast } from "react-hot-toast";

type ExcelRow = Record<string, any>;

type UserRow = {
  name: string;
  email: string;
  phone: string;
  role: string;
  isActive: boolean;
};

const Page = () => {
  const [file, setFile] = useState<File | null>(null);
  const [rows, setRows] = useState<ExcelRow[]>([]);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // ============================================================
  // READ EXCEL FILE
  // ============================================================

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    setFile(selectedFile);
    setRows([]);
    setUsers([]);
    setColumns([]);

    try {
      setLoading(true);

      const fileName = selectedFile.name.toLowerCase();

      const allowedExtensions = [".xlsx", ".xls", ".csv"];

      const isValidFile = allowedExtensions.some((extension) =>
        fileName.endsWith(extension),
      );

      if (!isValidFile) {
        toast.error("Please select an Excel or CSV file.");
        return;
      }

      // Read file
      const arrayBuffer = await selectedFile.arrayBuffer();

      // XLSX can read xlsx, xls and csv
      const workbook = XLSX.read(arrayBuffer, {
        type: "array",
      });

      // First sheet
      const firstSheetName = workbook.SheetNames[0];

      if (!firstSheetName) {
        toast.error("No worksheet found in the file.");
        return;
      }

      const worksheet = workbook.Sheets[firstSheetName];

      // Convert worksheet to JSON
      const jsonData: ExcelRow[] = XLSX.utils.sheet_to_json(worksheet, {
        defval: "",
        raw: false,
      });

      if (jsonData.length === 0) {
        toast.error("The Excel file is empty.");
        return;
      }

      // Get column names
      const detectedColumns = Object.keys(jsonData[0]);

      setColumns(detectedColumns);
      setRows(jsonData);

      // Convert Excel rows to your user structure
      const convertedUsers: UserRow[] = jsonData.map((row) => {
        const getValue = (possibleNames: string[]) => {
          const key = Object.keys(row).find((column) =>
            possibleNames.includes(
              column.toLowerCase().trim().replace(/\s+/g, "").replace(/_/g, ""),
            ),
          );

          return key ? String(row[key] ?? "").trim() : "";
        };

        const name = getValue(["name", "fullname", "username", "contactname"]);

        const email = getValue(["email", "emailaddress", "mail"]);

        const phone = getValue([
          "phone",
          "phonenumber",
          "mobilenumber",
          "mobile",
          "contact",
        ]);

        const role = getValue(["role"]) || "user";

        const activeValue = getValue([
          "isactive",
          "active",
          "status",
        ]).toLowerCase();

        const isActive =
          activeValue === ""
            ? true
            : !["false", "inactive", "0", "no", "disabled"].includes(
                activeValue,
              );

        return {
          name,
          email,
          phone,
          role,
          isActive,
        };
      });

      setUsers(convertedUsers);

      toast.success(
        `${jsonData.length} row${jsonData.length === 1 ? "" : "s"} loaded`,
      );
    } catch (error) {
      console.error("Excel import error:", error);
      toast.error("Failed to read Excel file.");
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // CLEAR FILE
  // ============================================================

  const clearFile = () => {
    setFile(null);
    setRows([]);
    setUsers([]);
    setColumns([]);
  };

  // ============================================================
  // IMPORT USERS
  // ============================================================

  const importUsers = async () => {
    if (users.length === 0) {
      toast.error("No users available to import.");
      return;
    }

    try {
      setLoading(true);

      console.log("Users ready for import:", users);

      /*
       * NEXT STEP:
       *
       * Send users to your backend.
       *
       * Example:
       *
       * const response = await fetch(
       *   `${process.env.NEXT_PUBLIC_API_URL}/api/users/import`,
       *   {
       *     method: "POST",
       *     headers: {
       *       "Content-Type": "application/json",
       *     },
       *     credentials: "include",
       *     body: JSON.stringify({
       *       users,
       *     }),
       *   },
       * );
       *
       * const result = await response.json();
       *
       * if (!response.ok) {
       *   throw new Error(result.message || "Import failed");
       * }
       */

      toast.success(`${users.length} users are ready to import.`);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Import failed.");
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="mx-auto max-w-[1500px]">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100">
              <FileSpreadsheet className="h-6 w-6 text-emerald-600" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Import Users
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Upload an Excel or CSV file to import users.
              </p>
            </div>
          </div>
        </div>

        {/* Upload Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 px-6 py-14">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100">
              <FileSpreadsheet className="h-8 w-8 text-emerald-600" />
            </div>

            <h2 className="mt-5 text-lg font-semibold text-slate-900">
              Select Excel File
            </h2>

            <p className="mt-2 text-center text-sm text-slate-500">
              Supported formats: .xlsx, .xls, .csv
            </p>

            <label className="mt-6 inline-flex h-11 cursor-pointer items-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700">
              <Upload className="h-4 w-4" />
              Select File
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>

          {/* Selected File */}
          {file && (
            <div className="mt-5 flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <div className="flex min-w-0 items-center gap-3">
                <FileSpreadsheet className="h-5 w-5 flex-shrink-0 text-emerald-600" />

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-emerald-900">
                    {file.name}
                  </p>

                  <p className="text-xs text-emerald-700">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={clearFile}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-emerald-700 hover:bg-emerald-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="mt-6 flex items-center justify-center rounded-2xl border border-slate-200 bg-white p-10">
            <div className="flex items-center gap-3 text-slate-600">
              <Loader2 className="h-5 w-5 animate-spin" />
              Reading Excel file...
            </div>
          </div>
        )}

        {/* File Information */}
        {rows.length > 0 && !loading && (
          <>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">Total Rows</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {rows.length}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">Columns</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {columns.length}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">Users Detected</p>
                <p className="mt-2 text-3xl font-bold text-emerald-600">
                  {users.length}
                </p>
              </div>
            </div>

            {/* Detected Columns */}
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="font-semibold text-slate-900">Detected Columns</h2>

              <div className="mt-4 flex flex-wrap gap-2">
                {columns.map((column) => (
                  <span
                    key={column}
                    className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700"
                  >
                    {column}
                  </span>
                ))}
              </div>
            </div>

            {/* Preview */}
            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                <div>
                  <h2 className="font-semibold text-slate-900">
                    Excel Data Preview
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Showing {rows.length} rows
                  </p>
                </div>

                <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
                  <CheckCircle2 className="h-4 w-4" />
                  File Read Successfully
                </div>
              </div>

              <div className="max-h-[600px] overflow-auto">
                <table className="min-w-full text-sm">
                  <thead className="sticky top-0 bg-slate-100">
                    <tr>
                      <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-bold uppercase text-slate-500">
                        #
                      </th>

                      {columns.map((column) => (
                        <th
                          key={column}
                          className="whitespace-nowrap px-4 py-3 text-left text-xs font-bold uppercase text-slate-500"
                        >
                          {column}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {rows.map((row, index) => (
                      <tr key={index} className="hover:bg-slate-50">
                        <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-400">
                          {index + 1}
                        </td>

                        {columns.map((column) => (
                          <td
                            key={`${index}-${column}`}
                            className="whitespace-nowrap px-4 py-3 text-slate-700"
                          >
                            {String(row[column] ?? "")}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Converted Users */}
            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 px-6 py-4">
                <h2 className="font-semibold text-slate-900">
                  Users Ready for Import
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  These are the fields that will be sent to your backend.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-bold uppercase text-slate-500">
                        #
                      </th>

                      <th className="px-4 py-3 text-left text-xs font-bold uppercase text-slate-500">
                        Name
                      </th>

                      <th className="px-4 py-3 text-left text-xs font-bold uppercase text-slate-500">
                        Email
                      </th>

                      <th className="px-4 py-3 text-left text-xs font-bold uppercase text-slate-500">
                        Phone
                      </th>

                      <th className="px-4 py-3 text-left text-xs font-bold uppercase text-slate-500">
                        Role
                      </th>

                      <th className="px-4 py-3 text-left text-xs font-bold uppercase text-slate-500">
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {users.map((user, index) => (
                      <tr key={index} className="hover:bg-slate-50">
                        <td className="px-4 py-3 text-slate-400">
                          {index + 1}
                        </td>

                        <td className="px-4 py-3 font-medium text-slate-900">
                          {user.name || (
                            <span className="text-red-500">Missing name</span>
                          )}
                        </td>

                        <td className="px-4 py-3 text-slate-600">
                          {user.email || "-"}
                        </td>

                        <td className="px-4 py-3 text-slate-600">
                          {user.phone || "-"}
                        </td>

                        <td className="px-4 py-3">
                          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                            {user.role}
                          </span>
                        </td>

                        <td className="px-4 py-3">
                          {user.name ? (
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                              <CheckCircle2 className="h-4 w-4" />
                              Ready
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600">
                              <AlertCircle className="h-4 w-4" />
                              Invalid
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Import Button */}
              <div className="flex justify-end border-t border-slate-200 bg-slate-50 px-6 py-4">
                <button
                  type="button"
                  onClick={importUsers}
                  disabled={loading || users.length === 0}
                  className="inline-flex h-11 items-center gap-2 rounded-xl bg-emerald-600 px-6 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Upload className="h-4 w-4" />
                  Import {users.length} Users
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Page;
