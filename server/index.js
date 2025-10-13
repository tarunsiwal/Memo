import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import tasksRoutes from "./routes/tasksRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import userLabelsRoutes from "./routes/userLabelsRoutes.js";
import dotenv from "dotenv";
import { errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use("/api/tasks", tasksRoutes);
app.use("/api/user", userRoutes);
app.use("/api/user/labels", userLabelsRoutes);
app.use(errorHandler);

// A simple root route to check if the server is running
app.get("/", (req, res) => {
  res.send("API is running!");
});

const mongoosConnection = process.env.MONGODB_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(mongoosConnection);
    console.log("mongoose connected successfully!");
  } catch (err) {
    console.error("mongoose failed to connect", err.message);
  }
};

const startServer = () => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
};

// Connect to the database and then start the server
connectDB().then(() => {
  startServer();
});
