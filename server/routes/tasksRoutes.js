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
router.get("/today", getTasksByDate); // Fetch tasks for today
router.get("/upcoming", getUpcomingTasks); // Fetch upcoming tasks
router.get("/search", searchTasks); // Search tasks
router.get("/", getAllTasks); // Fetch all tasks
router.get("/:id", getTaskById); // Fetch task by ID
router.post("", createTask); // Create a new task
router.put("/:id", updateTask); // Update task by ID
router.delete("/:id", deleteTask);

export default router;
