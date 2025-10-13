import Task from "../models/tasksModel.js";
import asyncHandler from "express-async-handler";

// @desc    Get all tasks for the logged-in user
// @route   GET /api/tasks
// @access  Private
export const getAllTasks = asyncHandler(async (req, res) => {
  // Removed try/catch. asyncHandler will catch any Mongoose errors.
  const tasks = await Task.find({ user: req.user.id });
  res.status(200).json({
    success: true,
    count: tasks.length,
    tasks: tasks,
  });
});

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
export const createTask = asyncHandler(async (req, res) => {
  const { title, description, dueDate, labels, priority, isPinned, cardColor } =
    req.body;
  const user = req.user.id;

  if (!title) {
    res.status(400);
    throw new Error("Title is required");
  }
  const savedTask = await Task.create({
    title,
    description,
    dueDate,
    labels,
    priority,
    isPinned,
    cardColor,
    user,
  });

  res.status(201).json(savedTask);
});

// @desc    Get a single task by ID
// @route   GET /api/tasks/:id
// @access  Private
export const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, user: req.user.id });

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  res.status(200).json({ task });
});

// @desc    Get tasks due today
// @route   GET /api/tasks/today
// @access  Private
export const getTasksByDate = asyncHandler(async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const tasks = await Task.find({
    dueDate: {
      $gte: today,
      $lt: tomorrow,
    },
    user: req.user.id,
  });
  res.status(200).json({ tasks });
});

// @desc    Get upcoming tasks (after today)
// @route   GET /api/tasks/upcoming
// @access  Private
export const getUpcomingTasks = asyncHandler(async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tasks = await Task.find({
    dueDate: { $gt: today },
    user: req.user.id,
  });
  res.status(200).json({ tasks });
});

// @desc    Search tasks by title or description
// @route   GET /api/tasks/search?query=...
// @access  Private
export const searchTasks = asyncHandler(async (req, res) => {
  const { query } = req.query;

  const tasks = await Task.find({
    $or: [
      { title: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } },
    ],
    user: req.user.id,
  });
  res.status(200).json({ tasks });
});

// @desc    Update a task by ID
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updatFields = req.body;

  const updatedTask = await Task.findOneAndUpdate(
    { _id: id, user: req.user.id },
    updatFields,
    { new: true }
  );

  if (!updatedTask) {
    res.status(404);
    throw new Error("Task not found");
  }

  res.status(200).json({ updatedTask });
});

// @desc    Delete a task by ID
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = asyncHandler(async (req, res) => {
  const deletedTask = await Task.findOneAndDelete({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!deletedTask) {
    res.status(404);
    throw new Error("Task not found");
  }

  res.status(200).json({ message: "Task deleted successfully" });
});
