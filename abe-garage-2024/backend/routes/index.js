// Import the express module
const express = require("express");
// Call the router method from express to create the router
const router = express.Router();

// Import the employee routes
const employeeRouter = require("./employeeRoutes");
// Import the login routes
const loginRoutes = require("./loginRoutes");
// Import the check user routes
const checkUserRoutes = require("./checkUserRoutes");
// Import the customer routes
const customerRoutes = require("./customerRoutes");
//import vehicle routes
const vehicleRouter = require("./vechileRoutes");
// Import the service routes
const serviceRoutes = require("./serviceRoutes");
// Import the order routes
const orderRoutes = require("./orderRoutes");
// Add the check user routes to the main router
router.use(checkUserRoutes);
// Add the employee routes to the main router
router.use(employeeRouter);
// Add the login routes to the main router
router.use(loginRoutes);
// Add the customer routes to the main router
router.use(customerRoutes);
// Add the vehicle routes to the main router
router.use(vehicleRouter);
// Add the service routes to the main router
router.use(serviceRoutes);
// Add the order routes to the main router
router.use(require("./orderRoutes"));
// Export the router
module.exports = router;
