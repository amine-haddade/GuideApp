// middlewares/uploadImages.js
import multer from "multer";
import path from "path";
import fs from "fs";

//  Chemin du dossier uploads
const uploadDir = path.resolve("uploads");

// Crée le dossier s’il n’existe pas
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configuration du stockage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

//  Multer pour plusieurs images
export const uploadImages = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // max 5MB
}).array("images", 5); // max 5 images
