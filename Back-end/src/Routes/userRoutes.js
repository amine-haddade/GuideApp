import express from "express";
import { addUser, updateUser, deleteUserById, deleteManyUsers, getAllUsers, getUserById } from "../Controllers/userController.js";
import { createUserValidation, updateUserValidation, deleteManyUsersValidation } from "../Validations/userValidator.js";
import { validate } from "../Middlewares/userValidate.js";
import { verifyToken } from "../Middlewares/verifyJwtToken.js";

const router = express.Router();

router.post("/user", verifyToken, createUserValidation, validate, addUser);
router.put("/user/:id", verifyToken, updateUserValidation, validate, updateUser);
router.delete("/user/:id", verifyToken, deleteUserById);
router.delete("/user", verifyToken, deleteManyUsersValidation, validate, deleteManyUsers);
router.get("/users", verifyToken, getAllUsers);
router.get("/user/:id", verifyToken, getUserById);

export default router;
