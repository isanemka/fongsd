import express, { Request, Response } from "express";
import User from "../models/User";
import { generateToken } from "../utils/jwt";

const router = express.Router();

// Register
router.post("/register", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "E-post används redan" });
      return;
    }

    const newUser = new User({ email, password });
    await newUser.save();

    res.status(201).json({ token: generateToken(newUser.id) });
  } catch (err) {
    res.status(500).json({ message: "Serverfel" });
  }
});

// Login
router.post("/login", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "Fel e-post eller lösenord" });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(400).json({ message: "Fel e-post eller lösenord" });
      return;
    }

    res.json({ token: generateToken(user.id) });
  } catch (err) {
    res.status(500).json({ message: "Serverfel" });
  }
});

export default router;