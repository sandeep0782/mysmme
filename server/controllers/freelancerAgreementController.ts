import { Request, Response } from "express";
import crypto from "crypto";

import FreelancerAgreement from "../models/freelancerAgreement";

const CURRENT_AGREEMENT_VERSION = "1.0";

function getLoggedInUserId(req: Request) {
  const request = req as any;

  return (
    request.user?._id ||
    request.user?.id ||
    request.userId ||
    request.id ||
    null
  );
}

export const getFreelancerAgreement = async (req: Request, res: Response) => {
  try {
    const userId = getLoggedInUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    const agreement = await FreelancerAgreement.findOne({
      user: userId,
      agreementVersion: CURRENT_AGREEMENT_VERSION,
    }).lean();

    if (!agreement) {
      return res.status(200).json({
        success: true,
        data: {
          accepted: false,
          acceptedAt: null,
          version: CURRENT_AGREEMENT_VERSION,
          acceptanceReference: null,
        },
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        accepted: agreement.accepted,
        acceptedAt: agreement.acceptedAt,
        version: agreement.agreementVersion,
        acceptanceReference: agreement.acceptanceReference || null,
      },
    });
  } catch (error) {
    console.error("GET FREELANCER AGREEMENT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load agreement status.",
    });
  }
};

export const acceptFreelancerAgreement = async (
  req: Request,
  res: Response,
) => {
  try {
    const userId = getLoggedInUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    const { accepted, version = CURRENT_AGREEMENT_VERSION } = req.body;

    if (!accepted) {
      return res.status(400).json({
        success: false,
        message: "Agreement acceptance is required.",
      });
    }

    if (version !== CURRENT_AGREEMENT_VERSION) {
      return res.status(400).json({
        success: false,
        message: "The agreement version is invalid or outdated.",
      });
    }

    let agreement = await FreelancerAgreement.findOne({
      user: userId,
      agreementVersion: CURRENT_AGREEMENT_VERSION,
    });

    if (agreement?.accepted) {
      return res.status(200).json({
        success: true,
        message: "Agreement already accepted.",
        data: {
          accepted: true,
          acceptedAt: agreement.acceptedAt,
          version: agreement.agreementVersion,
          acceptanceReference: agreement.acceptanceReference,
        },
      });
    }

    const acceptanceReference = `AGR-${crypto
      .randomBytes(6)
      .toString("hex")
      .toUpperCase()}`;

    if (!agreement) {
      agreement = await FreelancerAgreement.create({
        user: userId,
        agreementVersion: CURRENT_AGREEMENT_VERSION,
        accepted: true,
        acceptedAt: new Date(),
        acceptanceReference,
      });
    } else {
      agreement.accepted = true;
      agreement.acceptedAt = new Date();
      agreement.acceptanceReference = acceptanceReference;

      await agreement.save();
    }

    return res.status(200).json({
      success: true,
      message: "Agreement accepted successfully.",
      data: {
        accepted: true,
        acceptedAt: agreement.acceptedAt,
        version: agreement.agreementVersion,
        acceptanceReference: agreement.acceptanceReference,
      },
    });
  } catch (error) {
    console.error("ACCEPT FREELANCER AGREEMENT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to accept agreement.",
    });
  }
};
