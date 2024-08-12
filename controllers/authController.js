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
//generateOTP function
function generateOTP() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

// Register a new user
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
    } = req.body;

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

    if (!termsAndConditions || !username || !email || !password || !gender) {
      let missingFields = [];
      if (!termsAndConditions) missingFields.push("terms and conditions");
      if (!username) missingFields.push("username");
      if (!email) missingFields.push("email");
      if (!password) missingFields.push("password");
      if (!confirmPassword) missingFields.push("confirmPassword");
      if (!gender) missingFields.push("gender");

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
    });

    await user.save();
    const authToken = jwt.sign({ userId: user._id }, process.env.SECRET);

    user.authToken = authToken;
    await user.save();

    return sendResponse(res, 200, "User registered successfully", {
      authToken: authToken
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: error.message || "Something went wrong",
    });
  }
};

exports.userProfile = async (req, res) => {
  try {
    const {email} = req.user;

    return sendResponse(res, 200, "User profile get Successfully", {
      email:email
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

    // Find the user by username
    const user = await User.findOne({ email: email.toLowerCase() });

    // If the user does not exist, return an error
    if (!user) {
      return sendResponse(res, 404, "User not found");
    }

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return sendResponse(res, 401, "Invalid password");
    }

    // Generate JWT token
    const authToken = jwt.sign({ userId: user._id }, process.env.SECRET);

    // Return the token and user details
    return sendResponse(res, 200, " Login successfully", {
      authToken: authToken,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: error.message || "Something went wrong",
    });
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
    // Find the user by ID
    const user = await User.findById(req.user.id);
    console.log(user);
    if (!user) {
      return sendResponse(res, 404, "User not found");
    }

    // Check if the current password is correct
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isCurrentPasswordValid) {
      return sendResponse(res, 400, "Current password is incorrect");
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    user.password = hashedNewPassword;
    await user.save();

    return sendResponse(res, 200, "Password changed successfully");
  } catch (error) {
    console.error(error.message);

    return res.status(500).json({
      message: error.message || "Something went wrong",
    });
  }
};
// Forgot Password
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
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes from now

    // Temporary stop the resend otp functionality for 1 minute
    //  -->>
    // const existingOTP = await OTP.findOneAndUpdate(
    //   { email: email.toLowerCase() },
    //   { otp, expiresAt, lastResend: new Date(0) }, // Set lastResend to a past date
    //   { upsert: true, new: true }
    // );

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
      // If no OTP entry exists, create a new one
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
    return res.status(500).json({
      message: error.message || "Something went wrong",
    });
  }
};

//Reset Password
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
    const gender = existingUser.gender.toLowerCase(); // Convert gender to lowercase
    // Function to calculate portion size based on rules
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

    // Calculate portion sizes
    const portionSizes = calculatePortionSize(gender, numberOfMeals);
    const warningMessage = checkMainMeals(mealTypes);
    let combineData = { portionSizes, warningMessage };
    // Send response
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

    let query = {};
    if (day) {
      query.Day = day;
    }
    if (mealType && mealType.length > 0) {
      query.Meal = { $in: mealType };
    }

    const collection = gender === "male" ? Mendietplan : Womendietplan;

    const mealData = await collection
      .aggregate([
        { $match: query },
        {
          $lookup: {
            from: "Alimenti",
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
            ItemsDetails: 0,
            "Items.Name": 0,
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

    return (
      sendResponse(res, 200, "Meal plan data retrieved successfully", {
        mealData: mealData,
      }),
      console.log("🚀 ~ exports.datWiseMealPlan= ~ mealData:", mealData)
    );
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

    // Extracting only the values from the array of objects
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
