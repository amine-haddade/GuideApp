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

// Create a pack. Makes sure only guides have access to this controller
const createPack = asyncHandler( async (req, res) => {
    if (req.user.role.toLowerCase() !== 'guide') {
        return res.status(403).json({message: 'You don\'t seem to have the right permissions to perform this action'});
    }
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

// Gets a pack by it's ID. Makes sure the guides only get access to their packs and not to other guides packs.
const getPackById = asyncHandler( async (req, res) => {
    if (req.user.role.toLowerCase() === "guide") {
        const pack = await Pack.findOne({_id: req.params.id, guideId: req.user.id});
    } else {
        const pack = await Pack.findById(req.params.id);
    }

    if (!pack) {
        return res.status(404).json({ message: 'Pack not found'});
    }

    res.status(200).json(pack);
});

// Delete a pack. Makes sure only guides have access to this controller
const deletePack = asyncHandler( async (req, res) => {
    if (req.user.role.toLowerCase() !== 'guide') {
        return res.status(403).json({message: 'You don\'t seem to have the right permissions to perform this action'});
    }
    const pack = await Pack.findByIdAndDelete(req.params.id);

    if (!pack) {
        return res.status(404).json({message: 'Pack not found'});
    }

    res.status(202).json(pack)
});

module.exports = [
    getAllPacks,
    createPack,
    getPackById,
    deletePack,
];
