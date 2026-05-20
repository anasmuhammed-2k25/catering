import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const register = async (req, res) => {
  try {
    const { name, email, password, phone, role, experience, bio } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "Missing fields" });

    const exist = await User.findOne({ email });
    if (exist) return res.status(400).json({ message: "User exists" });

    // Encrypt the password using bcryptjs
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({ 
      name, 
      email, 
      password: hashedPassword, 
      phone, 
      role, 
      experience, 
      bio 
    });
    await user.save();

    // Sign the token with user ID and role
    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET || "supersecretkey", 
      { expiresIn: "7d" }
    );

    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Missing credentials" });

    // Retrieve user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Compare input password with the hashed password in database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Sign the token with user ID and role
    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET || "supersecretkey", 
      { expiresIn: "7d" }
    );

    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};