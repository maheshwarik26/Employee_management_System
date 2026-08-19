const express = require('express');
const cors = require('cors');
const authRoutes = require("./routes/authRoutes");

const app = express();

//allow frontend to call backend
app.use(cors());




//express read json sent in req bodies
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({
    message: "Employee Management API is running"
  });
});

app.use("/api/auth", authRoutes);
module.exports = app;