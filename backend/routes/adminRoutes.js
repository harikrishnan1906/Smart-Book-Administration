const express = require("express");
const router = express.Router();
const {
  getAdminProfile,
  getSystemSettings,
  updateSystemSettings,
  getActivityLogs,
} = require("../controllers/adminController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// All routes here should just be accessed by admin
router.get("/profile", protect, adminOnly, getAdminProfile);
router.get("/settings", protect, adminOnly, getSystemSettings);
router.put("/settings", protect, adminOnly, updateSystemSettings);
router.get("/activity-logs", protect, adminOnly, getActivityLogs);

module.exports = router;
