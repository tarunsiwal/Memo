import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

const protect = asyncHandler(async (req, res, next) => {
  let token;

  // 1. Check if the Authorization header exists and starts with 'Bearer'
  // NOTE: Headers must be accessed using req.headers (plural and lowercase)
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header (split 'Bearer <token>')
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // Get user from the token's ID (which is stored in 'decoded.id')
      // Select '-password' means we attach the user object to the request,
      // but without the hashed password.
      req.user = await User.findById(decoded.id).select("-password");

      next(); // Move to the next middleware or controller (e.g., getMe)
    } catch (error) {
      // This catches errors like an expired or invalid signature token
      console.error(error);
      res.status(401);
      throw new Error("Not authorized, token failed verification");
    }
  }
  // 2. If the token was never extracted in the step above
  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token found in request");
  }
});

export default protect;
