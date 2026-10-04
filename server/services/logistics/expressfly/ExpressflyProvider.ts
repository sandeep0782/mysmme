import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";

import {
  CreateShipmentInput,
  CreateShipmentResult,
  CourierOption,
  LogisticsProvider,
} from "../LogisticsProvider";

import {
  LogisticsProviderName,
  ShippingStatus,
} from "../../../models/Shipping";

import { mapExpressflyStatus } from "./ExpressflyStatusMapper";

interface ExpressflyConfig {
  username: string;
  password: string;
}

interface ExpressflyAuthResponse {
  status?: string;
  message?: string;
  token?: string;
}

interface ExpressflyRate {
  courier_info?: {
    logistic_id?: string;
    logistic_name?: string;
    api_name?: string;
    logo_image?: string;
  };

  price_info?: {
    sub_total?: number;
    freight_charge_gst_tax?: number;
    cod_charge?: number;
    cod_charge_gst_tax?: number;
    gst_tax?: number;
    total?: number;
  };

  delivery_info?: {
    zone?: string;
    zone_type?: string;
    expressfly_edd?: string;
    expected_pickup?: string;
  };

  temp_rate_id?: string;
}

export class ExpressflyProvider implements LogisticsProvider {
  private readonly client: AxiosInstance;

  private readonly config: ExpressflyConfig;

  private token?: string;

  /**
   * Your existing LogisticsService calls:
   *
   * createShipment()
   * getCourierOptions()
   * assignCourier()
   *
   * Expressfly rate lookup requires the order ID
   * created in createShipment().
   *
   * We keep it here so LogisticsService remains unchanged.
   */
  private currentProviderOrderId?: string;

  constructor(config: ExpressflyConfig) {
    this.config = config;

    this.client = axios.create({
      baseURL: "https://tech.expressfly.in/api",

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
    if (this.token) {
      return this.token;
    }

    try {
      const response = await this.client.post<ExpressflyAuthResponse>(
        "/unicommerce/authToken",
        {
          username: this.config.username,
          password: this.config.password,
        },
      );

      const token = response.data?.token;

      if (!token) {
        throw new Error(
          `Expressfly authentication succeeded but no token was returned. Response: ${JSON.stringify(
            response.data,
          )}`,
        );
      }

      this.token = token;

      return token;
    } catch (error) {
      throw this.handleExpressflyError(
        error,
        "Expressfly authentication failed",
      );
    }
  }

  private async requestConfig(): Promise<AxiosRequestConfig> {
    const token = await this.getToken();

    return {
      headers: {
        /**
         * Expressfly documentation shows the JWT
         * directly in Authorization.
         *
         * Not:
         * Authorization: Bearer <token>
         */
        Authorization: token,

        "Content-Type": "application/json",
      },
    };
  }

  // ============================================================
  // CREATE SHIPMENT / ORDER
  // ============================================================

  async createShipment(
    input: CreateShipmentInput,
  ): Promise<CreateShipmentResult> {
    const config = await this.requestConfig();

    const payload = {
      name: input.customer.name,

      mobile_no: input.customer.phone,

      alternate_mobile_no: null,

      email_id: input.customer.email || "",

      /**
       * Expressfly docs:
       * 0 = forward
       * 1 = DTO
       */
      shipment_type: 0,

      receiver_address: [input.customer.address, input.customer.address2]
        .filter(Boolean)
        .join(", "),

      receiver_pincode: input.customer.pincode,

      receiver_city: input.customer.city,

      receiver_state: input.customer.state,

      receiver_landmark: input.customer.address2 || null,

      /**
       * Use sellerOrderId because each seller order
       * represents one shipment in your marketplace.
       */
      order_no: input.sellerOrderId.toString(),

      /**
       * The exact field names below may differ slightly
       * depending on Expressfly's complete Create Order API.
       *
       * They are kept here so the complete shipment information
       * is available to Expressfly.
       */
      payment_type: input.paymentMethod === "COD" ? "COD" : "Prepaid",

      cod_amount: input.paymentMethod === "COD" ? input.totalAmount : 0,

      order_amount: input.totalAmount,

      weight: input.package.weight,

      length: input.package.length,

      breadth: input.package.breadth,

      height: input.package.height,

      products: input.items.map((item) => ({
        name: item.name,
        sku: item.sku,
        quantity: item.quantity,
        price: item.price,
        hsn: item.hsn || "",
      })),

      pickup_address: input.pickupAddress.address,

      pickup_address2: input.pickupAddress.address2 || "",

      pickup_city: input.pickupAddress.city,

      pickup_state: input.pickupAddress.state,

      pickup_pincode: input.pickupAddress.pincode,

      pickup_contact_name: input.pickupAddress.name,

      pickup_contact_no: input.pickupAddress.phone,

      pickup_email: input.pickupAddress.email || "",
    };

    try {
      const response = await this.client.post("/orders", payload, config);

      const raw = response.data;

      const data = raw?.data ?? raw?.order ?? raw;

      const providerOrderId =
        data?._id ?? data?.id ?? data?.order_id ?? data?.orderId;

      if (!providerOrderId) {
        throw new Error(
          `Expressfly did not return order ID. Response: ${JSON.stringify(
            raw,
          )}`,
        );
      }

      this.currentProviderOrderId = String(providerOrderId);

      const providerShipmentId =
        data?.shipment_id ?? data?.shipmentId ?? providerOrderId;

      const providerStatus = data?.status ?? raw?.status ?? "created";

      const providerStatusCode = data?.status_code ?? data?.statusCode;

      return {
        provider: "expressfly" as LogisticsProviderName,

        providerOrderId: String(providerOrderId),

        providerShipmentId: String(providerShipmentId),

        awb:
          data?.awb ??
          data?.awb_no ??
          data?.awb_number ??
          data?.waybill ??
          undefined,

        courierName: data?.courier_name ?? data?.logistic_name ?? undefined,

        courierCompanyId:
          data?.courier_id != null
            ? String(data.courier_id)
            : data?.logistic_id != null
              ? String(data.logistic_id)
              : undefined,

        status: mapExpressflyStatus(providerStatus, providerStatusCode),

        providerStatus:
          providerStatus != null ? String(providerStatus) : undefined,

        providerStatusCode:
          providerStatusCode != null ? String(providerStatusCode) : undefined,
      };
    } catch (error) {
      throw this.handleExpressflyError(
        error,
        "Failed to create Expressfly shipment",
      );
    }
  }

  // ============================================================
  // GET AVAILABLE COURIERS / RATES
  // ============================================================

  async getCourierOptions(input: {
    pickupPincode: string;
    deliveryPincode: string;
    weight: number;
    cod: boolean;
  }): Promise<CourierOption[]> {
    const config = await this.requestConfig();

    if (!this.currentProviderOrderId) {
      throw new Error(
        "Expressfly provider order ID is not available for rate calculation",
      );
    }

    try {
      const response = await this.client.get(
        `/orders/get-rates/${encodeURIComponent(this.currentProviderOrderId)}`,
        config,
      );

      const rates: ExpressflyRate[] = response.data?.data?.rates ?? [];

      return rates
        .filter((rate) => rate?.temp_rate_id && rate?.courier_info)
        .map((rate) => ({
          /**
           * IMPORTANT:
           *
           * For Expressfly we store temp_rate_id here,
           * because assignCourier() receives this value
           * from LogisticsService and Expressfly Ship Order
           * requires temp_rate_id.
           */
          courierCompanyId: String(rate.temp_rate_id),

          courierName:
            rate.courier_info?.logistic_name ||
            rate.courier_info?.api_name ||
            "Expressfly Courier",

          rate:
            rate.price_info?.total != null
              ? Number(rate.price_info.total)
              : undefined,

          etd: rate.delivery_info?.expressfly_edd || undefined,

          freightCharge:
            rate.price_info?.sub_total != null
              ? Number(rate.price_info.sub_total)
              : undefined,

          codCharges:
            rate.price_info?.cod_charge != null
              ? Number(rate.price_info.cod_charge)
              : undefined,

          otherCharges:
            rate.price_info?.gst_tax != null
              ? Number(rate.price_info.gst_tax)
              : undefined,
        }));
    } catch (error) {
      throw this.handleExpressflyError(
        error,
        "Failed to fetch Expressfly courier rates",
      );
    }
  }

  // ============================================================
  // SHIP ORDER / ASSIGN COURIER
  // ============================================================

  async assignCourier(
    providerShipmentId: string,
    courierId?: string,
  ): Promise<{
    awb: string;
    courierName?: string;
    courierCompanyId?: string;
  }> {
    if (!courierId) {
      throw new Error("Expressfly temp_rate_id is required");
    }

    const config = await this.requestConfig();

    try {
      const response = await this.client.post(
        "/admin/orders/b2c/ship-order",
        {
          temp_rate_id: courierId,
        },
        config,
      );

      const raw = response.data;

      const data = raw?.data ?? raw?.order ?? raw?.shipment ?? raw;

      const awb =
        data?.awb ??
        data?.awb_no ??
        data?.awb_number ??
        data?.awb_code ??
        data?.waybill ??
        data?.tracking_number;

      if (!awb) {
        throw new Error(
          `Expressfly Ship Order succeeded but AWB was not returned. Response: ${JSON.stringify(
            raw,
          )}`,
        );
      }

      return {
        awb: String(awb),

        courierName:
          data?.courier_name ??
          data?.logistic_name ??
          data?.courier?.name ??
          undefined,

        /**
         * Keep temp_rate_id because your existing
         * LogisticsService stores the selected ID.
         */
        courierCompanyId: courierId,
      };
    } catch (error) {
      throw this.handleExpressflyError(
        error,
        "Failed to ship Expressfly order",
      );
    }
  }

  // ============================================================
  // SCHEDULE PICKUP
  // ============================================================

  async schedulePickup(providerShipmentId: string): Promise<{
    pickupScheduledDate?: Date;
  }> {
    /**
     * Based on the Expressfly API you shared,
     * Ship Order handles shipping selection.
     *
     * No separate pickup endpoint has been provided.
     *
     * We return an empty result so your existing
     * LogisticsService can continue unchanged.
     */
    return {};
  }

  // ============================================================
  // TRACKING
  // ============================================================

  async getTracking(identifier: string): Promise<{
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
  }> {
    /**
     * Tracking endpoint was not included in
     * the Expressfly API information provided.
     *
     * Do not fabricate an endpoint here.
     */
    throw new Error(
      `Expressfly tracking API is not configured yet for identifier: ${identifier}`,
    );
  }

  // ============================================================
  // CANCEL SHIPMENT
  // ============================================================

  async cancelShipment(providerOrderId: string): Promise<void> {
    /**
     * Cancel Order endpoint was not included in
     * the Expressfly API information provided.
     */
    throw new Error(
      `Expressfly cancellation API is not configured yet for order: ${providerOrderId}`,
    );
  }

  // ============================================================
  // ERROR HANDLER
  // ============================================================

  private handleExpressflyError(
    error: unknown,
    fallbackMessage: string,
  ): Error {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<any>;

      const responseData = axiosError.response?.data;

      const status = axiosError.response?.status;

      /**
       * If Expressfly invalidates/expires our cached
       * JWT, force re-authentication on the next call.
       */
      if (status === 401 || status === 403) {
        this.token = undefined;
      }

      const message =
        responseData?.message ||
        responseData?.error ||
        responseData?.errors ||
        axiosError.message ||
        fallbackMessage;

      const normalizedMessage =
        typeof message === "string" ? message : JSON.stringify(message);

      return new Error(`Expressfly: ${normalizedMessage}`);
    }

    if (error instanceof Error) {
      return new Error(`Expressfly: ${error.message}`);
    }

    return new Error(`Expressfly: ${fallbackMessage}`);
  }
}
