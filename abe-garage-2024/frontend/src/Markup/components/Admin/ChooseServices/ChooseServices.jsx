import React, { useState, useEffect } from "react";
import styles from "./ChooseServices.module.css";
import { useUser } from "../../../../context/UserContext";
import { useNavigate } from "react-router";
import { fetchTotalServices } from "../../../../Services/service.service";
import { createOrder } from "../../../../Services/order.service";
import { fetchEmployees } from "../../../../Services/employee.service";

const ChooseServices = ({ customerId, vehicleId }) => {
  const { user } = useUser();
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [orderTotalPrice, setOrderTotalPrice] = useState("");
  const [additionalRequest, setAdditionalRequest] = useState("");
  const [notesForInternalUse, setNotesForInternalUse] = useState("");
  const [notesForCustomer, setNotesForCustomer] = useState("");
  const [estimatedCompletionDate, setEstimatedCompletionDate] = useState("");
  const [orderStatus, setOrderStatus] = useState("Vehicle Dropped Off");
  const [employees, setEmployees] = useState([]);
  const [assignedMechanic, setAssignedMechanic] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const servicesPerPage = 7;

  // Fetch services and employees on mount
  useEffect(() => {
    const loadServices = async () => {
      try {
        const data = await fetchTotalServices(currentPage, servicesPerPage);
        setServices(data);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    const fetchAllEmployees = async () => {
      try {
        const response = await fetchEmployees();
        setEmployees(response);
        console.log("Employees fetched:", response);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    loadServices();
    fetchAllEmployees();
  }, [currentPage]);

  const handleCheckboxChange = (service_id) => {
    setSelectedServices((prevSelected) =>
      prevSelected.includes(service_id)
        ? prevSelected.filter((id) => id !== service_id)
        : [...prevSelected, service_id]
    );
    setError("");
  };
const
 handleOrderSubmit = async () => {
  if (!assignedMechanic) {
    setError("Please select an assigned mechanic.");
    return;
  }

  const selectedMechanic = employees.find(
    (emp) => emp.employee_id.toString() === assignedMechanic
  );

  if (!selectedMechanic) {
    setError("Assigned mechanic not found.");
    console.error("Assigned mechanic not found");
    return;
  }

  const orderData = {
    employee_id: user?.employee_id,
    customer_id: customerId,
    vehicle_id: vehicleId,
    service_ids: selectedServices,
    order_total_price: parseFloat(orderTotalPrice),
    additional_request: additionalRequest,
    notes_for_internal_use: notesForInternalUse,
    notes_for_customer: notesForCustomer,
    estimated_completion_date: estimatedCompletionDate,
    assigned_mechanic: `${selectedMechanic.employee_first_name} ${selectedMechanic.employee_last_name}`, // Mechanic full name
    received_by: `${user?.employee_first_name} ${user?.employee_last_name}`,
    order_status: orderStatus,
  };

  try {
    const response = await createOrder(orderData);
    alert(`Order created successfully with ID: ${response.order_id}`);
    setTimeout(() => {
      navigate(`/admin/customers/customer-profile/${customerId}`);
    }, 1000);
  } catch (error) {
    setError(error.message);
    console.error("Error creating order:", error);
  }
};


  return (
    <div className={styles.chooseServiceContainer}>
      <h2 className={styles.sectionTitle}>
        Choose Service <span className={styles.titleUnderline}></span>
      </h2>
      <p>
        Select the services you wish to include. You can search and select from
        the list below.
      </p>
      {services.map((service) => (
        <div key={service.service_id} className={styles.serviceItem}>
          <div className={styles.serviceInfo}>
            <h4 className={styles.serviceName}>{service.service_name}</h4>
            <p className={styles.serviceDescription}>
              {service.service_description}
            </p>
          </div>
          <input
            type="checkbox"
            className={styles.serviceCheckbox}
            checked={selectedServices.includes(service.service_id)}
            onChange={() => handleCheckboxChange(service.service_id)}
          />
        </div>
      ))}

      <div className={styles.pagination}>
        <button
          className={styles.paginationButton}
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className={styles.pageNumber}>{currentPage}</span>
        <button
          className={styles.paginationButton}
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={services.length < servicesPerPage}
        >
          Next
        </button>
      </div>

      {/* Form Fields */}
      <div className={styles.formGroup}>
        <label htmlFor="orderTotalPrice">Order Total Price:</label>
        <input
          type="number"
          id="orderTotalPrice"
          value={orderTotalPrice}
          onChange={(e) => setOrderTotalPrice(e.target.value)}
          className={styles.input}
          placeholder="Enter total price"
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="estimatedCompletionDate">
          Estimated Completion Date:
        </label>
        <input
          type="datetime-local"
          id="estimatedCompletionDate"
          value={estimatedCompletionDate}
          onChange={(e) => setEstimatedCompletionDate(e.target.value)}
          className={styles.input}
        />
      </div>

      {/* Mechanic Selection */}
      <div className={styles.formGroup}>
        <label htmlFor="assignedMechanic">Assigned Mechanic:</label>
        <select
          id="assignedMechanic"
          value={assignedMechanic}
          onChange={(e) => setAssignedMechanic(e.target.value)}
          className={styles.input}
        >
          <option value="">Select Mechanic</option>
          {employees.map((employee) => (
            <option key={employee.employee_id} value={employee.employee_id}>
              {employee.employee_first_name} {employee.employee_last_name}
            </option>
          ))}
        </select>
      </div>

      {/* Additional Requests */}
      <div className={styles.formGroup}>
        <label htmlFor="additionalRequest">Additional Request:</label>
        <textarea
          id="additionalRequest"
          value={additionalRequest}
          onChange={(e) => setAdditionalRequest(e.target.value)}
          className={styles.textarea}
          placeholder="Enter any additional requests"
        ></textarea>
      </div>

      {/* Notes for Internal Use */}
      <div className={styles.formGroup}>
        <label htmlFor="notesForInternalUse">Notes for Internal Use:</label>
        <textarea
          id="notesForInternalUse"
          value={notesForInternalUse}
          onChange={(e) => setNotesForInternalUse(e.target.value)}
          className={styles.textarea}
          placeholder="Enter notes for internal use"
        ></textarea>
      </div>

      {/* Notes for Customer */}
      <div className={styles.formGroup}>
        <label htmlFor="notesForCustomer">Notes for Customer:</label>
        <textarea
          id="notesForCustomer"
          value={notesForCustomer}
          onChange={(e) => setNotesForCustomer(e.target.value)}
          className={styles.textarea}
          placeholder="Enter notes for the customer"
        ></textarea>
      </div>

      {/* Error Handling */}
      {error && <div className={styles.error}>{error}</div>}

      {/* Submit Button */}
      <div>
        <button className={styles.submitButton} onClick={handleOrderSubmit}>
          Submit Order
        </button>
      </div>
    </div>
  );
};

export default ChooseServices;
