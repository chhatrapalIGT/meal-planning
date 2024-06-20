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
require("dotenv").config({ path: ".env" });
console.log(process.env.SECRET);
// Register a new user
exports.register = async (req, res) => {
  try {
    const { IDnumber, gender, username, password, termsAndConditions } =
      req.body;

    let generatedID;
    if (
      !IDnumber ||
      IDnumber.length < 3 ||
      IDnumber.length > 5 ||
      isNaN(Number(IDnumber))
    ) {
      generatedID = generateUniqueID(Math.floor(Math.random() * 3) + 3);
    }
    if (!termsAndConditions || !username || !password || !gender) {
      let missingFields = [];
      if (!termsAndConditions) missingFields.push("terms and conditions");
      if (!username) missingFields.push("username");
      if (!password) missingFields.push("password");
      if (!gender) missingFields.push("gender");

      return res.status(400).json({
        message: `The following fields are missing: ${missingFields.join(
          ", "
        )}. Please fill them out.`,
      });
    }

    const existingUser = await User.findOne({
      $or: [{ username }, { password }],
    });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      IDnumber: IDnumber || generatedID.toString(),
      gender,
      username,
      password: hashedPassword,
      termsAndConditions,
    });

    await user.save();
    const authToken = jwt.sign({ userId: user._id }, process.env.SECRET, {
      expiresIn: "1h",
    });

    user.authToken = authToken;
    await user.save();

    res
      .status(201)
      .json({ message: "User registered successfully", authToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

function generateUniqueID(length) {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Verify user registration with authentication token
exports.verifyRegistration = async (req, res) => {
  try {
    const { authToken } = req.body;

    // Decode the authentication token
    const decoded = jwt.verify(authToken, config.secret);

    // Find the user by ID and update the verification status
    await User.findByIdAndUpdate(decoded.userId, { isVerified: true });

    res
      .status(200)
      .json({ message: "User registration verified successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Login a user
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      let missingFields = [];
      if (!username) missingFields.push("username");
      if (!password) missingFields.push("password");

      return res.status(400).json({
        message: `The following fields are missing: ${missingFields.join(
          ", "
        )}. Please fill them out.`,
      });
    }

    // Find the user by username
    const user = await User.findOne({ username });
    console.log(user);

    // If the user does not exist, return an error
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate JWT token
    const authToken = jwt.sign({ userId: user._id }, process.env.SECRET, {
      expiresIn: "1h",
    });

    // Return the token and user details
    res.status(200).json({
      authToken,
      user: { id: user._id, username: user.username, Gender: user.gender },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
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
    res.status(500).json({ success: false, message: error.message });
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
    const { username, day, mealType } = req.body;

    if (!username || !mealType) {
      let missingFields = [];
      if (!username) missingFields.push("username");
      if (!mealType) missingFields.push("mealType");

      return res.status(400).json({
        message: `The following fields are missing: ${missingFields.join(
          ", "
        )}. Please fill them out.`,
      });
    }

    const existingUser = await User.findOne({ username: username });
    if (!existingUser) throw new Error("user not found");
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
      return res
        .status(404)
        .json({ error: `No meal plan found for the given parameters.` });
    }

    return res.json({
      success: true,
      message: "meal plan data get successfully",
      data: mealData,
    });
    console.log("🚀 ~ exports.datWiseMealPlan= ~ mealData:", mealData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
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
