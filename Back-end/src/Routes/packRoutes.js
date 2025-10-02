import express from "express";
import packController from "../Controllers/packController";

const router = express.Router();

// Get all the packs. But if the user is a guide, he'll only get his packs not all the packs
router.get('/', packController.getAllPacks);

// Create a new pack ( only guides should have access to this route )
router.post('/', packController.createPack);

module.exports = router;
