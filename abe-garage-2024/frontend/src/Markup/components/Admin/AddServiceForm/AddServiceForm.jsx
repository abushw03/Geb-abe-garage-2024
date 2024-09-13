import React, { useState } from "react";
import axios from "axios";
import styles from "./AddServiceForm.module.css";
import { useNavigate } from "react-router";
import { addService } from "../../../../Services/service.service";

const AddServiceForm = () => {
  const [newService, setNewService] = useState({
    service_name: "",
    service_description: "",
  });
  const navigate = useNavigate();
  const [responseMessage, setResponseMessage] = useState(""); 
  const [isError, setIsError] = useState(false);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewService((prevService) => ({
      ...prevService,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
   const response = await addService(newService);
      if (response) {
        setNewService({ service_name: "", service_description: "" });
        setResponseMessage("Service added successfully!");
        setIsError(false);
        setTimeout(() => {
          navigate("/admin/services");
        }, 1000);
      } else {
        setResponseMessage("Failed to add service."); // Set failure message
        setIsError(true); // Indicate error
      }
    } catch (error) {
      setResponseMessage(
        error.response?.data?.error || "Error adding service. Please try again."
      ); // Display error message from backend
      setIsError(true); // Indicate error
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        Add New Service <span className={styles.titleUnderline}></span>
      </h2>

      {/* Display response message if it exists */}
      {responseMessage && (
        <div className={isError ? styles.errorMessage : styles.successMessage}>
          {responseMessage}
        </div>
      )}

      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit} className={styles.serviceForm}>
          <div className={styles.formGroup}>
            <label htmlFor="service_name" className={styles.label}>
              Service Name
            </label>
            <input
              type="text"
              id="service_name"
              name="service_name"
              value={newService.service_name}
              onChange={handleInputChange}
              className={styles.input}
              placeholder="Enter Service Name"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="service_description" className={styles.label}>
              Service Description
            </label>
            <textarea
              id="service_description"
              name="service_description"
              value={newService.service_description}
              onChange={handleInputChange}
              className={styles.textarea}
              placeholder="Enter Service Description"
              required
            ></textarea>
          </div>

          <button type="submit" className={styles.submitButton}>
            Add Service
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddServiceForm;
