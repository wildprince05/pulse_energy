import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";

import { connectDb } from "../src/lib/connectDb.js";
import { authRouter } from "../src/routes/auth.routes.js";
import { productsRouter } from "../src/routes/products.routes.js";
import { ordersRouter } from "../src/routes/orders.routes.js";

dotenv.config();

const app = express();

// 🔹 Root route (fixes 404 on "/")
app.get("/", (req, res) => {
  res.status(200).send("Backend is live 🚀");
});

// 🔹 Middleware
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "*", // safer for testing
    credentials: true,
  })
);

app.use(express.json());
app.use(morgan("dev"));

// 🔹 Health check
app.get("/api/health", (_req, res) => {
  res.status(200).json({ ok: true, service: "pulse-energy-api" });
});

// 🔹 Routes
app.use("/api/auth", authRouter);
app.use("/api/products", productsRouter);
app.use("/api/orders", ordersRouter);

// 🔥 DB connection (optimized for serverless)
let isConnected = false;

async function connectOnce() {
  if (!isConnected) {
    const mongoUri =
      process.env.MONGO_URI || process.env.MONGODB_URI || process.env.DATABASE_URL;

    if (!mongoUri) {
      throw new Error(
        "❌ Missing MongoDB connection string. Set MONGO_URI (or MONGODB_URI / DATABASE_URL) in your deployment environment."
      );
    }

    await connectDb(mongoUri);
    isConnected = true;
    console.log("✅ MongoDB connected");
  }
}

// 🔥 Vercel serverless handler
export default async function handler(req, res) {
  try {
    await connectOnce();
    return app(req, res);
  } catch (error) {
    console.error("❌ Server error:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: error.message,
    });
  }
}