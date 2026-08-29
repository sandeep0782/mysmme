import mongoose from "mongoose";

import { LogisticsProviderName, ShippingStatus } from "../../models/Shipping";

export interface PickupAddress {
  name: string;
  address: string;
  address2?: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  email?: string;

  /**
   * Shiprocket pickup location name.
   *
   * Example:
   * "Seller Warehouse"
   */
  pickupLocation: string;
}

export interface CreateShipmentInput {
  sellerOrderId: mongoose.Types.ObjectId;
  orderId: mongoose.Types.ObjectId;

  /**
   * Seller's pickup address.
   *
   * IMPORTANT:
   * In a marketplace this must belong to the seller
   * whose products are being shipped.
   */
  pickupAddress: PickupAddress;

  customer: {
    name: string;
    email?: string;
    phone: string;

    address: string;
    address2?: string;

    city: string;
    state: string;
    country: string;
    pincode: string;
  };

  items: {
    name: string;
    sku: string;
    quantity: number;
    price: number;
    hsn?: string;
  }[];

  paymentMethod: "COD" | "Prepaid";

  totalAmount: number;

  package: {
    length: number;
    breadth: number;
    height: number;
    weight: number;
  };
}

export interface CreateShipmentResult {
  provider: LogisticsProviderName;

  providerOrderId: string;
  providerShipmentId: string;

  awb?: string;
  courierName?: string;
  courierCompanyId?: string;

  status: ShippingStatus;

  providerStatus?: string;
  providerStatusCode?: string;
}

export interface CourierOption {
  courierCompanyId: string;
  courierName: string;

  rate?: number;
  etd?: string;
  rating?: number;

  freightCharge?: number;
  codCharges?: number;
  otherCharges?: number;

  deliveryPerformance?: number;
  pickupPerformance?: number;

  chargeWeight?: number;
}

export interface LogisticsProvider {
  createShipment(input: CreateShipmentInput): Promise<CreateShipmentResult>;

  /**
   * Get available couriers from seller pickup location
   * to customer delivery location.
   */
  getCourierOptions(input: {
    pickupPincode: string;
    deliveryPincode: string;
    weight: number;
    cod: boolean;
  }): Promise<CourierOption[]>;

  assignCourier(
    providerShipmentId: string,
    courierId?: string,
  ): Promise<{
    awb: string;
    courierName?: string;
    courierCompanyId?: string;
  }>;

  schedulePickup(providerShipmentId: string): Promise<{
    pickupScheduledDate?: Date;
  }>;

  getTracking(identifier: string): Promise<{
    status: ShippingStatus;
    statusCode?: string;

    providerStatus?: string;
    providerStatusCode?: string;

    events: {
      status: ShippingStatus;
      statusCode?: string;

      activity?: string;
      location?: string;
      timestamp: Date;

      providerStatus?: string;
      providerStatusCode?: string;
    }[];
  }>;

  cancelShipment(providerOrderId: string): Promise<void>;
}
