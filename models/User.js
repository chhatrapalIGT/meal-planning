const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema({
//   IDnumber: { type: String, unique: true },
//   gender: { type: String, enum: ["Male", "Female", "Others"] },
//   username: { type: String, required: true, unique: true },
//   password: { type: String },
//   authToken: { type: String },
//   isVerified: { type: Boolean, default: false },
//   termsAndConditions: { type: Boolean, default: true },
// });

const userSchema = new mongoose.Schema({
  IDnumber: { type: String, unique: true },
  gender: { type: String, enum: ["Male", "Female", "Others"] },
  username: { type: String, required: true},
  email: {type:String,required:true,unique:true},
  password: { type: String },
  authToken: { type: String },
  isVerified: { type: Boolean, default: false },
  termsAndConditions: { type: Boolean, default: true },
});


const User = mongoose.model("User", userSchema);

module.exports = User;
