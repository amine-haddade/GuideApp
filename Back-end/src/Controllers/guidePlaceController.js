// controllers/guidePlaceController.js
import GuidePlace from "../Models/Guide.js";
import fs from "fs";
import path from "path";

// ✅ Créer un lieu avec upload
export const createGuidePlace = async (req, res) => {
  try {
    //  Récupérer les noms des images uploadées
    const imageNames = req.files?.map((file) => file.filename) || [];

    if (imageNames.length === 0) {
      return res.status(400).json({ message: "Au moins une image est requise" });
    }

    const data = {
      ...req.body,
      images: imageNames,
    };

    const newPlace = await GuidePlace.create(data);
    res.status(201).json({ message: "Lieu créé avec succès ✅", data: newPlace });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur ❌", error: error.message });
  }
};

//  Récupérer tous les lieux
export const getAllGuidePlaces = async (req, res) => {
  try {
    const places = await GuidePlace.find();
    res.json(places);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

//  Récupérer un lieu par ID
export const getGuidePlaceById = async (req, res) => {
  try {
    const place = await GuidePlace.findById(req.params.id);
    if (!place) return res.status(404).json({ message: "Lieu non trouvé ❌" });
    res.json(place);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

//  Mettre à jour un lieu (avec images optionnelles)
export const updateGuidePlace = async (req, res) => {
  try {
    let updatedData = { ...req.body };

    if (req.files && req.files.length > 0) {
      updatedData.images = req.files.map((file) => file.filename);
    }

    const updated = await GuidePlace.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!updated) return res.status(404).json({ message: "Lieu non trouvé ❌" });
    res.json({ message: "Lieu mis à jour ", data: updated });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

//  Supprimer un lieu et ses images
export const deleteGuidePlace = async (req, res) => {
  try {
    const deleted = await GuidePlace.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Lieu non trouvé ❌" });

    // Supprimer les fichiers physiques
    deleted.images.forEach((img) => {
      const filePath = path.resolve("uploads", img);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    });

    res.json({ message: "Lieu supprimé" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};
