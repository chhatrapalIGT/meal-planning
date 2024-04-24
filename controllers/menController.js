const MenModel = require("../models/menModel");

exports.addMenDietPlan = async (req, res) => {
  try {
    const { Day, Meal, Items, Recipe } = req.body;

    // Validate required fields
    if (!Day || !Meal || !Items || !Recipe) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields: Day, Meal, Items, Recipe"
      });
    }

    const formattedItems = Items.map(item => ({
      name: item.name,
      quantity: item.quantity
    }));

    const newMenDietPlan = await MenModel.create({
      Day,
      Meal,
      Items: formattedItems,
      Recipe
    });

    res.status(201).json({
      success: true,
      message: "Men's diet plan added successfully",
      data: newMenDietPlan
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

exports.getAllMenDietPlans = async (req, res) => {
  try {
    const menDietPlans = await MenModel.find();
    res.status(200).json({
      success: true,
      message: "Retrieved all men's diet plans",
      data: menDietPlans
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

exports.getMenDietPlanById = async (req, res) => {
  try {
    const menDietPlan = await MenModel.findById(req.params.id);
    if (!menDietPlan) {
      return res.status(404).json({
        success: false,
        message: "Men's diet plan not found"
      });
    }
    res.status(200).json({
      success: true,
      message: "Retrieved men's diet plan",
      data: menDietPlan
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

exports.updateMenDietPlanById = async (req, res) => {
  try {
    const updatedMenDietPlan = await MenModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedMenDietPlan) {
      return res.status(404).json({
        success: false,
        message: "Men's diet plan not found"
      });
    }
    res.status(200).json({
      success: true,
      message: "Updated men's diet plan",
      data: updatedMenDietPlan
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

exports.deleteMenDietPlanById = async (req, res) => {
  try {
    const deletedMenDietPlan = await MenModel.findByIdAndDelete(req.params.id);
    if (!deletedMenDietPlan) {
      return res.status(404).json({
        success: false,
        message: "Men's diet plan not found"
      });
    }
    res.status(200).json({
      success: true,
      message: "Deleted men's diet plan",
      data: deletedMenDietPlan
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};
