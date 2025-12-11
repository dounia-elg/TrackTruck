import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
connectDB();

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("TrackTruck is running");
});

app.use(errorHandler);

const PORT = process.env.PORT  || 3002;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
