import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./EditVehicleForm.module.css";
import {
  updateVehicle,
  getVehicleById,
} from "../../../../Services/vehicle.service";

const EditVehicleForm = () => {
  const { vehicle_id } = useParams(); // Get the vehicle_id from the URL
  const navigate = useNavigate(); // For navigating after the edit is done
  const [responseMessage, setResponseMessage] = useState(null);
  const [vehicleData, setVehicleData] = useState({
    vehicle_year: "",
    vehicle_make: "",
    vehicle_model: "",
    vehicle_type: "",
    vehicle_mileage: "",
    vehicle_tag: "",
    vehicle_serial: "",
    vehicle_color: "",
  });

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const response = await getVehicleById(vehicle_id);
        setVehicleData(response.vehicle);
      } catch (error) {
        console.error("Error fetching vehicle data:", error);
        setResponseMessage("Error fetching vehicle data. Please try again.");
      }
    };
    fetchVehicle();
  }, [vehicle_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVehicleData({
      ...vehicleData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await updateVehicle(vehicle_id, vehicleData);
      setResponseMessage(response.message);
      setTimeout(() => {
        navigate(`/admin/customers/vehicles/${vehicle_id}`);
      }, 1000);
      console.log(response);
    } catch (error) {
      setResponseMessage(
        error.response?.data?.error ||
          "An error occurred while updating the vehicle."
      );
    }
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.firstheader}>
        <h2 className={styles.formTitle}>
          Edit Vehicle: {vehicleData.vehicle_make} {vehicleData.vehicle_model}
        </h2>
        <div className={styles.DarkorangeLine}></div>
      </div>
      {responseMessage && (
        <div className={styles.responseMessage}>
          <h4>{responseMessage}</h4>
        </div>
      )}
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.twoColumnGrid}>
          {/* Left Column */}
          <div className={styles.column}>
            <div className={styles.formGroup}>
              <label htmlFor="vehicle_year" className={styles.label}>
                Year
              </label>
              <input
                type="text"
                id="vehicle_year"
                name="vehicle_year"
                value={vehicleData.vehicle_year}
                onChange={handleChange}
                className={styles.input}
                placeholder="Enter Vehicle Year"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="vehicle_make" className={styles.label}>
                Make
              </label>
              <input
                type="text"
                id="vehicle_make"
                name="vehicle_make"
                value={vehicleData.vehicle_make}
                onChange={handleChange}
                className={styles.input}
                placeholder="Enter Vehicle Make"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="vehicle_model" className={styles.label}>
                Model
              </label>
              <input
                type="text"
                id="vehicle_model"
                name="vehicle_model"
                value={vehicleData.vehicle_model}
                onChange={handleChange}
                className={styles.input}
                placeholder="Enter Vehicle Model"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="vehicle_type" className={styles.label}>
                Type
              </label>
              <input
                type="text"
                id="vehicle_type"
                name="vehicle_type"
                value={vehicleData.vehicle_type}
                onChange={handleChange}
                className={styles.input}
                placeholder="Enter Vehicle Type"
              />
            </div>
          </div>

          {/* Right Column */}
          <div className={styles.column}>
            <div className={styles.formGroup}>
              <label htmlFor="vehicle_mileage" className={styles.label}>
                Mileage
              </label>
              <input
                type="text"
                id="vehicle_mileage"
                name="vehicle_mileage"
                value={vehicleData.vehicle_mileage}
                onChange={handleChange}
                className={styles.input}
                placeholder="Enter Vehicle Mileage"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="vehicle_tag" className={styles.label}>
                Tag
              </label>
              <input
                type="text"
                id="vehicle_tag"
                name="vehicle_tag"
                value={vehicleData.vehicle_tag}
                onChange={handleChange}
                className={styles.input}
                placeholder="Enter Vehicle Tag"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="vehicle_serial" className={styles.label}>
                Serial Number
              </label>
              <input
                type="text"
                id="vehicle_serial"
                name="vehicle_serial"
                value={vehicleData.vehicle_serial}
                onChange={handleChange}
                className={styles.input}
                placeholder="Enter Vehicle Serial Number"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="vehicle_color" className={styles.label}>
                Color
              </label>
              <input
                type="text"
                id="vehicle_color"
                name="vehicle_color"
                value={vehicleData.vehicle_color}
                onChange={handleChange}
                className={styles.input}
                placeholder="Enter Vehicle Color"
              />
            </div>
          </div>
        </div>

        <button type="submit" className={styles.submitButton}>
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditVehicleForm;
