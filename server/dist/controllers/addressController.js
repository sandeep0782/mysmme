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
exports.createOrUpdateAddressByUserId = exports.getAddressByUserId = void 0;
const Address_1 = __importDefault(require("../models/Address"));
const responseHandler_1 = require("../utils/responseHandler");
const User_1 = __importDefault(require("../models/User"));
const getAddressByUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.id;
        if (!userId) {
            return (0, responseHandler_1.response)(res, 400, "User not found");
        }
        const user = yield User_1.default.findById(userId).populate("addresses");
        if (!user) {
            return (0, responseHandler_1.response)(res, 404, "User not found");
        }
        return (0, responseHandler_1.response)(res, 200, "Addresses fetched successfully", user.addresses || []);
    }
    catch (error) {
        console.error("Get address error:", error);
        return (0, responseHandler_1.response)(res, 500, "Error fetching addresses");
    }
});
exports.getAddressByUserId = getAddressByUserId;
const createOrUpdateAddressByUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.id;
        const { phoneNumber, addressLine1, addressLine2, city, state, pincode, country, addressId, } = req.body;
        if (!userId) {
            return (0, responseHandler_1.response)(res, 400, "User not found");
        }
        // Required fields based on your Address schema
        if (!addressLine1 || !city || !state || !pincode) {
            return (0, responseHandler_1.response)(res, 400, "Address line, city, state and pincode are required");
        }
        /* -------------------------------- */
        /* UPDATE EXISTING ADDRESS          */
        /* -------------------------------- */
        if (addressId) {
            const existingAddress = yield Address_1.default.findOne({
                _id: addressId,
                user: userId,
            });
            if (!existingAddress) {
                return (0, responseHandler_1.response)(res, 404, "Address not found");
            }
            existingAddress.addressLine1 = addressLine1;
            existingAddress.addressLine2 = addressLine2 || "";
            existingAddress.phoneNumber = phoneNumber || "";
            existingAddress.city = city;
            existingAddress.state = state;
            existingAddress.pincode = pincode;
            existingAddress.country = country || "India";
            yield existingAddress.save();
            return (0, responseHandler_1.response)(res, 200, "Address updated successfully", existingAddress);
        }
        /* -------------------------------- */
        /* CREATE NEW ADDRESS               */
        /* -------------------------------- */
        const newAddress = yield Address_1.default.create({
            user: userId,
            addressLine1,
            addressLine2: addressLine2 || "",
            phoneNumber: phoneNumber || "",
            city,
            state,
            pincode,
            country: country || "India",
        });
        yield User_1.default.findByIdAndUpdate(userId, {
            $push: {
                addresses: newAddress._id,
            },
        });
        return (0, responseHandler_1.response)(res, 201, "Address added successfully", newAddress);
    }
    catch (error) {
        console.error("Create/update address error:", error);
        return (0, responseHandler_1.response)(res, 500, "Error creating or updating address");
    }
});
exports.createOrUpdateAddressByUserId = createOrUpdateAddressByUserId;
