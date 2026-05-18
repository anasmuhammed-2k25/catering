import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  phone: String,
  role: String,
  experience: String,
  bio: String,
  status: { type: String, default: "pending" },
});

export default mongoose.model("User", userSchema);