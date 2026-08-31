"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLogisticsProviders = createLogisticsProviders;
const ShiprocketProvider_1 = require("./shiprocket/ShiprocketProvider");
function requireEnv(name) {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
}
function createLogisticsProviders() {
    const providers = {};
    providers.shiprocket = new ShiprocketProvider_1.ShiprocketProvider({
        email: requireEnv("SHIPROCKET_EMAIL"),
        password: requireEnv("SHIPROCKET_PASSWORD"),
        channelId: process.env.SHIPROCKET_CHANNEL_ID
            ? Number(process.env.SHIPROCKET_CHANNEL_ID)
            : undefined,
    });
    return providers;
}
