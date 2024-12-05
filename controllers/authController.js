// authController.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/User");
const Alimenti = require("../models/Alimenti");
const Mealplan = require("../models/Mealplan");
const config = require("../config/config");
const Mendietplan = require("../models/Mendietplan");
const Womendietplan = require("../models/Womendietplan");
const MailService = require("../utils/mail");
const OTP = require("../models/OTP");
const sendResponse = require("../utils/sendResponse");
require("dotenv").config({ path: ".env" });
function generateOTP() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

exports.register = async (req, res) => {
  try {
    const {
      IDnumber,
      gender,
      username,
      email,
      password,
      confirmPassword,
      termsAndConditions,
      languagePreference,
      dietType,
      isDietaryRestrictions,
    } = req.body;
    console.log("🚀 ~ exports.register= ~ req.body:", req.body);

    if (password !== confirmPassword) {
      return sendResponse(res, 400, "Password don't match");
    }

    let generatedID;
    if (
      !IDnumber ||
      IDnumber.length < 3 ||
      IDnumber.length > 5 ||
      isNaN(Number(IDnumber))
    ) {
      generatedID = generateUniqueID(Math.floor(Math.random() * 3) + 3);
    }

    const uniqueIdNumber = await User.findOne({ IDnumber: IDnumber });
    if (uniqueIdNumber) {
      return sendResponse(res, 409, "IDnumber already exists");
    }

    if (
      !termsAndConditions ||
      !username ||
      !email ||
      !password ||
      !gender ||
      !isDietaryRestrictions
    ) {
      let missingFields = [];
      if (!termsAndConditions) missingFields.push("terms and conditions");
      if (!username) missingFields.push("username");
      if (!email) missingFields.push("email");
      if (!password) missingFields.push("password");
      if (!confirmPassword) missingFields.push("confirmPassword");
      if (!gender) missingFields.push("gender");
      if (!dietType) missingFields.push("dietType");
      if (
        isDietaryRestrictions === null ||
        isDietaryRestrictions === undefined
      ) {
        missingFields.push("isDietaryRestrictions");
      }
      return sendResponse(
        res,
        400,
        `The following fields are missing: ${missingFields.join(
          ", "
        )}. Please fill them out.`
      );
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return sendResponse(res, 409, "User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      IDnumber: IDnumber || generatedID.toString(),
      gender,
      username: username,
      email: email.toLowerCase(),
      password: hashedPassword,
      termsAndConditions,
      dietType,
      dietaryRestrictions: req.body.dietaryRestrictions || [],
      languagePreference: languagePreference,
    });

    await user.save();
    const authToken = jwt.sign({ userId: user._id }, process.env.SECRET);

    return sendResponse(res, 200, "User registered successfully", {
      authToken: authToken,
    });
  } catch (error) {
    console.error(error);

    return sendResponse(res, 500, error.message || "Something went wrong");
  }
};

exports.userProfile = async (req, res) => {
  try {
    console.log("🚀 ~ exports.userProfile= ~ req.user:", req.user);
    return sendResponse(res, 200, "User profile get Successfully", {
      user: req.user,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: error.message || "Something went wrong",
    });
  }
};

function generateUniqueID(length) {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      let missingFields = [];
      if (!email) missingFields.push("email");
      if (!password) missingFields.push("password");

      return sendResponse(
        res,
        400,
        `The following fields are missing: ${missingFields.join(
          ", "
        )}. Please fill them out.`
      );
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return sendResponse(res, 404, "User not found");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return sendResponse(res, 401, "Invalid password");
    }

    const authToken = jwt.sign({ userId: user._id }, process.env.SECRET);

    return sendResponse(res, 200, "Login successfully", {
      authToken: authToken,
    });
  } catch (error) {
    console.error(error);

    return sendResponse(res, 500, error.message || "Something went wrong");
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      let missingFields = [];
      if (!currentPassword) missingFields.push("Current password");
      if (!newPassword) missingFields.push("New password");
      if (!confirmPassword) missingFields.push("Confirm password");

      return sendResponse(
        res,
        400,
        `The following fields are missing: ${missingFields.join(
          ", "
        )}. Please fill them out.`
      );
    }

    if (newPassword !== confirmPassword) {
      return sendResponse(
        res,
        400,
        "New password and confirm password don't match"
      );
    }

    console.log(req.user.id);
    const user = await User.findById(req.user.id);
    console.log(user);
    if (!user) {
      return sendResponse(res, 404, "User not found");
    }

    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isCurrentPasswordValid) {
      return sendResponse(res, 400, "Current password is incorrect");
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedNewPassword;
    await user.save();

    return sendResponse(res, 200, "Password changed successfully");
  } catch (error) {
    console.error(error.message);

    return sendResponse(res, 500, error.message || "Something went wrong");
  }
};
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return sendResponse(res, 400, "Email is required");
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return sendResponse(res, 404, "User not found");
    }

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000);

    let existingOTP = await OTP.findOne({ email: email.toLowerCase() });

    if (existingOTP) {
      const resendInterval = 2 * 60 * 1000;
      const now = Date.now();

      if (now - existingOTP.lastResend.getTime() < resendInterval) {
        const waitTime = Math.round(
          (resendInterval - (now - existingOTP.lastResend.getTime())) / 1000
        );
        return sendResponse(
          res,
          429,
          `Please wait ${waitTime} seconds before requesting a new OTP`
        );
      }

      existingOTP.otp = otp;
      existingOTP.expiresAt = expiresAt;
      existingOTP.lastResend = new Date();
      await existingOTP.save();
    } else {
      await OTP.create({
        email: email.toLowerCase(),
        otp,
        expiresAt,
        lastResend: new Date(),
      });
    }

    MailService(email, "Password Reset OTP", otp);

    return sendResponse(res, 200, "OTP sent to your email");
  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, error.message || "Something went wrong");
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword, confirmPassword } = req.body;

    if (!email || !otp || !newPassword || !confirmPassword) {
      return sendResponse(
        res,
        400,
        "Email, OTP, and new password are required"
      );
    }

    const checkEmail = await User.findOne({ email: email.toLowerCase() });

    if (!checkEmail) {
      return sendResponse(res, 400, "Email not found");
    }

    const otpEntry = await OTP.findOne({ email: email.toLowerCase(), otp });

    if (!otpEntry) {
      return sendResponse(res, 400, "Invalid OTP");
    }

    if (otpEntry.expiresAt < new Date()) {
      return sendResponse(res, 400, "OTP has expired");
    }

    if (newPassword !== confirmPassword) {
      return sendResponse(res, 400, "Password don't match");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.updateOne(
      { email: email.toLowerCase() },
      { password: hashedPassword }
    );

    await OTP.deleteOne({ email: email.toLowerCase(), otp });

    return sendResponse(res, 200, "Password reset successfully");
  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, error.message || "Something went wrong");
  }
};

exports.selectPlan = async (req, res) => {
  try {
    const { IDnumber, numberOfMeals, mealTypes, Day, Meal } = req.body;

    const existingUser = await User.findOne({ IDnumber: IDnumber });
    if (!existingUser) throw new Error("id is not found");
    const gender = existingUser.gender.toLowerCase();
    function calculatePortionSize(gender, numberOfMeals) {
      let portionSize;
      if (gender === "female") {
        if (numberOfMeals === 4 || numberOfMeals === 5) {
          portionSize = { grain: 50, protein: 100 };
        } else {
          portionSize = { grain: 80, protein: 150 };
        }
      } else if (gender === "male") {
        if (numberOfMeals === 4 || numberOfMeals === 5) {
          portionSize = { grain: 80, protein: 150 };
        } else {
          portionSize = { grain: 100, protein: 200 };
        }
      }
      return portionSize;
    }

    function checkMainMeals(mealTypes) {
      if (
        mealTypes?.includes("breakfast") &&
        mealTypes?.includes("snack") &&
        mealTypes?.length === 2
      ) {
        return "Are you sure? It is advisable to consume at least one main meal per day";
      }
      return null;
    }

    const portionSizes = calculatePortionSize(gender, numberOfMeals);
    const warningMessage = checkMainMeals(mealTypes);
    let combineData = { portionSizes, warningMessage };
    res.json({
      success: true,
      message: "data get successfully",
      data: combineData,
    });
  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, error.message);
  }
};

const paginatedResults = async (
  pageNumber,
  perPageValue,
  sortField,
  sortType,
  defaultSortField
) => {
  const page = pageNumber > 0 ? parseInt(pageNumber) : 1;
  const perPage = perPageValue > 0 ? parseInt(perPageValue) : 10;
  let sortObj = {
    [defaultSortField]: -1,
  };

  if (sortField != undefined && sortType == "asc") {
    sortObj = {
      [sortField]: 1,
    };
  }

  if (sortField != undefined && sortType == "desc") {
    sortObj = {
      [sortField]: -1,
    };
  }
  return { page, skipRecord: (page - 1) * perPage, perPage, sortObj };
};

const searching = async (search, fields) => {
  let filter = {};
  filter.$or = fields.map((ele) => {
    return { [ele]: { $regex: search, $options: "i" } };
  });
  return filter;
};

exports.findNameOfAlimenti = async (req, res) => {
  try {
    const { IdNumber, FoodGroup } = req.body;
    let pagination = await paginatedResults(
      req.query.page,
      req.query.limit,
      req.query.sortField,
      req.query.sortType,
      "_id"
    );

    const foodGroupsArray = Array.isArray(FoodGroup) ? FoodGroup : [FoodGroup];
    console.log(
      "🚀 ~ exports.findNameOfAlimenti= ~ foodGroupsArray:",
      foodGroupsArray
    );

    const alternatives = await Alimenti.aggregate(
      [
        {
          $match: {
            "List of Alternatives (Food group)": { $in: foodGroupsArray },
          },
        },
        { $sort: pagination.sortObj },
        { $skip: pagination.skipRecord },
        { $limit: pagination.perPage },
      ],
      { collation: { locale: "en" } }
    );

    let totalPage;
    let totalCount;
    totalCount = (
      await Alimenti.aggregate([
        {
          $match: {
            "List of Alternatives (Food group)": { $in: foodGroupsArray },
          },
        },
      ])
    ).length;

    totalPage = Math.ceil(totalCount / pagination.perPage);

    res.json({
      success: true,
      message: "Data retrieved successfully",
      totalPages: totalPage,
      count: totalCount,
      data: alternatives,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.datWiseMealPlan = async (req, res) => {
  try {
    const { day, mealType } = req.body;
    const email = req.user.email;

    if (!email || !mealType) {
      let missingFields = [];
      if (!mealType) missingFields.push("mealType");

      return sendResponse(
        res,
        400,
        `The following fields are missing: ${missingFields.join(
          ", "
        )}. Please fill them out.`
      );
    }

    const existingUser = await User.findOne({ email: email });

    if (!existingUser) {
      return sendResponse(res, 404, "User not found");
    }
    const gender = existingUser.gender.toLowerCase();
    const dietType = existingUser.dietType;

    let query = {};
    if (day) {
      query.Day = day;
    }
    if (mealType && mealType.length > 0) {
      query.Meal = { $in: mealType };
    }

    const collection = gender === "male" ? Mendietplan : Womendietplan;

    let mealData = await collection
      .aggregate([
        { $match: query },
        {
          $lookup: {
            from: "alimentis",
            localField: "Items._id",
            foreignField: "_id",
            as: "ItemsDetails",
          },
        },
        {
          $addFields: {
            Items: {
              $map: {
                input: "$Items",
                as: "item",
                in: {
                  $mergeObjects: [
                    "$$item",
                    {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: "$ItemsDetails",
                            as: "itemDetail",
                            cond: { $eq: ["$$itemDetail._id", "$$item._id"] },
                          },
                        },
                        0,
                      ],
                    },
                  ],
                },
              },
            },
          },
        },
        {
          $project: {
            "Items.name": 0,
            ItemsDetails: 0,
          },
        },
      ])
      .exec();

    if (mealData.length === 0) {
      return sendResponse(
        res,
        404,
        "No meal plan found for the given parameters."
      );
    }

    const mealNames = mealData.flatMap((meal) =>
      meal.Items.map((item) => item.Name)
    );

    const mealIds = mealData.flatMap((meal) =>
      meal.Items.map((item) => item._id)
    );

    const additionalAlimentiItems = await Alimenti.find({
      Name: { $in: mealNames },
      _id: { $nin: mealIds },
    });
    if (dietType === "Standard-Weight-Loss") {
      additionalAlimentiItems.forEach((item) => {
        mealData.forEach((meal) => {
          meal.Items.forEach((mealItem) => {
            if (mealItem.Name === item.Name) {
              if (!mealItem.alimentiDetails) {
                mealItem.alimentiDetails = [];
              }
              mealItem.alimentiDetails.push(item);
            }
          });
        });
      });
    }
    const mealTypeCount = mealType.length;

    if (dietType === "Standard-Weight-Loss") {
      mealData.forEach((meal) => {
        if (gender === "male") {
          meal.Level = mealTypeCount >= 4 && mealTypeCount <= 5 ? 2 : 3;
        } else {
          meal.Level = mealTypeCount >= 4 && mealTypeCount <= 5 ? 1 : 2;
        }
      });
    } else {
      mealData.forEach((meal) => {
        meal.Level = null;
      });
    }

    const mealTypeOrder = {};

    mealType.forEach((meal, index) => {
      mealTypeOrder[meal] = index;
    });

    mealData.sort((a, b) => {
      return mealTypeOrder[a.Meal] - mealTypeOrder[b.Meal];
    });

    return sendResponse(res, 200, "Meal plan data retrieved successfully", {
      mealData: mealData,
    });
  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, error?.message || "Something went wrong");
  }
};

exports.findAllGroupArray = async (req, res) => {
  try {
    const alternatives = await Alimenti.aggregate([
      { $match: { "List of Alternatives (Food group)": { $exists: true } } },
      { $group: { _id: "$List of Alternatives (Food group)" } },
      { $project: { _id: 0, "List of Alternatives (Food group)": "$_id" } },
    ]);

    const data = alternatives.map(
      (item) => item["List of Alternatives (Food group)"]
    );

    res.json({
      success: true,
      message: "FoodGroup Data Get successfully",
      data: data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const updateData = req.body;

    if (Object.keys(updateData).length === 0) {
      return sendResponse(res, 400, "No data to update");
    }
    const validFields = [
      "username",
      "email",
      "gender",
      "sexAtBirth",
      "dietType",
      "dietaryRestrictions",
      "languagePreference",
      "password",
      "authToken",
      "termsAndConditions",
      "IDnumber",
      "isDietaryRestrictions",
    ];
    const keysToUpdate = Object.keys(updateData);

    const isValidUpdate = keysToUpdate.every((key) =>
      validFields.includes(key)
    );
    if (!isValidUpdate) {
      return sendResponse(res, 400, "Invalid field(s) in update request");
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return sendResponse(res, 404, "User not found");
    }

    return sendResponse(res, 200, "User updated successfully", {
      updatedUser: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return sendResponse(res, 500, error.message || "Something went wrong");
  }
};

exports.getRecipeDetailsByCuisine = async (req, res) => {
  try {
    const { _id, cuisine } = req.query;

    if (!_id) {
      return sendResponse(res, 400, "Recipe ID (_id) is required.");
    }

    const recipe = await Alimenti.findById(_id);

    if (!recipe) {
      return sendResponse(res, 404, "Recipe not found.");
    }

    let responseData = {};

    if (cuisine === "Italian") {
      responseData = {
        ...responseData,
        RecipeInstructions: recipe.RecipeInstructionsItalian,
        RecipeIngredients: recipe.RecipeIngredientsItalian,
        Name: recipe.ItalianName,
      };
    } else if (cuisine === "Swedish") {
      responseData = {
        ...responseData,
        RecipeInstructions: recipe.RecipeInstructionsSwedish,
        RecipeIngredients: recipe.RecipeIngredientsSwedish,
        Name: recipe.SwedishName,
      };
    } else {
      responseData = {
        ...responseData,
        RecipeInstructions: recipe.RecipeInstructions,
        RecipeIngredients: recipe.RecipeIngredients,
        Name: recipe.Name,
      };
    }

    return sendResponse(
      res,
      200,
      "Recipe details fetched successfully.",
      responseData
    );
  } catch (error) {
    console.error("Error in getRecipeDetailsByCuisine:", error.message);
    return sendResponse(res, 500, "Failed to fetch recipe details.");
  }
};
