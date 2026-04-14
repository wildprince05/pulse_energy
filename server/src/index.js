import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";

import { connectDb } from "./lib/connectDb.js";
import { authRouter } from "./routes/auth.routes.js";
import { productsRouter } from "./routes/products.routes.js";
import { ordersRouter } from "./routes/orders.routes.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "pulse-energy-api" });
});

app.use("/api/auth", authRouter);
app.use("/api/products", productsRouter);
app.use("/api/orders", ordersRouter);

const port = Number(process.env.PORT) || 5000;

async function start() {
  await connectDb(process.env.MONGO_URI);
  app.listen(port, () => {
    // Intentionally minimal: helpful for local dev.
    console.log(`API listening on http://localhost:${port}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});

