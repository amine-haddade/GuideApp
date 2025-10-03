import Pack from "../Models/Pack";
import asyncHandler from "../Middlewares/asyncHandler";

// Gets all the packs. Makes sure the guides get only the packs they need, which are their packs.
const getAllPacks = asyncHandler( async (req, res) => {
    const options = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10
    }

    if (req.user.role.toLowerCase() === "guide") {
        const packs = await Packs.paginate({guideId: req.user.id}, options);
    } else {
        const packs = await Packs.paginate({}, options);
    }

    res.status(200).json(packs);
});

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
