import Pack from "../Models/Pack";
import asyncHandler from "../Middlewares/asyncHandler";

// Create a pack
const createPack = asyncHandler( async (req, res) => {
    const {
        guidesPlacesId,
        title,
        description,
        price,
        startDate,
        endDate,
        availability,
        startLocation,
        endLocation,
        maxClients
    } = req.body;
    
    const guideId = req.user.id;

    const newPack = Pack({
        guideId,
        guidesPlacesId,
        title,
        description,
        price,
        startDate,
        endDate,
        availability,
        startLocation,
        endLocation,
        maxClients
    });

    const savedPack = await newPack.save();
    res.status(201).json(savedPack);
});

module.exports = [
    getAllPacks,
    createPack,
];
