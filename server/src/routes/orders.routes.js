import { Router } from "express";

import { requireAuth } from "../middleware/auth.js";
import { Product } from "../models/Product.js";
import { Order } from "../models/Order.js";

export const ordersRouter = Router();

ordersRouter.post("/", requireAuth, async (req, res) => {
  try {
    const { productId, quantity } = req.body || {};

    if (!productId || !quantity) {
      return res.status(400).json({ message: "productId and quantity are required" });
    }

    const qty = Number(quantity);
    if (!Number.isFinite(qty) || qty < 1) {
      return res.status(400).json({ message: "quantity must be a number >= 1" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const totalPrice = Number((product.price * qty).toFixed(2));
    const order = await Order.create({
      userId: req.user.id,
      productId: product._id,
      quantity: qty,
      totalPrice
    });

    return res.status(201).json(order);
  } catch (err) {
    return res.status(500).json({ message: "Failed to place order", error: err?.message });
  }
});

