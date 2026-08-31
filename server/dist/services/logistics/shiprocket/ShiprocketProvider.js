"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShiprocketProvider = void 0;
const axios_1 = __importDefault(require("axios"));
const ShiprocketStatusMapper_1 = require("./ShiprocketStatusMapper");
class ShiprocketProvider {
    constructor(config) {
        this.config = config;
        this.client = axios_1.default.create({
            baseURL: "https://apiv2.shiprocket.in/v1/external",
            headers: {
                "Content-Type": "application/json",
            },
            timeout: 30000,
        });
    }
    // ============================================================
    // AUTHENTICATION
    // ============================================================
    getToken() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            /**
             * Shiprocket tokens are valid for 10 days.
             *
             * Refresh after 9 days.
             */
            if (this.token && this.tokenExpiresAt && Date.now() < this.tokenExpiresAt) {
                return this.token;
            }
            try {
                const response = yield this.client.post("/auth/login", {
                    email: this.config.email,
                    password: this.config.password,
                });
                if (!((_a = response.data) === null || _a === void 0 ? void 0 : _a.token)) {
                    throw new Error("Shiprocket authentication succeeded but no token was returned");
                }
                this.token = response.data.token;
                this.tokenExpiresAt = Date.now() + 9 * 24 * 60 * 60 * 1000;
                return this.token;
            }
            catch (error) {
                throw this.handleShiprocketError(error, "Shiprocket authentication failed");
            }
        });
    }
    requestConfig() {
        return __awaiter(this, void 0, void 0, function* () {
            const token = yield this.getToken();
            return {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            };
        });
    }
    // ============================================================
    // CREATE SHIPMENT
    // ============================================================
    createShipment(input) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            const config = yield this.requestConfig();
            // ----------------------------------------------------------
            // SELLER PICKUP LOCATION
            // ----------------------------------------------------------
            const pickupLocation = (_b = (_a = input.pickupAddress) === null || _a === void 0 ? void 0 : _a.pickupLocation) === null || _b === void 0 ? void 0 : _b.trim();
            if (!pickupLocation) {
                throw new Error("Seller Shiprocket pickup location is not configured");
            }
            const pickupPincode = (_d = (_c = input.pickupAddress) === null || _c === void 0 ? void 0 : _c.pincode) === null || _d === void 0 ? void 0 : _d.trim();
            if (!pickupPincode) {
                throw new Error("Seller pickup pincode is required");
            }
            // ----------------------------------------------------------
            // PAYLOAD
            // ----------------------------------------------------------
            const payload = Object.assign(Object.assign({ order_id: input.orderId.toString(), order_date: this.formatOrderDate(), 
                /**
                 * This MUST be the pickup location registered
                 * inside this Shiprocket account.
                 */
                pickup_location: pickupLocation }, (this.config.channelId
                ? {
                    channel_id: this.config.channelId,
                }
                : {})), { 
                // ========================================================
                // BILLING
                // ========================================================
                billing_customer_name: input.customer.name, billing_last_name: "", billing_address: input.customer.address, billing_address_2: input.customer.address2 || "", billing_city: input.customer.city, billing_pincode: Number(input.customer.pincode), billing_state: input.customer.state, billing_country: input.customer.country || "India", billing_email: input.customer.email || "", billing_phone: Number(input.customer.phone), 
                // ========================================================
                // SHIPPING
                // ========================================================
                shipping_is_billing: true, shipping_customer_name: input.customer.name, shipping_last_name: "", shipping_address: input.customer.address, shipping_address_2: input.customer.address2 || "", shipping_city: input.customer.city, shipping_pincode: Number(input.customer.pincode), shipping_country: input.customer.country || "India", shipping_state: input.customer.state, shipping_email: input.customer.email || "", shipping_phone: Number(input.customer.phone), 
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
                shipping_charges: 0, giftwrap_charges: 0, transaction_charges: 0, total_discount: 0, 
                // ========================================================
                // TOTAL
                // ========================================================
                sub_total: input.totalAmount, 
                // ========================================================
                // PACKAGE
                // ========================================================
                length: input.package.length, breadth: input.package.breadth, height: input.package.height, weight: input.package.weight });
            try {
                const response = yield this.client.post("/orders/create/adhoc", payload, config);
                const data = response.data;
                if ((data === null || data === void 0 ? void 0 : data.message) && !(data === null || data === void 0 ? void 0 : data.order_id) && !(data === null || data === void 0 ? void 0 : data.shipment_id)) {
                    throw new Error(`Shiprocket API rejected order: ${data.message}`);
                }
                if (data.order_id == null || data.shipment_id == null) {
                    throw new Error(`Shiprocket did not return order_id or shipment_id. Response: ${JSON.stringify(data)}`);
                }
                return {
                    provider: "shiprocket",
                    providerOrderId: String(data.order_id),
                    providerShipmentId: String(data.shipment_id),
                    awb: data.awb_code || undefined,
                    courierName: data.courier_name || undefined,
                    courierCompanyId: data.courier_company_id != null && data.courier_company_id !== ""
                        ? String(data.courier_company_id)
                        : undefined,
                    status: (0, ShiprocketStatusMapper_1.mapShiprocketStatus)(data.status, data.status_code),
                    providerStatus: data.status,
                    providerStatusCode: data.status_code != null ? String(data.status_code) : undefined,
                };
            }
            catch (error) {
                throw this.handleShiprocketError(error, "Failed to create Shiprocket shipment");
            }
        });
    }
    // ============================================================
    // GET AVAILABLE COURIERS
    // ============================================================
    // ============================================================
    // GET AVAILABLE COURIERS
    // ============================================================
    getCourierOptions(input) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            var _e;
            const config = yield this.requestConfig();
            const pickupPincode = (_a = input.pickupPincode) === null || _a === void 0 ? void 0 : _a.trim();
            const deliveryPincode = (_b = input.deliveryPincode) === null || _b === void 0 ? void 0 : _b.trim();
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
                const response = yield this.client.get("/courier/serviceability/", {
                    headers: {
                        Authorization: `Bearer ${yield this.getToken()}`,
                        "Content-Type": "application/json",
                    },
                    params: {
                        pickup_postcode: pickupPincode,
                        delivery_postcode: deliveryPincode,
                        weight: input.weight,
                        cod: input.cod ? 1 : 0,
                    },
                });
                const couriers = (_e = (_d = (_c = response.data) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.available_courier_companies) !== null && _e !== void 0 ? _e : [];
                return couriers.map((courier) => ({
                    courierCompanyId: courier.courier_company_id != null
                        ? String(courier.courier_company_id)
                        : "",
                    courierName: courier.courier_name || "",
                    rate: courier.rate != null ? Number(courier.rate) : undefined,
                    etd: courier.etd || undefined,
                    rating: courier.rating != null ? Number(courier.rating) : undefined,
                    freightCharge: courier.freight_charge != null
                        ? Number(courier.freight_charge)
                        : undefined,
                    codCharges: courier.cod_charges != null ? Number(courier.cod_charges) : undefined,
                    otherCharges: courier.other_charges != null
                        ? Number(courier.other_charges)
                        : undefined,
                    deliveryPerformance: courier.delivery_performance != null
                        ? Number(courier.delivery_performance)
                        : undefined,
                    pickupPerformance: courier.pickup_performance != null
                        ? Number(courier.pickup_performance)
                        : undefined,
                    chargeWeight: courier.charge_weight != null
                        ? Number(courier.charge_weight)
                        : undefined,
                }));
            }
            catch (error) {
                throw this.handleShiprocketError(error, "Failed to fetch available Shiprocket couriers");
            }
        });
    }
    // ============================================================
    // ASSIGN COURIER / AWB
    // ============================================================
    assignCourier(providerShipmentId, courierId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            var _b, _c, _d, _e, _f;
            const config = yield this.requestConfig();
            const shipmentId = Number(providerShipmentId);
            if (!Number.isInteger(shipmentId) || shipmentId <= 0) {
                throw new Error(`Invalid Shiprocket shipment ID: ${providerShipmentId}`);
            }
            const payload = {
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
                const response = yield this.client.post("/courier/assign/awb", payload, config);
                const data = response.data;
                const assignment = (_c = (_b = (_a = data === null || data === void 0 ? void 0 : data.response) === null || _a === void 0 ? void 0 : _a.data) !== null && _b !== void 0 ? _b : data === null || data === void 0 ? void 0 : data.data) !== null && _c !== void 0 ? _c : data;
                const awb = (_d = assignment === null || assignment === void 0 ? void 0 : assignment.awb_code) !== null && _d !== void 0 ? _d : data === null || data === void 0 ? void 0 : data.awb_code;
                const courierName = (_e = assignment === null || assignment === void 0 ? void 0 : assignment.courier_name) !== null && _e !== void 0 ? _e : data === null || data === void 0 ? void 0 : data.courier_name;
                const courierCompanyId = (_f = assignment === null || assignment === void 0 ? void 0 : assignment.courier_company_id) !== null && _f !== void 0 ? _f : data === null || data === void 0 ? void 0 : data.courier_company_id;
                if (!awb) {
                    throw new Error("Shiprocket courier assignment succeeded but no AWB was returned");
                }
                return {
                    awb: String(awb),
                    courierName: courierName || undefined,
                    courierCompanyId: courierCompanyId != null && courierCompanyId !== ""
                        ? String(courierCompanyId)
                        : undefined,
                };
            }
            catch (error) {
                throw this.handleShiprocketError(error, "Failed to assign Shiprocket courier");
            }
        });
    }
    // ============================================================
    // SCHEDULE PICKUP
    // ============================================================
    schedulePickup(providerShipmentId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f;
            var _g, _h;
            const config = yield this.requestConfig();
            const shipmentId = Number(providerShipmentId);
            if (!Number.isInteger(shipmentId) || shipmentId <= 0) {
                throw new Error(`Invalid Shiprocket shipment ID: ${providerShipmentId}`);
            }
            try {
                const response = yield this.client.post("/courier/generate/pickup", {
                    shipment_id: shipmentId,
                }, config);
                const pickupDate = (_h = (_g = (_c = (_b = (_a = response.data) === null || _a === void 0 ? void 0 : _a.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.pickup_scheduled_date) !== null && _g !== void 0 ? _g : (_e = (_d = response.data) === null || _d === void 0 ? void 0 : _d.data) === null || _e === void 0 ? void 0 : _e.pickup_scheduled_date) !== null && _h !== void 0 ? _h : (_f = response.data) === null || _f === void 0 ? void 0 : _f.pickup_scheduled_date;
                return {
                    pickupScheduledDate: pickupDate ? new Date(pickupDate) : undefined,
                };
            }
            catch (error) {
                throw this.handleShiprocketError(error, "Failed to schedule Shiprocket pickup");
            }
        });
    }
    // ============================================================
    // TRACK SHIPMENT
    // ============================================================
    getTracking(identifier) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e;
            const config = yield this.requestConfig();
            if (!identifier) {
                throw new Error("Tracking identifier is required");
            }
            try {
                const response = yield this.client.get(`/courier/track/awb/${encodeURIComponent(identifier)}`, config);
                const data = response.data;
                const trackingData = (_b = (_a = data === null || data === void 0 ? void 0 : data.tracking_data) !== null && _a !== void 0 ? _a : data === null || data === void 0 ? void 0 : data.tracking) !== null && _b !== void 0 ? _b : {};
                const activities = (_c = trackingData === null || trackingData === void 0 ? void 0 : trackingData.shipment_track_activities) !== null && _c !== void 0 ? _c : [];
                const currentStatus = (_e = (_d = trackingData === null || trackingData === void 0 ? void 0 : trackingData.shipment_status) !== null && _d !== void 0 ? _d : data === null || data === void 0 ? void 0 : data.status) !== null && _e !== void 0 ? _e : "pending";
                return {
                    status: (0, ShiprocketStatusMapper_1.mapShiprocketStatus)(currentStatus, trackingData === null || trackingData === void 0 ? void 0 : trackingData.shipment_status_id),
                    statusCode: (trackingData === null || trackingData === void 0 ? void 0 : trackingData.shipment_status_id) != null
                        ? String(trackingData.shipment_status_id)
                        : undefined,
                    providerStatus: currentStatus,
                    providerStatusCode: (trackingData === null || trackingData === void 0 ? void 0 : trackingData.shipment_status_id) != null
                        ? String(trackingData.shipment_status_id)
                        : undefined,
                    events: activities.map((event) => ({
                        status: (0, ShiprocketStatusMapper_1.mapShiprocketStatus)(event.activity, event["sr-status-label"]),
                        statusCode: event["sr-status"] != null ? String(event["sr-status"]) : undefined,
                        activity: event.activity,
                        location: event.location || undefined,
                        timestamp: new Date(event.date || event.datetime || event.timestamp),
                        providerStatus: event.activity,
                        providerStatusCode: event["sr-status"] != null ? String(event["sr-status"]) : undefined,
                    })),
                };
            }
            catch (error) {
                throw this.handleShiprocketError(error, "Failed to fetch Shiprocket tracking");
            }
        });
    }
    // ============================================================
    // CANCEL SHIPMENT
    // ============================================================
    cancelShipment(providerOrderId) {
        return __awaiter(this, void 0, void 0, function* () {
            const config = yield this.requestConfig();
            const orderId = Number(providerOrderId);
            if (!Number.isInteger(orderId) || orderId <= 0) {
                throw new Error(`Invalid Shiprocket order ID: ${providerOrderId}`);
            }
            try {
                yield this.client.post("/orders/cancel", {
                    ids: [orderId],
                }, config);
            }
            catch (error) {
                throw this.handleShiprocketError(error, "Failed to cancel Shiprocket shipment");
            }
        });
    }
    // ============================================================
    // DATE FORMAT
    // ============================================================
    formatOrderDate() {
        const date = new Date();
        const pad = (value) => String(value).padStart(2, "0");
        return [
            `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`,
            `${pad(date.getHours())}:${pad(date.getMinutes())}`,
        ].join(" ");
    }
    // ============================================================
    // ERROR HANDLER
    // ============================================================
    handleShiprocketError(error, fallbackMessage) {
        var _a;
        if (axios_1.default.isAxiosError(error)) {
            const axiosError = error;
            const responseData = (_a = axiosError.response) === null || _a === void 0 ? void 0 : _a.data;
            const message = (responseData === null || responseData === void 0 ? void 0 : responseData.message) ||
                (responseData === null || responseData === void 0 ? void 0 : responseData.error) ||
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
exports.ShiprocketProvider = ShiprocketProvider;
