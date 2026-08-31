"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const LogisticsController_1 = require("../controllers/LogisticsController");
const router = (0, express_1.Router)();
router.post("/seller-orders/:sellerOrderId/shipment", LogisticsController_1.createShipment);
exports.default = router;
