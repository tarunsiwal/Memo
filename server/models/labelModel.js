import mongoose from "mongoose";

const labelSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
  },
});
const Labels = mongoose.model("Labels", labelSchema);

export default Labels;
