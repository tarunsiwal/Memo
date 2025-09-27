import mongoose, { Mongoose } from "mongoose";

const taskSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  title: { type: String, required: true },
  description: { type: String },
  dueDate: { type: Date },
  isCompleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  assignee: { type: String },
  labels: [String],
  priority: { type: Number },
  isPinned: { type: Boolean, default: false },
  cardColor: { type: String, default: "#ffffff" },
});

const Task = mongoose.model("Task", taskSchema);

export default Task;
