import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const User = mongoose.model("User", userSchema);

