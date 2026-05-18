import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event"
  },
  worker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  status: {
    type: String,
    enum: ["applied", "selected"],
    default: "applied"
  }
});

export default mongoose.model("Application", applicationSchema);