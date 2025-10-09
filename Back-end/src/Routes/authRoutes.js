import express from "express";
import {
  signUp,
  login,
  logout,
  refreshAccessToken,
  updateProfile,
} from "../Controllers/authController.js";
import { createUserValidation } from "../Validations/userValidator.js";
import { validate } from "../Middlewares/userValidate.js";
import { verifyToken } from "../Middlewares/verifyJwtToken.js";
import { updateProfileValidation } from "../Validations/authValidator.js";
import { authorizeRoles } from "../Middlewares/authorizeRole.js";

const router = express.Router();    

router.post("/signup", createUserValidation, validate, signUp);
router.put('/profile', verifyToken, authorizeRoles(["client", "guide"]), updateProfileValidation, validate, updateProfile)
router.post("/login", login);
router.post("/refresh", refreshAccessToken);
router.post("/logout", verifyToken, logout);  

export default router;
