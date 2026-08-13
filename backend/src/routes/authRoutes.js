const express = require("express");
const { loginUser,createEmployeeAccount } = require("../controllers/authController");

const router = express.Router();
const protect = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

router.post("/login", loginUser);

router.post("/create-employee", protect, allowRoles("ADMIN"), createEmployeeAccount
);

module.exports = router;