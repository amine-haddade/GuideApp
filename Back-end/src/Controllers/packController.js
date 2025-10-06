import Pack from "../Models/Pack.js";

// Gets all the packs. Makes sure the guides get only the packs they need, which are their packs.
const getAllPacks = async (req, res) => {
    const options = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10
    }

    let packs;
    if (req.user.role.toLowerCase() === "guide") {
        packs = await Pack.paginate({ guideId: req.user.id }, options);
    } else {
        packs = await Pack.paginate({}, options);
    }

    res.status(200).json(packs);
};

// Create a pack. Makes sure only guides have access to this controller
const createPack = async (req, res) => {
    if (req.user.role.toLowerCase() !== 'guide') {
        return res.status(403).json({ message: 'You don\'t seem to have the right permissions to perform this action' });
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

    const newPack = new Pack({
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
};

// Gets a pack by it's ID. Makes sure the guides only get access to their packs and not to other guides packs.
const getPackById = async (req, res) => {
    let pack;
    if (req.user.role.toLowerCase() === "guide") {
        pack = await Pack.findOne({ _id: req.params.id, guideId: req.user.id });
    } else {
        pack = await Pack.findById(req.params.id);
    }

    if (!pack) {
        return res.status(404).json({ message: 'Pack not found' });
    }

    res.status(200).json(pack);
};

// Update a pack. Makes sure only the owner guides have access to the pack update.
const updatePack = async (req, res) => {
    if (req.user.role.toLowerCase() !== 'guide') {
        return res.status(403).json({ message: 'You don\'t seem to have the right permissions to perform this action' });
    }
    const updatePack = await Pack.findOneAndUpdate(
        { _id: req.params.id, guideId: req.user.id },
        req.body,
        { new: true, runValidators: true }
    );

    if (!updatePack) {
        return res.status(404).json({ message: 'Pack not found' });
    }

    res.status(200).json(updatePack)
};

// Delete a pack. Makes sure only guides have access to this controller
const deletePack = async (req, res) => {
    if (req.user.role.toLowerCase() !== 'guide') {
        return res.status(403).json({ message: 'You don\'t seem to have the right permissions to perform this action' });
    }
    const pack = await Pack.findOneAndDelete({ _id: req.params.id, guideId: req.user.id });

    if (!pack) {
        return res.status(404).json({ message: 'Pack not found' });
    }

    res.status(202).json(pack)
};

export {
    getAllPacks,
    createPack,
    getPackById,
    updatePack,
    deletePack,
};
