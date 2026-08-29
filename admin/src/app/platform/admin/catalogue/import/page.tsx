"use client";

import React, { ChangeEvent, DragEvent, useRef, useState } from "react";
import {
  Upload,
  FileSpreadsheet,
  X,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Download,
} from "lucide-react";
import { useUploadProductExcelMutation } from "@/store/api/productImportApi";
import { BASE_URL } from "@/store/api";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

const ALLOWED_EXTENSIONS = [".xlsx", ".xls"];

const ProductImportPage = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const [isDownloadingTemplate, setIsDownloadingTemplate] = useState(false);
  const [uploadProductExcel, { isLoading: isUploading }] =
    useUploadProductExcelMutation();

  // ============================================================
  // FILE VALIDATION
  // ============================================================

  const validateFile = (file: File) => {
    const extension = `.${file.name.split(".").pop()?.toLowerCase()}`;

    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      return "Please select a valid Excel file (.xlsx or .xls).";
    }

    if (file.size > MAX_FILE_SIZE) {
      return "File size must be less than 10 MB.";
    }

    return "";
  };

  // ============================================================
  // SELECT FILE
  // ============================================================

  const handleFile = (file: File) => {
    setError("");

    const validationError = validateFile(file);

    if (validationError) {
      setSelectedFile(null);
      setError(validationError);
      return;
    }

    setSelectedFile(file);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    handleFile(file);
  };

  // ============================================================
  // DRAG & DROP
  // ============================================================

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];

    if (!file) {
      return;
    }

    handleFile(file);
  };

  // ============================================================
  // REMOVE FILE
  // ============================================================

  const removeFile = () => {
    setSelectedFile(null);
    setError("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  // ============================================================
  // FORMAT FILE SIZE
  // ============================================================

  const formatFileSize = (size: number) => {
    if (size < 1024) {
      return `${size} B`;
    }

    if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} KB`;
    }

    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  // ============================================================
  // UPLOAD
  // ============================================================

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select an Excel file first.");
      return;
    }

    setError("");

    try {
      const formData = new FormData();

      formData.append("file", selectedFile);

      const response = await uploadProductExcel(formData).unwrap();

      window.location.href = "/platform/admin/catalogue";
    } catch (error: unknown) {
      console.error("Product import upload failed:", error);
      console.log("Upload error JSON:", JSON.stringify(error, null, 2));

      if (error && typeof error === "object") {
        console.log("Upload error keys:", Object.keys(error));
      }

      setError("Product import upload failed. Check the browser console.");
    }
  };

  const handleDownloadTemplate = async () => {
    setError("");
    setIsDownloadingTemplate(true);

    try {
      const response = await fetch(`${BASE_URL}/admin/templates/product`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        let message = "Failed to download template.";

        try {
          const data = await response.json();
          message = data?.message || data?.error || message;
        } catch {
          // Response may not be JSON
        }

        throw new Error(`${message} (HTTP ${response.status})`);
      }

      const blob = await response.blob();

      const downloadUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "saree-product-import-template.xlsx";

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Failed to download product template:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to download template. Please try again.",
      );
    } finally {
      setIsDownloadingTemplate(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="px-4 py-6 sm:px-6 lg:px-8 ">
        {/* HEADER */}

        <div className="mb-8">
          <div className="mb-2 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-blue-600" />

            <span className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              Catalog Management
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Import Products
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Upload an Excel file to import products into your catalogue.
          </p>
        </div>

        {/* MAIN CARD */}

        <div className="mx-auto w-full">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-6 py-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Upload Excel File
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Supported formats: .xlsx and .xls. Maximum file size: 10 MB.
                  </p>
                </div>

                <button
                  type="button"
                  disabled={isDownloadingTemplate}
                  onClick={handleDownloadTemplate}
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isDownloadingTemplate ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Downloading...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      Download Template
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="p-6">
              {!selectedFile ? (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => inputRef.current?.click()}
                  className={`flex min-h-[280px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 text-center transition ${
                    isDragging
                      ? "border-blue-500 bg-blue-50"
                      : "border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50/50"
                  }`}
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                    <FileSpreadsheet className="h-8 w-8" />
                  </div>

                  <h3 className="mt-5 text-base font-semibold text-slate-900">
                    Drop your Excel file here
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    or click to browse from your computer
                  </p>

                  <span className="mt-4 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-blue-600 shadow-sm ring-1 ring-slate-200">
                    Choose Excel File
                  </span>

                  <input
                    ref={inputRef}
                    type="file"
                    accept=".xlsx,.xls"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>
              ) : (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
                        <FileSpreadsheet className="h-6 w-6" />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate font-semibold text-slate-900">
                          {selectedFile.name}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          {formatFileSize(selectedFile.size)}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={isUploading}
                      onClick={removeFile}
                      className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-white hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="mt-4 flex items-center gap-2 text-sm font-medium text-emerald-700">
                    <CheckCircle2 className="h-4 w-4" />
                    File ready for import
                  </div>
                </div>
              )}

              {/* ERROR */}

              {error && (
                <div className="mt-4 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                  <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />

                  <p className="text-sm font-medium text-red-700">{error}</p>
                </div>
              )}

              {/* ACTIONS */}

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  disabled={isUploading}
                  onClick={() => {
                    window.location.href =
                      "/platform/admin/catalogue/product-imports";
                  }}
                  className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={!selectedFile || isUploading}
                  onClick={handleUpload}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      Import Products
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* INFORMATION */}

          <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 px-5 py-4">
            <div className="flex gap-3">
              <div className="mt-0.5 flex-shrink-0 text-blue-600">
                <AlertTriangle className="h-5 w-5" />
              </div>

              <div>
                <p className="text-sm font-semibold text-blue-900">
                  Before uploading
                </p>

                <p className="mt-1 text-sm leading-6 text-blue-700">
                  Make sure your Excel file follows the product import template.
                  Invalid rows can be reported separately after processing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductImportPage;
