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
exports.updateCartItemQuantity = exports.getCart = exports.removeFromCart = exports.addToCart = void 0;
const cartItems_1 = __importDefault(require("../models/cartItems"));
const Product_1 = __importDefault(require("../models/Product"));
const responseHandler_1 = require("../utils/responseHandler");
const addToCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req === null || req === void 0 ? void 0 : req.id;
        const { productId, quantity } = req.body;
        const product = yield Product_1.default.findById(productId);
        if (!product) {
            return (0, responseHandler_1.response)(res, 404, "Product not found");
        }
        // if (product.seller.toString() === userId) {
        //   return response(res, 400, "You cannot add your own product to the cart");
        // }
        let cart = yield cartItems_1.default.findOne({ user: userId });
        if (!cart) {
            cart = new cartItems_1.default({ user: userId, items: [] });
        }
        const existingItem = cart.items.find((item) => item.product.toString() === productId);
        if (existingItem) {
            existingItem.quantity += quantity;
        }
        else {
            const newItem = {
                product: productId,
                quantity: quantity,
            };
            cart.items.push(newItem);
        }
        yield cart.save();
        (0, responseHandler_1.response)(res, 200, "Item added to cart", cart);
    }
    catch (error) {
        (0, responseHandler_1.response)(res, 500, "Error adding item to cart");
    }
});
exports.addToCart = addToCart;
const removeFromCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req === null || req === void 0 ? void 0 : req.id;
        const { productId } = req.params;
        const cart = yield cartItems_1.default.findOne({ user: userId });
        if (!cart) {
            return (0, responseHandler_1.response)(res, 404, "Cart not found");
        }
        cart.items = cart.items.filter((item) => item.product.toString() !== productId);
        yield cart.save();
        (0, responseHandler_1.response)(res, 200, "Item removed from cart", cart);
    }
    catch (error) {
        (0, responseHandler_1.response)(res, 500, "Error removing item from cart");
    }
});
exports.removeFromCart = removeFromCart;
const getCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        const cart = yield cartItems_1.default.findOne({ user: userId }).populate("items.product");
        if (!cart) {
            return (0, responseHandler_1.response)(res, 200, "Cart is empty", { items: [] });
        }
        (0, responseHandler_1.response)(res, 200, "Cart fetched successfully", cart);
    }
    catch (error) {
        console.error("Error fetching cart:", error);
        (0, responseHandler_1.response)(res, 500, "Error fetching cart");
    }
});
exports.getCart = getCart;
// controllers/cartController.ts
const updateCartItemQuantity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.id; // make sure your auth middleware sets this
        const { productId } = req.params;
        const { quantity } = req.body;
        if (!productId || quantity == null) {
            return (0, responseHandler_1.response)(res, 400, "Product ID and quantity are required");
        }
        const cart = yield cartItems_1.default.findOne({ user: userId });
        if (!cart) {
            return (0, responseHandler_1.response)(res, 404, "Cart not found");
        }
        const item = cart.items.find((item) => item.product.toString() === productId);
        if (!item) {
            return (0, responseHandler_1.response)(res, 404, "Product not found in cart");
        }
        item.quantity = quantity; // update quantity
        yield cart.save();
        (0, responseHandler_1.response)(res, 200, "Cart updated successfully", cart);
    }
    catch (error) {
        console.error(error);
        (0, responseHandler_1.response)(res, 500, "Error updating cart item");
    }
});
exports.updateCartItemQuantity = updateCartItemQuantity;
