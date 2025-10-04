import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "../Models/userModel.js";

// Add New User
const addUser = async (req, res, next) => {
  try {
    const newUser = { ...req.body };
    newUser.email = newUser.email.toLowerCase();
    newUser.name = newUser.name.toLowerCase();

    const existingUser = await User.findOne({ email: newUser.email });
    if (existingUser) {
      const error = new Error("email already exists");
      error.statusCode = 400;
      throw error;
    }

    newUser.password = await bcrypt.hash(newUser.password, 10);
    const user = await User.create(newUser);

    const { password, refreshToken, ...userData } = user.toObject();

    res.status(201).json({ success: true, user: userData });
  } catch (err) {
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const update = { ...req.body };

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const error = new Error("user not found");
      error.statusCode = 404;
      throw error;
    }

    if (update.email) {
      update.email = update.email.toLowerCase();
    } 
    
    if (update.name) {
      update.name = update.name.toLowerCase();
    }

    delete update.refreshToken;

    if (update.password) {
      update.password = await bcrypt.hash(update.password, 10);
    } else {
      delete update.password;
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true, runValidators: true }
    ).select("-password -refreshToken");

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    next(error);
  }
};

export { addUser, updateUser };
