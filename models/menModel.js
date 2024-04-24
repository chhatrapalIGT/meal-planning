const mongoose = require("mongoose");

const menSchema = new mongoose.Schema({
  Day: {
    type: String,
    required: true
  },
  Meal: {
    type: String,
    required: true
  },
  Items: [{
    name: {
      type: String,
      required: false
    },
    quantity: {
      type: String,
      required: false
    }
  }],
  Recipe: {
    type: String
    // Add any other options as needed
  }
});

const MenModel = mongoose.model("MenDietPlan", menSchema);

module.exports = MenModel;
