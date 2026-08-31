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
exports.submitReel = exports.updateReel = exports.createReel = exports.getMyReel = exports.getMyReels = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const ReelSubmission_1 = __importDefault(require("../models/ReelSubmission"));
const Campaign_1 = __importDefault(require("../models/Campaign"));
const User_1 = __importDefault(require("../models/User"));
/* =========================================================
   HELPERS
========================================================= */
function getUserId(req) {
    if (!req.id) {
        return null;
    }
    return String(req.id);
}
/* =========================================================
   EXPRESS PARAM HELPER
========================================================= */
function getParam(value) {
    var _a;
    if (!value) {
        return null;
    }
    if (Array.isArray(value)) {
        return (_a = value[0]) !== null && _a !== void 0 ? _a : null;
    }
    return value;
}
/* =========================================================
   POPULATE REEL
========================================================= */
function populateReel(reelId) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const reel = yield ReelSubmission_1.default.findById(reelId)
            .populate("campaignId", "title brand productName productImage category")
            .populate("freelancerId", "name email profilePicture")
            .lean();
        if (!reel) {
            return null;
        }
        return Object.assign(Object.assign({}, reel), { 
            // Frontend-friendly ID
            id: String(reel._id), campaign: reel.campaignId, freelancer: reel.freelancerId, campaignId: ((_a = reel.campaignId) === null || _a === void 0 ? void 0 : _a._id)
                ? String(reel.campaignId._id)
                : String(reel.campaignId), freelancerId: ((_b = reel.freelancerId) === null || _b === void 0 ? void 0 : _b._id)
                ? String(reel.freelancerId._id)
                : String(reel.freelancerId) });
    });
}
/* =========================================================
   GET MY REELS
   GET /api/reels/my
========================================================= */
const getMyReels = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = getUserId(req);
        if (!userId) {
            res.status(401).json({
                success: false,
                message: "Authentication required.",
            });
            return;
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
            res.status(401).json({
                success: false,
                message: "Invalid user ID.",
            });
            return;
        }
        /* =====================================================
           USER
        ===================================================== */
        const user = yield User_1.default.findById(userId).select("_id role");
        if (!user) {
            res.status(404).json({
                success: false,
                message: "User not found.",
            });
            return;
        }
        if (user.role !== "freelancer") {
            res.status(403).json({
                success: false,
                message: "Only freelancers can access their reel submissions.",
            });
            return;
        }
        /* =====================================================
           REELS
        ===================================================== */
        const reels = yield ReelSubmission_1.default.find({
            freelancerId: user._id,
        })
            .populate("campaignId", "title brand productName productImage category payout reelsRequired deadline platforms")
            .populate("freelancerId", "name email profilePicture")
            .sort({
            createdAt: -1,
        })
            .lean();
        const result = reels.map((reel) => { var _a, _b; return (Object.assign(Object.assign({}, reel), { id: String(reel._id), campaign: reel.campaignId, freelancer: reel.freelancerId, campaignId: ((_a = reel.campaignId) === null || _a === void 0 ? void 0 : _a._id)
                ? String(reel.campaignId._id)
                : String(reel.campaignId), freelancerId: ((_b = reel.freelancerId) === null || _b === void 0 ? void 0 : _b._id)
                ? String(reel.freelancerId._id)
                : String(reel.freelancerId) })); });
        res.status(200).json(result);
    }
    catch (error) {
        console.error("getMyReels error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to load your reels.",
        });
    }
});
exports.getMyReels = getMyReels;
/* =========================================================
   GET SINGLE REEL
   GET /api/reels/:id
========================================================= */
const getMyReel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    var _c, _d;
    try {
        const userId = getUserId(req);
        const id = getParam(req.params.id);
        if (!userId) {
            res.status(401).json({
                success: false,
                message: "Authentication required.",
            });
            return;
        }
        if (!id) {
            res.status(400).json({
                success: false,
                message: "Reel ID is required.",
            });
            return;
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({
                success: false,
                message: "Invalid reel ID.",
            });
            return;
        }
        const reel = yield ReelSubmission_1.default.findOne({
            _id: id,
            freelancerId: userId,
        })
            .populate("campaignId", "title brand productName productImage category payout reelsRequired deadline platforms")
            .populate("freelancerId", "name email profilePicture")
            .lean();
        if (!reel) {
            res.status(404).json({
                success: false,
                message: "Reel submission not found.",
            });
            return;
        }
        const result = Object.assign(Object.assign({}, reel), { campaign: reel.campaignId, freelancer: reel.freelancerId, campaignId: (_c = (_a = reel.campaignId) === null || _a === void 0 ? void 0 : _a._id) !== null && _c !== void 0 ? _c : reel.campaignId, freelancerId: (_d = (_b = reel.freelancerId) === null || _b === void 0 ? void 0 : _b._id) !== null && _d !== void 0 ? _d : reel.freelancerId });
        res.status(200).json(result);
    }
    catch (error) {
        console.error("getMyReel error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to load reel.",
        });
    }
});
exports.getMyReel = getMyReel;
/* =========================================================
   CREATE REEL
   POST /api/reels
========================================================= */
const createReel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = getUserId(req);
        if (!userId) {
            res.status(401).json({
                success: false,
                message: "Authentication required.",
            });
            return;
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
            res.status(401).json({
                success: false,
                message: "Invalid user ID.",
            });
            return;
        }
        const { campaignId, title, caption, videoUrl, thumbnailUrl, instagramUrl, youtubeUrl, status, } = req.body;
        /* =====================================================
           VALIDATION
        ===================================================== */
        if (!campaignId) {
            res.status(400).json({
                success: false,
                message: "Campaign ID is required.",
            });
            return;
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(String(campaignId))) {
            res.status(400).json({
                success: false,
                message: "Invalid campaign ID.",
            });
            return;
        }
        if (!title || !String(title).trim()) {
            res.status(400).json({
                success: false,
                message: "Reel title is required.",
            });
            return;
        }
        /* =====================================================
           USER
        ===================================================== */
        const user = yield User_1.default.findById(userId).select("_id role");
        if (!user) {
            res.status(404).json({
                success: false,
                message: "User not found.",
            });
            return;
        }
        if (user.role !== "freelancer") {
            res.status(403).json({
                success: false,
                message: "Only freelancers can submit reels.",
            });
            return;
        }
        /* =====================================================
           CAMPAIGN
        ===================================================== */
        const campaign = yield Campaign_1.default.findById(campaignId);
        if (!campaign) {
            res.status(404).json({
                success: false,
                message: "Campaign not found.",
            });
            return;
        }
        /* =====================================================
           ACCEPTANCE CHECK
        ===================================================== */
        const hasAcceptedCampaign = campaign.acceptedBy.some((acceptedUserId) => String(acceptedUserId) === String(userId));
        if (!hasAcceptedCampaign) {
            res.status(403).json({
                success: false,
                message: "You must accept this campaign before submitting content.",
            });
            return;
        }
        /* =====================================================
           REEL LIMIT
        ===================================================== */
        const existingReels = yield ReelSubmission_1.default.find({
            campaignId,
            freelancerId: userId,
        }).select("_id title status createdAt");
        console.log("EXISTING REELS:", existingReels);
        console.log("CAMPAIGN REELS REQUIRED:", campaign.reelsRequired);
        const existingReelCount = yield ReelSubmission_1.default.countDocuments({
            campaignId,
            freelancerId: userId,
            status: {
                $ne: "rejected",
            },
        });
        if (existingReelCount >= campaign.reelsRequired) {
            res.status(400).json({
                success: false,
                message: `You can submit a maximum of ${campaign.reelsRequired} reel${campaign.reelsRequired > 1 ? "s" : ""} for this campaign.`,
            });
            return;
        }
        /* =====================================================
           STATUS
        ===================================================== */
        const reelStatus = status === "submitted" ? "submitted" : "draft";
        /* =====================================================
           CREATE
        ===================================================== */
        const reel = yield ReelSubmission_1.default.create({
            campaignId,
            freelancerId: userId,
            title: String(title).trim(),
            caption: caption !== undefined ? String(caption).trim() : undefined,
            videoUrl: videoUrl !== undefined ? String(videoUrl).trim() : undefined,
            thumbnailUrl: thumbnailUrl !== undefined ? String(thumbnailUrl).trim() : undefined,
            instagramUrl: instagramUrl !== undefined ? String(instagramUrl).trim() : undefined,
            youtubeUrl: youtubeUrl !== undefined ? String(youtubeUrl).trim() : undefined,
            status: reelStatus,
            submittedAt: reelStatus === "submitted" ? new Date() : undefined,
        });
        const populatedReel = yield populateReel(reel._id);
        res.status(201).json(populatedReel);
    }
    catch (error) {
        console.error("createReel error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create reel submission.",
        });
    }
});
exports.createReel = createReel;
/* =========================================================
   UPDATE REEL
   PATCH /api/reels/:id
========================================================= */
const updateReel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = getUserId(req);
        const id = getParam(req.params.id);
        if (!userId) {
            res.status(401).json({
                success: false,
                message: "Authentication required.",
            });
            return;
        }
        if (!id) {
            res.status(400).json({
                success: false,
                message: "Reel ID is required.",
            });
            return;
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({
                success: false,
                message: "Invalid reel ID.",
            });
            return;
        }
        const reel = yield ReelSubmission_1.default.findOne({
            _id: id,
            freelancerId: userId,
        });
        if (!reel) {
            res.status(404).json({
                success: false,
                message: "Reel submission not found.",
            });
            return;
        }
        /* =====================================================
           EDITABILITY
        ===================================================== */
        if (reel.status === "under_review" ||
            reel.status === "approved" ||
            reel.status === "published") {
            res.status(400).json({
                success: false,
                message: `A reel with status "${reel.status}" cannot be edited.`,
            });
            return;
        }
        const { title, caption, videoUrl, thumbnailUrl, instagramUrl, youtubeUrl } = req.body;
        if (title !== undefined) {
            if (!String(title).trim()) {
                res.status(400).json({
                    success: false,
                    message: "Reel title cannot be empty.",
                });
                return;
            }
            reel.title = String(title).trim();
        }
        if (caption !== undefined) {
            reel.caption = String(caption).trim();
        }
        if (videoUrl !== undefined) {
            reel.videoUrl = String(videoUrl).trim();
        }
        if (thumbnailUrl !== undefined) {
            reel.thumbnailUrl = String(thumbnailUrl).trim();
        }
        if (instagramUrl !== undefined) {
            reel.instagramUrl = String(instagramUrl).trim();
        }
        if (youtubeUrl !== undefined) {
            reel.youtubeUrl = String(youtubeUrl).trim();
        }
        /* =====================================================
           CHANGES REQUESTED -> DRAFT
        ===================================================== */
        if (reel.status === "changes_requested") {
            reel.status = "draft";
        }
        yield reel.save();
        const populatedReel = yield populateReel(reel._id);
        res.status(200).json(populatedReel);
    }
    catch (error) {
        console.error("updateReel error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update reel.",
        });
    }
});
exports.updateReel = updateReel;
/* =========================================================
   SUBMIT REEL
   POST /api/reels/:id/submit
========================================================= */
const submitReel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const userId = getUserId(req);
        const id = getParam(req.params.id);
        if (!userId) {
            res.status(401).json({
                success: false,
                message: "Authentication required.",
            });
            return;
        }
        if (!id) {
            res.status(400).json({
                success: false,
                message: "Reel ID is required.",
            });
            return;
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({
                success: false,
                message: "Invalid reel ID.",
            });
            return;
        }
        /* =====================================================
           FIND REEL
        ===================================================== */
        const reel = yield ReelSubmission_1.default.findOne({
            _id: id,
            freelancerId: userId,
        });
        if (!reel) {
            res.status(404).json({
                success: false,
                message: "Reel submission not found.",
            });
            return;
        }
        /* =====================================================
           STATUS CHECK
        ===================================================== */
        if (reel.status === "under_review" ||
            reel.status === "approved" ||
            reel.status === "published") {
            res.status(400).json({
                success: false,
                message: `This reel is already ${reel.status.replace("_", " ")}.`,
            });
            return;
        }
        /* =====================================================
           REQUIRED CONTENT
        ===================================================== */
        if (!((_a = reel.title) === null || _a === void 0 ? void 0 : _a.trim())) {
            res.status(400).json({
                success: false,
                message: "Reel title is required.",
            });
            return;
        }
        if (!((_b = reel.videoUrl) === null || _b === void 0 ? void 0 : _b.trim())) {
            res.status(400).json({
                success: false,
                message: "Video URL is required before submission.",
            });
            return;
        }
        /* =====================================================
           CAMPAIGN
        ===================================================== */
        const campaign = yield Campaign_1.default.findById(reel.campaignId);
        if (!campaign) {
            res.status(404).json({
                success: false,
                message: "Campaign not found.",
            });
            return;
        }
        /* =====================================================
           ACCEPTANCE CHECK
        ===================================================== */
        const hasAcceptedCampaign = campaign.acceptedBy.some((acceptedUserId) => String(acceptedUserId) === String(userId));
        if (!hasAcceptedCampaign) {
            res.status(403).json({
                success: false,
                message: "You are no longer an accepted freelancer for this campaign.",
            });
            return;
        }
        /* =====================================================
           SUBMIT
        ===================================================== */
        reel.status = "submitted";
        reel.submittedAt = new Date();
        yield reel.save();
        const populatedReel = yield populateReel(reel._id);
        res.status(200).json(populatedReel);
    }
    catch (error) {
        console.error("submitReel error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to submit reel.",
        });
    }
});
exports.submitReel = submitReel;
