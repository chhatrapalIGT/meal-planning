const mongoose = require('mongoose');

const mealPlanSchema = new mongoose.Schema({
    lunch: {
        vegetables: String,
        grainBasedMeal: String,
        legumes: String,
        fruit: String,
    },
    dinner: {
        vegetables: String,
        proteinBasedMeal: String,
        wholegrainBread: String,
        fruit: String,
    },
});

const MealPlan = mongoose.model('MealPlan', mealPlanSchema);
module.exports = MealPlan;