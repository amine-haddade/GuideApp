import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      trim: true,
      unique: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "please add a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minlength: [6, "password should be at least 6 characters"]
    },
    role: {
      type: String,
      required: [true, "role is required"],
      enum: ["client", "guide", "admin"],
    },
    phone: {
      type: String,
      unique: true,
      trim: true,
    },
    cin: {
      type: String,
      unique: true,
    },
    refreshToken: {
      type: String,
      default: null,
    },
    isDeleted: { 
      type: Boolean, 
      default: false 
    },
    deletedAt: { 
      type: Date, 
      default: null
    },
  },
  { timestamps: true }
);

const User = mongoose.model("users", userSchema);
export default User;
