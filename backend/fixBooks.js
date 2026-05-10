const mongoose = require("mongoose");
const Book = require("./models/Book");
const Department = require("./models/Department");
require("dotenv").config();

async function fix() {
  try {
    // Forcing family 4 to resolve MongoDB ENOTFOUND issues quickly on Windows
    await mongoose.connect(process.env.MONGO_URI, { family: 4 });
    console.log("Connected to MongoDB.");

    // 1. Find the target Department ObjectId
    const deptName = "Information Technology";
    const dept = await Department.findOne({ name: deptName });

    if (!dept) {
      console.log(`Error: Department '${deptName}' not found in the database!`);
      process.exit(1);
    }

    console.log(`Found Department: ${dept.name} with ID: ${dept._id}`);

    // 2. Update all Books to use this exact ObjectId
    // We update anything that currently has the string name OR needs to be defaulted
    const result = await Book.updateMany(
      {},
      { $set: { departmentId: dept._id } }
    );

    console.log(`Migration Complete: Updated ${result.modifiedCount} book(s) to use the correct ObjectId reference.`);
  } catch (error) {
    console.error("Migration Failed:", error);
  } finally {
    process.exit(0);
  }
}

fix();
