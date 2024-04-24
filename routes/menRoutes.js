const express = require('express');
const router = express.Router();
const menController = require('../controllers/menController');

// Route to add a new men's diet plan
router.post('/', menController.addMenDietPlan);

// Route to get all men's diet plans
router.get('/', menController.getAllMenDietPlans);

// Route to get a specific men's diet plan by ID
router.get('/:id', menController.getMenDietPlanById);

// Route to update a specific men's diet plan by ID
router.put('/:id', menController.updateMenDietPlanById);

// Route to delete a specific men's diet plan by ID
router.delete('/:id', menController.deleteMenDietPlanById);

module.exports = router;
