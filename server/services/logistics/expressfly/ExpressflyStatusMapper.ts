import { ShippingStatus } from "../../../models/Shipping";

export function mapExpressflyStatus(
  status?: string,
  statusCode?: string | number,
): ShippingStatus {
  const normalized = String(status ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");

  switch (normalized) {
    case "new":
    case "created":
    case "order_created":
      return "created";

    case "awb_assigned":
    case "awb_generated":
    case "assigned":
      return "awb_assigned";

    case "pickup_scheduled":
    case "pickup_requested":
      return "pickup_scheduled";

    case "picked_up":
    case "pickup_done":
      return "picked_up";

    case "in_transit":
    case "intransit":
    case "shipped":
      return "in_transit";

    case "out_for_delivery":
    case "ofd":
      return "out_for_delivery";

    case "delivered":
      return "delivered";

    case "cancelled":
    case "canceled":
      return "cancelled";

    case "rto_initiated":
      return "rto_initiated";

    case "rto_in_transit":
      return "rto_in_transit";

    case "rto_delivered":
      return "rto_delivered";

    case "failed":
    case "shipment_failed":
      return "failed";

    default:
      return "pending";
  }
}
