import bcrypt from "bcryptjs";
import User from "../Models/userModel.js";

// Add New User
const addUser = async (req, res, next) => {
  try {
    const { name, email, password, role, cin, phone } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error("email already exists");
      error.statusCode = 400;
      throw error;
    }

    const hashedPwd = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPwd,
      role,
      cin,
      phone,
    });

    res.status(201).json({ message: "user added successfully", user: newUser });
  } catch (err) {
    next(err);
  }
};

export { addUser };