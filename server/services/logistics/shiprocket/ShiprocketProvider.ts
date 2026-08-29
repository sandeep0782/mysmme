import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";

import {
  CreateShipmentInput,
  CreateShipmentResult,
  CourierOption,
  LogisticsProvider,
} from "../LogisticsProvider";

import { LogisticsProviderName } from "../../../models/Shipping";
import { mapShiprocketStatus } from "./ShiprocketStatusMapper";

interface ShiprocketConfig {
  email: string;
  password: string;
  channelId?: number;
}

interface ShiprocketTokenResponse {
  token: string;
}

interface ShiprocketCreateOrderResponse {
  order_id: number;
  shipment_id: number;

  channel_order_id?: string;

  status: string;
  status_code: number;

  onboarding_completed_now?: number;

  awb_code?: string | null;
  courier_company_id?: number | string | null;
  courier_name?: string | null;

  new_channel?: boolean;
  packaging_box_error?: string;
  message?: string;
}

interface ShiprocketCourierResponse {
  courier_company_id?: number | string;
  courier_name?: string;

  rate?: number | string;
  etd?: string;

  rating?: number | string;

  freight_charge?: number | string;
  cod_charges?: number | string;
  other_charges?: number | string;

  delivery_performance?: number | string;
  pickup_performance?: number | string;

  charge_weight?: number | string;
}

export class ShiprocketProvider implements LogisticsProvider {
  private readonly client: AxiosInstance;

  private token?: string;
  private tokenExpiresAt?: number;

  private readonly config: ShiprocketConfig;

  constructor(config: ShiprocketConfig) {
    this.config = config;

    this.client = axios.create({
      baseURL: "https://apiv2.shiprocket.in/v1/external",

      headers: {
        "Content-Type": "application/json",
      },

      timeout: 30_000,
    });
  }

  // ============================================================
  // AUTHENTICATION
  // ============================================================

  private async getToken(): Promise<string> {
    /**
     * Shiprocket tokens are valid for 10 days.
     *
     * Refresh after 9 days.
     */
    if (this.token && this.tokenExpiresAt && Date.now() < this.tokenExpiresAt) {
      return this.token;
    }

    try {
      const response = await this.client.post<ShiprocketTokenResponse>(
        "/auth/login",
        {
          email: this.config.email,
          password: this.config.password,
        },
      );

      if (!response.data?.token) {
        throw new Error(
          "Shiprocket authentication succeeded but no token was returned",
        );
      }

      this.token = response.data.token;

      this.tokenExpiresAt = Date.now() + 9 * 24 * 60 * 60 * 1000;

      return this.token;
    } catch (error) {
      throw this.handleShiprocketError(
        error,
        "Shiprocket authentication failed",
      );
    }
  }

  private async requestConfig(): Promise<AxiosRequestConfig> {
    const token = await this.getToken();

    return {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
  }

  // ============================================================
  // CREATE SHIPMENT
  // ============================================================

  async createShipment(
    input: CreateShipmentInput,
  ): Promise<CreateShipmentResult> {
    const config = await this.requestConfig();

    // ----------------------------------------------------------
    // SELLER PICKUP LOCATION
    // ----------------------------------------------------------

    const pickupLocation = input.pickupAddress?.pickupLocation?.trim();

    if (!pickupLocation) {
      throw new Error("Seller Shiprocket pickup location is not configured");
    }

    const pickupPincode = input.pickupAddress?.pincode?.trim();

    if (!pickupPincode) {
      throw new Error("Seller pickup pincode is required");
    }

    // ----------------------------------------------------------
    // PAYLOAD
    // ----------------------------------------------------------

    const payload = {
      order_id: input.orderId.toString(),

      order_date: this.formatOrderDate(),

      /**
       * This MUST be the pickup location registered
       * inside this Shiprocket account.
       */
      pickup_location: pickupLocation,

      ...(this.config.channelId
        ? {
            channel_id: this.config.channelId,
          }
        : {}),

      // ========================================================
      // BILLING
      // ========================================================

      billing_customer_name: input.customer.name,

      billing_last_name: "",

      billing_address: input.customer.address,

      billing_address_2: input.customer.address2 || "",

      billing_city: input.customer.city,

      billing_pincode: Number(input.customer.pincode),

      billing_state: input.customer.state,

      billing_country: input.customer.country || "India",

      billing_email: input.customer.email || "",

      billing_phone: Number(input.customer.phone),

      // ========================================================
      // SHIPPING
      // ========================================================

      shipping_is_billing: true,

      shipping_customer_name: input.customer.name,

      shipping_last_name: "",

      shipping_address: input.customer.address,

      shipping_address_2: input.customer.address2 || "",

      shipping_city: input.customer.city,

      shipping_pincode: Number(input.customer.pincode),

      shipping_country: input.customer.country || "India",

      shipping_state: input.customer.state,

      shipping_email: input.customer.email || "",

      shipping_phone: Number(input.customer.phone),

      // ========================================================
      // ITEMS
      // ========================================================

      order_items: input.items.map((item) => ({
        name: item.name,

        sku: item.sku,

        units: item.quantity,

        selling_price: item.price,

        discount: 0,

        tax: 0,

        hsn: item.hsn || "",
      })),

      // ========================================================
      // PAYMENT
      // ========================================================

      payment_method: input.paymentMethod,

      // ========================================================
      // CHARGES
      // ========================================================

      shipping_charges: 0,

      giftwrap_charges: 0,

      transaction_charges: 0,

      total_discount: 0,

      // ========================================================
      // TOTAL
      // ========================================================

      sub_total: input.totalAmount,

      // ========================================================
      // PACKAGE
      // ========================================================

      length: input.package.length,

      breadth: input.package.breadth,

      height: input.package.height,

      weight: input.package.weight,
    };

    try {
      const response = await this.client.post<ShiprocketCreateOrderResponse>(
        "/orders/create/adhoc",
        payload,
        config,
      );
      const data = response.data;

      if (data?.message && !data?.order_id && !data?.shipment_id) {
        throw new Error(`Shiprocket API rejected order: ${data.message}`);
      }

      if (data.order_id == null || data.shipment_id == null) {
        throw new Error(
          `Shiprocket did not return order_id or shipment_id. Response: ${JSON.stringify(
            data,
          )}`,
        );
      }

      return {
        provider: "shiprocket" as LogisticsProviderName,

        providerOrderId: String(data.order_id),

        providerShipmentId: String(data.shipment_id),

        awb: data.awb_code || undefined,

        courierName: data.courier_name || undefined,

        courierCompanyId:
          data.courier_company_id != null && data.courier_company_id !== ""
            ? String(data.courier_company_id)
            : undefined,

        status: mapShiprocketStatus(data.status, data.status_code),

        providerStatus: data.status,

        providerStatusCode:
          data.status_code != null ? String(data.status_code) : undefined,
      };
    } catch (error) {
      throw this.handleShiprocketError(
        error,
        "Failed to create Shiprocket shipment",
      );
    }
  }

  // ============================================================
  // GET AVAILABLE COURIERS
  // ============================================================

  // ============================================================
  // GET AVAILABLE COURIERS
  // ============================================================

  async getCourierOptions(input: {
    pickupPincode: string;
    deliveryPincode: string;
    weight: number;
    cod: boolean;
  }): Promise<CourierOption[]> {
    const config = await this.requestConfig();

    const pickupPincode = input.pickupPincode?.trim();
    const deliveryPincode = input.deliveryPincode?.trim();

    if (!pickupPincode) {
      throw new Error("Seller pickup pincode is required");
    }

    if (!deliveryPincode) {
      throw new Error("Delivery pincode is required");
    }

    if (!input.weight || input.weight <= 0) {
      throw new Error("Shipment weight must be greater than 0");
    }

    try {
      const response = await this.client.get("/courier/serviceability/", {
        headers: {
          Authorization: `Bearer ${await this.getToken()}`,
          "Content-Type": "application/json",
        },
        params: {
          pickup_postcode: pickupPincode,
          delivery_postcode: deliveryPincode,
          weight: input.weight,
          cod: input.cod ? 1 : 0,
        },
      });

      const couriers: ShiprocketCourierResponse[] =
        response.data?.data?.available_courier_companies ?? [];

      return couriers.map((courier) => ({
        courierCompanyId:
          courier.courier_company_id != null
            ? String(courier.courier_company_id)
            : "",

        courierName: courier.courier_name || "",

        rate: courier.rate != null ? Number(courier.rate) : undefined,

        etd: courier.etd || undefined,

        rating: courier.rating != null ? Number(courier.rating) : undefined,

        freightCharge:
          courier.freight_charge != null
            ? Number(courier.freight_charge)
            : undefined,

        codCharges:
          courier.cod_charges != null ? Number(courier.cod_charges) : undefined,

        otherCharges:
          courier.other_charges != null
            ? Number(courier.other_charges)
            : undefined,

        deliveryPerformance:
          courier.delivery_performance != null
            ? Number(courier.delivery_performance)
            : undefined,

        pickupPerformance:
          courier.pickup_performance != null
            ? Number(courier.pickup_performance)
            : undefined,

        chargeWeight:
          courier.charge_weight != null
            ? Number(courier.charge_weight)
            : undefined,
      }));
    } catch (error) {
      throw this.handleShiprocketError(
        error,
        "Failed to fetch available Shiprocket couriers",
      );
    }
  }
  // ============================================================
  // ASSIGN COURIER / AWB
  // ============================================================

  async assignCourier(providerShipmentId: string, courierId?: string) {
    const config = await this.requestConfig();

    const shipmentId = Number(providerShipmentId);

    if (!Number.isInteger(shipmentId) || shipmentId <= 0) {
      throw new Error(`Invalid Shiprocket shipment ID: ${providerShipmentId}`);
    }

    const payload: {
      shipment_id: number;
      courier_id?: number;
    } = {
      shipment_id: shipmentId,
    };

    if (courierId) {
      const parsedCourierId = Number(courierId);

      if (!Number.isInteger(parsedCourierId) || parsedCourierId <= 0) {
        throw new Error(`Invalid Shiprocket courier ID: ${courierId}`);
      }

      payload.courier_id = parsedCourierId;
    }

    try {
      const response = await this.client.post(
        "/courier/assign/awb",
        payload,
        config,
      );

      const data = response.data;

      const assignment = data?.response?.data ?? data?.data ?? data;

      const awb = assignment?.awb_code ?? data?.awb_code;

      const courierName = assignment?.courier_name ?? data?.courier_name;

      const courierCompanyId =
        assignment?.courier_company_id ?? data?.courier_company_id;

      if (!awb) {
        throw new Error(
          "Shiprocket courier assignment succeeded but no AWB was returned",
        );
      }

      return {
        awb: String(awb),

        courierName: courierName || undefined,

        courierCompanyId:
          courierCompanyId != null && courierCompanyId !== ""
            ? String(courierCompanyId)
            : undefined,
      };
    } catch (error) {
      throw this.handleShiprocketError(
        error,
        "Failed to assign Shiprocket courier",
      );
    }
  }

  // ============================================================
  // SCHEDULE PICKUP
  // ============================================================

  async schedulePickup(providerShipmentId: string) {
    const config = await this.requestConfig();

    const shipmentId = Number(providerShipmentId);

    if (!Number.isInteger(shipmentId) || shipmentId <= 0) {
      throw new Error(`Invalid Shiprocket shipment ID: ${providerShipmentId}`);
    }

    try {
      const response = await this.client.post(
        "/courier/generate/pickup",
        {
          shipment_id: shipmentId,
        },
        config,
      );
      const pickupDate =
        response.data?.response?.data?.pickup_scheduled_date ??
        response.data?.data?.pickup_scheduled_date ??
        response.data?.pickup_scheduled_date;

      return {
        pickupScheduledDate: pickupDate ? new Date(pickupDate) : undefined,
      };
    } catch (error) {
      throw this.handleShiprocketError(
        error,
        "Failed to schedule Shiprocket pickup",
      );
    }
  }

  // ============================================================
  // TRACK SHIPMENT
  // ============================================================

  async getTracking(identifier: string) {
    const config = await this.requestConfig();

    if (!identifier) {
      throw new Error("Tracking identifier is required");
    }

    try {
      const response = await this.client.get(
        `/courier/track/awb/${encodeURIComponent(identifier)}`,
        config,
      );

      const data = response.data;

      const trackingData = data?.tracking_data ?? data?.tracking ?? {};

      const activities = trackingData?.shipment_track_activities ?? [];

      const currentStatus =
        trackingData?.shipment_status ?? data?.status ?? "pending";

      return {
        status: mapShiprocketStatus(
          currentStatus,
          trackingData?.shipment_status_id,
        ),

        statusCode:
          trackingData?.shipment_status_id != null
            ? String(trackingData.shipment_status_id)
            : undefined,

        providerStatus: currentStatus,

        providerStatusCode:
          trackingData?.shipment_status_id != null
            ? String(trackingData.shipment_status_id)
            : undefined,

        events: activities.map((event: any) => ({
          status: mapShiprocketStatus(event.activity, event["sr-status-label"]),

          statusCode:
            event["sr-status"] != null ? String(event["sr-status"]) : undefined,

          activity: event.activity,

          location: event.location || undefined,

          timestamp: new Date(event.date || event.datetime || event.timestamp),

          providerStatus: event.activity,

          providerStatusCode:
            event["sr-status"] != null ? String(event["sr-status"]) : undefined,
        })),
      };
    } catch (error) {
      throw this.handleShiprocketError(
        error,
        "Failed to fetch Shiprocket tracking",
      );
    }
  }

  // ============================================================
  // CANCEL SHIPMENT
  // ============================================================

  async cancelShipment(providerOrderId: string): Promise<void> {
    const config = await this.requestConfig();

    const orderId = Number(providerOrderId);

    if (!Number.isInteger(orderId) || orderId <= 0) {
      throw new Error(`Invalid Shiprocket order ID: ${providerOrderId}`);
    }

    try {
      await this.client.post(
        "/orders/cancel",
        {
          ids: [orderId],
        },
        config,
      );
    } catch (error) {
      throw this.handleShiprocketError(
        error,
        "Failed to cancel Shiprocket shipment",
      );
    }
  }

  // ============================================================
  // DATE FORMAT
  // ============================================================

  private formatOrderDate(): string {
    const date = new Date();

    const pad = (value: number) => String(value).padStart(2, "0");

    return [
      `${date.getFullYear()}-${pad(
        date.getMonth() + 1,
      )}-${pad(date.getDate())}`,

      `${pad(date.getHours())}:${pad(date.getMinutes())}`,
    ].join(" ");
  }

  // ============================================================
  // ERROR HANDLER
  // ============================================================

  private handleShiprocketError(
    error: unknown,
    fallbackMessage: string,
  ): Error {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<any>;

      const responseData = axiosError.response?.data;
      const message =
        responseData?.message ||
        responseData?.error ||
        axiosError.message ||
        fallbackMessage;

      return new Error(`Shiprocket: ${message}`);
    }

    if (error instanceof Error) {
      return new Error(`Shiprocket: ${error.message}`);
    }

    return new Error(fallbackMessage);
  }
}
