const User = require("../models/User");
const sendResponse = require("../utils/sendResponse");
const jwt = require("jsonwebtoken");

const isAuthenticated = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      return sendResponse(res, 400, "Please enter the token");
    }

    const token = authorization.split(" ")[1];

    if (!token) {
      return sendResponse(res, 400, "Invalid Token");
    }
    const decoded = jwt.verify(token, process.env.SECRET);

    const userId = decoded.userId;
    const userInfo = await User.findOne({ _id: userId });

    if (!userInfo) {
      return sendResponse(res, 404, "User not found");
    }

    req.user = userInfo;
    req.token = token;
    req.userId = userId;
    next();
  } catch (error) {
    console.log(error.message);
    return sendResponse(res, 500, error?.message || "Authentication Failed");
  }
};

module.exports = isAuthenticated;
