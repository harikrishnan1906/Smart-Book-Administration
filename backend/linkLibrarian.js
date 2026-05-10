const mongoose = require("mongoose");
const User = require("./models/User");
const Department = require("./models/Department");

const URI = "mongodb+srv://hari20045058_db_user:93VqAY1FZ1WzuGXC@cluster0.mqnk6lg.mongodb.net/?appName=Cluster0";

async function linkLibrarian() {
  try {
    await mongoose.connect(URI);
    console.log("Connected to MongoDB.");

    const librarian = await User.findOne({ role: "librarian", departmentId: /Information Technology/i });
    if (!librarian) {
      console.log("No librarian found for Information Technology.");
      process.exit();
    }

    let dept = await Department.findOne({ name: /Information Technology/i });
    if (!dept) {
      console.log("Information Technology department not found. Creating it...");
      dept = new Department({ name: "Information Technology" });
    }

    dept.librarianId = librarian._id;
    await dept.save();

    console.log(`Successfully linked Librarian ${librarian.fullName} to Department ${dept.name}`);
    process.exit();
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

linkLibrarian();
