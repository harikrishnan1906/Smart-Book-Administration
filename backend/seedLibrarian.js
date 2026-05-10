const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config({ path: __dirname + "/.env" });
const User = require("./models/User");

const seedLibrarian = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected for seeding");

    const existing = await User.findOne({ email: "itdeptcbe@gmail.com" });
    if (existing) {
      console.log("Librarian already exists, skipping seed.");
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("password123", salt);

    const librarian = new User({
      role: "librarian",
      fullName: "Soranamageswari",
      email: "itdeptcbe@gmail.com",
      password: "password123", // Will be hashed by pre-save hook, so we pass raw here
      departmentId: "Information Technology",
      mobile: "9842941360",
      staffId: "LIB001",
      designation: "Associate Professor",
      profilePic: "/src/assets/soranaProfile.jpeg",
      idProof: "/images/librarian-avatar.png",
      status: "active",
      isActive: true,
      isDeleted: false
    });

    await librarian.save();
    console.log("Librarian seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding librarian:", error);
    process.exit(1);
  }
};

seedLibrarian();
