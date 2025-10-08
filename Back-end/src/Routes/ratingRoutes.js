import express from "express";
import {addRating} from '../Controllers/ratingController.js'
import { verifyToken } from "../Middlewares/verifyJwtToken.js";
import { authorizeRoles } from "../Middlewares/authorizeRole.js";
import { addRatingValidation } from "../Validations/ratingValidator.js";
import { validate } from "../Middlewares/userValidate.js";

const router = express.Router();

router.post('/rating', verifyToken, authorizeRoles(["client"]), addRatingValidation, validate, addRating)

export default router;


