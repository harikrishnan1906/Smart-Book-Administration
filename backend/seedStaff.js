const mongoose = require("mongoose");
require("dotenv").config({ path: __dirname + "/.env" });
const User = require("./models/User");

const seedStaff = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected for seeding staff");

    const names = [
      "loganathan",
      "sasikala",
      "christopher",
      "radha",
      "devakumari",
      "radha priya",
      "soranamaheswari",
      "thenmozhi",
      "sundari",
      "sumathi",
    ];

    const staffData = names.map((name, index) => {
      const strippedName = name.replace(/\s+/g, "").toLowerCase();
      // Ensure unique 10-digit mobile number, e.g., 9800000001
      const mobileNumber = `98000000${(index + 1).toString().padStart(2, "0")}`;

      return {
        fullName: name,
        email: `${strippedName}@gmail.com`,
        password: `${strippedName}123`,
        role: "staff",
        departmentId: "Information Technology",
        mobile: mobileNumber,
        status: "active",
        isActive: true,
        staffId: `STAFF${(index + 1).toString().padStart(3, "0")}`,
        designation: "Associate Professor",
      };
    });

    const emailsToInsert = staffData.map(u => u.email);
    const existingUsers = await User.find({ email: { $in: emailsToInsert } });
    const existingEmails = existingUsers.map(u => u.email);
    
    const newStaffData = staffData.filter(u => !existingEmails.includes(u.email));

    if (newStaffData.length === 0) {
      console.log("All staff members already exist in the database. No new insertion required.");
      process.exit(0);
    } 

    console.log(`Inserting ${newStaffData.length} new staff members...`);
      
    // EXPLICIT REQUIREMENT: "Use User.insertMany()" and "Passwords hashed automatically"
    // Since Mongoose's User.insertMany() explicitly bypasses the pre('save') middleware,
    // passwords will NOT be hashed automatically if we use it. 
    // To ensure "schema handles it" via the existing pre('save') hook, we use User.create().
    // User.create() internally calls new User().save() for every item in the array, firing the hook.
    // If we strictly *must* use insertMany, we would do:
    // await User.insertMany(newStaffData);
    
    await User.create(newStaffData);
    
    console.log("10 staff users inserted successfully!");
    
    process.exit(0);
  } catch (error) {
    if (error.code === 11000) {
      console.error("Duplicate email error detected:", error.message);
    } else {
      console.error("Error seeding staff:", error);
    }
    process.exit(1);
  }
};

seedStaff();
