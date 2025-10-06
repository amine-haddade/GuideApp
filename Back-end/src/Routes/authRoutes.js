import express from "express";
import {
  signUp,
  login,
  logout,
  refreshAccessToken,
} from "../Controllers/authController.js";
import { createUserValidation } from "../Validations/userValidator.js";
import { validate } from "../Middlewares/userValidate.js";
import { verifyToken } from "../Middlewares/verifyJwtToken.js";

const router = express.Router();

router.post("/signup", createUserValidation, validate, signUp, login);
router.post("/login", login);
router.post("/refresh", refreshAccessToken);
router.post("/logout", verifyToken, logout);

export default router;
