import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt, { hashSync } from "bcryptjs";
import asyncHandler from "express-async-handler";

// @desc Register User
// @route POST /api/user/
// @access Public

export const registerUser = asyncHandler(async (req, res) => {
  console.log("Request Body:", req.body);
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
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
      token: generateToken(user._id),
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
  const { email, password } = req.body;
  // console.log(email, password);
  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(404);
    throw new Error("Invalid Email or Password");
  }
});

// @desc Register User
// @route POST /api/user/
// @access Private

export const profile = asyncHandler(async (req, res) => {
  const { _id, name, email } = await User.findById(req.user.id);
  res.status(200).json({
    id: _id,
    name,
    email,
  });
});

// generate jwt token

export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};
