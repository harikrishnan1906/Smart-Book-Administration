const SystemSettings = require("../models/SystemSettings");
const ActivityLog = require("../models/ActivityLog");
const User = require("../models/User");
const Book = require("../models/Book");

// ---------------- GET ADMIN PROFILE ----------------
exports.getAdminProfile = async (req, res) => {
  try {
    // Admin uses .env for auth, so we return a dummy profile constructed from .env
    const adminProfile = {
      id: "ADMIN-001",
      name: "Super Admin",
      email: process.env.ADMIN_EMAIL,
      role: "admin",
      lastLogin: new Date().toISOString(), // Since we do not track admin session DB, just return current or placeholder
    };
    res.json(adminProfile);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch admin profile", error: error.message });
  }
};

// ---------------- GET SYSTEM SETTINGS ----------------
exports.getSystemSettings = async (req, res) => {
  try {
    let settings = await SystemSettings.findOne();
    if (!settings) {
      // Create default settings if not exists
      settings = await SystemSettings.create({});
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch system settings", error: error.message });
  }
};

// ---------------- UPDATE SYSTEM SETTINGS ----------------
exports.updateSystemSettings = async (req, res) => {
  try {
    let settings = await SystemSettings.findOne();
    if (!settings) {
      settings = new SystemSettings(req.body);
    } else {
      Object.assign(settings, req.body);
    }
    await settings.save();
    
    // Log the activity
    await ActivityLog.create({
      type: "system",
      action: "Updated System Settings",
      target: "System Configuration",
    });

    res.json({ message: "System settings updated successfully", settings });
  } catch (error) {
    res.status(500).json({ message: "Failed to update system settings", error: error.message });
  }
};

// ---------------- GET ACTIVITY LOGS ----------------
exports.getActivityLogs = async (req, res) => {
  try {
    const logs = await ActivityLog.find().sort({ timestamp: -1 }).limit(100);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch activity logs", error: error.message });
  }
};
