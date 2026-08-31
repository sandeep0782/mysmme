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
exports.acceptCampaign = exports.getMyCampaigns = exports.getAvailableCampaigns = exports.getCampaign = exports.createCampaign = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Campaign_1 = __importDefault(require("../models/Campaign"));
const responseHandler_1 = require("../utils/responseHandler");
const createCampaign = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, productName, productImage, category, description, payout, reelsRequired, deadline, estimatedReach, platforms, tags, } = req.body;
        if (!title ||
            !productName ||
            !productImage ||
            !category ||
            !description ||
            payout === undefined ||
            !deadline) {
            return (0, responseHandler_1.response)(res, 400, "Please provide all required campaign fields");
        }
        const campaign = yield Campaign_1.default.create({
            title,
            productName,
            productImage,
            category,
            description,
            payout,
            reelsRequired: reelsRequired !== null && reelsRequired !== void 0 ? reelsRequired : 1,
            deadline,
            estimatedReach: estimatedReach !== null && estimatedReach !== void 0 ? estimatedReach : "0",
            applicants: 0,
            platforms: platforms !== null && platforms !== void 0 ? platforms : [],
            tags: tags !== null && tags !== void 0 ? tags : [],
            acceptedBy: [],
        });
        return res.status(201).json(campaign);
    }
    catch (error) {
        console.error("createCampaign:", error);
        return (0, responseHandler_1.response)(res, 500, "Failed to create campaign");
    }
});
exports.createCampaign = createCampaign;
const getCampaign = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (Array.isArray(id)) {
            return (0, responseHandler_1.response)(res, 400, "Invalid campaign ID");
        }
        const campaign = yield Campaign_1.default.findById(id);
        if (!campaign) {
            return (0, responseHandler_1.response)(res, 404, "Campaign not found");
        }
        return res.status(200).json(campaign);
    }
    catch (error) {
        console.error("getCampaign:", error);
        return (0, responseHandler_1.response)(res, 500, "Failed to get campaign");
    }
});
exports.getCampaign = getCampaign;
const getAvailableCampaigns = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { search, category, sort = "recommended" } = req.query;
        const filter = {};
        // Exclude campaigns already accepted by the logged-in freelancer
        if (req.id) {
            filter.acceptedBy = {
                $ne: new mongoose_1.default.Types.ObjectId(req.id),
            };
        }
        if (category) {
            filter.category = category;
        }
        if (search) {
            filter.$or = [
                {
                    title: {
                        $regex: search,
                        $options: "i",
                    },
                },
                {
                    productName: {
                        $regex: search,
                        $options: "i",
                    },
                },
                {
                    description: {
                        $regex: search,
                        $options: "i",
                    },
                },
            ];
        }
        let query = Campaign_1.default.find(filter);
        if (sort === "highest_payout") {
            query = query.sort({ payout: -1 });
        }
        else if (sort === "deadline") {
            query = query.sort({ deadline: 1 });
        }
        else {
            query = query.sort({ createdAt: -1 });
        }
        const campaigns = yield query.lean();
        const formattedCampaigns = campaigns.map((campaign) => (Object.assign(Object.assign({}, campaign), { id: campaign._id.toString() })));
        return res.status(200).json(formattedCampaigns);
    }
    catch (error) {
        console.error("getAvailableCampaigns:", error);
        return (0, responseHandler_1.response)(res, 500, "Failed to load campaigns");
    }
});
exports.getAvailableCampaigns = getAvailableCampaigns;
const getMyCampaigns = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const campaigns = yield Campaign_1.default.find({
            acceptedBy: new mongoose_1.default.Types.ObjectId(req.id),
        })
            .sort({ createdAt: -1 })
            .lean();
        const formattedCampaigns = campaigns.map((campaign) => (Object.assign(Object.assign({}, campaign), { id: campaign._id.toString() })));
        return res.status(200).json(formattedCampaigns);
    }
    catch (error) {
        console.error("getMyCampaigns:", error);
        return (0, responseHandler_1.response)(res, 500, "Failed to load your campaigns");
    }
});
exports.getMyCampaigns = getMyCampaigns;
const acceptCampaign = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (Array.isArray(id)) {
            return (0, responseHandler_1.response)(res, 400, "Invalid campaign ID");
        }
        const campaign = yield Campaign_1.default.findById(id);
        if (!campaign) {
            return (0, responseHandler_1.response)(res, 404, "Campaign not found");
        }
        const alreadyAccepted = campaign.acceptedBy.some((userId) => userId.toString() === req.id);
        if (alreadyAccepted) {
            return res.status(200).json({
                success: true,
                message: "Campaign already accepted",
                data: campaign,
            });
        }
        campaign.acceptedBy.push(new mongoose_1.default.Types.ObjectId(req.id));
        campaign.applicants += 1;
        yield campaign.save();
        return res.status(200).json(campaign);
    }
    catch (error) {
        console.error("acceptCampaign:", error);
        return (0, responseHandler_1.response)(res, 500, "Failed to accept campaign");
    }
});
exports.acceptCampaign = acceptCampaign;
