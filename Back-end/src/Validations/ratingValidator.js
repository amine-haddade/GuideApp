import { body } from "express-validator";
import mongoose from "mongoose";

export const addRatingValidation = [
  body("stars")
    .notEmpty()
    .withMessage("stars rating is required")
    .isInt({ min: 1, max: 5 })
    .withMessage("stars must be a number between 1 and 5")
    .escape(),

  body("comment")
    .trim()
    .notEmpty()
    .withMessage("rating comment is required")
    .escape(),

  body("packID")
    .notEmpty()
    .withMessage("pack ID is required")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("pack ID must be a valid ObjectId"),
];

export const updateRatingValidation = [
  body("stars")
    .notEmpty()
    .withMessage("stars rating is required")
    .isInt({ min: 1, max: 5 })
    .withMessage("stars must be a number between 1 and 5")
    .escape(),
];
