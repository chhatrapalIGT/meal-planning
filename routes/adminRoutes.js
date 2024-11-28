const express = require("express");
const adminController = require("../controllers/adminController");
const verifyAdminToken = require("../middleware/adminAuth");

const router = express.Router();

router.post("/adminLogin", adminController.adminLogin);
router.post(
  "/createAlimenti",
  verifyAdminToken,
  adminController.createAlimenti
);
router.post(
  "/updateAlimenti",
  verifyAdminToken,
  adminController.updateAlimenti
);
router.get("/getAlimenti", adminController.getAlimenti);

module.exports = router;
