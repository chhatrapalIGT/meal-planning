const mongoose = require("mongoose");

// Define the schema for women's diet plans
const womenSchema = new mongoose.Schema({
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

// Create a model for women's diet plans using the schema
const WomenModel = mongoose.model("WomenDietPlan", womenSchema);

// Export the model for use in other files
module.exports = WomenModel;
