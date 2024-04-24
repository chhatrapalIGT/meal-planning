const WomenModel = require("../models/womenModel");

exports.addWomenDietPlan = async (req, res) => {
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

    const newWomenDietPlan = await WomenModel.create({
      Day,
      Meal,
      Items: formattedItems,
      Recipe
    });

    res.status(201).json({
      success: true,
      message: "Women's diet plan added successfully",
      data: newWomenDietPlan
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

exports.getAllWomenDietPlans = async (req, res) => {
  try {
    const womenDietPlans = await WomenModel.find();
    res.status(200).json({
      success: true,
      message: "Retrieved all women's diet plans",
      data: womenDietPlans
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

exports.getWomenDietPlanById = async (req, res) => {
  try {
    const womenDietPlan = await WomenModel.findById(req.params.id);
    if (!womenDietPlan) {
      return res.status(404).json({
        success: false,
        message: "Women's diet plan not found"
      });
    }
    res.status(200).json({
      success: true,
      message: "Retrieved women's diet plan",
      data: womenDietPlan
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

exports.updateWomenDietPlanById = async (req, res) => {
  try {
    const updatedWomenDietPlan = await WomenModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedWomenDietPlan) {
      return res.status(404).json({
        success: false,
        message: "Women's diet plan not found"
      });
    }
    res.status(200).json({
      success: true,
      message: "Updated women's diet plan",
      data: updatedWomenDietPlan
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

exports.deleteWomenDietPlanById = async (req, res) => {
  try {
    const deletedWomenDietPlan = await WomenModel.findByIdAndDelete(req.params.id);
    if (!deletedWomenDietPlan) {
      return res.status(404).json({
        success: false,
        message: "Women's diet plan not found"
      });
    }
    res.status(200).json({
      success: true,
      message: "Deleted women's diet plan",
      data: deletedWomenDietPlan
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
