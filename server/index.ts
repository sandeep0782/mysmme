import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors, { CorsOptions } from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";

import connectDB from "./config/dbConnect";
import authRoute from "./routes/authRoute";
import "./controllers/strategy/google.strategy";

import seasonRoutes from "./routes/seasonRoutes";
import brandRoutes from "./routes/brandRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import colorRoutes from "./routes/colorRoutes";
import productRoute from "./routes/productRoutes";
import templateRoutes from "./routes/templateRoutes";
import gstRoutes from "./routes/gstRoutes";
import productAttributeRoutes from "./routes/productAttributeRoutes";
import productImportRoutes from "./routes/productImportRoutes";
import { startProductImportWorker } from "./workers/productImportWorker";
import cartRoutes from "./routes/cartRoutes";
import wishListRoutes from "./routes/wishListRoutes";
import orderRoutes from "./routes/orderRoutes";
import userRoutes from "./routes/userRoutes";
import addressRoutes from "./routes/addressRoutes";
import sellerOrderRoutes from "./routes/sellerOrderRoutes";
import logisticsRoutes from "./routes/LogisticsRoutes";
import campaignRoutes from "./routes/campaignRoutes";
import reelRoutes from "./routes/reelRoutes";

// Load environment variables BEFORE importing/starting
// anything that depends on process.env.
dotenv.config();

const PORT = Number(process.env.PORT) || 8000;

const app = express();

app.set("trust proxy", 1);

// -----------------------------------------------------
// CORS
// -----------------------------------------------------

const allowedOrigins = [
  process.env.NEXT_PUBLIC_SITE_URL,
  process.env.NEXT_PUBLIC_ADMIN_URL,
].filter((origin): origin is string => Boolean(origin));

console.log("CORS allowed origins:", allowedOrigins);

const corsOptions: CorsOptions = {
  origin: (
    origin: string | undefined,
    callback: (error: Error | null, allow?: boolean) => void,
  ) => {
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

app.use(cors(corsOptions));

// -----------------------------------------------------
// Middleware
// -----------------------------------------------------

app.use(express.json());

app.use(cookieParser());

app.use(passport.initialize());

// -----------------------------------------------------
// Health check
// -----------------------------------------------------

app.get("/", (_req: Request, res: Response) => {
  res.status(200).send("Welcome to MYSMME backend! API is live ✅");
});

// -----------------------------------------------------
// Database
// -----------------------------------------------------

connectDB();

// -----------------------------------------------------
// Background workers
// -----------------------------------------------------

startProductImportWorker();

// -----------------------------------------------------
// API Routes
// -----------------------------------------------------

app.use("/api/auth", authRoute);

app.use("/api/season", seasonRoutes);
app.use("/api/brand", brandRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/colors", colorRoutes);

app.use("/api/products", productRoute);

app.use("/api/admin/templates", templateRoutes);

app.use("/api/gst", gstRoutes);

app.use("/api/product-attributes", productAttributeRoutes);

app.use("/api/product-imports", productImportRoutes);

app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishListRoutes);

app.use("/api/order", orderRoutes);

app.use("/api/users", userRoutes);
app.use("/api/user/address", addressRoutes);

app.use("/api/seller/orders", sellerOrderRoutes);

app.use("/api/logistics", logisticsRoutes);

app.use("/api/campaigns", campaignRoutes);

app.use("/api/reels", reelRoutes);

// -----------------------------------------------------
// Start server
// -----------------------------------------------------

app.listen(PORT, "0.0.0.0", () => {
  console.log(`MYSMME server is running on port ${PORT}`);
});
