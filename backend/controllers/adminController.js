import Event from "../models/Event.js";
import User from "../models/User.js";

export const getAdminEvents = async (req, res) => {
  try {
    const events = await Event.find().populate("customer");
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateEventStatus = async (req, res) => {
  try {
    const { id, action } = req.params;
    const event = await Event.findById(id);

    event.status = action === "approve" ? "approved" : "rejected";
    await event.save();

    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAdminUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: "admin" } });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    user.status = req.params.action === "approve" ? "approved" : "rejected";
    await user.save();

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};