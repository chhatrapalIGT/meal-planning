const mongoose = require('mongoose');


const menDietPlanSchema = new mongoose.Schema({
    Name: { type: String, required: true },
    IdNumber: { type: Number, required: true },
    FoodGroup: { type: String, required: true }
})


const Alimenti = mongoose.model('food', menDietPlanSchema);


module.exports = Alimenti;