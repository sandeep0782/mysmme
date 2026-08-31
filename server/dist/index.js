"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const passport_1 = __importDefault(require("passport"));
const dbConnect_1 = __importDefault(require("./config/dbConnect"));
const authRoute_1 = __importDefault(require("./routes/authRoute"));
require("./controllers/strategy/google.strategy");
const seasonRoutes_1 = __importDefault(require("./routes/seasonRoutes"));
const brandRoutes_1 = __importDefault(require("./routes/brandRoutes"));
const categoryRoutes_1 = __importDefault(require("./routes/categoryRoutes"));
const colorRoutes_1 = __importDefault(require("./routes/colorRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const templateRoutes_1 = __importDefault(require("./routes/templateRoutes"));
const gstRoutes_1 = __importDefault(require("./routes/gstRoutes"));
const productAttributeRoutes_1 = __importDefault(require("./routes/productAttributeRoutes"));
const productImportRoutes_1 = __importDefault(require("./routes/productImportRoutes"));
const productImportWorker_1 = require("./workers/productImportWorker");
const cartRoutes_1 = __importDefault(require("./routes/cartRoutes"));
const wishListRoutes_1 = __importDefault(require("./routes/wishListRoutes"));
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const addressRoutes_1 = __importDefault(require("./routes/addressRoutes"));
const sellerOrderRoutes_1 = __importDefault(require("./routes/sellerOrderRoutes"));
const LogisticsRoutes_1 = __importDefault(require("./routes/LogisticsRoutes"));
const campaignRoutes_1 = __importDefault(require("./routes/campaignRoutes"));
const reelRoutes_1 = __importDefault(require("./routes/reelRoutes"));
// Load environment variables BEFORE importing/starting
// anything that depends on process.env.
dotenv_1.default.config();
const PORT = Number(process.env.PORT) || 8000;
const app = (0, express_1.default)();
app.set("trust proxy", 1);
// -----------------------------------------------------
// CORS
// -----------------------------------------------------
const allowedOrigins = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.NEXT_PUBLIC_ADMIN_URL,
].filter((origin) => Boolean(origin));
console.log("CORS allowed origins:", allowedOrigins);
const corsOptions = {
    origin: (origin, callback) => {
        console.log("Incoming Origin:", origin);
        // Allow requests without an Origin header.
        // Examples:
        // - Postman
        // - server-to-server requests
        // - some CLI requests
        if (!origin) {
            return callback(null, true);
        }
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        console.log("CORS BLOCKED:", origin);
        // Returning false lets CORS reject the request.
        return callback(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
};
app.use((0, cors_1.default)(corsOptions));
// -----------------------------------------------------
// Middleware
// -----------------------------------------------------
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(passport_1.default.initialize());
// -----------------------------------------------------
// Health check
// -----------------------------------------------------
app.get("/", (_req, res) => {
    res.status(200).send("Welcome to MYSMME backend! API is live ✅");
});
// -----------------------------------------------------
// Database
// -----------------------------------------------------
(0, dbConnect_1.default)();
// -----------------------------------------------------
// Background workers
// -----------------------------------------------------
(0, productImportWorker_1.startProductImportWorker)();
// -----------------------------------------------------
// API Routes
// -----------------------------------------------------
app.use("/api/auth", authRoute_1.default);
app.use("/api/season", seasonRoutes_1.default);
app.use("/api/brand", brandRoutes_1.default);
app.use("/api/category", categoryRoutes_1.default);
app.use("/api/colors", colorRoutes_1.default);
app.use("/api/products", productRoutes_1.default);
app.use("/api/admin/templates", templateRoutes_1.default);
app.use("/api/gst", gstRoutes_1.default);
app.use("/api/product-attributes", productAttributeRoutes_1.default);
app.use("/api/product-imports", productImportRoutes_1.default);
app.use("/api/cart", cartRoutes_1.default);
app.use("/api/wishlist", wishListRoutes_1.default);
app.use("/api/order", orderRoutes_1.default);
app.use("/api/users", userRoutes_1.default);
app.use("/api/user/address", addressRoutes_1.default);
app.use("/api/seller/orders", sellerOrderRoutes_1.default);
app.use("/api/logistics", LogisticsRoutes_1.default);
app.use("/api/campaigns", campaignRoutes_1.default);
app.use("/api/reels", reelRoutes_1.default);
// -----------------------------------------------------
// Start server
// -----------------------------------------------------
app.listen(PORT, "0.0.0.0", () => {
    console.log(`MYSMME server is running on port ${PORT}`);
});
