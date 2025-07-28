// --- 1. Third-party packages ---
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

// --- 2. Local modules ---
import { authRoute } from "./routes/auth.js";

// --- 3. Environment variables setup ---
dotenv.config();

// --- 4. App and configuration ---
const app = express();
const port = process.env.PORT;

// --- 5. Middleware ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- 6. Router ---

app.use("/api/user", authRoute);

async function connectDB() {
  try {
    await mongoose.connect(process.env.DATABASE_URL, {
      dbName: process.env.DATABASE_NAME,
    });
    console.log("✅ Connected to MongoDB");

    app.listen(port, () => {
      console.log(`App listening on port ${port}`);
    });
  } catch (error) {
    console.log("❌ MongoDB connection failed:", error);
    process.exit(1);
  }
}

connectDB();
