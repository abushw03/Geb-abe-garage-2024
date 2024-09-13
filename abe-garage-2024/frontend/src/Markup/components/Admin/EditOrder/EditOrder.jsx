import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./EditOrder.module.css";
import {
  getOrderDetails,
  updateOrderbyHash,
} from "../../../../Services/order.service";
import { fetchEmployees } from "../../../../Services/employee.service";
import { useUser } from "../../../../context/UserContext"; // Import useUser

const EditOrder = () => {
  const { order_hash } = useParams(); // Get the order_hash from the URL
  const navigate = useNavigate(); // To navigate back after a successful edit
  const { user } = useUser(); // Get the logged-in user
  const [employees, setEmployees] = useState([]); // State to store employees
  const [orderData, setOrderData] = useState({
    customer_first_name: "",
    customer_last_name: "",
    customer_email: "",
    customer_phone_number: "",
    vehicle_model: "",
    vehicle_year: "",
    vehicle_tag: "",
    order_total_price: "",
    order_status: "Received",
    additional_request: "",
    estimated_completion_date: "",
    completion_date: "",
    notes_for_internal_use: "",
    notes_for_customer: "",
    assigned_mechanic: "", // Use assigned_mechanic directly
    services: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch order details, including the assigned mechanic
    const fetchOrder = async () => {
      try {
        const data = await getOrderDetails(order_hash);

        // Format the date for the datetime-local input
        const formattedEstimatedCompletionDate = data.estimated_completion_date
          ? new Date(data.estimated_completion_date)
              .toISOString()
              .substring(0, 16)
          : "";

        const formattedCompletionDate = data.completion_date
          ? new Date(data.completion_date).toISOString().substring(0, 16)
          : "";

        setOrderData({
          ...data,
          estimated_completion_date: formattedEstimatedCompletionDate,
          completion_date: formattedCompletionDate,
          services: data.services, // Include services in the state
          assigned_mechanic: data.assigned_mechanic || "", // Set the assigned mechanic from the fetched data
        });

        setLoading(false);
      } catch (error) {
        console.error("Error fetching order details:", error.message);
        setError("Failed to load order details.");
        setLoading(false);
      }
    };

    // Fetch employees with the role of 'Employee' (mechanics)
    const fetchAllEmployees = async () => {
      try {
        const response = await fetchEmployees();
        setEmployees(response); // Set the fetched employees (mechanics)
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchOrder();
    fetchAllEmployees(); // Properly invoke the fetchAllEmployees function
  }, [order_hash]);

  const handleChange = (e) => {
    setOrderData({ ...orderData, [e.target.name]: e.target.value });
    setError(""); // Clear error when the user starts typing
  };

  const handleServiceStatusChange = (e, index) => {
    const updatedServices = [...orderData.services];
    updatedServices[index].service_completed = e.target.value;
    setOrderData({ ...orderData, services: updatedServices });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const { service_id, service_name, service_completed, ...cleanOrderData } =
        orderData;
      const updatedOrderData = {
        ...cleanOrderData,
        services: orderData.services.map((service) => ({
          service_id: service.service_id,
          service_name: service.service_name,
          service_completed: service.service_completed,
        })),
      };

      await updateOrderbyHash(order_hash, updatedOrderData);
      alert("Order updated successfully!");
      navigate("/admin/orders");
    } catch (error) {
      console.error("Error updating order:", error.message);
      setError(error.message);
    }
  };

  return (
    <div className={styles.editOrderContainer}>
      <h2 className={styles.sectionTitle}>
        Edit Order <span className={styles.titleUnderline}></span>
      </h2>

      {loading ? (
        <p>Loading order details...</p>
      ) : (
        <form onSubmit={handleSubmit} className={styles.editOrderForm}>
          {/* Customer Information (Non-editable) */}
          <div className={styles.twoColumnContainer}>
            <div className={styles.formGroup}>
              <label>Customer First Name</label>
              <input
                type="text"
                name="customer_first_name"
                value={orderData.customer_first_name}
                readOnly
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Customer Last Name</label>
              <input
                type="text"
                name="customer_last_name"
                value={orderData.customer_last_name}
                readOnly
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.twoColumnContainer}>
            <div className={styles.formGroup}>
              <label>Email</label>
              <input
                type="email"
                name="customer_email"
                value={orderData.customer_email}
                readOnly
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Phone Number</label>
              <input
                type="text"
                name="customer_phone_number"
                value={orderData.customer_phone_number}
                readOnly
                className={styles.input}
              />
            </div>
          </div>

          {/* Vehicle Information (Non-editable) */}
          <div className={styles.twoColumnContainer}>
            <div className={styles.formGroup}>
              <label>Vehicle Model</label>
              <input
                type="text"
                name="vehicle_model"
                value={orderData.vehicle_model}
                readOnly
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Vehicle Year</label>
              <input
                type="text"
                name="vehicle_year"
                value={orderData.vehicle_year}
                readOnly
                className={styles.input}
              />
            </div>
          </div>

          {/* Order Status and Price */}
          <div className={styles.twoColumnContainer}>
            <div className={styles.formGroup}>
              <label>Total Price</label>
              <input
                type="number"
                name="order_total_price"
                value={orderData.order_total_price}
                onChange={handleChange}
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Order Status</label>
              <select
                name="order_status"
                value={orderData.order_status}
                onChange={handleChange}
                className={styles.selectInput}
              >
                <option value="Received">Received</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Assigned Mechanic */}
          <div className={styles.twoColumnContainer}>
            <div className={styles.formGroup}>
              <label>Assigned Mechanic</label>
              {/* Conditionally show a dropdown for Admins/Managers and read-only for Employees */}
              {user?.role === "Admin" || user?.role === "Manager" ? (
                <select
                  name="assigned_mechanic"
                  value={orderData.assigned_mechanic}
                  onChange={handleChange}
                  className={styles.selectInput}
                >
                  <option value="">Select Mechanic</option>
                  {employees.map((employee) => (
                    <option
                      key={employee.employee_id}
                      value={`${employee.employee_first_name} ${employee.employee_last_name}`}
                    >
                      {employee.employee_first_name}{" "}
                      {employee.employee_last_name}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  name="assigned_mechanic"
                  value={orderData.assigned_mechanic}
                  readOnly
                  className={styles.input}
                />
              )}
            </div>
          </div>

          {/* Dates */}
          <div className={styles.twoColumnContainer}>
            <div className={styles.formGroup}>
              <label>Estimated Completion Date</label>
              <input
                type="datetime-local"
                name="estimated_completion_date"
                value={orderData.estimated_completion_date}
                onChange={handleChange}
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Completion Date</label>
              <input
                type="datetime-local"
                name="completion_date"
                value={orderData.completion_date}
                onChange={handleChange}
                className={styles.input}
              />
            </div>
          </div>

          {/* Notes and Services */}
          <div className={styles.twoColumnContainer}>
            <div className={styles.formGroup}>
              <label htmlFor="notes_for_internal_use">
                Notes for Internal Use
              </label>
              <textarea
                id="notes_for_internal_use"
                value={orderData.notes_for_internal_use}
                onChange={handleChange}
                className={styles.textarea}
              ></textarea>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="notes_for_customer">Notes for Customer</label>
              <textarea
                id="notes_for_customer"
                value={orderData.notes_for_customer}
                onChange={handleChange}
                className={styles.textarea}
              ></textarea>
            </div>
          </div>

          {/* Service Status Dropdowns */}
          {orderData.services.map((service, index) => (
            <div key={service.service_id} className={styles.formGroup}>
              <label>{service.service_name} Status</label>
              <select
                name={`service_status_${service.service_id}`}
                value={service.service_completed}
                onChange={(e) => handleServiceStatusChange(e, index)}
                className={styles.selectInput}
              >
                <option value="Received">Received</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          ))}

          {error && <div className={styles.error}>{error}</div>}

          <button type="submit" className={styles.submitButton}>
            Save Changes
          </button>
        </form>
      )}
    </div>
  );
};

export default EditOrder;
