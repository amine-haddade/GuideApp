import express from "express";
import { getAllPacks, createPack, getPackById, updatePack, deletePack } from "../Controllers/packController.js";
import { verifyToken } from "../Middlewares/verifyJwtToken.js";
import { authorizeRoles } from "../Middlewares/authorizeRole.js";
import { requireProfileCompletion } from "../Middlewares/requireProfileFields.js";
import { packRulesMw } from '../Validations/packValidator.js';



const router = express.Router();

// TODO: Add proper authentication middleware here
router.use(verifyToken);

// Get all the packs. But if the user is a guide, he'll only get his packs not all the packs
router.get('/', getAllPacks);

// Get a pack by its id. Make sure the guides only get access to their packs
router.get('/:id', getPackById);

// Create and delete a pack ( only guides should have access to this route )
router.post('/', authorizeRoles(['guide', 'admin']) , packRulesMw('create'),requireProfileCompletion, createPack);
router.put('/:id', authorizeRoles(['guide', 'admin']), packRulesMw('update'), updatePack);
router.delete('/:id', authorizeRoles(['guide', 'admin']), deletePack);

export default router;
