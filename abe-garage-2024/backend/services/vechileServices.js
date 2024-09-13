const conn = require("../config/database");

const addVehicle = async (customer_id, vehicle) => {
  let addedVehicle = {};
  try {
    console.log("Adding vehicle:", vehicle);

    // Check if all required fields are provided
    if (
      !vehicle.vehicle_year ||
      !vehicle.vehicle_make ||
      !vehicle.vehicle_model ||
      !vehicle.vehicle_type ||
      !vehicle.vehicle_serial
    ) {
      throw new Error("All required fields must be provided.");
    }

    // Check if a vehicle with the same serial number already exists
    const [existingVehicle] = await conn.query(
      "SELECT * FROM customer_vehicle_info WHERE vehicle_serial = ?",
      [vehicle.vehicle_serial]
    );
    console.log("Existing vehicle check:", existingVehicle);

    if (existingVehicle.length > 0) {
      throw new Error("A vehicle with this serial number already exists.");
    }

    // Insert the new vehicle into the database
    const query = `
      INSERT INTO customer_vehicle_info 
      (customer_id, vehicle_year, vehicle_make, vehicle_model, vehicle_type, vehicle_mileage, vehicle_tag, vehicle_serial, vehicle_color)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const [result] = await conn.query(query, [
      customer_id,
      vehicle.vehicle_year,
      vehicle.vehicle_make,
      vehicle.vehicle_model,
      vehicle.vehicle_type,
      vehicle.vehicle_mileage,
      vehicle.vehicle_tag,
      vehicle.vehicle_serial,
      vehicle.vehicle_color,
    ]);

    if (result.affectedRows === 1) {
      addedVehicle = {
        vehicle_id: result.insertId,
        customer_id: customer_id,
        ...vehicle,
      };
      console.log("Vehicle added successfully:", addedVehicle);
    } else {
      throw new Error("Failed to insert vehicle into customer_vehicle_info");
    }
  } catch (err) {
    console.error("Failed to add vehicle:", err.message);
    throw err;
  }
  return addedVehicle;
};

const getVehiclesByCustomerId = async (customer_id) => {
  try {
    const [rows] = await conn.query(
      "SELECT * FROM customer_vehicle_info WHERE customer_id = ?",
      [customer_id]
    );
    return rows;
  } catch (error) {
    console.error("Error fetching vehicles:", error.message);
    throw new Error("Error fetching vehicles");
  }
};
// A function to get vehicle and its associated customer info by vehicle_id
async function getVehicleById(vehicle_id) {
  const query = `
    SELECT 
      cvi.vehicle_id, 
      cvi.vehicle_year, 
      cvi.vehicle_make,
      cvi.vehicle_model,
      cvi.vehicle_type,
      cvi.vehicle_mileage,
      cvi.vehicle_tag,
      cvi.vehicle_serial,
      cvi.vehicle_color,
      ci.customer_id,
      ci.customer_first_name,
      ci.customer_last_name,
      ci.customer_active_status,
      cident.customer_email,
      cident.customer_phone_number
    FROM 
      customer_vehicle_info cvi
    INNER JOIN 
      customer_identifier cident ON cvi.customer_id = cident.customer_id
    INNER JOIN 
      customer_info ci ON cident.customer_id = ci.customer_id
    WHERE 
      cvi.vehicle_id = ?;
  `;

  try {
    const [rows] = await conn.query(query, [vehicle_id]);
  
    return rows[0];
  } catch (error) {
    console.error("Error executing query:", error.message);
    throw error;
  }
}
async function updateVehicle(vehicle_id, vehicleData) {
  const {
    vehicle_year,
    vehicle_make,
    vehicle_model,
    vehicle_type,
    vehicle_mileage,
    vehicle_tag,
    vehicle_serial,
    vehicle_color,
  } = vehicleData;

  try {
    const query = `
      UPDATE customer_vehicle_info
      SET
        vehicle_year = ?,
        vehicle_make = ?,
        vehicle_model = ?,
        vehicle_type = ?,
        vehicle_mileage = ?,
        vehicle_tag = ?,
        vehicle_serial = ?,
        vehicle_color = ?
      WHERE vehicle_id = ?`;

    const [result] = await conn.query(query, [
      vehicle_year,
      vehicle_make,
      vehicle_model,
      vehicle_type,
      vehicle_mileage,
      vehicle_tag,
      vehicle_serial,
      vehicle_color,
      vehicle_id,
    ]);

    if (result.affectedRows === 0) {
      throw new Error("Vehicle not found or no changes made");
    }

    return {
      vehicle_id,
      ...vehicleData,
    };
  } catch (error) {
    console.error("Error updating vehicle:", error.message);
    throw new Error("Failed to update vehicle");
  }
}

module.exports = {
  addVehicle,
  getVehiclesByCustomerId,
  getVehicleById,
  updateVehicle,
};
