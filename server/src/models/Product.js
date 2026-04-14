import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    flavor: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, required: true, trim: true }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Product = mongoose.model("Product", productSchema);

