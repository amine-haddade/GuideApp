// models/GuidePlace.js
import mongoose from "mongoose";

const guidePlaceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, minlength: 10 },
    location: { type: String, required: true },
    images: {
      type: [String], // tableau de noms de fichiers
      validate: {
        validator: (val) => val.length > 0,
        message: "Au moins une image est requise",
      },
      required: true,
    },
    city: { type: String, required: true },
    country: { type: String, required: true },
    guideID: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const GuidePlace = mongoose.model("GuidePlace", guidePlaceSchema);

export default GuidePlace;
