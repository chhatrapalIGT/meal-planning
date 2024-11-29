const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  IDnumber: { type: String, unique: true },
  gender: { type: String, enum: ["Male", "Female", "Others"] },
  dietType: {
    type: String,
    enum: [
      "Mind-Gut-Study",
      "Standard-Weight-Loss",
      "Low-Carbohydrate",
      "Low-Fodmap",
      "Low-Nickel",
      "Muscle-Building",
    ],
    required: true,
  },
  dietaryRestrictions: {
    type: [String],
    enum: ["GlutenFree", "LactoseFree", "LactoOvoVegetarian", "Vegan"],
  },
  languagePreference: {
    type: String,
    enum: ["Italian", "English", "Swedish"],
    default: "English",
    required: true,
  },
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  // authToken: { type: String },
  isVerified: { type: Boolean, default: false },
  termsAndConditions: { type: Boolean, default: true },
  isDietaryRestrictions: { type: Boolean, default: false },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
