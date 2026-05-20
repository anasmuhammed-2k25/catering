import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

import { register, login } from "./controllers/authController.js";
import { updateProfile, getApprovedWorkers } from "./controllers/userController.js";
import { 
  createEvent, 
  getEvents, 
  getApprovedEvents, 
  applyEvent, 
  approveWorker, 
  rejectWorker 
} from "./controllers/eventController.js";
import { 
  getAdminEvents, 
  updateEventStatus, 
  getAdminUsers, 
  updateUserStatus, 
  deleteUser 
} from "./controllers/adminController.js";
import { authMiddleware } from "./middleware/authMiddleware.js";

const app = express();


const MONGODB_URI = process.env.MONGO_URI || process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/catering";
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.log("DB Error ❌:", err));


app.use(cors());
app.use(express.json());



app.post("/api/auth/register", register);
app.post("/api/auth/login", login);


app.put("/api/users/profile", authMiddleware, updateProfile);
app.get("/api/users/workers", getApprovedWorkers);


app.post("/api/events", authMiddleware, createEvent);
app.get("/api/events", getEvents);
app.get("/api/events/approved", getApprovedEvents);
app.post("/api/events/:id/apply", authMiddleware, applyEvent);
app.put("/api/events/:id/approve-worker", authMiddleware, approveWorker);
app.put("/api/events/:id/reject-worker", authMiddleware, rejectWorker);


app.get("/api/admin/events", getAdminEvents);
app.put("/api/admin/events/:id/:action", updateEventStatus);
app.get("/api/admin/users", getAdminUsers);
app.put("/api/admin/users/:id/:action", updateUserStatus);
app.delete("/api/admin/users/:id", deleteUser);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
export default app;