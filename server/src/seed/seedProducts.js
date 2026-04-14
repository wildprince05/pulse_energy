import dotenv from "dotenv";
dotenv.config();

import { connectDb } from "../lib/connectDb.js";
import { Product } from "../models/Product.js";

const seed = [
  {
    name: "Pulse Energy Original",
    flavor: "Original",
    price: 2.49,
    image: "https://images.unsplash.com/photo-1622480916113-9000c0b4bcd0?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Pulse Energy Sugarfree",
    flavor: "Sugarfree",
    price: 2.59,
    image: "https://images.unsplash.com/photo-1615486363973-40a7c4fa2f2e?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Pulse Energy Tropical",
    flavor: "Tropical",
    price: 2.79,
    image: "https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Pulse Energy Berry",
    flavor: "Berry",
    price: 2.69,
    image: "https://images.unsplash.com/photo-1585238342028-4da8f8db6d2a?auto=format&fit=crop&w=800&q=80"
  }
];

async function run() {
  await connectDb(process.env.MONGO_URI);

  // Idempotent seed: keep one product per flavor.
  for (const p of seed) {
    await Product.updateOne(
      { flavor: p.flavor },
      { $set: p },
      { upsert: true }
    );
  }

  const count = await Product.countDocuments();
  console.log(`Seed complete. Products in DB: ${count}`);
  process.exit(0);
}

run().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});

