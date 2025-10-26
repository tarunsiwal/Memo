import express from "express";

import {
  getAllTasks,
  getTaskById,
  getTasksByDate,
  getUpcomingTasks,
  createTask,
  getTasksWithFilters,
  updateTask,
  deleteTask,
} from "../controllers/tasksControllers.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Routes
router.get("/today", protect, getTasksByDate); // Fetch tasks for today
router.get("/upcoming", protect, getUpcomingTasks); // Fetch upcoming tasks
router.get("/search", protect, getTasksWithFilters); // search task
router.get("/", protect, getAllTasks); // Fetch all tasks
router.get("/:id", protect, getTaskById); // Fetch task by ID
router.post("", protect, createTask); // Create a new task
router.put("/:id", protect, updateTask); // Update task by ID
router.delete("/:id", protect, deleteTask);

export default router;
