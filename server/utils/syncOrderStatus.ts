import Order from "../models/ProductOrder";
import SellerOrder from "../models/SellerOrder";

export const syncParentOrderStatus = async (
  orderId: string,
): Promise<string | null> => {
  const sellerOrders = await SellerOrder.find({
    order: orderId,
  }).select("status");

  if (sellerOrders.length === 0) {
    console.warn(`No seller orders found for parent order ${orderId}`);

    return null;
  }

  const statuses = sellerOrders.map((sellerOrder) => sellerOrder.status);

  let parentStatus:
    | "processing"
    | "partially_shipped"
    | "shipped"
    | "delivered"
    | "cancelled";

  // ---------------------------------------------------------
  // ALL DELIVERED
  // ---------------------------------------------------------

  if (statuses.every((status) => status === "delivered")) {
    parentStatus = "delivered";
  }

  // ---------------------------------------------------------
  // ALL CANCELLED
  // ---------------------------------------------------------
  else if (statuses.every((status) => status === "cancelled")) {
    parentStatus = "cancelled";
  }

  // ---------------------------------------------------------
  // ALL SHIPPED OR DELIVERED
  // ---------------------------------------------------------
  else if (
    statuses.every((status) => status === "shipped" || status === "delivered")
  ) {
    parentStatus = "shipped";
  }

  // ---------------------------------------------------------
  // AT LEAST ONE SHIPPED/DELIVERED
  // BUT NOT ALL
  // ---------------------------------------------------------
  else if (
    statuses.some((status) => status === "shipped" || status === "delivered")
  ) {
    parentStatus = "partially_shipped";
  }

  // ---------------------------------------------------------
  // NOTHING HAS SHIPPED
  // ---------------------------------------------------------
  else {
    parentStatus = "processing";
  }

  await Order.findByIdAndUpdate(orderId, {
    status: parentStatus,
  });

  console.log(`Order ${orderId} status synchronized → ${parentStatus}`);

  return parentStatus;
};
