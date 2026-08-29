import { Router } from "express";

import { createShipment } from "../controllers/LogisticsController";

const router = Router();

router.post("/seller-orders/:sellerOrderId/shipment", createShipment);

export default router;
