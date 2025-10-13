import mongoose from "mongoose";

const labelSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  label: { type: String, required: true },
});
const UserLabels = mongoose.model("Labels", labelSchema);

export default UserLabels;
