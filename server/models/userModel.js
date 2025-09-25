import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Please add a name"] },
    email: {
      type: String,
      required: [true, "Please add a email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      unique: true,
    },
    profilePicture: { type: String }, // Store the image URL as a String
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
