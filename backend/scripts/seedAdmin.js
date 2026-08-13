require("dotenv").config();

const mongoose = require("mongoose");
const connectDatabase = require("../src/config/database");
const User = require("../src/models/User");

const createAdmin = async () => {
  try {
    await connectDatabase();

    const existingAdmin = await User.findOne({
      email: "admin@company.com"
    });

    if (existingAdmin) {
      console.log("Admin account already exists.");
      return;
    }

    await User.create({
      name: "System Admin",
      email: "admin@company.com",
      password: "Admin@123",
      role: "ADMIN"
    });

    console.log("Admin account created successfully.");
    console.log("Email: admin@company.com");
    console.log("Password: Admin@123");
  } catch (error) {
    console.error("Failed to create Admin account:", error.message);
  } finally {
    await mongoose.connection.close();
  }
};

createAdmin();