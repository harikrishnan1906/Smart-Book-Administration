const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const getCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
  };
};

// ---------------- ADMIN LOGIN ----------------
exports.adminLogin = (req, res) => {
  const { email, password } = req.body;

  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", token, {
      ...getCookieOptions(),
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      role: "admin",
      token,
    });
  }

  res.status(401).json({ message: "Invalid admin credentials" });
};

// ---------------- USER LOGIN ----------------
exports.userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, isDeleted: false });

    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.status !== "approved" && user.status !== "active")
      return res.status(403).json({ message: "User not approved yet" });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
        departmentId: user.departmentId,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.cookie("token", token, {
      ...getCookieOptions(),
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      token,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

// ---------------- LOGOUT ----------------
exports.logout = (req, res) => {
  res.clearCookie("token", getCookieOptions());
  res.json({ success: true, message: "Logged out successfully" });
};
