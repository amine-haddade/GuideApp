import Pack from "../Models/Pack.js";

// Gets all the packs. Makes sure the guides get only the packs they need, which are their packs.
const getAllPacks = async (req, res) => {
    try {
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
    } catch (error) {
        res.status(500).json({ message: 'Error fetching packs', error: error.message });
    }
};

// Create a pack. Makes sure only guides have access to this controller
const createPack = async (req, res) => {
    try {
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
    } catch (error) {
        res.status(500).json({ message: 'Error creating pack', error: error.message });
    }
};

// Gets a pack by it's ID. Makes sure the guides only get access to their packs and not to other guides packs.
const getPackById = async (req, res) => {
    try {
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
    } catch (error) {
        res.status(500).json({ message: 'Error fetching pack', error: error.message });
    }
};

// Update a pack. Makes sure only the owner guides have access to the pack update.
const updatePack = async (req, res) => {
    try {
        if (req.user.role.toLowerCase() !== 'guide') {
            return res.status(403).json({ message: 'You don\'t seem to have the right permissions to perform this action' });
        }
        const updatedPack = await Pack.findOneAndUpdate(
            { _id: req.params.id, guideId: req.user.id },
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedPack) {
            return res.status(404).json({ message: 'Pack not found' });
        }

        res.status(200).json(updatedPack);
    } catch (error) {
        res.status(500).json({ message: 'Error updating pack', error: error.message });
    }
};

// Delete a pack. Makes sure only guides have access to this controller
const deletePack = async (req, res) => {
    try {
        if (req.user.role.toLowerCase() !== 'guide') {
            return res.status(403).json({ message: 'You don\'t seem to have the right permissions to perform this action' });
        }
        const pack = await Pack.findOneAndDelete({ _id: req.params.id, guideId: req.user.id });

        if (!pack) {
            return res.status(404).json({ message: 'Pack not found' });
        }

        res.status(202).json(pack);
    } catch (error) {
        res.status(500).json({ message: 'Error deleting pack', error: error.message });
    }
};

export {
    getAllPacks,
    createPack,
    getPackById,
    updatePack,
    deletePack,
};
