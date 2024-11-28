const jwt = require("jsonwebtoken");
const sendResponse = require("../utils/sendResponse");

const verifyAdminToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return sendResponse(res, 400, "No token provided");
    }

    const decoded = jwt.verify(token, process.env.ADMIN_SECRET);

    if (!decoded || !decoded.adminId) {
      return sendResponse(res, 400, "Invalid or expired token");
    }

    req.adminId = decoded.adminId;
    next();
  } catch (error) {
    return sendResponse(res, 500, error.message || "Authentication Failed");
  }
};

module.exports = verifyAdminToken;
