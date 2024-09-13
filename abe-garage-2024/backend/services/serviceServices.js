const db = require("../config/database");

// Fetch all services with pagination and search
const getServices = async (page = 1, limit = 7, searchQuery = "") => {
  try {
    const offset = (page - 1) * limit;
    console.log(
      `Executing query to fetch services with page ${page}, limit ${limit}, and search query "${searchQuery}"`
    );

    const query = `
      SELECT SQL_CALC_FOUND_ROWS * FROM common_services
      WHERE service_name LIKE ? OR service_description LIKE ?
      LIMIT ? OFFSET ?;
    `;
    const [services] = await db.query(query, [
      `%${searchQuery}%`,
      `%${searchQuery}%`,
      limit,
      offset,
    ]);

    const [[{ total }]] = await db.query("SELECT FOUND_ROWS() as total;");
    console.log("Services fetched from the database:", services);

    return { services, total };
  } catch (error) {
    console.error("Error in getServices:", error.message);
    throw new Error("Failed to retrieve services.");
  }
};

// Fetch a single service by ID
const getServiceById = async (service_id) => {
  try {
    const [service] = await db.query(
      "SELECT * FROM common_services WHERE service_id = ?",
      [service_id]
    );
    console.log("Service fetched from the database:", service);
    if (service.length === 0) {
      throw new Error("Service not found.");
    }
    return service[0];
  } catch (error) {
    throw new Error("Failed to retrieve the service.");
  }
};

// Add a new service
const addService = async (service_name, service_description) => {
  try {
    const [result] = await db.query(
      "INSERT INTO common_services (service_name, service_description) VALUES (?, ?)",
      [service_name, service_description]
    );
    return result;
  } catch (error) {
    throw new Error("Failed to add the service.");
  }
};

// Update a service by ID
const updateService = async (service_id, service_name, service_description) => {
  try {
    const [result] = await db.query(
      "UPDATE common_services SET service_name = ?, service_description = ? WHERE service_id = ?",
      [service_name, service_description, service_id]
    );
    if (result.affectedRows === 0) {
      throw new Error("Service not found.");
    }
    return result;
  } catch (error) {
    throw new Error("All Fields Are Required.");
  }
};

// Delete a service by ID
const deleteService = async (service_id) => {
  try {
    const [result] = await db.query(
      "DELETE FROM common_services WHERE service_id = ?",
      [service_id]
    );
    if (result.affectedRows === 0) {
      throw new Error("Service not found.");
    }
    return result;
  } catch (error) {
    throw new Error("Failed to delete the service.");
  }
};

module.exports = {
  getServices,
  getServiceById,
  addService,
  updateService,
  deleteService,
};
