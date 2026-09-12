import { Request, Response } from "express";

const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;

export const verifyGstin = async (req: Request, res: Response) => {
  try {
    const gstin = String(req.params.gstin || "")
      .trim()
      .toUpperCase()
      .replace(/\s+/g, "");

    console.log("========== GST VERIFICATION ==========");
    console.log("GSTIN:", gstin);

    // -----------------------------------------
    // Validate GSTIN
    // -----------------------------------------

    if (!GSTIN_REGEX.test(gstin)) {
      console.log("❌ Invalid GSTIN format");

      return res.status(422).json({
        success: false,
        message: "Invalid GSTIN format.",
      });
    }

    // -----------------------------------------
    // Configuration
    // -----------------------------------------

    const baseUrl =
      process.env.GST_VERIFY_BASE_URL || "https://gstverify.co.in/api/v1";

    const apiKey = process.env.GST_VERIFICATION_API;

    console.log("GST base URL:", baseUrl);
    console.log("GST API configured:", Boolean(apiKey));

    if (!apiKey) {
      console.error("❌ GST_VERIFICATION_API is missing");

      return res.status(500).json({
        success: false,
        message: "GST verification service is not configured.",
      });
    }

    // -----------------------------------------
    // GSTVerify API request
    // -----------------------------------------

    const url = `${baseUrl.replace(/\/$/, "")}/verify/${encodeURIComponent(
      gstin,
    )}`;

    console.log("➡️ GSTVerify URL:", url);
    console.log("➡️ X-API-Key:", "YES");

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "X-API-Key": apiKey,
        Accept: "application/json",
      },
    });

    // -----------------------------------------
    // Parse provider response
    // -----------------------------------------

    const text = await response.text();

    let result: any;

    try {
      result = JSON.parse(text);
    } catch {
      console.error("❌ GSTVerify returned non-JSON response:", text);

      return res.status(502).json({
        success: false,
        message: "Invalid response from GST verification service.",
      });
    }

    console.log("⬅️ GSTVerify status:", response.status);
    console.log("⬅️ GSTVerify response:", result);

    // -----------------------------------------
    // Provider errors
    // -----------------------------------------

    if (!response.ok) {
      switch (response.status) {
        case 401:
          return res.status(401).json({
            success: false,
            message: "Invalid or missing GST verification API key.",
          });

        case 402:
          return res.status(402).json({
            success: false,
            message:
              "GST verification credits are exhausted. Please recharge your GSTVerify account.",
          });

        case 422:
          return res.status(422).json({
            success: false,
            message: "Invalid GSTIN format.",
          });

        case 429:
          return res.status(429).json({
            success: false,
            message:
              "GST verification rate limit exceeded. Please try again later.",
          });

        case 502:
          return res.status(502).json({
            success: false,
            message: "GST verification service is temporarily unavailable.",
          });

        default:
          return res.status(response.status).json({
            success: false,
            message:
              result?.message || result?.error || "GST verification failed.",
          });
      }
    }

    // -----------------------------------------
    // Successful response
    // -----------------------------------------

    if (!result?.success) {
      return res.status(400).json({
        success: false,
        message: result?.message || result?.error || "GST verification failed.",
      });
    }

    return res.status(200).json({
      success: true,
      cached: result.cached ?? false,
      credits_remaining: result.credits_remaining ?? null,
      data: result.data ?? null,
    });
  } catch (error: any) {
    console.error("❌ GSTIN verification error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to verify GSTIN. Please try again.",
    });
  }
};
