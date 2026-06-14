import mongoose from "mongoose";

const achievementSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  badgeId: { type: String, required: true },
  unlockedAt: { type: Date, default: Date.now },
});

// Compound index: one user can only unlock each badge once
achievementSchema.index({ userId: 1, badgeId: 1 }, { unique: true });

export default mongoose.model("Achievement", achievementSchema);
