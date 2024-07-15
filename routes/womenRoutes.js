const express = require('express');
const router = express.Router();
const womenController = require('../controllers/womenController');
const isAuthenticated = require('../middleware/auth');

// Route to add a new women's diet plan
router.post('/',isAuthenticated, womenController.addWomenDietPlan);

// Route to get all women's diet plans
router.get('/',isAuthenticated, womenController.getAllWomenDietPlans);

// Route to get a specific women's diet plan by ID
router.get('/:id',isAuthenticated, womenController.getWomenDietPlanById);

// Route to update a specific women's diet plan by ID
router.put('/:id',isAuthenticated, womenController.updateWomenDietPlanById);

// Route to delete a specific women's diet plan by ID
router.delete('/:id',isAuthenticated, womenController.deleteWomenDietPlanById);

module.exports = router;
