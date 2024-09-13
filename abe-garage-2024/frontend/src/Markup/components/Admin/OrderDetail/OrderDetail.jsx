import React, { useEffect, useState } from "react";
import styles from "./OrderDetail.module.css";
import { getOrdersByHash } from "../../../../Services/order.service";

const OrderDetail = ({ order_hash }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await getOrdersByHash(order_hash);
        setOrder(response);
        setLoading(false);
        console.log("Services array:", response.services);
      } catch (err) {
        setError("Error fetching order details");
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [order_hash]);

  if (loading) {
    return <p>Loading order details...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!order) {
    return <p>No order found.</p>;
  }

  const {
    customer_first_name,
    customer_last_name,
    customer_email,
    customer_phone_number,
    active_customer,
    vehicle_model,
    vehicle_tag,
    vehicle_year,
    vehicle_mileage,
    services,
    order_status,
    estimated_completion_date,
    order_total_price,
    assigned_mechanic, // Consolidated assigned mechanic field
  } = order;

  // Format the order date to a readable format
  const formattedOrderDate = new Date(
    estimated_completion_date
  ).toLocaleDateString();

  // Function to get the appropriate status class for service status
  const getStatusClass = (status) => {
    switch (status) {
      case "Vehicle Dropped Off":
        return styles.statusInProgress;
      case "Parts Ordered":
        return styles.statusYellow;
      case "Waiting for Customer":
      case "Ready for Pickup":
      case "Quality Check":
        return styles.statusGreen;
      case "Picked Up":
        return styles.statusGreen;
      case "Order Cancelled":
        return styles.statusRed;
      default:
        return styles.statusInProgress;
    }
  };

  return (
    <div className={styles.orderDetailsContainer}>
      <div className={styles.orderHeader}>
        <h1 className={styles.customerName}>
          {customer_first_name} {customer_last_name}
          <span className={styles.titleUnderline}></span>
        </h1>
        <p className={styles.status}>
          <span
            className={`${styles.statusBadge} ${getStatusClass(order_status)}`}
          >
            {order_status}
          </span>
        </p>
      </div>
      <p className={styles.orderDescription}>
        You can track the progress of your order using this page. As soon as we
        are done with the order, the status will turn green. That means your car
        is ready for pickup.
      </p>

      <div className={styles.orderDetails}>
        <div className={styles.customerDetails}>
          <h3>Customer Full Name</h3>
          <p>
            <strong>
              {customer_first_name} {customer_last_name}
            </strong>
          </p>
          <p>Email: {customer_email}</p>
          <p>Phone Number: {customer_phone_number}</p>
          <p>Active Customer: {active_customer ? "Yes" : "No"}</p>
        </div>
        <div className={styles.vehicleDetails}>
          <h3>Car Detail In Service</h3>
          <p>
            <strong>{vehicle_model}</strong>
          </p>
          <p>Vehicle tag: {vehicle_tag}</p>
          <p>Vehicle year: {vehicle_year}</p>
          <p>Vehicle mileage: {vehicle_mileage}</p>
        </div>
      </div>

      <div className={styles.servicesSection}>
        <h3>Requested Service</h3>
        <div className={styles.servicesList}>
          {services && services.length > 0 ? (
            services.map((service, index) => (
              <div key={index} className={styles.serviceItem}>
                <div className={styles.serviceInfo}>
                  <h4>{service.service_name}</h4>
                  <p>{service.service_description}</p>
                </div>
                <span
                  className={`${styles.statusBadge} ${getStatusClass(
                    service.service_completed
                  )}`}
                >
                  {service.service_completed}
                </span>
              </div>
            ))
          ) : (
            <p>No services requested.</p>
          )}
        </div>
      </div>

      <div className={styles.orderDetailsSummary}>
        {/* Order Summary Section */}
        <div className={styles.orderSummary}>
          <h3>Order Summary</h3>
          <p>
            <strong>Order Date:</strong> {formattedOrderDate}
          </p>
          <p>
            <strong>Total Price:</strong> ${order_total_price.toFixed(2)}
          </p>
        </div>

        {/* Mechanic Details Section */}
        <div className={styles.mechanicDetails}>
          <h3>Assigned Mechanic</h3>
          <p>
            <strong>Mechanic Name:</strong> {assigned_mechanic || "Unassigned"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
