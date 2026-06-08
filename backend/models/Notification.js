import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  type: {
    type: String,
    enum: [
      "streak",
      "achievement",
      "mentor_reply",
      "problem_solved",
      "weekly_report",
      "system",
    ],
    required: true,
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  icon: { type: String, default: "Bell" },
  isRead: { type: Boolean, default: false },
  link: { type: String }, // Optional link to navigate to
  metadata: { type: mongoose.Schema.Types.Mixed }, // Extra data
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Notification", notificationSchema);
