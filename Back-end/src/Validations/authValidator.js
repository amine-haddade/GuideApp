import { body } from "express-validator";

export const updateProfileValidation = [
  body("phone")
    .if((value, { req }) => req.user?.role === "guide")
    .trim()
    .notEmpty()
    .withMessage("phone number is required")
    .isMobilePhone("any")
    .withMessage("please add a valid phone number")
    .escape(),

  body("cin")
    .if((value, { req }) => req.user?.role === "guide")
    .trim()
    .notEmpty()
    .withMessage("cin is required")
    .escape(),
];
