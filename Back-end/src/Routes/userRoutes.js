import express from "express";
import { addUser, updateUser } from "../Controllers/userController.js";
import { createUserValidation, updateUserValidation } from "../Validations/userValidator.js";
import { validate } from "../Middlewares/userValidate.js";

const router = express.Router();

router.post("/user", createUserValidation, validate, addUser);
router.put("/user/:id", updateUserValidation, validate, updateUser);

export default router;
