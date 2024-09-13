import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./EditService.module.css";
import { useParams, useNavigate } from "react-router-dom";
import { getServiceById, updateService } from "../../../../Services/service.service";

const EditService = () => {
  const { service_id } = useParams();
  const navigate = useNavigate();

  const [serviceData, setServiceData] = useState({
    service_name: "",
    service_description: "",
  });

  const [responseMessage, setResponseMessage] = useState({
    message: "",
    success: null, // true for success, false for error
  });

  useEffect(() => {
    const fetchService = async () => {
      console.log("Fetching service data for ID:", service_id);
      try {
        const response = await getServiceById(service_id
        );
        console.log("Service data received:", response);
        setServiceData(response);
      } catch (error) {
        console.error(
          "Error fetching service:",
          error.response ? error.response : error.message
        );
        setResponseMessage({
          message: error.response ? error.response : error.message,
          success: false,
        });
      }
    };

    fetchService();
  }, [service_id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setServiceData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(
      "Submitting updated service data for ID:",
      service_id,
      serviceData
    );
    try {
      await updateService(service_id,
        serviceData
      );
      setResponseMessage({
        message: "Service updated successfully!",
        success: true,
      });
      setTimeout(() => {
        navigate("/admin/services");
      }, 1000);
    } catch (error) {
      console.error(
        "Error updating service:",
        error.response ? error.response.data : error.message
      );
      setResponseMessage({
        message: error.response ? error.response.data : error.message,
        success: false,
      });
    }
  };

  return (
    <div className={styles.container}>
      <h2>
        Edit Service <span className={styles.titleUnderline}></span>
      </h2>

      {/* Conditional Rendering of Response Message */}
      {responseMessage.message && (
        <div
          className={
            responseMessage.success
              ? styles.successMessage
              : styles.errorMessage
          }
        >
          {responseMessage.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.serviceForm}>
        <div className={styles.formGroup}>
          <label htmlFor="service_name">Service Name</label>
          <input
            type="text"
            id="service_name"
            name="service_name"
            value={serviceData.service_name}
            onChange={handleInputChange}
            required
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="service_description">Service Description</label>
          <textarea
            id="service_description"
            name="service_description"
            value={serviceData.service_description}
            onChange={handleInputChange}
            required
            className={styles.textarea}
          ></textarea>
        </div>
        <button type="submit" className={styles.submitButton}>
          Update Service
        </button>
      </form>
    </div>
  );
};

export default EditService;
