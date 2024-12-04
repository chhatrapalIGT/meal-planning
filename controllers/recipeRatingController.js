const RecipeRating = require("../models/recipeRatingModel.js");
const sendResponse = require("../utils/sendResponse");
require("dotenv").config({ path: ".env" });

exports.rateRecipe = async (req, res) => {
  try {
    const { recipeId, rating, suggestion } = req.body;

    const userId = req.userId;

    if (!recipeId || !rating) {
      return sendResponse(res, 400, "Recipe ID, and Rating are required.");
    }

    if (rating < 1 || rating > 5) {
      return sendResponse(res, 400, "Rating must be between 1 and 5.");
    }

    const updatedRating = await RecipeRating.findOneAndUpdate(
      { recipeId, userId },
      { rating, suggestion },
      { new: true, upsert: true }
    );

    return sendResponse(res, 200, "Rating submitted successfully.", {
      updatedRating: updatedRating,
    });
  } catch (error) {
    console.error("Error in rateRecipe:", error.message);
    return sendResponse(res, 500, error.message || "Something went wrong");
  }
};

exports.getRecipeRatings = async (req, res) => {
  try {
    const { recipeId } = req.query;

    if (!recipeId) {
      return sendResponse(res, 400, "Recipe ID is required.");
    }

    const ratings = await RecipeRating.find({ recipeId });
    const totalRatings = ratings.length;
    const averageRating = totalRatings
      ? (
          ratings.reduce((acc, cur) => acc + cur.rating, 0) / totalRatings
        ).toFixed(2)
      : 0;

    return sendResponse(res, 200, "Ratings retrieved successfully.", {
      averageRating,
      totalRatings,
      ratings: ratings,
    });
  } catch (error) {
    console.error("Error in getRecipeRatings:", error.message);
    return sendResponse(res, 500, error.message || "Something went wrong");
  }
};
