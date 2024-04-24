// authRoutes.js
const express = require('express');
const authController = require('../controllers/authController');


const router = express.Router();

router.post('/register', authController.register);
router.post('/verify-registration', authController.verifyRegistration);
router.post('/login', authController.login);
router.post('/selectPlan', authController.selectPlan);
router.post('/findNameOfAlimenti', authController.findNameOfAlimenti);
router.post('/findDayWise', authController.datWiseMealPlan);


module.exports = router;