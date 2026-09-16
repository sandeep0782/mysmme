import fs from "fs/promises";
import path from "path";
import * as XLSX from "xlsx";

import { IProductImport } from "../../models/ProductImport";

// ============================================================
// TYPES
// ============================================================

type ExcelProductRow = Record<string, unknown>;

type ErrorFileResult = {
  fileUrl: string;
  fileName: string;
  fileSize: number;
};

// ============================================================
// DIRECTORY
// ============================================================

const ERROR_FILE_DIR = path.join(
  process.cwd(),
  "uploads",
  "product-import-errors",
);

// ============================================================
// GENERATE ERROR EXCEL
// ============================================================

export const generateProductImportErrorFile = async (
  rows: ExcelProductRow[],
  importErrors: IProductImport["importErrors"],
  productImportId: string,
): Promise<ErrorFileResult> => {
  await fs.mkdir(ERROR_FILE_DIR, {
    recursive: true,
  });

  // ----------------------------------------------------------
  // Map errors by Excel row number
  //
  // Excel row number starts at 2 because row 1 is the header.
  // ----------------------------------------------------------

  const errorsByRow = new Map<number, string>();

  for (const importError of importErrors) {
    errorsByRow.set(importError.rowNumber, importError.error);
  }

  // ----------------------------------------------------------
  // Add importError column to original rows
  // ----------------------------------------------------------

  const errorRows = rows.map((row, index) => {
    const excelRowNumber = index + 2;

    return {
      ...row,

      importError: errorsByRow.get(excelRowNumber) || "",
    };
  });

  // ----------------------------------------------------------
  // Create workbook
  // ----------------------------------------------------------

  const workbook = XLSX.utils.book_new();

  const worksheet = XLSX.utils.json_to_sheet(errorRows, {
    skipHeader: false,
  });

  // ----------------------------------------------------------
  // Make importError column wider
  // ----------------------------------------------------------

  const existingColumns = Object.keys(errorRows[0] ?? {});

  worksheet["!cols"] = existingColumns.map((column) => {
    if (column === "importError") {
      return {
        wch: 80,
      };
    }

    return {
      wch: Math.min(Math.max(column.length + 5, 15), 40),
    };
  });

  XLSX.utils.book_append_sheet(workbook, worksheet, "Import Errors");

  // ----------------------------------------------------------
  // Generate filename
  // ----------------------------------------------------------

  const fileName = `product-import-errors-${productImportId}.xlsx`;

  const filePath = path.join(ERROR_FILE_DIR, fileName);

  // ----------------------------------------------------------
  // Write Excel
  // ----------------------------------------------------------

  const buffer = XLSX.write(workbook, {
    type: "buffer",
    bookType: "xlsx",
  });

  await fs.writeFile(filePath, buffer);

  const stats = await fs.stat(filePath);

  return {
    fileUrl: filePath,
    fileName,
    fileSize: stats.size,
  };
};

// ============================================================
// DELETE ERROR FILE
// ============================================================

export const deleteProductImportErrorFile = async (
  fileUrl?: string,
): Promise<void> => {
  if (!fileUrl) {
    return;
  }

  try {
    await fs.unlink(fileUrl);
  } catch (error: unknown) {
    const code =
      typeof error === "object" && error !== null && "code" in error
        ? (error as { code?: string }).code
        : undefined;

    // File already doesn't exist.
    if (code === "ENOENT") {
      return;
    }

    console.error("Failed to delete product import error file:", error);
  }
};
