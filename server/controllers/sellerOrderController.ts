import { Request, Response } from "express";
import SellerOrder from "../models/SellerOrder";
import { response } from "../utils/responseHandler";
import { syncParentOrderStatus } from "../utils/syncOrderStatus";

export const getSellerOrders = async (req: Request, res: Response) => {
  try {
    const sellerId = req.id;

    if (!sellerId) {
      return response(res, 401, "Unauthorized");
    }

    const sellerOrders = await SellerOrder.find({
      seller: sellerId,
    })
      .populate({
        path: "order",
        select:
          "orderNumber user shippingAddress paymentStatus paymentMethod createdAt notes",
        populate: [
          {
            path: "user",
            select: "name email",
          },
          {
            path: "shippingAddress",
          },
        ],
      })
      .populate({
        path: "items.product",
        select: "title images skuId",
      })
      .sort({ createdAt: -1 });

    return response(
      res,
      200,
      "Seller orders fetched successfully",
      sellerOrders,
    );
  } catch (error) {
    console.error("Get seller orders error:", error);

    return response(res, 500, "Error fetching seller orders");
  }
};

export const getSellerOrderById = async (req: Request, res: Response) => {
  try {
    const sellerId = req.id;
    const { id } = req.params;

    if (!sellerId) {
      return response(res, 401, "Unauthorized");
    }

    const sellerOrder = await SellerOrder.findOne({
      _id: id,
      seller: sellerId,
    })
      .populate({
        path: "order",
        select:
          "user shippingAddress paymentStatus paymentMethod status createdAt notes",
        populate: [
          {
            path: "user",
            select: "name email",
          },
          {
            path: "shippingAddress",
          },
        ],
      })
      .populate({
        path: "items.product",
        select: "title images skuId",
      });

    if (!sellerOrder) {
      return response(res, 404, "Seller order not found");
    }

    return response(res, 200, "Seller order fetched successfully", sellerOrder);
  } catch (error) {
    console.error("Get seller order error:", error);

    return response(res, 500, "Error fetching seller order");
  }
};

export const acceptSellerOrder = async (req: Request, res: Response) => {
  try {
    const sellerId = req.id;
    const { id } = req.params;

    if (!sellerId) {
      return response(res, 401, "Unauthorized");
    }

    const sellerOrder = await SellerOrder.findOne({
      _id: id,
      seller: sellerId,
      status: "pending",
    });

    if (!sellerOrder) {
      return response(res, 404, "Pending seller order not found");
    }

    sellerOrder.status = "accepted";

    await sellerOrder.save();

    return response(res, 200, "Order accepted successfully", sellerOrder);
  } catch (error) {
    console.error("Accept seller order error:", error);

    return response(res, 500, "Error accepting seller order");
  }
};

export const processSellerOrder = async (req: Request, res: Response) => {
  try {
    const sellerId = req.id;
    const { id } = req.params;

    if (!sellerId) {
      return response(res, 401, "Unauthorized");
    }

    const sellerOrder = await SellerOrder.findOne({
      _id: id,
      seller: sellerId,
      status: "accepted",
    });

    if (!sellerOrder) {
      return response(res, 404, "Accepted seller order not found");
    }

    sellerOrder.status = "processing";

    await sellerOrder.save();

    return response(res, 200, "Order moved to processing", sellerOrder);
  } catch (error) {
    console.error("Process seller order error:", error);

    return response(res, 500, "Error processing seller order");
  }
};

export const markSellerOrderReadyToShip = async (
  req: Request,
  res: Response,
) => {
  try {
    const sellerId = req.id;
    const { id } = req.params;

    if (!sellerId) {
      return response(res, 401, "Unauthorized");
    }

    const sellerOrder = await SellerOrder.findOne({
      _id: id,
      seller: sellerId,
      status: "processing",
    });

    if (!sellerOrder) {
      return response(res, 404, "Processing seller order not found");
    }

    sellerOrder.status = "ready_to_ship";

    await sellerOrder.save();

    return response(res, 200, "Order marked as ready to ship", sellerOrder);
  } catch (error) {
    console.error("Ready to ship error:", error);

    return response(res, 500, "Error updating seller order");
  }
};

export const dispatchSellerOrder = async (req: Request, res: Response) => {
  try {
    const sellerId = req.id;
    const { id } = req.params;

    const { courierName, trackingNumber, trackingUrl } = req.body;

    if (!sellerId) {
      return response(res, 401, "Unauthorized");
    }

    if (!courierName) {
      return response(res, 400, "Courier name is required");
    }

    if (!trackingNumber) {
      return response(res, 400, "Tracking number is required");
    }

    const sellerOrder = await SellerOrder.findOne({
      _id: id,
      seller: sellerId,
      status: "ready_to_ship",
    });

    if (!sellerOrder) {
      return response(res, 404, "Ready-to-ship seller order not found");
    }

    sellerOrder.status = "shipped";

    sellerOrder.shipping = {
      courierName,
      trackingNumber,
      trackingUrl,
      dispatchedAt: new Date(),
    };

    await sellerOrder.save();

    // -----------------------------------------
    // Sync parent customer order
    // -----------------------------------------

    const parentStatus = await syncParentOrderStatus(
      sellerOrder.order.toString(),
    );
    return response(res, 200, "Order dispatched successfully", {
      sellerOrder,
      parentOrderStatus: parentStatus,
    });
  } catch (error) {
    console.error("Dispatch seller order error:", error);

    return response(res, 500, "Error dispatching seller order");
  }
};

export const markSellerOrderDelivered = async (req: Request, res: Response) => {
  try {
    const sellerId = req.id;
    const { id } = req.params;

    if (!sellerId) {
      return response(res, 401, "Unauthorized");
    }

    const sellerOrder = await SellerOrder.findOne({
      _id: id,
      seller: sellerId,
      status: "shipped",
    });

    if (!sellerOrder) {
      return response(res, 404, "Shipped seller order not found");
    }

    sellerOrder.status = "delivered";

    sellerOrder.shipping = {
      ...sellerOrder.shipping,
      deliveredAt: new Date(),
    };

    await sellerOrder.save();

    // -----------------------------------------
    // Sync parent customer order
    // -----------------------------------------

    const parentStatus = await syncParentOrderStatus(
      sellerOrder.order.toString(),
    );
    return response(res, 200, "Order marked as delivered", {
      sellerOrder,
      parentOrderStatus: parentStatus,
    });
  } catch (error) {
    console.error("Deliver seller order error:", error);

    return response(res, 500, "Error marking order as delivered");
  }
};
