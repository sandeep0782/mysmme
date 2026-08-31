import { Request, Response } from "express";
import mongoose from "mongoose";

import { logisticsService } from "../services/logistics";
import { LogisticsProviderName } from "../models/Shipping";

export const createShipment = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { sellerOrderId } = req.params as { sellerOrderId: string };
    const { provider } = req.body as {
      provider: LogisticsProviderName;
    };

    if (!mongoose.isValidObjectId(sellerOrderId)) {
      res.status(400).json({
        success: false,
        message: "Invalid seller order ID",
      });
      return;
    }

    const validProviders: LogisticsProviderName[] = [
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

    const result = await logisticsService.createShipment(
      provider,
      new mongoose.Types.ObjectId(sellerOrderId),
    );

    res.status(201).json({
      success: true,
      message: "Shipment created successfully",
      data: result,
    });
  } catch (error) {
    console.error("Create shipment error:", error);

    res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to create shipment",
    });
  }
};
