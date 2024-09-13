import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import styles from "./EditCustomerForm.module.css";
import Loading from "../../Loading/Loading"; // Assuming you have a Loading component
import {
  getSingleCustomer,
  editCustomer,
} from "../../../../Services/customer.service";

const EditCustomerForm = () => {
  const { customer_id } = useParams(); // Get the customer_id from the URL
  const navigate = useNavigate(); // For navigating after the edit is done
  const [loading, setLoading] = useState(true);
  const [responseMessage, setResponseMessage] = useState(null);
  const [customerData, setCustomerData] = useState({
    customer_first_name: "",
    customer_last_name: "",
    customer_phone_number: "",
    customer_active_status: 1, // Default to active
  });

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await getSingleCustomer(customer_id);

        setCustomerData({
          ...response.customer,
          customer_active_status:
            response.customer.customer_active_status === 1 ? 1 : 0,
        });

        console.log("State after setting customer data:", customerData);
      } catch (error) {
        console.error("Error fetching customer data:", error);
        setResponseMessage("Error fetching customer data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [customer_id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCustomerData({
      ...customerData,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await editCustomer(customer_id, customerData);
      setResponseMessage(response.message);
      setTimeout(() => {
        navigate("/admin/customers"); // Navigate back to the customers list after a short delay
      }, 2000);
    } catch (error) {
      setResponseMessage(
        error.response?.data?.error ||
          "An error occurred while updating the customer."
      );
    }
  };

  // if (loading) {
  //   return <Loading />;
  // }

  return (
    <div className={styles.formContainer}>
      <div className={styles.firstheader}>
      <h2 className={styles.formTitle}>
        Edit: {customerData.customer_first_name}{" "}
        {customerData.customer_last_name}
      </h2>
      <div className={styles.DarkorangeLine}></div>
      </div>
      <p className={styles.customerEmail}>
        Customer email: {customerData.customer_email}
      </p>
      {responseMessage && (
        <div className={styles.responseMessage}>
          <h4>{responseMessage}</h4>
        </div>
      )}
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="customer_first_name" className={styles.label}>
            First Name
          </label>
          <input
            type="text"
            id="customer_first_name"
            name="customer_first_name"
            value={customerData.customer_first_name}
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
            value={customerData.customer_last_name}
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
            value={customerData.customer_phone_number}
            onChange={handleChange}
            className={styles.input}
            placeholder="Enter Customer Phone Number"
          />
        </div>
        <div className={styles.lastformGroup}>
          <input
            type="checkbox"
            id="customer_active_status"
            name="customer_active_status"
            checked={customerData.customer_active_status === 1}
            onChange={(e) =>
              handleChange({
                target: {
                  name: "customer_active_status",
                  value: e.target.checked ? 1 : 0,
                  type: "checkbox",
                  checked: e.target.checked,
                },
              })
            }
            className={styles.inputCheckbox}
          />
          <label htmlFor="customer_active_status" className={styles.label}>
            Is active customer
          </label>
        </div>

        <button type="submit" className={styles.submitButton}>
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditCustomerForm;
