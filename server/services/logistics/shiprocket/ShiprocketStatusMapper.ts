import { ShippingStatus } from "../../../models/Shipping";

export function mapShiprocketStatus(
  status?: string,
  statusCode?: string | number,
): ShippingStatus {
  const normalized = String(status ?? "")
    .trim()
    .toLowerCase();

  switch (normalized) {
    case "new":
    case "created":
      return "created";

    case "awb assigned":
    case "awb_assigned":
    case "assigned":
      return "awb_assigned";

    case "pickup scheduled":
    case "pickup_scheduled":
      return "pickup_scheduled";

    case "picked up":
    case "picked_up":
      return "picked_up";

    case "in transit":
    case "in_transit":
      return "in_transit";

    case "out for delivery":
    case "out_for_delivery":
      return "out_for_delivery";

    case "delivered":
      return "delivered";

    case "cancelled":
    case "canceled":
      return "cancelled";

    case "rto initiated":
    case "rto_initiated":
      return "rto_initiated";

    case "rto in transit":
    case "rto_in_transit":
      return "rto_in_transit";

    case "rto delivered":
    case "rto_delivered":
      return "rto_delivered";

    case "failed":
      return "failed";

    default:
      return "pending";
  }
}
