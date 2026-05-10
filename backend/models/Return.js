const mongoose = require("mongoose");

const returnSchema = new mongoose.Schema(
  {
    issuedBookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "IssuedBook",
      required: true,
    },

    returnDate: {
      type: Date,
      default: Date.now,
    },

    condition: {
      type: String,
      enum: ["normal", "damaged", "lost"],
      required: true,
    },

    damageDescription: {
      type: String,
      default: null,
    },

    originalFine: {
      type: Number,
      default: 0,
    },

    finalFine: {
      type: Number,
      default: 0,
    },

    fineCollected: {
      type: Boolean,
      default: false,
    },

    collectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    paymentMode: {
      type: String,
      enum: ["cash"],
      default: "cash",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Return", returnSchema);
