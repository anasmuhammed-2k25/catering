import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { name, email, password, phone, role, experience, bio } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "Missing fields" });

    const exist = await User.findOne({ email });
    if (exist) return res.status(400).json({ message: "User exists" });

    const user = new User({ name, email, password, phone, role, experience, bio });
    await user.save();

    const token = jwt.sign({ id: user._id }, "supersecretkey", { expiresIn: "7d" });

    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
      password: req.body.password
    });

    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, "supersecretkey", { expiresIn: "7d" });

    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};