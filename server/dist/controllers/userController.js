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
exports.deleteUser = exports.updateUser = exports.addUser = exports.getAllUsers = exports.editUserProfile = void 0;
const express_1 = require("express");
const responseHandler_1 = require("../utils/responseHandler");
const User_1 = __importDefault(require("../models/User"));
const router = (0, express_1.Router)();
const editUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params; // Extract userId from request parameters
        if (!userId) {
            return (0, responseHandler_1.response)(res, 400, "User ID is required.");
        }
        const { name, email, phoneNumber } = req.body;
        const updatedUser = yield User_1.default.findByIdAndUpdate(userId, { name, email, phoneNumber }, { returnDocument: "after", runValidators: true }).select("-password -verificationToken -resetPasswordToken -resetPasswordExpires");
        if (!updatedUser) {
            return (0, responseHandler_1.response)(res, 404, "User not found.");
        }
        return (0, responseHandler_1.response)(res, 200, "User profile updated successfully.", updatedUser);
    }
    catch (error) {
        console.error("EDIT PROFILE ERROR:", error);
        return (0, responseHandler_1.response)(res, 500, (error === null || error === void 0 ? void 0 : error.message) || "Internal server error.");
    }
});
exports.editUserProfile = editUserProfile;
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_1.default.find().sort({ createdAt: -1 });
        return (0, responseHandler_1.response)(res, 200, "Users fetched successfully", users);
    }
    catch (error) {
        console.error(error);
        return (0, responseHandler_1.response)(res, 500, "Internal Server Error");
    }
});
exports.getAllUsers = getAllUsers;
// ============================================================
// ADD USER
// ============================================================
const addUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, phoneNumber, password, role, isActive, isVerified } = req.body;
        // ----------------------------------------------------------
        // VALIDATION
        // ----------------------------------------------------------
        if (!name || !name.trim()) {
            return (0, responseHandler_1.response)(res, 400, "Name is required.");
        }
        if (!email || !email.trim()) {
            return (0, responseHandler_1.response)(res, 400, "Email is required.");
        }
        if (!password) {
            return (0, responseHandler_1.response)(res, 400, "Password is required.");
        }
        if (password.length < 6) {
            return (0, responseHandler_1.response)(res, 400, "Password must be at least 6 characters long.");
        }
        const normalizedEmail = email.toLowerCase().trim();
        // ----------------------------------------------------------
        // CHECK EMAIL
        // ----------------------------------------------------------
        const existingUser = yield User_1.default.findOne({
            email: normalizedEmail,
        });
        if (existingUser) {
            return (0, responseHandler_1.response)(res, 409, "Email is already registered.");
        }
        // ----------------------------------------------------------
        // CREATE USER
        // ----------------------------------------------------------
        const user = yield User_1.default.create({
            name: name.trim(),
            email: normalizedEmail,
            phoneNumber: phoneNumber || undefined,
            password,
            role: role || "user",
            isVerified: isVerified !== undefined ? isVerified : false,
        });
        // ----------------------------------------------------------
        // REMOVE SENSITIVE DATA
        // ----------------------------------------------------------
        const createdUser = yield User_1.default.findById(user._id).select("-password -verificationToken -resetPasswordToken -resetPasswordExpires");
        return (0, responseHandler_1.response)(res, 201, "User created successfully.", createdUser);
    }
    catch (error) {
        console.error("Add user error:", error);
        return (0, responseHandler_1.response)(res, 500, "Internal server error.", error);
    }
});
exports.addUser = addUser;
// ============================================================
// UPDATE USER
// ============================================================
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { userId } = req.params;
        if (!userId) {
            return (0, responseHandler_1.response)(res, 400, "User ID is required.");
        }
        const { name, email, phoneNumber, role, isActive, isVerified, password } = req.body;
        // ----------------------------------------------------------
        // FIND USER
        // ----------------------------------------------------------
        const existingUser = yield User_1.default.findById(userId);
        if (!existingUser) {
            return (0, responseHandler_1.response)(res, 404, "User not found.");
        }
        // ----------------------------------------------------------
        // EMAIL CHECK
        // ----------------------------------------------------------
        if (email && email.toLowerCase().trim() !== existingUser.email) {
            const emailExists = yield User_1.default.findOne({
                email: email.toLowerCase().trim(),
                _id: { $ne: userId },
            });
            if (emailExists) {
                return (0, responseHandler_1.response)(res, 409, "Email is already registered.");
            }
        }
        // ----------------------------------------------------------
        // UPDATE DATA
        // ----------------------------------------------------------
        const updateData = {};
        if (name !== undefined) {
            updateData.name = name.trim();
        }
        if (email !== undefined) {
            updateData.email = email.toLowerCase().trim();
        }
        if (phoneNumber !== undefined) {
            updateData.phoneNumber = phoneNumber;
        }
        if (role !== undefined) {
            updateData.role = role;
        }
        if (isActive !== undefined) {
            updateData.isActive = isActive;
        }
        if (isVerified !== undefined) {
            updateData.isVerified = isVerified;
        }
        if (password !== undefined && password !== "") {
            if (password.length < 6) {
                return (0, responseHandler_1.response)(res, 400, "Password must be at least 6 characters long.");
            }
            updateData.password = password;
        }
        // ----------------------------------------------------------
        // UPDATE
        // ----------------------------------------------------------
        const updatedUser = yield User_1.default.findByIdAndUpdate(userId, {
            $set: updateData,
        }, {
            returnDocument: "after",
            runValidators: true,
        }).select("-password -verificationToken -resetPasswordToken -resetPasswordExpires");
        if (!updatedUser) {
            return (0, responseHandler_1.response)(res, 404, "User not found.");
        }
        return (0, responseHandler_1.response)(res, 200, "User updated successfully.", updatedUser);
    }
    catch (error) {
        console.error("Failed to save user:", error);
        if (error === null || error === void 0 ? void 0 : error.data) {
            console.error("API error data:", error.data);
        }
        if (error === null || error === void 0 ? void 0 : error.status) {
            console.error("API error status:", error.status);
        }
        const message = ((_a = error === null || error === void 0 ? void 0 : error.data) === null || _a === void 0 ? void 0 : _a.message) ||
            ((_b = error === null || error === void 0 ? void 0 : error.data) === null || _b === void 0 ? void 0 : _b.error) ||
            (error === null || error === void 0 ? void 0 : error.error) ||
            "Failed to save user. Please check the information and try again.";
    }
});
exports.updateUser = updateUser;
// ============================================================
// DELETE USER
// ============================================================
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        if (!userId) {
            return (0, responseHandler_1.response)(res, 400, "User ID is required.");
        }
        const user = yield User_1.default.findById(userId);
        if (!user) {
            return (0, responseHandler_1.response)(res, 404, "User not found.");
        }
        yield User_1.default.findByIdAndDelete(userId);
        return (0, responseHandler_1.response)(res, 200, "User deleted successfully.");
    }
    catch (error) {
        console.error("Delete user error:", error);
        return (0, responseHandler_1.response)(res, 500, "Internal server error.", error);
    }
});
exports.deleteUser = deleteUser;
