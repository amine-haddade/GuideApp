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
const router = express.Router();  

router.post("/", uploadImages, validate(createGuidePlaceSchema), createGuidePlace);
router.get("/", getAllGuidePlaces);
router.get("/:id", getGuidePlaceById);
router.put("/:id", uploadImages, validate(updateGuidePlaceSchema), updateGuidePlace);
router.delete("/:id", deleteGuidePlace);

export default router;
