// authRoutes.js
const express = require('express');
const authController = require('../controllers/authController');
const isAuthenticated = require('../middleware/auth');


const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);
router.post("/change-password",isAuthenticated,authController.changePassword)
router.post('/selectPlan', authController.selectPlan);
router.post('/findNameOfAlimenti', authController.findNameOfAlimenti);
router.post('/findDayWise',isAuthenticated, authController.datWiseMealPlan);
router.post('/findAllGroupArray', authController.findAllGroupArray);


module.exports = router;