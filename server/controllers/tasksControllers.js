import Task from "../models/tasksModel.js";
import asyncHandler from "express-async-handler";

// @desc    Get all tasks for the logged-in user
// @route   GET /api/tasks
// @access  Private
export const getAllTasks = asyncHandler(async (req, res) => {
  // Removed try/catch. asyncHandler will catch any Mongoose errors.
  const tasks = await Task.find({ user: req.user.id });
  res.status(200).json(tasks);
});

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
export const createTask = asyncHandler(async (req, res) => {
  const { title, description, dueDate, labels, priority, isPinned, cardColor } =
    req.body;
  const user = req.user.id;

  // IMPORTANT: For validation errors, we set the status and THROW an Error.
  // The asyncHandler will catch this and pass it to errorMiddleware.js.
  if (!title) {
    res.status(400);
    throw new Error("Title is required");
  }

  // FIXED: Correctly use Task.create() and await the promise.
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
  // Removed try/catch.
  // FIXED: Access the ID correctly via req.params.id
  const task = await Task.findOne({ _id: req.params.id, user: req.user.id });

  if (!task) {
    // For a 'not found' error, we set the status to 404 and throw the error.
    res.status(404);
    throw new Error("Task not found");
  }

  res.status(200).json(task);
});

// @desc    Get tasks due today
// @route   GET /api/tasks/today
// @access  Private
export const getTasksByDate = asyncHandler(async (req, res) => {
  // Removed try/catch.
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
  res.status(200).json(tasks);
});

// @desc    Get upcoming tasks (after today)
// @route   GET /api/tasks/upcoming
// @access  Private
export const getUpcomingTasks = asyncHandler(async (req, res) => {
  // Removed try/catch.
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tasks = await Task.find({
    dueDate: { $gt: today },
    user: req.user.id,
  });
  res.status(200).json(tasks);
});

// @desc    Search tasks by title or description
// @route   GET /api/tasks/search?query=...
// @access  Private
export const searchTasks = asyncHandler(async (req, res) => {
  // Removed try/catch.
  const { query } = req.query;

  const tasks = await Task.find({
    $or: [
      { title: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } },
    ],
    user: req.user.id,
  });
  res.status(200).json(tasks);
});

// @desc    Update a task by ID
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updatFields = req.body;

  // FIXED: Correct Mongoose method is findOneAndUpdate (not findByOneUpdate)
  const updatedTask = await Task.findOneAndUpdate(
    { _id: id, user: req.user.id },
    updatFields,
    { new: true } // { new: true } returns the updated document
  );

  if (!updatedTask) {
    res.status(404);
    throw new Error("Task not found");
  }

  res.status(200).json(updatedTask);
});

// @desc    Delete a task by ID
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = asyncHandler(async (req, res) => {
  // Removed try/catch.
  const deletedTask = await Task.findOneAndDelete({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!deletedTask) {
    res.status(404);
    throw new Error("Task not found");
  }

  // The client doesn't need the deleted task body, just a success message
  res.status(200).json({ message: "Task deleted successfully" });
});
