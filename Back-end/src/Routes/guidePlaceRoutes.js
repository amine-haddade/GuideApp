// routes/guidePlaceRoutes.js
import express from "express";
import {
  createGuidePlace,  
  getAllGuidePlaces,
  getGuidePlaceById,
  updateGuidePlace,
  deleteGuidePlace,
} from "../Controllers/guidePlaceController.js";
import { validate } from "../Middlewares/validate.js";
import { uploadImages } from "../Middlewares/uploadImages.js";
import { createGuidePlaceSchema, updateGuidePlaceSchema } from "../Validations/guideValidator.js"; 
import { authorizeRoles } from "../Middlewares/authorizeRole.js";  
import { verifyToken } from "../Middlewares/verifyJwtToken.js";
const router = express.Router();  

router.post("/", uploadImages,verifyToken, authorizeRoles(["guide"]), validate(createGuidePlaceSchema), createGuidePlace);
router.get("/",verifyToken, authorizeRoles(["guide","admin"]), getAllGuidePlaces);
router.get("/:id", verifyToken, authorizeRoles(["guide","admin"]),getGuidePlaceById);
router.put("/:id",verifyToken, authorizeRoles(["guide"]), uploadImages, validate(updateGuidePlaceSchema), updateGuidePlace);
router.delete("/:id",verifyToken, authorizeRoles(["guide","admin"]), deleteGuidePlace);

export default router;
 