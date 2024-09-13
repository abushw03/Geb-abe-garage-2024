import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHandPointer } from "react-icons/fa";
import axios from "axios";
import styles from "./VehicleSection.module.css";
import { createVehicle } from "../../../../Services/vehicle.service";

const VehicleSection = ({
  customer_first_name,
  customer_id,
  vehicles,
  setVehicles,
}) => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    vehicle_year: "",
    vehicle_make: "",
    vehicle_model: "",
    vehicle_type: "",
    vehicle_mileage: "",
    vehicle_tag: "",
    vehicle_serial: "",
    vehicle_color: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Submitting vehicle data:", formData);
      const response = await createVehicle(customer_id, formData);
      if (response) {
        setSuccess("Vehicle added successfully!");
        setError("");
        setFormData({
          vehicle_year: "",
          vehicle_make: "",
          vehicle_model: "",
          vehicle_type: "",
          vehicle_mileage: "",
          vehicle_tag: "",
          vehicle_serial: "",
          vehicle_color: "",
        });
        setVehicles([...vehicles, response.vehicle]); // Add the new vehicle to the list

        // Shrink the form and hide it
        setIsFormVisible(false);

        // Refresh the page or reload the component by fetching vehicles again
        setTimeout(() => {
          window.location.reload(); // Reload the page to reflect the new vehicle
        }, 1000); // Delay for 1 second before refresh
      } else {
        setError(response.error || "An unexpected error occurred.");
        setSuccess("");
      }
    } catch (err) {
      console.error("Error occurred in handleSubmit:", err);
      setError(err.response?.error || "Something went wrong!");
      setSuccess("");
    }
  };

  const handleVehicleSelect = (vehicleId) => {
    navigate(`/admin/customers/vehicles/${vehicleId}`);
  };

  const handleCloseForm = () => {
    setIsFormVisible(false); // Shrink and hide the form
  };

  const handleOpenForm = () => {
    setIsFormVisible(true); // Show the form
  };

  return (
    <div className={styles.vehiclesSection}>
      <h3 className={styles.sectionTitle}>Vehicles of {customer_first_name}</h3>
      <div className={styles.vehicleList}>
        {vehicles.length > 0 ? (
          <table className={styles.vehicleTable}>
            <thead>
              <tr>
                <th>Year</th>
                <th>Make</th>
                <th>Model</th>
                <th>Type</th>
                <th>Mileage</th>
                <th>Tag</th>
                <th>Serial</th>
                <th>Color</th>
                <th>Select</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((vehicle) => (
                <tr key={vehicle?.vehicle_id}>
                  <td>{vehicle?.vehicle_year}</td>
                  <td>{vehicle?.vehicle_make}</td>
                  <td>{vehicle?.vehicle_model}</td>
                  <td>{vehicle?.vehicle_type}</td>
                  <td>{vehicle?.vehicle_mileage}</td>
                  <td>{vehicle?.vehicle_tag}</td>
                  <td>{vehicle?.vehicle_serial}</td>
                  <td>{vehicle?.vehicle_color}</td>
                  <td>
                    <FaHandPointer
                      className={styles.selectIcon}
                      onClick={() => handleVehicleSelect(vehicle.vehicle_id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className={styles.noDataFound}>No vehicle found</p>
        )}
      </div>
      {!isFormVisible && (
        <button className={styles.addButton} onClick={handleOpenForm}>
          Add New Vehicle
        </button>
      )}

      {isFormVisible && (
        <div className={`${styles.addVehicleContainer} ${styles.shrinkForm}`}>
          <div className={styles.header}>
            <h2 className={styles.title}>Add a new vehicle</h2>
            <button onClick={handleCloseForm} className={styles.closeButton}>
              ✖
            </button>
          </div>
          <hr className={styles.underline} />
          {error && <p className={styles.error}>{error}</p>}
          {success && <p className={styles.success}>{success}</p>}
          <form className={styles.form} onSubmit={handleSubmit}>
            <input
              type="text"
              name="vehicle_year"
              placeholder="Vehicle year"
              value={formData.vehicle_year}
              onChange={handleChange}
              className={styles.inputField}
            />
            <input
              type="text"
              name="vehicle_make"
              placeholder="Vehicle make"
              value={formData.vehicle_make}
              onChange={handleChange}
              className={styles.inputField}
            />
            <input
              type="text"
              name="vehicle_model"
              placeholder="Vehicle model"
              value={formData.vehicle_model}
              onChange={handleChange}
              className={styles.inputField}
            />
            <input
              type="text"
              name="vehicle_type"
              placeholder="Vehicle type"
              value={formData.vehicle_type}
              onChange={handleChange}
              className={styles.inputField}
            />
            <input
              type="text"
              name="vehicle_mileage"
              placeholder="Vehicle mileage"
              value={formData.vehicle_mileage}
              onChange={handleChange}
              className={styles.inputField}
            />
            <input
              type="text"
              name="vehicle_tag"
              placeholder="Vehicle tag"
              value={formData.vehicle_tag}
              onChange={handleChange}
              className={styles.inputField}
            />
            <input
              type="text"
              name="vehicle_serial"
              placeholder="Vehicle serial"
              value={formData.vehicle_serial}
              onChange={handleChange}
              className={styles.inputField}
            />
            <input
              type="text"
              name="vehicle_color"
              placeholder="Vehicle color"
              value={formData.vehicle_color}
              onChange={handleChange}
              className={styles.inputField}
            />
            <button type="submit" className={styles.submitButton}>
              Add Vehicle
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default VehicleSection;
