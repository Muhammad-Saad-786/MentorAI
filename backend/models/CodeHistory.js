import mongoose from "mongoose";

const codeHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  language: { type: String, required: true },
  sourceCode: { type: String, required: true },
  status: {
    type: String,
    enum: ["solved", "attempted", "failed"],
    default: "attempted",
  },
  problemTitle: { type: String },
  executionTime: { type: Number },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("CodeHistory", codeHistorySchema);
