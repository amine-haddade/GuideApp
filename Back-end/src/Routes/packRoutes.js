import express from "express";
import packController from "../Controllers/packController";

const router = express.Router();

// Get all the packs. But if the user is a guide, he'll only get his packs not all the packs
router.get('/', packController.getAllPacks);

// Get a pack by its id. Make sure the guides only get access to their packs
router.get('/:id', packController.getPackById);

// Create and delete a pack ( only guides should have access to this route )
router.post('/', packController.createPack);
router.put('/:id', packController.updatePack);
router.delete('/:id', packController.deletePack);

module.exports = router;
