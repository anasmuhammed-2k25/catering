import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: Date,
  location: String,
  city: String,
  guestCount: Number,
  cuisine: String,
  budget: Number,
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },
  applicants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  approvedWorkers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  rejectedWorkers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }]
});

export default mongoose.model("Event", eventSchema);