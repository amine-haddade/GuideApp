import express from "express";
import { addUser } from "../Controllers/userController.js";
import { userValidation } from "../Validations/userValidator.js";
import { validate } from "../Middlewares/userValidate.js";

const router = express.Router();

router.post("/user", userValidation, validate, addUser);

export default router;
