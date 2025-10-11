import express from "express";
import { addUser, updateUser, deleteUserById, deleteManyUsers, getAllUsers, getUserById, getUser } from "../Controllers/userController.js";
import { createUserValidation, updateUserValidation, deleteManyUsersValidation } from "../Validations/userValidator.js";
import { validate } from "../Middlewares/userValidate.js";
import { verifyToken } from "../Middlewares/verifyJwtToken.js";
import { authorizeRoles} from '../Middlewares/authorizeRole.js';

import {
  logout
} from "../Controllers/authController.js";
import upload from "../Middlewares/upload.js";

const router = express.Router();

router.post("/user", verifyToken, authorizeRoles(["admin"]), createUserValidation, validate, addUser);

router.put("/user/", verifyToken, authorizeRoles(["admin", "guide", "client"]), updateUserValidation, validate, upload.single("profileImage"), updateUser);

router.delete("/user/:id", verifyToken, authorizeRoles(["admin", "client", "guide"]), deleteUserById, logout);
router.delete("/user", verifyToken, authorizeRoles(["admin"]), deleteManyUsersValidation, validate, deleteManyUsers);

router.get("/users", verifyToken, authorizeRoles(["admin"]), getAllUsers);
router.get("/user/:id", verifyToken, authorizeRoles(["admin","guide", "client"]), getUserById);
router.get("/user/", verifyToken, authorizeRoles(["admin","guide", "client"]), getUser);

export default router;
