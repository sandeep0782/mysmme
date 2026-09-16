export interface GSTData {
  gstin: string;
  legal_name: string;
  trade_name: string;
  status: string;
  constitution: string;
  taxpayer_type: string;
  registration_date: string;
  last_updated: string;
  state: string;
  state_code: string;
  pan: string;
  address: string;
  district: string;
  pincode: string;
  nature_of_business: string[];
}

interface GSTApiResponse {
  success: boolean;
  cached?: boolean;
  credits_remaining?: number;
  data?: GSTData;
  message?: string;
}

const GST_API_URL = "https://gstverify.co.in/api/v1/verify";

export const verifyGST = async (gstin: string): Promise<GSTData> => {
  const apiKey = process.env.GST_API_KEY;

  if (!apiKey) {
    throw new Error("GST_API_KEY is not configured");
  }

  const normalizedGSTIN = gstin.trim().toUpperCase();

  // ------------------------------------------
  // Validate GSTIN
  // ------------------------------------------

  if (!/^[0-9A-Z]{15}$/.test(normalizedGSTIN)) {
    throw new Error("Invalid GST number format");
  }

  // ------------------------------------------
  // Call GST API
  // ------------------------------------------

  const response = await fetch(`${GST_API_URL}/${normalizedGSTIN}`, {
    method: "GET",
    headers: {
      "X-API-Key": apiKey,
      Accept: "application/json",
    },
  });

  // ------------------------------------------
  // Parse response
  // ------------------------------------------

  let result: GSTApiResponse;

  try {
    result = await response.json();
  } catch {
    throw new Error("Invalid response from GST verification API");
  }

  // ------------------------------------------
  // HTTP error
  // ------------------------------------------

  if (!response.ok) {
    throw new Error(result.message || "GST verification API request failed");
  }

  // ------------------------------------------
  // API error
  // ------------------------------------------

  if (!result.success) {
    throw new Error(result.message || "GST verification failed");
  }

  // ------------------------------------------
  // Make sure data exists
  // ------------------------------------------

  if (!result.data) {
    throw new Error("GST API returned no GST data");
  }

  // ------------------------------------------
  // IMPORTANT
  // ------------------------------------------
  // At this point TypeScript knows that
  // result.data is GSTData.
  // ------------------------------------------

  const gstData: GSTData = result.data;

  return gstData;
};
