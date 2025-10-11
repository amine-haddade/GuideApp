// middlewares/requireProfileFields.js
import User from "../Models/User.js";

export const requireProfileCompletion = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("role phone cin");

    if (!user) {
      const error = new Error("user not found");
      error.statusCode = 404;
      throw error;
    }

    let missingFields = [];

    // Check based on role
    if (user.role === "guide") {
      if (!user.phone) missingFields.push("phone");
      if (!user.cin) missingFields.push("cin");
    }

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: "profile incomplete - please update your information",
        missingFields,
        updateProfileUrl: "POST /api/profile",
      });
    }

    next();
  } catch (err) {
    next(err);
  }
};
