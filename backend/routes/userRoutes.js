const express = require("express");
const router = express.Router();
const {
  registerUser,
  getPendingUsers,
  approveUser,
  resetUserPassword,
  getAllUsers,
  toggleUserStatus,
  getAdminStats,
  getMe,
  updateMyProfile,
  changePassword,
} = require("../controllers/userController");
const { protect, adminOnly } = require("../middleware/authMiddleware");


router.post("/register", registerUser);

// user profile routes
router.get("/me", protect, getMe);
router.put("/me/profile", protect, updateMyProfile);
router.put("/me/change-password", protect, changePassword);

// admin protected routes
router.get("/pending", protect, adminOnly, getPendingUsers);
router.put("/approve/:userId", protect, adminOnly, approveUser);
router.put("/reset-password/:userId", protect, adminOnly, resetUserPassword);
router.get("/all", protect, adminOnly, getAllUsers);
router.put("/toggle-status/:userId", protect, adminOnly, toggleUserStatus);
router.get("/admin-stats", protect, adminOnly, getAdminStats);

module.exports = router;
