const mongoose = require("mongoose");

const issuedBookSchema = new mongoose.Schema(
  {
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    librarianId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    departmentId: {
      type: String,
      required: true,
    },

    issueDate: {
      type: Date,
      default: Date.now,
    },

    dueDate: {
      type: Date, // student only
      default: null,
    },

    returnDate: {
      type: Date,
      default: null,
    },

    conditionOnIssue: {
      type: String,
      enum: ["good"],
      default: "good",
    },

    fineAmount: {
      type: Number,
      default: 0,
    },

    fineCollected: {
      type: Boolean,
      default: false,
    },

    isReturned: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("IssuedBook", issuedBookSchema);
