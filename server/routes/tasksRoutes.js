import express from "express";

import {
  getAllTasks,
  getTaskById,
  getTasksByDate,
  getUpcomingTasks,
  createTask,
  searchTasks,
  updateTask,
  deleteTask,
} from "../controllers/tasksControllers.js";

const router = express.Router();

// Routes
router.get("/tasks/today", getTasksByDate); // Fetch tasks for today
router.get("/tasks/upcoming", getUpcomingTasks); // Fetch upcoming tasks
router.get("/tasks/search", searchTasks); // Search tasks
router.get("/tasks", getAllTasks); // Fetch all tasks
router.get("/tasks/:id", getTaskById); // Fetch task by ID
router.post("/tasks", createTask); // Create a new task
router.put("/tasks/:id", updateTask); // Update task by ID
router.delete("/tasks/:id", deleteTask);

export default router;
