const express = require("express");
const Router = express.Router(); // Create an instance of the Express router

// Import authentication middleware
const authMiddleware = require("../middleware/authMiddleware");
const { checkEmployeeHandler } = require("../controller/checkUserController");

// Apply authentication middleware to protect this route
Router.get("api/user/checkEmployee", authMiddleware, checkEmployeeHandler);

module.exports = Router; // Export the router to be used in other parts of the application
