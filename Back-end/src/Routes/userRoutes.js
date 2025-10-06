import express from "express";
import { addUser, updateUser, deleteUserById, deleteManyUsers, getAllUsers, getUserById } from "../Controllers/userController.js";
import { createUserValidation, updateUserValidation, deleteManyUsersValidation } from "../Validations/userValidator.js";
import { validate } from "../Middlewares/userValidate.js";

const router = express.Router();

router.post("/user", createUserValidation, validate, addUser);
router.put("/user/:id", updateUserValidation, validate, updateUser);
router.delete("/user/:id", deleteUserById);
router.delete("/user", deleteManyUsersValidation, validate, deleteManyUsers);
router.get("/users", getAllUsers);
router.get("/user/:id", getUserById);

export default router;
