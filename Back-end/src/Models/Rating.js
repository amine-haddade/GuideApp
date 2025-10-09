import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema(
  {
    stars: {
      type: Number,
      required: [true, "stars rating is required"],
      min: [1, "minimum rating is 1 star"],
      max: [5, "maximum rating is 5 stars"],
    },
    comment: {
      type: String,
      required: [true, "rating comment is required"],
      trim: true,
    },
    packID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pack",
      required: [true, "pack ID is required"],
    },
    clientID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "client ID is required"],
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

const Rating = mongoose.model("Rating", ratingSchema);
export default Rating;
