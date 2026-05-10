const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["librarian", "staff", "student"],
      required: true,
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      default: null, // IMPORTANT
    },

    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },

    staffId: String,
    registerNumber: String,
    designation: String,
    course: String,
    membershipType: String,

    mobile: {
      type: String,
      required: true,
    },

    profilePic: String,
    idProof: String,

    status: {
      type: String,
      enum: ["pending", "approved", "active", "inactive"],
      default: "pending",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// ✅ ONE AND ONLY PASSWORD HOOK (FINAL)
userSchema.pre("save", async function () {
  // Registration stage: no password yet
  if (!this.password) return;

  // Password exists but unchanged
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});


module.exports = mongoose.model("User", userSchema);
