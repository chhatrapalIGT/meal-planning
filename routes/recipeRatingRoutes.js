const express = require("express");
const recipeRatingController = require("../controllers/recipeRatingController.js");
const isAuthenticated = require("../middleware/auth");

const router = express.Router();

router.post("/rateRecipe", isAuthenticated, recipeRatingController.rateRecipe);
router.get("/getRecipeRatings", recipeRatingController.getRecipeRatings);

module.exports = router;
