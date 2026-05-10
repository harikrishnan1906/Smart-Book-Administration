const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    accessionNumber: {
      type: String,
      required: true,
      unique: true, // unique per physical book
      trim: true,
    },

    serialNumber: {
      type: String,
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    author: {
      type: String,
      required: true,
      trim: true,
    },

    publication: {
      type: String,
      trim: true,
    },

    edition: {
      type: String,
      trim: true,
    },

    purchaseYear: {
      type: Number,
    },

    price: {
      type: Number,
      required: true,
    },

    entryDate: {
      type: Date,
      default: Date.now,
    },

    shelf: {
      type: String,
      trim: true,
    },

    rack: {
      type: String,
      trim: true,
    },

    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },

    status: {
      type: String,
      enum: ["available", "requested", "issued", "damaged"],
      default: "available",
    },

    damagedReason: {
      type: String,
      default: null,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Book", bookSchema);
