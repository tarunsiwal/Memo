import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";

// @desc Register User
// @route POST /api/user/
// @access Public

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (name || email || password) {
    res.status(404);
    throw new Error("Please fill all details");
  }
  const userExist = await User.findOne({ email });
  if (userExist) {
    res.status(404);
    throw new Error("User already Exists");
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });
  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(404);
    throw Error("Invalid user data");
  }
});

// @desc Authenticate User
// @route POST /api/user/login
// @access Public

export const loginUser = asyncHandler(async (req, res) => {
  res.json({ message: "Login User" });
});

// @desc Register User
// @route POST /api/user/
// @access Public

export const getMe = asyncHandler(async (req, res) => {
  res.json({ message: "User Data" });
});
