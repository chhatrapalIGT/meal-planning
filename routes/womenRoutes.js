const express = require('express');
const router = express.Router();
const womenController = require('../controllers/womenController');

// Route to add a new women's diet plan
router.post('/', womenController.addWomenDietPlan);

// Route to get all women's diet plans
router.get('/', womenController.getAllWomenDietPlans);

// Route to get a specific women's diet plan by ID
router.get('/:id', womenController.getWomenDietPlanById);

// Route to update a specific women's diet plan by ID
router.put('/:id', womenController.updateWomenDietPlanById);

// Route to delete a specific women's diet plan by ID
router.delete('/:id', womenController.deleteWomenDietPlanById);

module.exports = router;
