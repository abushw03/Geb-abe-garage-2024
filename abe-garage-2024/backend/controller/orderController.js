const {
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
} = require("../services/orderServices");

const createNewOrder = async (req, res) => {
  console.log("Incoming order creation request:", req.body);

  const {
    employee_id,
    customer_id,
    vehicle_id,
    additional_request,
    notes_for_internal_use,
    notes_for_customer,
    service_ids,
    order_total_price,
    estimated_completion_date,
    received_by,
    order_status,
    assigned_mechanic,
  } = req.body;

  try {
    const order_hash = require("crypto").randomBytes(16).toString("hex");
    const order_id = await createOrder({
      employee_id,
      customer_id,
      vehicle_id,
      order_hash,
    });

    await createOrderInfo({
      order_id,
      order_total_price,
      additional_request,
      notes_for_internal_use,
      notes_for_customer,
      estimated_completion_date,
      received_by,
      assigned_mechanic,
    });

    await createOrderStatus(order_id, order_status);

    await createOrderServices(order_id, service_ids);

    console.log("Order created successfully with ID:", order_id);
    res.status(201).json({ message: "Order created successfully", order_id });
  } catch (error) {
    console.error("Error creating order:", error.message);
    res.status(500).json({ error: "Failed to create order" });
  }
};

const listOrders = async (req, res) => {
  try {
    const orders = await getOrders();
    console.log("Listing all orders");
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error.message);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

const getOrdersByMechanicHandler = async (req, res) => {
  const { employee_id } = req.params;

  try {
    console.log("Fetching orders for mechanic:", employee_id);
    const orders = await getOrdersByMechanic(employee_id);

    if (orders.length === 0) {
      return res
        .status(404)
        .json({ error: "No orders found for this mechanic" });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders for mechanic:", error.message);
    res.status(500).json({ error: "Failed to fetch mechanic's orders" });
  }
};

const editOrder = async (req, res) => {
  const { order_hash } = req.params;
  const {
    order_total_price,
    additional_request,
    notes_for_internal_use,
    notes_for_customer,
    estimated_completion_date,
    completion_date,
    order_status,
    service_ids,
    assigned_mechanic,
  } = req.body;

  if (!order_total_price || isNaN(order_total_price)) {
    return res
      .status(400)
      .json({ error: "Order total price must be a valid number." });
  }
  if (!estimated_completion_date) {
    return res
      .status(400)
      .json({ error: "Estimated completion date is required." });
  }
  if (!order_status) {
    return res.status(400).json({ error: "Order status is required." });
  }

  try {
    console.log("Editing order with hash:", order_hash);
    await updateOrder(order_hash, {
      order_total_price,
      additional_request,
      notes_for_internal_use,
      notes_for_customer,
      estimated_completion_date,
      completion_date,
      order_status,
      assigned_mechanic,
      services: service_ids,
    });
    res.status(200).json({ message: "Order updated successfully" });
  } catch (error) {
    console.error("Error updating order:", error.message);
    res.status(500).json({ error: "Failed to update order" });
  }
};

const getOrderDetail = async (req, res) => {
  const { order_hash } = req.params;
  console.log("Received order_hash:", order_hash);

  if (!order_hash) {
    return res.status(400).json({ error: "No order_hash provided" });
  }
  try {
    const orderDetail = await getOrderDetails(order_hash);
    console.log("Order details fetched for hash:", order_hash);
    res.status(200).json(orderDetail);
  } catch (error) {
    console.error("Error fetching order details:", error.message);
    res.status(500).json({ error: "Failed to fetch order details" });
  }
};

const removeOrder = async (req, res) => {
  const { orderId } = req.params;

  try {
    console.log("Deleting order with ID:", orderId);
    await deleteOrder(orderId);
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error.message);
    res.status(500).json({ error: "Failed to delete order" });
  }
};

const fetchCustomerOrders = async (req, res) => {
  const { customer_id } = req.params;

  try {
    const customerOrders = await getCustomerOrders(customer_id);
    console.log("Fetched customer orders for ID:", customer_id);
    if (customerOrders.length === 0) {
      return res
        .status(404)
        .json({ message: "No orders found for this customer" });
    }
    res.status(200).json(customerOrders);
  } catch (error) {
    console.error("Error fetching customer orders:", error.message);
    res.status(500).json({ error: "Failed to fetch customer orders" });
  }
};

module.exports = {
  createNewOrder,
  listOrders,
  getOrdersByMechanicHandler,
  editOrder,
  getOrderDetail,
  removeOrder,
  fetchCustomerOrders,
};
