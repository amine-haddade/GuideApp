import { body } from "express-validator";

export const createUserValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("name is required")
    .isLength({ min: 2 })
    .withMessage("name must be at least 2 characters")
    .escape(),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("please provide a valid email")
    .escape(),

  body("phone")
    .if((value, { req }) => req.body?.role === "client")
    .trim()
    .notEmpty()
    .withMessage("phone number is required")
    .isMobilePhone("any")
    .withMessage("please add a valid phone number")
    .escape(),

  body("password")
    .trim()
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 6 })
    .withMessage("password should be at least 6 characters")
    .escape(),

  body("role")
    .trim()
    .notEmpty()
    .withMessage("role is required")
    .isIn(["client", "guide", "admin"])
    .withMessage("role must be client, guide or admin")
    .escape(),
];

export const updateUserValidation = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage("name must be at least 2 characters")
    .escape(),

  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("please provide a valid email")
    .escape(),

  body("password")
    .optional()
    .trim()
    .isLength({ min: 6 })
    .withMessage("password should be at least 6 characters")
    .escape(),

  body("role")
    .optional()
    .trim()
    .isIn(["client", "guide", "admin"])
    .withMessage("role must be client, guide or admin")
    .escape(),

  body("phone")
    .optional()
    .trim()
    .isMobilePhone()
    .withMessage("Please provide a valid phone number")
    .escape(),

  body("cin")
    .optional()
    .trim()
    .if((value, { req }) => req.user?.role === "guide")
    .escape(),

      // Profile image validation (optional)
  body("profileImage").custom((value, { req }) => {
    if (!req.file) return true; // Image is optional

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedTypes.includes(req.file.mimetype)) {
      throw new Error("invalid image type. Only JPG, PNG, and WEBP are allowed");
    }

    const maxSize = 2 * 1024 * 1024; // 2MB
    if (req.file.size > maxSize) {
      throw new Error("image too large. Maximum size is 2MB");
    }

    return true;
  }),
];

export const deleteManyUsersValidation = [
  body("id")
    .notEmpty().withMessage("IDs are required")
    .isArray().withMessage("IDs must be an array")
];
