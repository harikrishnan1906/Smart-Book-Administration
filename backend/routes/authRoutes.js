const express = require("express");
const router = express.Router();
const { adminLogin, userLogin, logout } = require("../controllers/authController");

router.post("/admin/login", adminLogin);
router.post("/login", userLogin);
router.post("/logout", logout);

module.exports = router;
