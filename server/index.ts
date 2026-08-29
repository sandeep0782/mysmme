import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import cookiesParser from "cookie-parser";
import connectDB from "./config/dbConnect";
import authRoute from "./routes/authRoute";
import passport from "passport";
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

dotenv.config();

const PORT = process.env.PORT || 8000;

const app = express();
app.set("trust proxy", 1);
const allowedOrigins = [process.env.FRONTEND_URL, process.env.ADMIN_URL].filter(
  Boolean,
);
console.log("CORS allowed origins:", allowedOrigins);
app.use(
  cors({
    origin: (origin, callback) => {
      console.log("Incoming Origin:", origin);

      // Allow Postman/server-to-server requests
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("CORS BLOCKED:", origin);

      return callback(new Error(`CORS blocked origin: ${origin}`));
    },

    credentials: true,

    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Test API route
app.get("/", (req, res) => {
  res.send("Welcome to MYSMME backend! API is live ✅");
});
// app.use(cors(corsOptions))
app.use(express.json());
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(cookiesParser());

connectDB();

startProductImportWorker();

// api endpoints
app.use("/api/auth", authRoute);
app.use("/api/season", seasonRoutes);
app.use("/api/brand", brandRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/colors", colorRoutes);
app.use("/api/products", productRoute);
app.use("/api/admin/templates", templateRoutes);
app.use("/api/gst/", gstRoutes);
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

app.listen(PORT, () => {
  console.log(`Server is running on ${process.env.PORT}`);
});
