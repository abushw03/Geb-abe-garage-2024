const express = require("express");
const router = express.Router();
const {
  createNewOrder,
  listOrders,
  getOrderDetail,
  editOrder,
  removeOrder,
  fetchCustomerOrders,
  getOrdersByMechanicHandler,
} = require("../controller/orderController");

// Route to create a new order
router.post("/api/orders", createNewOrder);

// Route to get all orders
router.get("/api/orders", listOrders);

// Route to get the details of a specific order by order ID
router.get("/api/orders/:order_hash", getOrderDetail);

// Route to edit an existing order by order ID
router.put("/api/orders/:order_hash", editOrder);

// Route to delete an order by order ID
router.delete("/api/orders/:orderId", removeOrder);
router.get("/api/orders/customer/:customer_id", fetchCustomerOrders);
router.get("/api/orders/mechanic/:employee_id", getOrdersByMechanicHandler);


module.exports = router;
