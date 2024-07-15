const MenModel = require("../models/menModel");
const sendResponse = require("../utils/sendResponse");

exports.addMenDietPlan = async (req, res) => {
  try {
    const { Day, Meal, Items, Recipe } = req.body;

    // Validate required fields
    if (!Day || !Meal || !Items || !Recipe) {
      return sendResponse(
        res,
        400,
        "Please provide all required fields: Day, Meal, Items, Recipe"
      );
    }

    const formattedItems = Items.map((item) => ({
      name: item.name,
      quantity: item.quantity,
    }));

    const newMenDietPlan = await MenModel.create({
      Day,
      Meal,
      Items: formattedItems,
      Recipe,
    });

    return sendResponse(res, 200, "Men's diet plan added successfully", {
      newMenDietPlan: newMenDietPlan,
    });
  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, error?.message || "Internal server error");
  }
};

exports.getAllMenDietPlans = async (req, res) => {
  try {
    const menDietPlans = await MenModel.find();
    return sendResponse(res, 200, "Retrieved all men's diet plans", {
      menDietPlans: menDietPlans,
    });
  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, error?.message || "Internal server error");
  }
};

exports.getMenDietPlanById = async (req, res) => {
  try {
    const menDietPlan = await MenModel.findById(req.params.id);
    if (!menDietPlan) {
      return sendResponse(res, 404, "Men's diet plan not found");
    }
    return sendResponse(res, 200, "Retrieved men's diet plan", {
      menDietPlan: menDietPlan,
    });
  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, error?.message || "Internal server error");
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
      return sendResponse(res, 404, "Men's diet plan not found");
    }
    return sendResponse(res, 200, "Updated men's diet plan", {
      updatedMenDietPlan: updatedMenDietPlan,
    });
  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, error?.message || "Internal server error");
  }
};

exports.deleteMenDietPlanById = async (req, res) => {
  try {
    const deletedMenDietPlan = await MenModel.findByIdAndDelete(req.params.id);
    if (!deletedMenDietPlan) {
      return sendResponse(res, 404, "Men's diet plan not found");
    }
    return sendResponse(res, 200, "Deleted men's diet plan", {
      deletedMenDietPlan: deletedMenDietPlan,
    });
  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, error?.message || "Internal server error");
  }
};
