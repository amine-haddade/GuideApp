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

// Update User by ID
const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const update = { ...req.body };

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const error = new Error("user not found");
      error.statusCode = 404;
      throw error;
    }
    const user = await User.findById(id);
    if (!user) {
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

// Delete single user by ID
const deleteUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const error = new Error("user not found");
      error.statusCode = 404;
      throw error;
    }

    const user = await User.findById(id).select("-password -refreshToken");
    if (!user) {
      const error = new Error("user not found");
      error.statusCode = 404;
      throw error;
    }

    if (user.isDeleted) {
      const error = new Error("user already deleted");
      error.statusCode = 400;
      throw error;
    }

    user.isDeleted = true;
    user.deletedAt = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: "user soft-deleted successfully",
      user,
    });
  } catch (err) {
    next(err);
  }
};

// Delete multiple users by IDs
const deleteManyUsers = async (req, res, next) => {
  try {
    let { ids } = req.body;

    if (!ids) {
      const error = new Error("please provide users ID's to delete");
      error.statusCode = 400;
      throw error;
    }

    if (!ids.every((id) => mongoose.Types.ObjectId.isValid(id))) {
      const error = new Error("one or more user not found");
      error.statusCode = 400;
      throw error;
    }
    // Find users that actually exist
    const existingUsers = await User.find({ _id: { $in: ids } });

    if (existingUsers.length !== ids.length) {
      const error = new Error("one or more user not found");
      error.statusCode = 400;
      throw error;
    }

    if (!Array.isArray(ids)) ids = [ids];

    const result = await User.updateMany(
      { _id: { $in: ids }, isDeleted: false },
      { $set: { isDeleted: true, deletedAt: new Date() } }
    );

    res.status(200).json({
      success: true,
      message: `${result.modifiedCount} users soft-deleted successfully`,
    });
  } catch (err) {
    next(err);
  }
};

export { addUser, updateUser, deleteUserById, deleteManyUsers };
