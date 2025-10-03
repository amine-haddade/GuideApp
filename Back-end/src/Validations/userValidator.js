import { body } from "express-validator";

export const userValidation = [
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
    .withMessage("please add a valid email")
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

  body("phone")
    .trim()
    .notEmpty()
    .withMessage("phone number is required")
    .isMobilePhone("any")
    .withMessage("please add a valid phone number")
    .escape(),

  body("cin")
    .if((value, { req }) => req.body.role === "guide")
    .trim()
    .notEmpty()
    .withMessage("cin is required")
    .escape(),
];
