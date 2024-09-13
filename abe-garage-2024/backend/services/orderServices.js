const db = require("../config/database");

// Create an order
const createOrder = async (orderData) => {
  console.log("Creating order with data:", orderData); // Log orderData
  const { employee_id, customer_id, vehicle_id, order_hash } = orderData;

  const query = `INSERT INTO orders (employee_id, customer_id, vehicle_id, active_order, order_hash)
                 VALUES (?, ?, ?, 1, ?)`;

  const [result] = await db.query(query, [
    employee_id,
    customer_id,
    vehicle_id,
    order_hash,
  ]);

  console.log("Order created with ID:", result.insertId); // Log the created order ID
  return result.insertId;
};

// Create order info
const createOrderInfo = async (orderInfoData) => {
  const {
    order_id,
    order_total_price,
    additional_request,
    notes_for_internal_use,
    notes_for_customer,
    estimated_completion_date,
    received_by,
    assigned_mechanic,
  } = orderInfoData;

  const query = `INSERT INTO order_info 
                 (order_id, order_total_price, additional_request, notes_for_internal_use, notes_for_customer, estimated_completion_date, received_by, assigned_mechanic)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  console.log("Inserting order info with mechanic:", assigned_mechanic); // Log the assigned mechanic

  await db.query(query, [
    order_id,
    order_total_price,
    additional_request,
    notes_for_internal_use,
    notes_for_customer,
    estimated_completion_date,
    received_by,
    assigned_mechanic,
  ]);
};

// Create order status
const createOrderStatus = async (order_id, order_status) => {
  console.log(
    "Creating order status for order ID:",
    order_id,
    "Status:",
    order_status
  );
  const query = `INSERT INTO order_status (order_id, order_status) VALUES (?, ?)`;
  await db.query(query, [order_id, order_status]);
  console.log("Order status created for order ID:", order_id);
};

// Link services to the order
const createOrderServices = async (order_id, service_ids) => {
  console.log(
    "Linking services to order ID:",
    order_id,
    "Services:",
    service_ids
  );
  for (const service_id of service_ids) {
    const query = `INSERT INTO order_services (order_id, service_id, service_completed) VALUES (?, ?, 'Received')`;
    await db.query(query, [order_id, service_id]);
  }
  console.log("Services linked to order ID:", order_id);
};

// Fetch all orders including assigned mechanic details
const getOrders = async () => {
  const query = `
    SELECT 
      o.order_id, 
      o.order_hash, 
      o.active_order, 
      oi.order_total_price, 
      oi.estimated_completion_date, 
      oi.received_by, 
      oi.assigned_mechanic,  -- Ensure assigned mechanic is selected
      os.order_status, 
      ci_info.customer_first_name, 
      ci_info.customer_last_name, 
      ci.customer_email, 
      ci.customer_phone_number, 
      cvi.vehicle_model, 
      cvi.vehicle_tag, 
      cvi.vehicle_year, 
      o.order_date
    FROM orders o
    JOIN order_info oi ON o.order_id = oi.order_id
    JOIN order_status os ON o.order_id = os.order_id
    JOIN customer_info ci_info ON o.customer_id = ci_info.customer_id
    JOIN customer_identifier ci ON o.customer_id = ci.customer_id
    JOIN customer_vehicle_info cvi ON o.vehicle_id = cvi.vehicle_id
    ORDER BY o.order_date DESC;
  `;

  const [orders] = await db.query(query);
  return orders;
};



const getOrdersByMechanic = async (employee_id) => {
  console.log("Fetching orders for mechanic ID:", employee_id); // Log the mechanic ID

  const query = `
    SELECT o.order_id, o.order_hash, o.active_order, oi.order_total_price, 
           oi.estimated_completion_date, oi.received_by, os.order_status, 
           ci_info.customer_first_name, ci_info.customer_last_name, 
           ci.customer_email, ci.customer_phone_number, 
           cvi.vehicle_model, cvi.vehicle_tag, cvi.vehicle_year, 
           o.order_date
    FROM orders o
    JOIN order_info oi ON o.order_id = oi.order_id
    JOIN order_status os ON o.order_id = os.order_id
    JOIN customer_info ci_info ON o.customer_id = ci_info.customer_id
    JOIN customer_identifier ci ON o.customer_id = ci.customer_id
    JOIN customer_vehicle_info cvi ON o.vehicle_id = cvi.vehicle_id
    WHERE oi.assigned_mechanic = (SELECT CONCAT(employee_first_name, ' ', employee_last_name) 
                                  FROM employee_info WHERE employee_id = ?) 
    ORDER BY o.order_date DESC
  `;

  const [orders] = await db.query(query, [employee_id]);
  console.log("Fetched orders for mechanic:", orders); // Log the fetched orders
  return orders;
};

const updateOrder = async (order_hash, orderData) => {
  const {
    order_total_price,
    additional_request,
    notes_for_internal_use,
    notes_for_customer,
    estimated_completion_date,
    completion_date,
    order_status,
    assigned_mechanic,
    services, // Ensure this is an array of services
  } = orderData;

  await db.query("START TRANSACTION");

  try {
    // Update the order_info table using the order_hash
    const updateOrderInfoQuery = `
      UPDATE order_info
      SET order_total_price = ?, additional_request = ?, notes_for_internal_use = ?,
          notes_for_customer = ?, estimated_completion_date = ?, completion_date = ?, assigned_mechanic = ?
      WHERE order_id = (SELECT order_id FROM orders WHERE order_hash = ?)
    `;

    console.log(
      "Updating order info with assigned mechanic:",
      assigned_mechanic
    );
    await db.query(updateOrderInfoQuery, [
      order_total_price,
      additional_request,
      notes_for_internal_use,
      notes_for_customer,
      estimated_completion_date,
      completion_date,
      assigned_mechanic,
      order_hash,
    ]);

    // Update order_status table
    const updateOrderStatusQuery = `
      UPDATE order_status
      SET order_status = ?
      WHERE order_id = (SELECT order_id FROM orders WHERE order_hash = ?)
    `;
    await db.query(updateOrderStatusQuery, [order_status, order_hash]);

    // Check if services is an array before iterating
    if (Array.isArray(services)) {
      for (const service of services) {
        const updateOrderServicesQuery = `
          UPDATE order_services
          SET service_completed = ?
          WHERE order_id = (SELECT order_id FROM orders WHERE order_hash = ?)
          AND service_id = ?
        `;
        await db.query(updateOrderServicesQuery, [
          service.service_completed,
          order_hash,
          service.service_id,
        ]);
      }
    } else {
      console.log("No services provided or services is not an array.");
    }

    await db.query("COMMIT");
    console.log("Order updated successfully for hash:", order_hash);
  } catch (error) {
    await db.query("ROLLBACK");
    console.error("Error during order update, rolling back:", error.message);
    throw error;
  }
};


const getOrderDetails = async (order_hash) => {
  const query = `
    SELECT 
      o.order_id, o.order_hash, o.active_order, 
      oi.order_total_price, oi.additional_request, 
      oi.notes_for_internal_use, oi.notes_for_customer, 
      oi.estimated_completion_date, oi.completion_date, 
      oi.assigned_mechanic, 
      emp_info.employee_first_name AS assigned_mechanic_first_name,  -- Mechanic's first name
      emp_info.employee_last_name AS assigned_mechanic_last_name,    -- Mechanic's last name
      os.order_status, 
      ci_info.customer_first_name, ci_info.customer_last_name,
      ci.customer_email, ci.customer_phone_number,
      cvi.vehicle_model, cvi.vehicle_tag, cvi.vehicle_year, 
      s.service_id, s.service_name, s.service_description,
      ord_serv.service_completed
    FROM orders o
    JOIN order_info oi ON o.order_id = oi.order_id
    JOIN order_status os ON o.order_id = os.order_id  
    JOIN customer_info ci_info ON o.customer_id = ci_info.customer_id
    JOIN customer_identifier ci ON o.customer_id = ci.customer_id
    JOIN customer_vehicle_info cvi ON o.vehicle_id = cvi.vehicle_id
    JOIN order_services ord_serv ON o.order_id = ord_serv.order_id  
    JOIN common_services s ON ord_serv.service_id = s.service_id
    LEFT JOIN employee_info emp_info ON oi.assigned_mechanic = emp_info.employee_id  -- Join mechanic info
    WHERE o.order_hash = ?
  `;

  const [orderDetails] = await db.query(query, [order_hash]);

  if (orderDetails.length === 0) {
    throw new Error("Order not found");
  }

  console.log("Order details fetched for hash:", order_hash, orderDetails);

  return {
    ...orderDetails[0],
    services: orderDetails.map((service) => ({
      service_id: service.service_id,
      service_name: service.service_name,
      service_description: service.service_description,
      service_completed: service.service_completed,
    })),
    assigned_mechanic_first_name: orderDetails[0].assigned_mechanic_first_name,
    assigned_mechanic_last_name: orderDetails[0].assigned_mechanic_last_name,
  };
};


// Delete an order
const deleteOrder = async (order_id) => {
  console.log("Deleting order with ID:", order_id);

  await db.query("START TRANSACTION");

  try {
    const deleteOrderServicesQuery = `DELETE FROM order_services WHERE order_id = ?`;
    await db.query(deleteOrderServicesQuery, [order_id]);

    const deleteOrderStatusQuery = `DELETE FROM order_status WHERE order_id = ?`;
    await db.query(deleteOrderStatusQuery, [order_id]);

    const deleteOrderInfoQuery = `DELETE FROM order_info WHERE order_id = ?`;
    await db.query(deleteOrderInfoQuery, [order_id]);

    const deleteOrderQuery = `DELETE FROM orders WHERE order_id = ?`;
    await db.query(deleteOrderQuery, [order_id]);

    await db.query("COMMIT");
    console.log("Order deleted successfully with ID:", order_id);
  } catch (error) {
    await db.query("ROLLBACK");
    console.error("Error deleting order with ID:", order_id, error.message);
    throw error;
  }
};

// Get customer orders
const getCustomerOrders = async (customer_id) => {
  console.log("Fetching orders for customer ID:", customer_id);
  const query = `
    SELECT o.order_id, o.order_hash, o.active_order, oi.order_total_price, 
           oi.estimated_completion_date, oi.received_by, os.order_status, 
           ci_info.customer_first_name, ci_info.customer_last_name, 
           ci.customer_email, ci.customer_phone_number, 
           cvi.vehicle_model, cvi.vehicle_tag, cvi.vehicle_year, 
           o.order_date
    FROM orders o
    JOIN order_info oi ON o.order_id = oi.order_id
    JOIN order_status os ON o.order_id = os.order_id
    JOIN customer_info ci_info ON o.customer_id = ci_info.customer_id
    JOIN customer_identifier ci ON o.customer_id = ci.customer_id
    JOIN customer_vehicle_info cvi ON o.vehicle_id = cvi.vehicle_id
    WHERE o.customer_id = ?
  `;

  const [orders] = await db.query(query, [customer_id]);
  console.log("Fetched orders for customer from Order service:", orders);
  return {orders};
};

module.exports = {
  createOrder,
  createOrderInfo,
  createOrderServices,
  createOrderStatus,
  getOrders,
  getOrdersByMechanic,
  updateOrder,
  getOrderDetails,
  deleteOrder,
  getCustomerOrders,
};
