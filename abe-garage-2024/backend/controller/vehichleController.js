const vehicleService = require("../services/vechileServices");

const addVehicle = async (req, res) => {
  try {
    const { customer_id } = req.params;
    const vehicle = req.body;

    console.log("Customer ID received:", customer_id); // Log the received customer_id
    console.log("Vehicle Data received:", vehicle); // Log the received vehicle data

    if (!customer_id) {
      return res.status(400).json({ error: "Customer ID is required" });
    }

    const addedVehicle = await vehicleService.addVehicle(customer_id, vehicle);

    console.log("Vehicle added successfully:", addedVehicle); // Log the added vehicle
    res.status(201).json({ status: true, data: addedVehicle });
  } catch (error) {
    console.error("Error adding vehicle:", error.message);
    res.status(500).json({ error: error.message || "Failed to add vehicle" });
  }
};

const getVehicles = async (req, res) => {
  // console.log(req.params);
  const { customer_id } = req.params;

  // console.log("Received customer_id for fetching vehicles:", customer_id);

  if (isNaN(customer_id)) {
    return res.status(400).json({ error: "Invalid customer ID" });
  }

  try {
    const vehicles = await vehicleService.getVehiclesByCustomerId(customer_id);
    if (vehicles.length === 0) {
      console.log("No vehicles found for customer_id:", customer_id);
      return res
        .status(404)
        .json({ message: "No vehicles found for this customer" });
    }

    // console.log("Vehicles fetched successfully:", vehicles);
    res.json({ status: true, vehicles });
  } catch (error) {
    console.error("Server error:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

const getVehicleById = async (req, res) => {
  const { vehicle_id } = req.params;

  if (!vehicle_id) {
    return res.status(400).json({ error: "Vehicle ID is required" });
  }

  try {
    const vehicleData = await vehicleService.getVehicleById(vehicle_id);
    console.log("Received vehicle_id for fetching vehicle:", vehicle_id);

    if (!vehicleData) {
      return res.status(404).json({ error: "Vehicle not found" });
    }

    res.status(200).json({ status: true, vehicle: vehicleData });
  } catch (error) {
    console.error("Error fetching vehicle data:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

const updateVehicle = async (req, res) => {
  const { vehicle_id } = req.params;
  const vehicleData = req.body;

  if (!vehicle_id) {
    return res.status(400).json({ error: "Vehicle ID is required" });
  }

  try {
    const updatedVehicle = await vehicleService.updateVehicle(
      vehicle_id,
      vehicleData
    );

    res.status(200).json({
      status: true,
      message: "Vehicle updated successfully",
      vehicle: updatedVehicle,
    });
  } catch (error) {
    console.error("Error updating vehicle:", error.message);
    res.status(500).json({ error: "Failed to update vehicle" });
  }
};

module.exports = {
  addVehicle,
  getVehicles,
  getVehicleById,
  updateVehicle,
};
