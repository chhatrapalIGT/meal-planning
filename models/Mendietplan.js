const mongoose = require('mongoose');


const menDietPlanSchema = new mongoose.Schema({
  // Define fields specific to the men's diet plan
  // You can adjust these fields based on your requirements
  Day: { type: String, required: true },
  mealType: { type: String, required: true },
  dietplan: [{
    Item: { type: String, required: true },
    Quantity: { type: Number, required: false },
    Recipe: { type: String, required: true }
  }]

});


const Mendietplan = mongoose.model('Mendietplan', menDietPlanSchema);


module.exports = Mendietplan;