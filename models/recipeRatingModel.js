const mongoose = require("mongoose");

const recipeRatingSchema = new mongoose.Schema(
  {
    recipeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Alimenti",
      required: true,
    },
    suggestion: { type: String },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: { type: Number, required: true, min: 1, max: 5 },
  },
  { timestamps: true }
);

const RecipeRating = mongoose.model("RecipeRating", recipeRatingSchema);

module.exports = RecipeRating;
