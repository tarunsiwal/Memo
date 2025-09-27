import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  registerUser,
  loginUser,
  getMe,
} from "../controllers/userControllers.js";

const router = express.Router();

router.post("/", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);

export default router;
