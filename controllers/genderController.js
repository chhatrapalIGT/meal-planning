/*const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const config = require('../config/config');



exports.gender = async (req, res) => {
  try {
    const { IDnumber} = req.body;


   
    const existingUser = await User.findOne( {IDnumber:IDnumber} );
    
  


   res.status(201).json({ message: 'User registered successfully', existingUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};*/
const User = require('../models/User');
const Mendietplan = require('../models/Mendietplan'); // Import MenDietPlan model
const Womendietplan = require('../models/Womendietplan'); // Import WomenDietPlan model



exports.gender = async (req, res) => {
  try {
    const { IDnumber, Day, Meal } = req.body;



   // Assuming the gender is stored in the existingUser object
    const existingUser = await User.findOne({ IDnumber: IDnumber });
    const gender = existingUser.gender.toLowerCase(); // Convert gender to lowercase



   let dietPlan;



   // Fetch data from the appropriate collection based on gender and meal type
    if (gender === 'male') {
     dietPlan = await Mendietplan.findOne({ Day: Day, Meal: Meal });
    } else if (gender === 'female') {
      dietPlan = await Womendietplan.findOne({ Day: Day, Meal: Meal });
    } else {
      return res.status(400).json({ message: 'Invalid gender' });
    }



   res.status(200).json({ message: 'Diet plan fetched successfully', dietPlan });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

