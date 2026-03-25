import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import routes from "./routes.js";
import cors from "cors";


dotenv.config();

const app = express();
app.use(cors({
  origin: "https://your-frontend.onrender.com"
}));
// middleware
app.use(express.json());

// routes
app.use("/api", routes);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
  });

// server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
