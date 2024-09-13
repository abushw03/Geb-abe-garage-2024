const express = require("express");
const router = express.Router();
const {
  addVehicle,
  getVehicles,
  getVehicleById,
  updateVehicle,
} = require("../controller/vehichleController"); // Ensure the controller file is correctly named and imported

// Route to add a vehicle to a customer
router.post("/api/customers/:customer_id/vehicles", addVehicle);

// Route for getting vehicles by customer ID
router.get("/api/customers/:customer_id/vehicles", getVehicles);

// Route for getting a vehicle by vehicle ID
router.get("/api/vehicles/:vehicle_id", getVehicleById);

// Route for updating a vehicle by vehicle ID
router.put("/api/vehicles/:vehicle_id", updateVehicle);

module.exports = router;
