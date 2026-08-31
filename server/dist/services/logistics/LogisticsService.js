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
exports.LogisticsService = void 0;
const Shipping_1 = __importDefault(require("../../models/Shipping"));
const SellerOrder_1 = __importDefault(require("../../models/SellerOrder"));
class LogisticsService {
    constructor(providers) {
        this.providers = providers;
    }
    // ============================================================
    // GET PROVIDER
    // ============================================================
    getProvider(providerName) {
        const provider = this.providers[providerName];
        if (!provider) {
            throw new Error(`Logistics provider "${providerName}" is not configured`);
        }
        return provider;
    }
    // ============================================================
    // CREATE SHIPMENT
    // ============================================================
    createShipment(providerName, sellerOrderId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f;
            var _g, _h, _j;
            const provider = this.getProvider(providerName);
            // ============================================================
            // GET SELLER ORDER
            // ============================================================
            const sellerOrder = yield SellerOrder_1.default.findById(sellerOrderId)
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
            const seller = sellerOrder.seller;
            if (!seller) {
                throw new Error("Seller not found");
            }
            // ============================================================
            // SELLER ADDRESSES
            // ============================================================
            const sellerAddresses = (_g = seller.addresses) !== null && _g !== void 0 ? _g : [];
            // ============================================================
            // FIND PICKUP ADDRESS
            // ============================================================
            const pickupAddress = sellerAddresses.find((address) => typeof address.pickupLocation === "string" &&
                address.pickupLocation.trim().length > 0);
            if (!pickupAddress) {
                throw new Error("Seller pickup address with pickupLocation is not configured");
            }
            // ============================================================
            // VALIDATE PICKUP LOCATION
            // ============================================================
            const pickupLocation = (_a = pickupAddress.pickupLocation) === null || _a === void 0 ? void 0 : _a.trim();
            if (!pickupLocation) {
                throw new Error("Seller pickup location is required");
            }
            // ============================================================
            // VALIDATE PICKUP PINCODE
            // ============================================================
            const pickupPincode = (_b = pickupAddress.pincode) === null || _b === void 0 ? void 0 : _b.trim();
            if (!pickupPincode) {
                throw new Error("Seller pickup address pincode is required");
            }
            // ============================================================
            // ORDER
            // ============================================================
            const order = sellerOrder.order;
            if (!order) {
                throw new Error("Order not found");
            }
            // ============================================================
            // CUSTOMER DELIVERY ADDRESS
            // ============================================================
            const address = order.shippingAddress;
            if (!address) {
                throw new Error("Shipping address not found");
            }
            const deliveryPincode = (_c = address.pincode) === null || _c === void 0 ? void 0 : _c.trim();
            if (!deliveryPincode) {
                throw new Error("Customer delivery pincode is required");
            }
            // ============================================================
            // CREATE SHIPMENT INPUT
            // ============================================================
            const shipmentInput = {
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
                    name: (_h = (_d = order.user) === null || _d === void 0 ? void 0 : _d.name) !== null && _h !== void 0 ? _h : "",
                    email: (_e = order.user) === null || _e === void 0 ? void 0 : _e.email,
                    phone: address.phoneNumber,
                    address: address.addressLine1,
                    address2: address.addressLine2 || "",
                    city: address.city,
                    state: address.state,
                    country: (_j = address.country) !== null && _j !== void 0 ? _j : "India",
                    pincode: deliveryPincode,
                },
                // ==========================================================
                // ITEMS
                // ==========================================================
                items: sellerOrder.items.map((item) => {
                    var _a;
                    var _b, _c;
                    const product = item.product;
                    return {
                        name: item.productName,
                        sku: (_c = (_b = product === null || product === void 0 ? void 0 : product.skuId) !== null && _b !== void 0 ? _b : product === null || product === void 0 ? void 0 : product.productId) !== null && _c !== void 0 ? _c : (_a = product === null || product === void 0 ? void 0 : product._id) === null || _a === void 0 ? void 0 : _a.toString(),
                        quantity: item.quantity,
                        price: item.unitPrice,
                        hsn: product === null || product === void 0 ? void 0 : product.hsnId,
                    };
                }),
                // ==========================================================
                // PAYMENT
                // ==========================================================
                paymentMethod: ((_f = order.paymentMethod) === null || _f === void 0 ? void 0 : _f.toLowerCase()) === "cod" ? "COD" : "Prepaid",
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
            const result = yield provider.createShipment(shipmentInput);
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
            const courierOptions = yield provider.getCourierOptions({
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
            if (!(selectedCourier === null || selectedCourier === void 0 ? void 0 : selectedCourier.courierCompanyId)) {
                throw new Error("Selected courier does not have a courier company ID");
            }
            const assignment = yield provider.assignCourier(result.providerShipmentId, selectedCourier.courierCompanyId);
            // ============================================================
            // VALIDATE AWB
            // ============================================================
            if (!(assignment === null || assignment === void 0 ? void 0 : assignment.awb)) {
                throw new Error("Shiprocket courier was assigned but AWB was not returned");
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
            const pickup = yield provider.schedulePickup(result.providerShipmentId);
            // ============================================================
            // SAVE SHIPPING
            // ============================================================
            const shipping = yield Shipping_1.default.create({
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
        });
    }
}
exports.LogisticsService = LogisticsService;
