import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../Models/userModel.js";

// Sign Up User
const signUp = async (req, res, next) => {
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

    res.status(200).json({
      success: true,
      user: userData,
    });
  } catch (err) {
    next(err);
  }
};

// User Login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const validEmail = email.toLowerCase();

    // Find the user by email
    const user = await User.findOne({
      email: validEmail,
      isDeleted: false,
    });

    if (!user) {
      const error = new Error("no user found with this email");
      error.statusCode = 404;
      throw error;
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const error = new Error("wrong password");
      error.statusCode = 401;
      throw error;
    }

    // Generate JWT
    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Store refresh token in DB for future token refresh
    const refreshJwtToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );
    user.refreshToken = refreshJwtToken;
    await user.save();

    // Store tokens in cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 60 * 60 * 1000,
    });
    res.cookie("refreshToken", refreshJwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const { password: pw, refreshToken, ...userData } = user.toObject();

    res.status(200).json({
      success: true,
      user: userData,
    });
  } catch (error) {
    next(error);
  }
};

// REFRESH TOKEN
const refreshAccessToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      const error = new Error("no refresh token provided");
      error.statusCode = 401;
      throw error;
    }
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken){
      const error = new Error("no refresh token provided");
      error.statusCode = 403;
      throw error;
    }

    // Generate new tokens
    const newAccessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const newRefreshToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    // Save new refresh token in DB
    user.refreshToken = newRefreshToken;
    await user.save();

    // Set new cookies
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 60 * 60 * 1000,
    });
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ success: true, message: "token refreshed" });
  } catch (error) {
    next(error);
  }
};

// User Logout
const logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      const user = await User.findById(decoded.id);
      if (user) {
        user.refreshToken = null;
        await user.save();
      }
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.status(200).json({ success: true, message: "logged out successfully" });
  } catch (error) {
    next(error);
  }
};

export { signUp, login, logout, refreshAccessToken };
