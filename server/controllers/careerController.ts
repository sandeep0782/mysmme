import { Request, Response } from "express";
import JobApplication from "../models/JobApplication";

const roles = {
  "technology-developer": {
    title: "Technology / Full-Stack Developer",
    type: "Full-time / Freelance",
  },

  "marketing-manager": {
    title: "Marketing Manager",
    type: "Full-time",
  },

  freelancers: {
    title: "Freelancers & Creative Partners",
    type: "Freelance / Project-based",
  },
} as const;

/**
 * Create a new job application
 */
export const createJobApplication = async (req: Request, res: Response) => {
  try {
    const {
      name,
      email,
      phone,
      role,
      experience,
      location,
      linkedin,
      github,
      portfolio,
      coverLetter,
    } = req.body;

    // --------------------------------
    // Required fields
    // --------------------------------

    if (!name || !email || !role) {
      return res.status(400).json({
        success: false,
        message: "Name, email and role are required.",
      });
    }

    // --------------------------------
    // Validate role
    // --------------------------------

    if (!(role in roles)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job role.",
      });
    }

    // --------------------------------
    // Normalize values
    // --------------------------------

    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedName) {
      return res.status(400).json({
        success: false,
        message: "Name cannot be empty.",
      });
    }

    if (!normalizedEmail) {
      return res.status(400).json({
        success: false,
        message: "Email cannot be empty.",
      });
    }

    // --------------------------------
    // Check duplicate application
    // --------------------------------

    const existingApplication = await JobApplication.findOne({
      email: normalizedEmail,
      role,
      status: {
        $ne: "rejected",
      },
    });

    if (existingApplication) {
      return res.status(409).json({
        success: false,
        message: "You have already applied for this position.",
      });
    }

    // --------------------------------
    // Create application
    // --------------------------------

    const application = await JobApplication.create({
      name: normalizedName,
      email: normalizedEmail,

      phone: phone?.trim(),

      role,

      experience: experience?.trim(),
      location: location?.trim(),

      linkedin: linkedin?.trim(),
      github: github?.trim(),
      portfolio: portfolio?.trim(),

      coverLetter: coverLetter?.trim(),

      status: "pending",
    });

    // --------------------------------
    // Success response
    // --------------------------------

    return res.status(201).json({
      success: true,
      message: "Application submitted successfully.",
      data: {
        id: application._id,
        status: application.status,
        role: application.role,
        createdAt: application.createdAt,
      },
    });
  } catch (error) {
    console.error("Create job application error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to submit application.",
    });
  }
};
