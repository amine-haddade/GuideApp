import express from "express";
import { getAllPacks, createPack, getPackById, updatePack, deletePack } from "../Controllers/packController.js";

const router = express.Router();

// TODO: Add proper authentication middleware here

// Get all the packs. But if the user is a guide, he'll only get his packs not all the packs
router.get('/', getAllPacks);

// Get a pack by its id. Make sure the guides only get access to their packs
router.get('/:id', getPackById);

// Create and delete a pack ( only guides should have access to this route )
router.post('/', createPack);
router.put('/:id', updatePack);
router.delete('/:id', deletePack);

export default router;
