import Rating from "../Models/ratingModel.js";

// Create New Rating
export const addRating = async (req, res, next) => {
  try {
    const { stars, comment, packID } = req.body;

    const userId = req.user.id;
    console.log(userId);

    const rating = await Rating.create({
      stars,
      comment,
      packID,
      clientID: userId,
    });

    res.status(201).json({
      success: true,
      message: "rating added successfully",
      data: rating,
    });
  } catch (err) {
    next(err);
  }
};
