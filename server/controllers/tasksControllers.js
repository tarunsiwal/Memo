import Task from "../models/tasksModel.js";

export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json({ tasks });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createTask = async (req, res) => {
  const { title, description, dueDate, labels, priority } = req.body;

  // Basic validation
  if (!title) {
    return res.status(400).json({ message: "Title is required" });
  }

  const newTask = new Task({
    title,
    description,
    dueDate,
    labels,
    priority,
  });

  try {
    const savedTask = await newTask.save(); // Saves the new task to the database
    res.status(201).json(savedTask); // Returns the created task
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTaskById = async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Task.findById(id); // Finds the task by its ID
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json(task); // Returns the task in JSON format
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTasksByDate = async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Sets time to midnight for consistency
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1); // The next day

  try {
    const tasks = await Task.find({
      dueDate: {
        $gte: today,
        $lt: tomorrow,
      },
    }); // Fetches tasks with a dueDate of today
    res.status(200).json({ tasks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUpcomingTasks = async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Sets time to midnight for consistency

  try {
    const tasks = await Task.find({
      dueDate: { $gt: today },
    }); // Fetches tasks with a dueDate in the future
    res.status(200).json({ tasks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const searchTasks = async (req, res) => {
  const { query } = req.query;

  try {
    const tasks = await Task.find({
      $or: [
        { title: { $regex: query, $options: "i" } }, // Case-insensitive search in title
        { description: { $regex: query, $options: "i" } }, // Case-insensitive search in description
      ],
    });
    res.status(200).json({ tasks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, dueDate, isCompleted, labels, priority } =
    req.body;

  try {
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { title, description, dueDate, isCompleted, labels, priority },
      { new: true } // Returns the updated document
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ updatedTask });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedTask = await Task.findByIdAndDelete(id); // Finds the task by its ID
    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({ message: "Task deleted successfully", deletedTask }); // Returns the task in JSON format
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
