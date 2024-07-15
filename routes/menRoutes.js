const express = require("express");
const router = express.Router();
const menController = require("../controllers/menController");
const isAuthenticated = require("../middleware/auth");

// Route to add a new men's diet plan
router.post("/", isAuthenticated, menController.addMenDietPlan);

// Route to get all men's diet plans
router.get("/", isAuthenticated, menController.getAllMenDietPlans);

// Route to get a specific men's diet plan by ID
router.get("/:id", isAuthenticated, menController.getMenDietPlanById);

// Route to update a specific men's diet plan by ID
router.put("/:id", isAuthenticated, menController.updateMenDietPlanById);

// Route to delete a specific men's diet plan by ID
router.delete("/:id", isAuthenticated, menController.deleteMenDietPlanById);

module.exports = router;
