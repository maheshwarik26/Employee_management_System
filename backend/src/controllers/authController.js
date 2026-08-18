const jwt = require("jsonwebtoken");
const User = require("../models/User");

const createToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      role: user.role
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d"
    }
  );
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check required input.
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    // Find the account using its email.
    const user = await User.findOne({
      email: email.toLowerCase()
    });

    // Keep this message general for security.
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    // Prevent deactivated accounts from logging in.
    if (!user.isActive) {
      return res.status(403).json({
        message: "This account has been deactivated"
      });
    }

    // Compare entered password with the encrypted password in MongoDB.
    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const token = createToken(user);

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Login error:", error.message);

    return res.status(500).json({
      message: "Unable to log in"
    });
  }
};

const createEmployeeAccount = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email, and password are required"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters"
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({
      email: normalizedEmail
    });

    if (existingUser) {
      return res.status(409).json({
        message: "An account with this email already exists"
      });
    }

    const employee = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      role: "EMPLOYEE"
    });

    return res.status(201).json({
      message: "Employee account created successfully",
      user: {
        id: employee._id,
        name: employee.name,
        email: employee.email,
        role: employee.role,
        isActive: employee.isActive
      }
    });
  } catch (error) {
    console.error("Create employee account error:", error.message);

    return res.status(500).json({
      message: "Unable to create employee account"
    });
  }
};

module.exports = {
  loginUser,
  createEmployeeAccount
};