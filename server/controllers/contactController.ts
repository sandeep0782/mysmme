import { Request, Response } from "express";
import ContactInquiry, {
  ContactInquiryStatus,
  ContactInquiryType,
} from "../models/ContactInquiry";

const ALLOWED_TYPES: ContactInquiryType[] = [
  "customer-support",
  "order-support",
  "seller-support",
  "catalogue-support",
  "business",
  "technical",
  "feedback",
  "other",
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const cleanString = (value: unknown, maxLength: number): string => {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().slice(0, maxLength);
};

/* ================================================================
   CREATE CONTACT ENQUIRY
   POST /api/contact
================================================================ */

export const createContactInquiry = async (req: Request, res: Response) => {
  try {
    const {
      name,
      email,
      phone,
      type,
      reference,
      subject,
      message,
      consent,

      // Honeypot
      website,
    } = req.body;

    /*
     * Basic spam protection.
     * Real users never fill this hidden field.
     */
    if (website) {
      return res.status(200).json({
        success: true,
        message: "Your message has been received.",
      });
    }

    const cleanedName = cleanString(name, 120);

    const cleanedEmail = cleanString(email, 180).toLowerCase();

    const cleanedPhone = cleanString(phone, 30);

    const cleanedReference = cleanString(reference, 150);

    const cleanedSubject = cleanString(subject, 250);

    const cleanedMessage = cleanString(message, 5000);

    /* ------------------------------------------------------------
       Required fields
    ------------------------------------------------------------ */

    if (
      !cleanedName ||
      !cleanedEmail ||
      !type ||
      !cleanedSubject ||
      !cleanedMessage
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields.",
      });
    }

    /* ------------------------------------------------------------
       Email validation
    ------------------------------------------------------------ */

    if (!EMAIL_REGEX.test(cleanedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    /* ------------------------------------------------------------
       Type validation
    ------------------------------------------------------------ */

    if (!ALLOWED_TYPES.includes(type as ContactInquiryType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid enquiry type.",
      });
    }

    /* ------------------------------------------------------------
       Consent
    ------------------------------------------------------------ */

    const hasConsent =
      consent === true ||
      consent === "true" ||
      consent === "on" ||
      consent === 1 ||
      consent === "1";

    if (!hasConsent) {
      return res.status(400).json({
        success: false,
        message:
          "Please confirm that we may use your information to respond to your enquiry.",
      });
    }

    /* ------------------------------------------------------------
       Minimum lengths
    ------------------------------------------------------------ */

    if (cleanedName.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Please enter your full name.",
      });
    }

    if (cleanedSubject.length < 3) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid subject.",
      });
    }

    if (cleanedMessage.length < 10) {
      return res.status(400).json({
        success: false,
        message: "Please provide a little more detail in your message.",
      });
    }

    /* ------------------------------------------------------------
       SAVE
    ------------------------------------------------------------ */

    const inquiry = await ContactInquiry.create({
      name: cleanedName,

      email: cleanedEmail,

      phone: cleanedPhone || undefined,

      type,

      reference: cleanedReference || undefined,

      subject: cleanedSubject,

      message: cleanedMessage,

      consent: true,

      status: "new",

      source: "website",
    });

    return res.status(201).json({
      success: true,

      message:
        "Thank you for contacting MYSMME. Your message has been received.",

      data: {
        id: inquiry._id,
        status: inquiry.status,
        createdAt: inquiry.createdAt,
      },
    });
  } catch (error) {
    console.error("CREATE CONTACT INQUIRY ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "We could not send your message right now. Please try again.",
    });
  }
};

export const getAdminContactInquiries = async (req: Request, res: Response) => {
  try {
    const {
      page = "1",
      limit = "20",
      search = "",
      status = "",
      type = "",
    } = req.query;

    const currentPage = Math.max(Number.parseInt(String(page), 10) || 1, 1);

    const pageSize = Math.min(
      Math.max(Number.parseInt(String(limit), 10) || 20, 1),
      100,
    );

    const filter: Record<string, unknown> = {};

    /* ------------------------------------------------------------
       STATUS
    ------------------------------------------------------------ */

    const allowedStatuses: ContactInquiryStatus[] = [
      "new",
      "in-progress",
      "resolved",
      "closed",
    ];

    if (status && allowedStatuses.includes(status as ContactInquiryStatus)) {
      filter.status = status;
    }

    /* ------------------------------------------------------------
       TYPE
    ------------------------------------------------------------ */

    const allowedTypes: ContactInquiryType[] = [
      "customer-support",
      "order-support",
      "seller-support",
      "catalogue-support",
      "business",
      "technical",
      "feedback",
      "other",
    ];

    if (type && allowedTypes.includes(type as ContactInquiryType)) {
      filter.type = type;
    }

    /* ------------------------------------------------------------
       SEARCH
    ------------------------------------------------------------ */

    const cleanedSearch = String(search).trim();

    if (cleanedSearch) {
      const safeSearch = cleanedSearch.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      const regex = new RegExp(safeSearch, "i");

      filter.$or = [
        { name: regex },
        { email: regex },
        { phone: regex },
        { subject: regex },
        { message: regex },
        { reference: regex },
      ];
    }

    /* ------------------------------------------------------------
       QUERY
    ------------------------------------------------------------ */

    const skip = (currentPage - 1) * pageSize;

    const [
      inquiries,
      total,
      newCount,
      inProgressCount,
      resolvedCount,
      closedCount,
    ] = await Promise.all([
      ContactInquiry.find(filter)
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(pageSize)
        .lean(),

      ContactInquiry.countDocuments(filter),

      ContactInquiry.countDocuments({
        status: "new",
      }),

      ContactInquiry.countDocuments({
        status: "in-progress",
      }),

      ContactInquiry.countDocuments({
        status: "resolved",
      }),

      ContactInquiry.countDocuments({
        status: "closed",
      }),
    ]);

    return res.status(200).json({
      success: true,

      message: "Contact enquiries fetched successfully.",

      data: {
        inquiries,

        pagination: {
          page: currentPage,
          limit: pageSize,
          total,
          totalPages: Math.max(Math.ceil(total / pageSize), 1),
        },

        summary: {
          new: newCount,
          inProgress: inProgressCount,
          resolved: resolvedCount,
          closed: closedCount,
          total: newCount + inProgressCount + resolvedCount + closedCount,
        },
      },
    });
  } catch (error) {
    console.error("GET ADMIN CONTACT INQUIRIES ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch contact enquiries.",
    });
  }
};

export const getAdminContactInquiryById = async (
  req: Request,
  res: Response,
) => {
  try {
    const inquiry = await ContactInquiry.findById(req.params.id).lean();

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: "Contact enquiry not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Contact enquiry fetched successfully.",
      data: inquiry,
    });
  } catch (error) {
    console.error("GET CONTACT INQUIRY ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch contact enquiry.",
    });
  }
};

export const updateContactInquiryStatus = async (
  req: Request,
  res: Response,
) => {
  try {
    const { status } = req.body;

    const allowedStatuses: ContactInquiryStatus[] = [
      "new",
      "in-progress",
      "resolved",
      "closed",
    ];

    if (!allowedStatuses.includes(status as ContactInquiryStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid contact enquiry status.",
      });
    }

    const inquiry = await ContactInquiry.findByIdAndUpdate(
      req.params.id,
      {
        status,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: "Contact enquiry not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Contact enquiry status updated successfully.",
      data: inquiry,
    });
  } catch (error) {
    console.error("UPDATE CONTACT STATUS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update contact enquiry.",
    });
  }
};
