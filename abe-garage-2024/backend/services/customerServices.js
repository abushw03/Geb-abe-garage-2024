const conn = require("../config/database");
const crypto = require("crypto");

async function createCustomer({
  customer_email,
  customer_phone_number,
  customer_first_name,
  customer_last_name,
  customer_active_status
}) {
  try {
    console.log("Creating customer with data:", {
      customer_email,
      customer_phone_number,
      customer_first_name,
      customer_last_name,
      customer_active_status
    });

    // Generate a unique customer hash
    const customerHash = crypto.randomBytes(16).toString("hex");

    await conn.query("START TRANSACTION");

    // Insert into customer_identifier table with generated customer hash
    const [result] = await conn.query(
      `INSERT INTO customer_identifier (customer_email, customer_phone_number, customer_added_date, customer_hash) 
       VALUES (?, ?, NOW(), ?)`,
      [customer_email, customer_phone_number, customerHash]
    );

    const customer_id = result.insertId;

    // Insert into customer_info table
    await conn.query(
      `INSERT INTO customer_info (customer_id, customer_first_name, customer_last_name, customer_active_status) 
       VALUES (?, ?, ?,?)`,
      [customer_id, customer_first_name, customer_last_name,1]
    );

    await conn.query("COMMIT");

    console.log("Customer created in the database with ID:", customer_id);

    return {
      customer_id,
      customer_email,
      customer_phone_number,
      customer_first_name,
      customer_last_name,
      customer_hash: customerHash,
      customer_active_status
    };
  } catch (error) {
    await conn.query("ROLLBACK");
    console.error("Error in createCustomer service:", error);
    throw error;
  }
}

// Get customer by ID
async function getCustomerById(customer_id) {
  const query = `
    SELECT ci.customer_id, ci.customer_email, ci.customer_phone_number,
           info.customer_first_name, info.customer_last_name, info.customer_active_status,
           DATE_FORMAT(ci.customer_added_date, '%Y-%m-%d %H:%i:%s') as customer_added_date
    FROM customer_identifier ci
    INNER JOIN customer_info info ON ci.customer_id = info.customer_id
    WHERE ci.customer_id = ?
  `;

  try {
    const [rows] = await conn.query(query, [customer_id]);
    return rows[0] || null;
  } catch (error) {
    console.error("Error fetching customer by ID:", error);
    throw error;
  }
}

// Get all customers
async function getAllCustomers(offset = 0, limit = 10) {
  const query = `
    SELECT ci.customer_id, ci.customer_email, ci.customer_phone_number,
           info.customer_first_name, info.customer_last_name,
           DATE_FORMAT(ci.customer_added_date, '%Y-%m-%d %H:%i:%s') as customer_added_date, info.customer_active_status
    FROM customer_identifier ci
    INNER JOIN customer_info info ON ci.customer_id = info.customer_id  ORDER BY ci.customer_added_date DESC
    LIMIT ? OFFSET ? 
  `;

  try {
    const [rows] = await conn.query(query, [
      parseInt(limit, 10),
      parseInt(offset, 10),
    ]);
    return rows;
  } catch (error) {
    console.error("Error fetching all customers:", error);
    throw error;
  }
}
// Get all orders for a specific customer by customer_id
const getCustomerOrders = async (customer_id) => {
  console.log("Fetching orders for customer ID:", customer_id); 

  const query = `
    SELECT o.order_id, o.order_hash, o.order_date, os.order_status, 
           ci_info.customer_first_name, ci_info.customer_last_name, 
           ci.customer_email, ci.customer_phone_number, 
           cvi.vehicle_model, cvi.vehicle_tag, cvi.vehicle_year, oi.received_by
    FROM orders o
    JOIN order_info oi ON o.order_id = oi.order_id
    JOIN order_status os ON o.order_id = os.order_id
    JOIN customer_info ci_info ON o.customer_id = ci_info.customer_id
    JOIN customer_identifier ci ON o.customer_id = ci.customer_id
    JOIN customer_vehicle_info cvi ON o.vehicle_id = cvi.vehicle_id
    WHERE o.customer_id = ?
    ORDER BY o.order_date DESC
  `;

  const [orders] = await db.query(query, [customer_id]);
  console.log("Fetched orders for customer from customer:", orders);
  return orders;
};
async function deleteCustomerById(customer_id) {
  try {
    await conn.query("START TRANSACTION");

    // Delete from the dependent table first
    await conn.query(`DELETE FROM customer_info WHERE customer_id = ?`, [
      customer_id,
    ]);

    // Then delete from the parent table
    const [result] = await conn.query(
      `DELETE FROM customer_identifier WHERE customer_id = ?`,
      [customer_id]
    );

    await conn.query("COMMIT");

    return result.affectedRows > 0;
  } catch (error) {
    await conn.query("ROLLBACK");
    console.error("Error deleting customer:", error);
    throw error;
  }
}
async function updateCustomerById(customer_id, customerData) {
  const query = `
    UPDATE customer_identifier ci
    INNER JOIN customer_info info ON ci.customer_id = info.customer_id
    SET
      ci.customer_email = ?,
      ci.customer_phone_number = ?,
      info.customer_first_name = ?,
      info.customer_last_name = ?,
      info.customer_active_status = ?
    WHERE ci.customer_id = ?
  `;

  const {
    customer_email,
    customer_phone_number,
    customer_first_name,
    customer_last_name,
    customer_active_status,
  } = customerData;

  const [result] = await conn.query(query, [
    customer_email,
    customer_phone_number,
    customer_first_name,
    customer_last_name,
    customer_active_status,
    customer_id,
  ]);

  return result;
}

// Get customer by email
async function getCustomerByEmail(customer_email) {
  const query = `SELECT * FROM customer_identifier WHERE customer_email = ?`;

  try {
    const [rows] = await conn.query(query, [customer_email]);
    return rows[0] || null;
  } catch (error) {
    console.error("Error fetching customer by email:", error);
    throw error;
  }
}

module.exports = {
  createCustomer,
  getCustomerById,
  getAllCustomers,
  updateCustomerById,
  deleteCustomerById,
  getCustomerByEmail,
  getCustomerOrders
};
