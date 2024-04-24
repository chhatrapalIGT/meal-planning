const mongoose = require('mongoose');


const womenDietPlanSchema = new mongoose.Schema({
  // Define fields specific to the women's diet plan
  // You can adjust these fields based on your requirements
  Day: { type: String, required: true },
  mealType: { type: String, required: true },
  dietplan: [{
    Item: { type: String, required: true },
    Quantity: { type: Number, required: false},
    Recipe: { type: String, required: true }
  }]
});


const Womendietplan = mongoose.model('Womendietplan', womenDietPlanSchema);


module.exports = Womendietplan;