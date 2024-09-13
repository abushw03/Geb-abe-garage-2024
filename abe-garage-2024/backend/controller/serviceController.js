const {
  getServices,
  getServiceById,
  addService,
  updateService,
  deleteService,
} = require("../services/serviceServices");

// Get all services with pagination and search
const fetchServices = async (req, res) => {
  console.log("Received request to fetch all services");

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 7;
  const searchQuery = req.query.q || "";

  try {
    const { services, total } = await getServices(page, limit, searchQuery);
    console.log("Services retrieved from database:", services);
    res
      .status(200)
      .json({
        services,
        total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
      });
  } catch (error) {
    console.error("Error fetching services:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// Get a single service by ID
const fetchServiceById = async (req, res) => {
  const { service_id } = req.params;
  console.log("Received request to fetch service by ID:", service_id);

  try {
    const service = await getServiceById(service_id);
    res.status(200).json({ service });
  } catch (error) {
    console.error("Error fetching service:", error.message);
    res.status(500).json({ error: error.message });
  }
};


// Add validation in both createService and modifyService
const createService = async (req, res) => {
  const { service_name, service_description } = req.body;

  // Input validation
  if (!service_name || !service_description) {
    return res.status(400).json({ error: "All fields are required." });
  }

  if (service_name.length < 3 || service_description.length < 10) {
    return res
      .status(400)
      .json({
        error: "Service name must be at least 3 characters and description at least 10 characters.",
      });
  }

  try {
    const result = await addService(service_name, service_description);
    console.log("Service added:", result);
    res.status(201).json({
      message: "Service added successfully.",
      serviceId: result.insertId,
    });
  } catch (error) {
    console.error("Error adding service:", error.message);
    res.status(500).json({ error: error.message });
  }
};

const modifyService = async (req, res) => {
  const { service_id } = req.params;
  const { service_name, service_description } = req.body;

  // Input validation
  if (!service_name || !service_description) {
    return res.status(400).json({ error: "All fields are required." });
  }

  if (service_name.length < 3 || service_description.length < 10) {
    return res.status(400).json({
      error:
        "Service name must be at least 3 characters and description at least 10 characters.",
    });
  }

  try {
    const result = await updateService(
      service_id,
      service_name,
      service_description
    );
    res.status(200).json({ message: "Service updated successfully." });
  } catch (error) {
    console.error("Error updating service:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// Delete a service by ID
const removeService = async (req, res) => {
  const { service_id } = req.params;
  try {
    await deleteService(service_id);
    res.status(200).json({ message: "Service deleted successfully." });
  } catch (error) {
    console.error("Error deleting service:", error.message);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  fetchServices,
  fetchServiceById,
  createService,
  modifyService,
  removeService,
};
