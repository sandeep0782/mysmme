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
exports.createShipment = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const logistics_1 = require("../services/logistics");
const createShipment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sellerOrderId } = req.params;
        const { provider } = req.body;
        if (!mongoose_1.default.isValidObjectId(sellerOrderId)) {
            res.status(400).json({
                success: false,
                message: "Invalid seller order ID",
            });
            return;
        }
        const validProviders = [
            "shiprocket",
            "delhivery",
            "bluedart",
            "xpressbees",
            "other",
        ];
        if (!provider || !validProviders.includes(provider)) {
            res.status(400).json({
                success: false,
                message: "Invalid logistics provider",
            });
            return;
        }
        const result = yield logistics_1.logisticsService.createShipment(provider, new mongoose_1.default.Types.ObjectId(sellerOrderId));
        res.status(201).json({
            success: true,
            message: "Shipment created successfully",
            data: result,
        });
    }
    catch (error) {
        console.error("Create shipment error:", error);
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Failed to create shipment",
        });
    }
});
exports.createShipment = createShipment;
