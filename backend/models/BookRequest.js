const mongoose = require("mongoose");

const bookRequestSchema = new mongoose.Schema(
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

    departmentId: {
      type: String,
      required: true,
    },

    requestedAt: {
      type: Date,
      default: Date.now,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "cancelled"],
      default: "pending",
    },

    // priority: {
    //   type: String,
    //   enum: ["staff", "student"],
    //   required: true,
    // },

    rejectionReason: {
      type: String,
      default: null,
    },

    cancelledByUser: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("BookRequest", bookRequestSchema);
