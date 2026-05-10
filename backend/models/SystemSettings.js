const mongoose = require("mongoose");

const systemSettingsSchema = new mongoose.Schema(
  {
    maxBooksPerStudent: {
      type: Number,
      default: 3,
    },

    maxBooksPerStaff: {
      type: Number,
      default: 5,
    },

    finePerDay: {
      type: Number,
      default: 5,
    },

    returnPeriodStudent: {
      type: Number, // days
      default: 14,
    },

    emailEnabled: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("SystemSettings", systemSettingsSchema);
