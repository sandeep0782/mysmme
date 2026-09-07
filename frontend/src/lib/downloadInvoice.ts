import { BASE_URL } from "@/store/api";

export const downloadInvoice = async (orderId: string): Promise<void> => {
  const response = await fetch(`${BASE_URL}/order/${orderId}/invoice`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    let message = "Unable to download invoice";

    try {
      const data = await response.json();
      message = data?.message || message;
    } catch {
      // Response is not JSON
    }

    throw new Error(message);
  }

  const blob = await response.blob();

  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;
  link.download = `invoice-${orderId}.pdf`;

  document.body.appendChild(link);
  link.click();

  link.remove();

  window.URL.revokeObjectURL(url);
};
