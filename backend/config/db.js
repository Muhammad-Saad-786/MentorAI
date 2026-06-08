import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGO_URI.replace(
        "<db_password>",
        process.env.MONGO_DB_PASSWORD,
      ),
    );
    console.log(`MongoDB connected successfuly}`);
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

export default connectDB;
