import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { User } from "../models/User.js";

export const authRouter = Router();

function isGmail(email) {
  return /^[^\s@]+@gmail\.com$/i.test(String(email || "").trim());
}

authRouter.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    if (!isGmail(email)) {
      return res.status(400).json({ message: "Email must be a valid gmail address" });
    }
    if (String(password).length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const existing = await User.findOne({ email: String(email).toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: "Email is already registered" });
    }

    const hashed = await bcrypt.hash(String(password), 10);
    const user = await User.create({ email, password: hashed });

    const token = jwt.sign(
      { email: user.email },
      process.env.JWT_SECRET,
      { subject: String(user._id), expiresIn: "7d" }
    );

    return res.status(201).json({
      token,
      user: { id: user._id, email: user.email, createdAt: user.createdAt }
    });
  } catch (err) {
    return res.status(500).json({ message: "Signup failed", error: err?.message });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    if (!isGmail(email)) {
      return res.status(400).json({ message: "Email must be a valid gmail address" });
    }

    const user = await User.findOne({ email: String(email).toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(String(password), user.password);
    if (!ok) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { email: user.email },
      process.env.JWT_SECRET,
      { subject: String(user._id), expiresIn: "7d" }
    );

    return res.json({
      token,
      user: { id: user._id, email: user.email, createdAt: user.createdAt }
    });
  } catch (err) {
    return res.status(500).json({ message: "Login failed", error: err?.message });
  }
});

