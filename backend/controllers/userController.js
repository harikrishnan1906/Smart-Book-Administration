const User = require("../models/User");
const Department = require("../models/Department");
const ActivityLog = require("../models/ActivityLog");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "alphahari5058@gmail.com",
    pass: "ofpz zweu zkgu yfgx",
  },
});

// ---------------- USER REGISTRATION ----------------
exports.registerUser = async (req, res) => {
  try {
    const {
      role,
      fullName,
      email,
      departmentId,
      staffId,
      registerNumber,
      designation,
      course,
      membershipType,
      mobile,
      profilePic,
      idProof,
    } = req.body;

    // basic validation
    if (!role || !fullName || !email || !departmentId || !mobile) {
      return res.status(400).json({
        message: "Required fields missing",
      });
    }

    // check if user already exists
    const existingUser = await User.findOne({ email, isDeleted: false });
    if (existingUser) {
      return res.status(409).json({
        message: "User already registered",
      });
    }

    // Check if department already has a librarian
    if (role === "librarian") {
      const departmentHasLibrarian = await Department.findOne({ _id: departmentId, librarianId: { $ne: null } });
      if (departmentHasLibrarian) {
        return res.status(400).json({
          message: "A librarian is already registered for this department.",
        });
      }
    }

    // create user WITHOUT password
    const user = new User({
      role,
      fullName,
      email,
      departmentId,
      staffId,
      registerNumber,
      designation,
      course,
      membershipType,
      mobile,
      profilePic,
      idProof,
      status: "pending",
    });

    await user.save();

    res.status(201).json({
      message: "Registration successful. Await admin approval.",
    });
  } catch (error) {
    res.status(500).json({
      message: "Registration failed",
      error: error.message,
    });
  }
};

// ---------------- ADMIN: GET PENDING USERS ----------------
exports.getPendingUsers = async (req, res) => {
  try {
    const pendingUsers = await User.find({
      status: "pending",
      isDeleted: false,
    }).populate("departmentId").select("-password"); // never send password

    res.json(pendingUsers);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch pending users",
      error: error.message,
    });
  }
};

// ---------------- ADMIN: APPROVE USER ----------------
exports.approveUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // generate temporary password
    const tempPassword = Math.random().toString(36).slice(-8);

    const user = await User.findById(userId);

    if (!user || user.isDeleted) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.status !== "pending") {
      return res
        .status(400)
        .json({ message: "User already approved or inactive" });
    }

    // update user
    user.password = tempPassword; // will be hashed by pre-save hook
    user.status = "approved";

    await user.save();

    // if user is a librarian, update department
    if (user.role === "librarian") {
      await Department.findByIdAndUpdate(user.departmentId, { librarianId: user._id });
    }

    // Send email with password
    const mailOptions = {
      from: "alphahari5058@gmail.com",
      to: user.email,
      subject: "Your Account is Approved - LibraManager",
      html: `<p>Hello ${user.fullName},</p>
             <p>Your account has been approved by the Admin.</p>
             <p>Your temporary password is: <strong>${tempPassword}</strong></p>
             <p>Please log in and change your password as soon as possible.</p>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });

    await ActivityLog.create({
      type: "user",
      action: "Approved User",
      target: user.email,
    });

    res.json({
      message: "User approved successfully. Password sent via email.",
    });
  } catch (error) {
    res.status(500).json({
      message: "Approval failed",
      error: error.message,
    });
  }
};


// ---------------- ADMIN: RESET USER PASSWORD ----------------
exports.resetUserPassword = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user || user.isDeleted) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.status !== "approved") {
      return res
        .status(400)
        .json({ message: "User is not approved yet" });
    }

    // generate new temporary password
    const tempPassword = Math.random().toString(36).slice(-8);

    user.password = tempPassword; // will be hashed by pre-save hook
    await user.save();

    res.json({
      message: "Password reset successful",
      temporaryPassword: tempPassword,
    });
  } catch (error) {
    res.status(500).json({
      message: "Password reset failed",
      error: error.message,
    });
  }
};

// ---------------- ADMIN: GET ALL USERS ----------------
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({
      status: { $in: ["approved", "active", "inactive"] },
      isDeleted: false,
    }).populate("departmentId").select("-password");

    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};

// ---------------- ADMIN: TOGGLE USER STATUS ----------------
exports.toggleUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user || user.isDeleted) {
      return res.status(404).json({ message: "User not found" });
    }

    // Toggle between approved/active and inactive
    user.status = user.status === "inactive" ? "approved" : "inactive";
    await user.save();

    res.json({
      message: `User status changed to ${user.status}`,
      user: {
        _id: user._id,
        status: user.status
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to toggle status",
      error: error.message,
    });
  }
};

const Book = require("../models/Book");
const IssuedBook = require("../models/IssuedBook");

// ---------------- ADMIN: GET STATS ----------------
exports.getAdminStats = async (req, res) => {
  try {
    const users = await User.find({ isDeleted: false });
    const books = await Book.find({ isDeleted: false });
    const issued = await IssuedBook.find({ status: "active" });

    res.json({
      books: books.length,
      students: users.filter((u) => u.role === "student").length,
      staff: users.filter((u) => u.role === "staff").length,
      librarians: users.filter((u) => u.role === "librarian").length,
      issued: issued.length,
      damaged: books.filter((b) => b.status === "damaged").length,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch stats",
      error: error.message,
    });
  }
};

// ---------------- GET MY PROFILE ----------------
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch profile", error: error.message });
  }
};

// ---------------- UPDATE MY PROFILE ----------------
exports.updateMyProfile = async (req, res) => {
  try {
    const { fullName, mobile, designation, departmentId } = req.body;
    const user = await User.findById(req.user.userId);
    
    if (!user) return res.status(404).json({ message: "User not found" });

    if (fullName) user.fullName = fullName;
    if (mobile) user.mobile = mobile;
    if (designation) user.designation = designation;
    if (departmentId) user.departmentId = departmentId;

    await user.save();
    
    // Return without password
    const updatedUser = await User.findById(req.user.userId).select("-password");
    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Failed to update profile", error: error.message });
  }
};

// ---------------- CHANGE PASSWORD ----------------
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Both current and new passwords are required" });
    }

    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect current password" });
    }

    user.password = newPassword; // Pre-save hook will hash it
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to change password", error: error.message });
  }
};
