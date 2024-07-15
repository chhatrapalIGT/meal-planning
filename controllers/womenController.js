const WomenModel = require("../models/womenModel");
const sendResponse = require("../utils/sendResponse");

exports.addWomenDietPlan = async (req, res) => {
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

    const newWomenDietPlan = await WomenModel.create({
      Day,
      Meal,
      Items: formattedItems,
      Recipe,
    });

  
    return sendResponse(
      res,
      200,
      "Women's diet plan added successfully",
      { newWomenDietPlan:newWomenDietPlan }
    );
  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, error?.message || "Internal server error");
  }
};

exports.getAllWomenDietPlans = async (req, res) => {
  try {
    const womenDietPlans = await WomenModel.find();
    return sendResponse(
      res,
      200,
      "Retrieved all women's diet plans",
      {womenDietPlans:womenDietPlans}
    );
  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, error?.message || "Internal server error");
  }
};

exports.getWomenDietPlanById = async (req, res) => {
  try {
    const womenDietPlan = await WomenModel.findById(req.params.id);
    if (!womenDietPlan) {
      return sendResponse(res, 404, "Women's diet plan not found");
    }
    return sendResponse(res, 200, "Retrieved women's diet plan", {womenDietPlan:womenDietPlan});
  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, error?.message || "Internal server error");
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
      return sendResponse(res, 404, "Women's diet plan not found");
    }
    return sendResponse(
      res,
      200,
      "Updated women's diet plan",
      {updatedWomenDietPlan:updatedWomenDietPlan}
    );
  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, error?.message || "Internal server error");
  }
};

exports.deleteWomenDietPlanById = async (req, res) => {
  try {
    const deletedWomenDietPlan = await WomenModel.findByIdAndDelete(
      req.params.id
    );
    if (!deletedWomenDietPlan) {
      return sendResponse(res, 404, "Women's diet plan not found");
    }
    return sendResponse(
      res,
      200,
      "Deleted women's diet plan",
      {deletedWomenDietPlan:deletedWomenDietPlan}
    );
  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, error?.message || "Internal server error");
  }
};
