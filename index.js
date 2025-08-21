// --- 1. Third-party packages ---
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import passport from "passport";
import cors from "cors";
// --- 2. Local modules ---
import { authRoute } from "./routes/auth.js";
import { taskRoute } from "./routes/task-route.js";
import { setupPassport } from "./config/passport.js";
// --- 3. Environment variables setup ---
dotenv.config();

// --- 4. App and configuration ---
const app = express();
const port = process.env.PORT || 3003;

// --- 5. Middleware ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [
      "https://task-frontend-rho-rose.vercel.app",
      "http://localhost:5173",
    ], // 前端的位址
  })
);
setupPassport(passport);

// --- 6. Router ---
app.use("/api/user", authRoute);
app.use(
  "/api/task",
  passport.authenticate("jwt", { session: false }),
  taskRoute
);

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
