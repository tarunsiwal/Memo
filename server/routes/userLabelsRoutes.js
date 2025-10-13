import express from "express";
import {
  getUserLabels,
  addUserLabels,
  searchLabels,
} from "../controllers/userLabelController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getUserLabels);
router.post("/", protect, addUserLabels);
router.get("/search", protect, searchLabels);
export default router;
