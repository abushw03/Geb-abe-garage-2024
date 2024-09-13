import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaEye, FaEdit, FaTrashAlt } from "react-icons/fa";
import axios from "axios"; // Import axios for API requests
import styles from "./SingleCustomerOrders.module.css";
import { getOrdersByCustomerId } from "../../../../Services/order.service";

const SingleCustomerOrders = ({ customer_id }) => {
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(5);

  // Fetch orders when the component mounts
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        console.log(`Fetching orders for customer ID: ${customer_id}`); // Debug log

        const response = await getOrdersByCustomerId(customer_id
        ); // Fetch orders by customer ID

        console.log("API response data:", response); // Log API response

        if (response) {
          setOrders(response.orders);
          console.log("Orders set:", response.orders); // Log the orders
        }
      } catch (error) {
        console.error("Error fetching orders:", error.message);
      }
    };

    if (customer_id) {
      fetchOrders();
    }
  }, [customer_id]);

  // Filter orders based on search query
  const filteredOrders = orders?.filter(
    (order) =>
      order?.customer_first_name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      order?.customer_last_name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      order?.vehicle_model?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  console.log("Filtered orders:", filteredOrders); // Log the filtered orders

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders?.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );

  console.log("Current orders to display:", currentOrders); // Log the current orders to display

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getStatusClass = (status) => {
    switch (status) {
      case "Received":
        return styles.statusInProgress;
      case "In Progress":
        return styles.statusYellow;
      case "Completed":
        return styles.statusGreen;
      default:
        return styles.statusInProgress;
    }
  };

  const handleDelete = async (order_id) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        console.log(`Deleting order with ID: ${order_id}`); // Log the order ID being deleted
        await axios.delete(`/api/orders/${order_id}`);
        setOrders((prevOrders) =>
          prevOrders.filter((order) => order.order_id !== order_id)
        );
        console.log("Order deleted successfully"); // Log success
      } catch (error) {
        console.error("Error deleting order:", error.message);
      }
    }
  };

  return (
    <div className={styles.ordersContainer}>
      <div className={styles.header}>
        <h2 className={styles.sectionTitle}>
          List Of Orders <span className={styles.titleUnderline}></span>
        </h2>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search by Customer Name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {currentOrders?.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <table className={styles.ordersTable}>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Vehicle</th>
              <th>Order Date</th>
              <th>Order Status</th>
              <th>Received By</th>
              <th>View/Edit/Delete</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.map((order) => (
              <tr key={order.order_id}>
                <td>{order.order_id}</td>
                <td>
                  {order.customer_first_name} {order.customer_last_name}
                  <br />
                  {order.customer_email}
                  <br />
                  {order.customer_phone_number}
                </td>
                <td>
                  {order.vehicle_model} ({order.vehicle_year})
                  <br />
                  Tag: {order.vehicle_tag}
                </td>
                <td>{new Date(order.order_date).toLocaleDateString()}</td>
                <td>
                  <span className={getStatusClass(order.order_status)}>
                    {order.order_status}
                  </span>
                </td>
                <td>{order.received_by || "Not yet received"}</td>
                <td className={styles.viewEdit}>
                  <Link to={`/admin/orders/view/${order.order_hash}`}>
                    <FaEye />
                  </Link>
                  <Link to={`/admin/orders/edit/${order.order_hash}`}>
                    <FaEdit />
                  </Link>
                  <FaTrashAlt
                    className={styles.deleteIcon}
                    onClick={() => handleDelete(order.order_id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className={styles.pagination}>
        <button
          className={styles.paginationButton}
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className={styles.pageNumber}>{currentPage}</span>
        <button
          className={styles.paginationButton}
          onClick={() => paginate(currentPage + 1)}
          disabled={indexOfLastOrder >= filteredOrders.length}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default SingleCustomerOrders;
