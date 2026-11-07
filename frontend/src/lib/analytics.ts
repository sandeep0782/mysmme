export type EcommerceItem = {
  item_id: string;
  item_name: string;
  price: number;
  item_brand?: string;
  item_category?: string;
  quantity?: number;
  index?: number;
};

type DataLayerEntry = Record<string, unknown>;

type AnalyticsWindow = Window & {
  dataLayer?: DataLayerEntry[];
};

export function trackEcommerceEvent(
  event: string,
  ecommerce: Record<string, unknown>,
) {
  if (typeof window === "undefined") return;

  const analyticsWindow = window as AnalyticsWindow;

  analyticsWindow.dataLayer = analyticsWindow.dataLayer || [];

  // Clear previous ecommerce data
  analyticsWindow.dataLayer.push({
    ecommerce: null,
  });

  // Push new event
  analyticsWindow.dataLayer.push({
    event,
    ecommerce,
  });
}

export function trackProductView(item: EcommerceItem) {
  trackEcommerceEvent("view_item", {
    currency: "INR",
    value: item.price,
    items: [{ ...item, quantity: 1 }],
  });
}

export function trackAddToCart(item: EcommerceItem, quantity: number = 1) {
  trackEcommerceEvent("add_to_cart", {
    currency: "INR",
    value: item.price * quantity,
    items: [{ ...item, quantity }],
  });
}
