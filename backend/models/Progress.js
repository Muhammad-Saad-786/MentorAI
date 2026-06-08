import mongoose from "mongoose";

const progressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  totalAttempts: { type: Number, default: 0 },
  totalSolved: { type: Number, default: 0 },
  currentStreak: { type: Number, default: 0 },
  bestStreak: { type: Number, default: 0 },
  lastActive: { type: Date, default: Date.now },
  topics: [
    {
      name: String,
      score: { type: Number, default: 0 },
      attempts: { type: Number, default: 0 },
      solved: { type: Number, default: 0 },
      lastAttempted: { type: Date },
    },
  ],
});

export default mongoose.model("Progress", progressSchema);
