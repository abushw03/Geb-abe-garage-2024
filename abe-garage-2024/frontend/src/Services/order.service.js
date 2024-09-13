import api from "../utils/axios";

export const getOrders = async () => {

  try {
    const response = await api.get("/orders");

    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

export const getOrder = async (orderId) => {
  try {
    const response = await api.get(`/orders/${orderId}`);
    console.log("Fetching details for order ID:", orderId, response);
    return response.data; 
  } catch (error) {
    console.error("Error fetching order:", error);
    throw error;
  }
};

export const updateOrder = async (id, orderData) => {
  try {
    const response = await api.put(`/orders/${id}`, {
      ...orderData,
      order_status: orderData.order_status,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating order:", error);
    throw error;
  }
};

export const createOrder = async (orderData) => {
  try {
    const response = await api.post("/orders", orderData);
    return response.data;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

export const deleteOrder = async (id) => {
  try {
    const response = await api.delete(`/orders/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting order:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to delete order",
    };
  }
};

export const getOrderDetails = async (order_hash) => {
  try {
    const response = await api.get(`/orders/${order_hash}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || "Failed to fetch order details"
    );
  }
};

export const updateOrderbyHash = async (order_hash, orderData) => {
  try {
    const response = await api.put(`/orders/${order_hash}`, orderData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to update order");
  }
};
export const getOrdersByHash = async (order_hash) => {
  try {
    const response = await api.get(`/orders/${order_hash}`);
return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to update order");
  }
};

export const getOrdersByCustomerId = async (customer_id) => {
  try {
    const response = await api.get(`/orders/customer/${customer_id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching orders by customer ID:", error.message);
    throw error;
  }
};

export const getOrdersByMechanic = async (employee_id) => {
  try {
    const response = await api.get(`/orders/mechanic/${employee_id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching mechanic orders:", error);
    throw error;
  }
};
