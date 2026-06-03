import dotenv from "dotenv";
dotenv.config();

console.log(
  "ENV loaded. OPENROUTER_API_KEY exists:",
  !!process.env.OPENROUTER_API_KEY,
);
