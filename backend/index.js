import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import fileUpload from "express-fileupload";
import { v2 as cloudinary } from "cloudinary";
import cors from "cors";

import courseRouter from "./routes/course.route.js";
import UserRouter from "./routes/user.route.js";
import adminRouter from "./routes/admin.route.js";
import contactRouter from "./routes/contact.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4001;

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:3000', 
    'http://127.0.0.1:3000',
    'https://course-selling-app-2y3r.vercel.app',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// middlewares
app.use(express.json());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// routes
app.use("/api/v1/course", courseRouter);
app.use("/api/v1/user", UserRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/contact", contactRouter);

// cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// database
mongoose
  .connect(process.env.MONGO_DB_URL)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ DB error:", err.message));

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export default app;