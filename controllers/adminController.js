const Admin = require("../models/adminModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Alimenti = require("../models/Alimenti");
const sendResponse = require("../utils/sendResponse");

exports.adminLogin = async (req, res) => {
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

    const admin = await Admin.findOne({ email: email.toLowerCase() });

    if (!admin) {
      return sendResponse(res, 404, "Admin not found");
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return sendResponse(res, 401, "Invalid password");
    }

    const authToken = jwt.sign(
      { adminId: admin._id },
      process.env.ADMIN_SECRET
    );

    return sendResponse(res, 200, "Admin login successful", {
      authToken: authToken,
    });
  } catch (error) {
    console.error("Error in adminLogin:", error.message);
    return sendResponse(res, 500, error.message || "Something went wrong");
  }
};

exports.createAlimenti = async (req, res) => {
  try {
    const alimentiData = req.body;
    const newAlimenti = new Alimenti(alimentiData);
    await newAlimenti.save();
    return sendResponse(res, 200, "Alimenti created successfully", {
      newAlimenti: newAlimenti,
    });
  } catch (error) {
    console.error("Error in createAlimenti:", error.message);
    return sendResponse(res, 500, error.message || "Something went wrong");
  }
};

exports.updateAlimenti = async (req, res) => {
  try {
    const { id } = req.query;
    const updateData = req.body;

    const updatedAlimenti = await Alimenti.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedAlimenti) {
      return sendResponse(res, 404, "Alimenti not found");
    }

    return sendResponse(res, 200, "Alimenti updated successfully", {
      updatedAlimenti: updatedAlimenti,
    });
  } catch (error) {
    console.error("Error in createAlimenti:", error.message);

    return sendResponse(res, 500, error.message || "Something went wrong");
  }
};

exports.getAlimenti = async (req, res) => {
  try {
    const { id } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    if (id) {
      const alimenti = await Alimenti.findById(id);
      if (!alimenti) {
        return sendResponse(res, 404, "Alimenti not found");
      }
      return sendResponse(
        res,
        200,
        "Alimenti retrieved successfully",
        alimenti
      );
    }

    const totalCount = await Alimenti.countDocuments();
    const alimentiList = await Alimenti.find().skip(skip).limit(limit);

    const totalPages = Math.ceil(totalCount / limit);

    return sendResponse(res, 200, "Alimenti data retrieved successfully", {
      count: alimentiList.length,
      totalPages,
      currentPage: page,
      alimentiList: alimentiList,
    });
  } catch (error) {
    console.error("Error in getAlimenti:", error.message);
    return sendResponse(res, 500, error.message || "Something went wrong");
  }
};
