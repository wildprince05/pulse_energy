import { Router } from "express";
import { Product } from "../models/Product.js";

export const productsRouter = Router();

productsRouter.get("/", async (_req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    return res.json(products);
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch products", error: err?.message });
  }
});

