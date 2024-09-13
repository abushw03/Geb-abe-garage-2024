import React, { useState } from "react";
import styles from "./AddCustomer.module.css";
import { useNavigate } from "react-router-dom";
import customerService from "../../../../Services/customer.service";

function AddCustomer() {
  const [responseMessage, setResponseMessage] = useState(null);
  const [responseMessageType, setResponseMessageType] = useState("");
  const navigate = useNavigate();

  // State for form fields
  const [customerForm, setCustomerForm] = useState({
    customer_first_name: "",
    customer_last_name: "",
    customer_phone_number: "",
    customer_email: "",
    customer_active_status: 1,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomerForm((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const result = await customerService.createCustomer(customerForm);
        if (result) {
          setResponseMessage(result.message);
          setResponseMessageType("success");
          setCustomerForm({
            customer_first_name: "",
            customer_last_name: "",
            customer_phone_number: "",
            customer_email: "",
            customer_active_status: 1,
          });
          setTimeout(() => {
            navigate("/admin/customers");
          }, 1000);
        } else {
          setResponseMessage(result.error || "An unexpected error occurred.");
          setResponseMessageType("error");
        }
    } catch (error) {
      setResponseMessage("An error occurred. Please try again.");
      setResponseMessageType("error"); 
    }
  };


  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h2 className={styles.formTitle}>Add a new customer</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div
            className={`${styles.responseMessage} ${
              responseMessageType === "success"
                ? styles.successMessage
                : styles.errorMessage
            }`}
          >
            {responseMessage && <h4>{responseMessage}</h4>}{" "}
            {/* Display the backend response message */}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="customer_first_name" className={styles.label}>
              First Name
            </label>
            <input
              type="text"
              id="customer_first_name"
              name="customer_first_name"
              value={customerForm.customer_first_name}
              onChange={handleChange}
              className={styles.input}
              placeholder="Enter Customer First Name"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="customer_last_name" className={styles.label}>
              Last Name
            </label>
            <input
              type="text"
              id="customer_last_name"
              name="customer_last_name"
              value={customerForm.customer_last_name}
              onChange={handleChange}
              className={styles.input}
              placeholder="Enter Customer Last Name"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="customer_phone_number" className={styles.label}>
              Phone Number
            </label>
            <input
              type="text"
              id="customer_phone_number"
              name="customer_phone_number"
              value={customerForm.customer_phone_number}
              onChange={handleChange}
              className={styles.input}
              placeholder="Enter Customer Phone Number"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="customer_email" className={styles.label}>
              Email
            </label>
            <input
              type="email"
              id="customer_email"
              name="customer_email"
              value={customerForm.customer_email}
              onChange={handleChange}
              className={styles.input}
              placeholder="Enter Customer Email"
            />
          </div>

          <button type="submit" className={styles.submitButton}>
            Add Customer
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddCustomer;
