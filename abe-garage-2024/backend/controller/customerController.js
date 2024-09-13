const customerService = require("../services/customerServices");

async function createCustomer(req, res) {
  console.log("Received a request to create a customer");
  console.log("Request body:", req.body);

  const {
    customer_email,
    customer_phone_number,
    customer_first_name,
    customer_last_name,
    customer_active_status = 1, // Default active status set to 1
  } = req.body;

  // Validate required fields
  if (
    !customer_email ||
    !customer_phone_number ||
    !customer_first_name ||
    !customer_last_name
  ) {
    console.error("Missing required fields");
    return res.status(400).json({ error: "All fields are required." });
  }

  // Validate email format
  const emailRegex = /\S+@\S+\.\S+/;
  if (!emailRegex.test(customer_email)) {
    return res
      .status(400)
      .json({ error: "Please enter a valid email address." });
  }

  // Validate phone number format (example: must be digits and between 10-15 digits)
  // const phoneRegex = /^\d{10,15}$/;
  // if (!phoneRegex.test(customer_phone_number)) {
  //   return res
  //     .status(400)
  //     .json({ error: "Please enter a valid phone number." });
  // }

  try {
    const customerExists = await customerService.getCustomerByEmail(
      customer_email
    );
    if (customerExists) {
      return res
        .status(400)
        .json({ error: "Customer with this email already exists!" });
    }

    const newCustomer = await customerService.createCustomer({
      customer_email,
      customer_phone_number,
      customer_first_name,
      customer_last_name,
      customer_active_status,
    });

    console.log("Customer created successfully:", newCustomer);
    res.status(201).json({
      message: "Customer created successfully",
      customer: newCustomer,
    });
  } catch (error) {
    console.error("Error creating customer:", error.message);
    res
      .status(500)
      .json({ error: error.message || "Failed to create customer" });
  }
}


// Get customer by ID
async function getCustomerById(req, res) {
  const customer_id = req.params.customer_id;

  try {
    const customer = await customerService.getCustomerById(customer_id);

    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    res.status(200).json({ customer });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch customer" });
  }
}

// Get all customers
async function getAllCustomers(req, res) {
  const { offset = 0, limit = 10 } = req.query;

  try {
    const customers = await customerService.getAllCustomers(offset, limit);
    res.status(200).json({ customers });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch customers" });
  }
}
// Controller to get all orders for a specific customer
const listCustomerOrders = async (req, res) => {
  const { customer_id } = req.params; // Get customer_id from URL parameters

  try {
    console.log("Fetching orders for customer ID:", customer_id); // Log the customer_id
    const orders = await getCustomerOrders(customer_id);

    if (orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this customer." });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching customer orders:", error.message);
    res.status(500).json({ error: "Failed to fetch customer orders." });
  }
};
async function updateCustomerById(req, res) {
  const { customer_id } = req.params;
  const {
    customer_email,
    customer_phone_number,
    customer_first_name,
    customer_last_name,
    customer_active_status,
  } = req.body;

  // Backend validation
  if (
    !customer_email ||
    !customer_phone_number ||
    !customer_first_name ||
    !customer_last_name
  ) {
    return res.status(400).json({
      error: "All fields are required!",
    });
  }

  const emailRegex = /\S+@\S+\.\S+/;
  if (!emailRegex.test(customer_email)) {
    return res.status(400).json({
      error: "Please enter a valid email address.",
    });
  }

  try {
    const result = await customerService.updateCustomerById(customer_id, {
      customer_email,
      customer_phone_number,
      customer_first_name,
      customer_last_name,
      customer_active_status,
    });

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Customer not found" });
    }

    res.status(200).json({
      status: "success",
      message: `${customer_first_name} information updated successfully`,
    });
  } catch (error) {
    console.error("Error updating customer:", error);
    res.status(500).json({ error: "Failed to update customer" });
  }
}

// Delete customer by ID
async function deleteCustomerById(req, res) {
  const customer_id = req.params.customer_id;

  try {
    const deleted = await customerService.deleteCustomerById(customer_id);

    if (!deleted) {
      return res.status(404).json({ error: "Customer not found" });
    }

    res.status(200).json({ message: "Customer deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete customer" });
  }
}

module.exports = {
  createCustomer,
  getCustomerById,
  getAllCustomers,
  updateCustomerById,
  deleteCustomerById,
  listCustomerOrders,
};
