import User from "../models/User.js";

export const updateProfile = async (req, res) => {
  try {
    const { name, phone, experience, bio } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone, experience, bio },
      { new: true }
    );
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getApprovedWorkers = async (req, res) => {
  try {
    const workers = await User.find({ role: "worker", status: "approved" });
    res.json(workers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
