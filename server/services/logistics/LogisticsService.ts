import mongoose from "mongoose";

import { LogisticsProviderName } from "../../models/Shipping";
import Shipping from "../../models/Shipping";
import SellerOrder from "../../models/SellerOrder";

import { CreateShipmentInput, LogisticsProvider } from "./LogisticsProvider";

export class LogisticsService {
  constructor(
    private readonly providers: Record<
      LogisticsProviderName,
      LogisticsProvider
    >,
  ) {}

  // ============================================================
  // GET PROVIDER
  // ============================================================

  private getProvider(providerName: LogisticsProviderName): LogisticsProvider {
    const provider = this.providers[providerName];

    if (!provider) {
      throw new Error(`Logistics provider "${providerName}" is not configured`);
    }

    return provider;
  }

  // ============================================================
  // CREATE SHIPMENT
  // ============================================================

  async createShipment(
    providerName: LogisticsProviderName,
    sellerOrderId: mongoose.Types.ObjectId,
  ) {
    const provider = this.getProvider(providerName);

    // ============================================================
    // GET SELLER ORDER
    // ============================================================

    const sellerOrder = await SellerOrder.findById(sellerOrderId)
      .populate({
        path: "seller",
        populate: {
          path: "addresses",
          model: "Address",
        },
      })
      .populate("items.product")
      .populate({
        path: "order",
        populate: [
          {
            path: "user",
          },
          {
            path: "shippingAddress",
          },
        ],
      })
      .lean();

    if (!sellerOrder) {
      throw new Error("Seller order not found");
    }
    // ============================================================
    // SELLER
    // ============================================================

    const seller = sellerOrder.seller as any;

    if (!seller) {
      throw new Error("Seller not found");
    }

    // ============================================================
    // SELLER ADDRESSES
    // ============================================================

    const sellerAddresses = seller.addresses ?? [];

    // ============================================================
    // FIND PICKUP ADDRESS
    // ============================================================

    const pickupAddress = sellerAddresses.find(
      (address: any) =>
        typeof address.pickupLocation === "string" &&
        address.pickupLocation.trim().length > 0,
    );

    if (!pickupAddress) {
      throw new Error(
        "Seller pickup address with pickupLocation is not configured",
      );
    }

    // ============================================================
    // VALIDATE PICKUP LOCATION
    // ============================================================

    const pickupLocation = pickupAddress.pickupLocation?.trim();

    if (!pickupLocation) {
      throw new Error("Seller pickup location is required");
    }

    // ============================================================
    // VALIDATE PICKUP PINCODE
    // ============================================================

    const pickupPincode = pickupAddress.pincode?.trim();

    if (!pickupPincode) {
      throw new Error("Seller pickup address pincode is required");
    }

    // ============================================================
    // ORDER
    // ============================================================

    const order = sellerOrder.order as any;

    if (!order) {
      throw new Error("Order not found");
    }

    // ============================================================
    // CUSTOMER DELIVERY ADDRESS
    // ============================================================

    const address = order.shippingAddress as any;

    if (!address) {
      throw new Error("Shipping address not found");
    }

    const deliveryPincode = address.pincode?.trim();

    if (!deliveryPincode) {
      throw new Error("Customer delivery pincode is required");
    }

    // ============================================================
    // CREATE SHIPMENT INPUT
    // ============================================================

    const shipmentInput: CreateShipmentInput = {
      sellerOrderId: sellerOrder._id,

      orderId: order._id,

      // ==========================================================
      // SELLER PICKUP ADDRESS
      // ==========================================================

      pickupAddress: {
        name: seller.name,

        address: pickupAddress.addressLine1,

        address2: pickupAddress.addressLine2 || "",

        city: pickupAddress.city,

        state: pickupAddress.state,

        pincode: pickupPincode,

        phone: pickupAddress.phoneNumber || seller.phoneNumber || "",

        email: seller.email,

        pickupLocation,
      },

      // ==========================================================
      // CUSTOMER DELIVERY ADDRESS
      // ==========================================================

      customer: {
        name: order.user?.name ?? "",

        email: order.user?.email,

        phone: address.phoneNumber,

        address: address.addressLine1,

        address2: address.addressLine2 || "",

        city: address.city,

        state: address.state,

        country: address.country ?? "India",

        pincode: deliveryPincode,
      },

      // ==========================================================
      // ITEMS
      // ==========================================================

      items: sellerOrder.items.map((item: any) => {
        const product = item.product;

        return {
          name: item.productName,

          sku: product?.skuId ?? product?.productId ?? product?._id?.toString(),

          quantity: item.quantity,

          price: item.unitPrice,

          hsn: product?.hsnId,
        };
      }),

      // ==========================================================
      // PAYMENT
      // ==========================================================

      paymentMethod:
        order.paymentMethod?.toLowerCase() === "cod" ? "COD" : "Prepaid",

      // ==========================================================
      // TOTAL
      // ==========================================================

      totalAmount: sellerOrder.totalAmount,

      // ==========================================================
      // PACKAGE
      // ==========================================================

      package: {
        length: 10,

        breadth: 10,

        height: 10,

        weight: 0.5,
      },
    };

    // ============================================================
    // DEBUG SHIPMENT INPUT
    // ============================================================

    const result = await provider.createShipment(shipmentInput);

    // ============================================================
    // VALIDATE SHIPROCKET SHIPMENT ID
    // ============================================================

    if (!result.providerShipmentId) {
      throw new Error("Shiprocket shipment ID was not returned");
    }

    // ============================================================
    // STEP 2
    // GET COURIER OPTIONS
    // ============================================================

    const courierOptions = await provider.getCourierOptions({
      pickupPincode: shipmentInput.pickupAddress.pincode,

      deliveryPincode: shipmentInput.customer.pincode,

      weight: shipmentInput.package.weight,

      cod: shipmentInput.paymentMethod === "COD",
    });

    // ============================================================
    // VALIDATE COURIERS
    // ============================================================

    if (!courierOptions || courierOptions.length === 0) {
      throw new Error("No courier available for Shiprocket shipment");
    }

    // ============================================================
    // SELECT COURIER
    // ============================================================

    // For now we select the first courier.
    //
    // Later you can replace this with:
    // - cheapest courier
    // - fastest courier
    // - highest rated courier
    // - courier selected by frontend
    // ============================================================

    const selectedCourier = courierOptions[0];

    if (!selectedCourier?.courierCompanyId) {
      throw new Error("Selected courier does not have a courier company ID");
    }

    const assignment = await provider.assignCourier(
      result.providerShipmentId,

      selectedCourier.courierCompanyId,
    );

    // ============================================================
    // VALIDATE AWB
    // ============================================================

    if (!assignment?.awb) {
      throw new Error(
        "Shiprocket courier was assigned but AWB was not returned",
      );
    }

    // ============================================================
    // IMPORTANT
    //
    // STEP 1 result contains the original create-order data.
    //
    // Step 1 usually has:
    //
    // awb: undefined
    // courierName: undefined
    // courierCompanyId: undefined
    //
    // Step 3 contains the actual assigned AWB.
    //
    // Therefore we MUST update result here.
    // ============================================================

    result.awb = assignment.awb;

    result.courierName = assignment.courierName || selectedCourier.courierName;

    result.courierCompanyId =
      assignment.courierCompanyId || selectedCourier.courierCompanyId;

    // ============================================================
    // STEP 4
    // SCHEDULE PICKUP
    // ============================================================

    const pickup = await provider.schedulePickup(result.providerShipmentId);

    // ============================================================
    // SAVE SHIPPING
    // ============================================================

    const shipping = await Shipping.create({
      sellerOrder: sellerOrder._id,

      provider: providerName,

      providerOrderId: result.providerOrderId,

      providerShipmentId: result.providerShipmentId,

      // ========================================================
      // AWB FROM STEP 3
      // ========================================================

      awb: result.awb,

      // ========================================================
      // COURIER FROM STEP 3
      // ========================================================

      courierName: result.courierName,

      courierCompanyId: result.courierCompanyId,

      // ========================================================
      // STATUS
      // ========================================================

      status: result.status,

      providerStatus: result.providerStatus,

      providerStatusCode: result.providerStatusCode,

      lastSyncedAt: new Date(),
    });

    // ============================================================
    // FINAL RESULT
    // ============================================================

    return {
      result,

      shipping,

      pickup,
    };
  }
}
