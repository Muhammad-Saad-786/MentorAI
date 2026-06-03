import "./config/env.js";
import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

// DEBUG: Check if env loaded
console.log("OPENROUTER_API_KEY exists:", !!process.env.OPENROUTER_API_KEY);
console.log(
  "OPENROUTER_API_KEY starts with:",
  process.env.OPENROUTER_API_KEY?.substring(0, 10),
);

import mentorRoutes from "./routes/mentorRoutes.js";
import compilerRoutes from "./routes/compilerRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(json());

app.use("/api/mentor", mentorRoutes);
app.use("/api/compiler", compilerRoutes);
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "MentorAI server is running" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
