import express from "express";
import {addRating, updateRating, getAllRatings, getRatingsByPack, deleteRating} from '../Controllers/ratingController.js'
import { verifyToken } from "../Middlewares/verifyJwtToken.js";
import { authorizeRoles } from "../Middlewares/authorizeRole.js";
import { addRatingValidation, updateRatingValidation } from "../Validations/ratingValidator.js";
import { validate } from "../Middlewares/userValidate.js";

const router = express.Router();

router.post('/rating', verifyToken, authorizeRoles(["client"]), addRatingValidation, validate, addRating)
router.put('/rating/:id', verifyToken, authorizeRoles(["client"]), updateRatingValidation, validate, updateRating)
router.delete('/rating/:id', verifyToken, authorizeRoles(["admin"]), deleteRating)
router.get('/rating/:packId', verifyToken, authorizeRoles(["admin", "client","guide"]), getRatingsByPack)
router.get('/rating', verifyToken, authorizeRoles(["admin"]), getAllRatings)

export default router;


