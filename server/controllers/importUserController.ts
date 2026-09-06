import { Request, Response, Router } from "express";
import { response } from "../utils/responseHandler";
import User from "../models/User";
import XLSX from "xlsx";

export const importUsersFromExcel = async (req: Request, res: Response) => {
  try {
    // ----------------------------------------------------------
    // CHECK FILE
    // ----------------------------------------------------------

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Excel file is required.",
      });
    }

    // ----------------------------------------------------------
    // READ EXCEL FROM MEMORY
    // ----------------------------------------------------------

    const workbook = XLSX.read(req.file.buffer, {
      type: "buffer",
    });

    if (!workbook.SheetNames.length) {
      return res.status(400).json({
        success: false,
        message: "Excel file does not contain any sheets.",
      });
    }

    // ----------------------------------------------------------
    // GET FIRST SHEET
    // ----------------------------------------------------------

    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    // ----------------------------------------------------------
    // CONVERT EXCEL TO JSON
    // ----------------------------------------------------------

    const rows = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet, {
      defval: "",
      raw: false,
    });

    if (!rows.length) {
      return res.status(400).json({
        success: false,
        message: "Excel file is empty.",
      });
    }

    // ----------------------------------------------------------
    // VALIDATION RESULT
    // ----------------------------------------------------------

    const validUsers: Array<{
      name: string;
      email: string;
      phone?: string;
      role: "user";
    }> = [];

    const errors: Array<{
      row: number;
      message: string;
    }> = [];

    // ----------------------------------------------------------
    // TRACK DUPLICATE EMAILS INSIDE EXCEL
    // ----------------------------------------------------------

    const excelEmails = new Set<string>();

    // ----------------------------------------------------------
    // VALIDATE EACH ROW
    // ----------------------------------------------------------

    rows.forEach((row, index) => {
      // Excel row 1 is the header,
      // therefore actual data starts from row 2.
      const rowNumber = index + 2;

      // --------------------------------------------------------
      // READ COLUMNS
      // --------------------------------------------------------

      const name = String(row["Name"] ?? row["name"] ?? "").trim();

      const email = String(row["Email"] ?? row["email"] ?? "")
        .trim()
        .toLowerCase();

      const phone = String(
        row["Phone No"] ?? row["Phone"] ?? row["phone"] ?? "",
      ).trim();

      // --------------------------------------------------------
      // NAME VALIDATION
      // --------------------------------------------------------

      if (!name) {
        errors.push({
          row: rowNumber,
          message: "Name is required.",
        });

        return;
      }

      // --------------------------------------------------------
      // EMAIL VALIDATION
      // --------------------------------------------------------

      if (!email) {
        errors.push({
          row: rowNumber,
          message: "Email is required.",
        });

        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(email)) {
        errors.push({
          row: rowNumber,
          message: `Invalid email address: ${email}`,
        });

        return;
      }

      // --------------------------------------------------------
      // DUPLICATE EMAIL IN EXCEL
      // --------------------------------------------------------

      if (excelEmails.has(email)) {
        errors.push({
          row: rowNumber,
          message: `Duplicate email in Excel: ${email}`,
        });

        return;
      }

      excelEmails.add(email);

      // --------------------------------------------------------
      // VALID USER
      // --------------------------------------------------------

      validUsers.push({
        name,
        email,
        ...(phone ? { phone } : {}),
        role: "user",
      });
    });

    // ----------------------------------------------------------
    // IF NOTHING IS VALID
    // ----------------------------------------------------------

    if (!validUsers.length) {
      return res.status(400).json({
        success: false,
        message: "No valid users found in the Excel file.",
        summary: {
          totalRows: rows.length,
          imported: 0,
          failed: errors.length,
        },
        errors,
      });
    }

    // ----------------------------------------------------------
    // CHECK EMAILS ALREADY EXISTING IN DATABASE
    // ----------------------------------------------------------

    const emails = validUsers.map((user) => user.email);

    const existingUsers = await User.find({
      email: {
        $in: emails,
      },
    }).select("email");

    const existingEmails = new Set(
      existingUsers.map((user) => String(user.email).toLowerCase()),
    );

    // ----------------------------------------------------------
    // REMOVE EXISTING USERS
    // ----------------------------------------------------------

    const usersToCreate = validUsers.filter((user) => {
      if (existingEmails.has(user.email)) {
        const rowIndex =
          rows.findIndex(
            (row) =>
              String(row["Email"] ?? row["email"] ?? "")
                .trim()
                .toLowerCase() === user.email,
          ) + 2;

        errors.push({
          row: rowIndex,
          message: `Email already exists: ${user.email}`,
        });

        return false;
      }

      return true;
    });

    // ----------------------------------------------------------
    // CREATE USERS
    // ----------------------------------------------------------

    let createdUsers: any[] = [];

    if (usersToCreate.length > 0) {
      createdUsers = await User.insertMany(usersToCreate);
    }

    // ----------------------------------------------------------
    // RESPONSE
    // ----------------------------------------------------------

    return res.status(200).json({
      success: true,

      message:
        createdUsers.length > 0
          ? "Users imported successfully."
          : "No new users were imported.",

      summary: {
        totalRows: rows.length,
        imported: createdUsers.length,
        failed: errors.length,
      },

      errors,
    });
  } catch (error: any) {
    console.error("Import users from Excel error:", error);

    return res.status(500).json({
      success: false,
      message: error?.message || "Failed to import users from Excel.",
    });
  }
};
