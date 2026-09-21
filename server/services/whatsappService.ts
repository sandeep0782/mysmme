const GRAPH_API_VERSION = "v24.0";

type WhatsAppTextResponse = {
  messaging_product?: string;
  contacts?: Array<{
    input: string;
    wa_id: string;
  }>;
  messages?: Array<{
    id: string;
  }>;
  error?: unknown;
};

/**
 * Send a normal WhatsApp text message.
 *
 * IMPORTANT:
 * Free-form text is intended for an active customer conversation.
 * Marketing initiation should use an approved Marketing template.
 */
export async function sendWhatsAppText(
  to: string,
  message: string,
): Promise<WhatsAppTextResponse> {
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!accessToken) {
    throw new Error("WHATSAPP_ACCESS_TOKEN is missing");
  }

  if (!phoneNumberId) {
    throw new Error("WHATSAPP_PHONE_NUMBER_ID is missing");
  }

  // Keep only digits: +91 98765 43210 -> 919876543210
  const recipient = to.replace(/\D/g, "");

  if (!recipient) {
    throw new Error("WhatsApp recipient number is required");
  }

  if (!message.trim()) {
    throw new Error("WhatsApp message cannot be empty");
  }

  const response = await fetch(
    `https://graph.facebook.com/${GRAPH_API_VERSION}/${phoneNumberId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: recipient,
        type: "text",
        text: {
          preview_url: true,
          body: message,
        },
      }),
    },
  );

  const data = (await response.json()) as WhatsAppTextResponse;

  if (!response.ok) {
    console.error("WhatsApp API error:", JSON.stringify(data, null, 2));

    throw new Error(
      `WhatsApp API request failed with status ${response.status}`,
    );
  }

  return data;
}
