import UserLabels from "../models/labelModel.js";
import asyncHandler from "express-async-handler";

// @desc    Get user labels
// @route   GET /api/user/labels
// @access  Private
export const getUserLabels = asyncHandler(async (req, res) => {
  const userLabels = await UserLabels.find({ user: req.user.id });
  res.status(200).json({
    success: true,
    userLabels: userLabels,
  });
});

// @desc    Create user labels
// @route   POST /api/user/labels
// @access  Private
export const addUserLabels = asyncHandler(async (req, res) => {
  const { label } = req.body;
  const userId = req.user.id;

  if (!label || label.trim() === "") {
    res.status(400);
    throw new Error("Label text is required.");
  }
  const normalizedLabel = label.trim().toLowerCase();

  const existingLabel = await UserLabels.findOne({
    user: userId,
    label: { $regex: new RegExp(`^${normalizedLabel}$`, "i") },
  });
  if (existingLabel) {
    return res.status(200).json(existingLabel);
  }
  const saveLabels = await UserLabels.create({
    user: userId,
    label: label.trim(),
  });
  res.status(201).json(saveLabels);
});

// @desc    Search labels
// @route   GET /api/user/labels/search?query=...
// @access  Private
export const searchLabels = asyncHandler(async (req, res) => {
  const { query } = req.query;
  // Use a sensible default for the query if it's not provided (to allow fetching all)
  const searchQuery = query ? query : "";

  const labels = await UserLabels.find({
    user: req.user.id,
    // Use the $regex operator for case-insensitive partial match
    label: { $regex: `^${searchQuery}`, $options: "i" },
  }).sort({ label: 1 }); // Optional: sort the results alphabetically
  res.status(200).json({ labels });
});
