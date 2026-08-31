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
exports.deleteReview = exports.getProductReviews = exports.addOrUpdateReview = void 0;
const Review_1 = __importDefault(require("../models/Review"));
const Product_1 = __importDefault(require("../models/Product"));
const responseHandler_1 = require("../utils/responseHandler");
/**
 * CREATE OR UPDATE REVIEW
 */
const addOrUpdateReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.id; // from auth middleware
        const { productId } = req.params;
        const { rating, comment } = req.body; // rating & comment stay in body
        if (!rating || rating < 1 || rating > 5) {
            return (0, responseHandler_1.response)(res, 400, "Rating must be between 1 and 5");
        }
        const product = yield Product_1.default.findById(productId);
        if (!product) {
            return (0, responseHandler_1.response)(res, 404, "Product not found");
        }
        // Check if review exists
        let review = yield Review_1.default.findOne({ user: userId, product: productId });
        if (review) {
            review.rating = rating;
            review.comment = comment;
            yield review.save();
        }
        else {
            review = yield Review_1.default.create({
                user: userId,
                product: productId,
                rating,
                comment,
            });
        }
        yield updateProductRating(productId);
        return (0, responseHandler_1.response)(res, 200, "Review submitted successfully", review);
    }
    catch (error) {
        if (error.code === 11000) {
            return (0, responseHandler_1.response)(res, 400, "You already reviewed this product");
        }
        return (0, responseHandler_1.response)(res, 500, "Failed to submit review");
    }
});
exports.addOrUpdateReview = addOrUpdateReview;
/**
 * GET REVIEWS BY PRODUCT
 */
const getProductReviews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId } = req.params;
        const reviews = yield Review_1.default.find({ product: productId })
            .populate("user", "name")
            .sort({ createdAt: -1 });
        return (0, responseHandler_1.response)(res, 200, "Reviews fetched successfully", reviews);
    }
    catch (error) {
        return (0, responseHandler_1.response)(res, 500, "Failed to fetch reviews");
    }
});
exports.getProductReviews = getProductReviews;
/**
 * DELETE REVIEW
 */
const deleteReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.id;
        const { reviewId } = req.params;
        const review = yield Review_1.default.findOneAndDelete({
            _id: reviewId,
            user: userId,
        });
        if (!review) {
            return (0, responseHandler_1.response)(res, 404, "Review not found");
        }
        yield updateProductRating(review.product);
        return (0, responseHandler_1.response)(res, 200, "Review deleted successfully");
    }
    catch (error) {
        return (0, responseHandler_1.response)(res, 500, "Failed to delete review");
    }
});
exports.deleteReview = deleteReview;
/**
 * HELPER: UPDATE PRODUCT RATING
 */
const updateProductRating = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    const reviews = yield Review_1.default.find({ product: productId });
    const numReviews = reviews.length;
    const avgRating = numReviews === 0
        ? 0
        : reviews.reduce((sum, r) => sum + r.rating, 0) / numReviews;
    yield Product_1.default.findByIdAndUpdate(productId, {
        rating: Number(avgRating.toFixed(1)),
        numReviews,
    });
});
