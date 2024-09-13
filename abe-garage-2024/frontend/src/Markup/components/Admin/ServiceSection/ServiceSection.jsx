import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import styles from "./ServiceSection.module.css";
import { getVehicleById } from "../../../../Services/vehicle.service";
import { FaEdit } from "react-icons/fa";
import { getSingleCustomer } from "../../../../Services/customer.service";
const ServiceSection = ({ onDataUpdate }) => {
  const { vehicle_id } = useParams();
  // const { customer_id } = useParams();
  const [vehicleInfo, setVehicleInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchVehicleData = async () => {
      try {
        const response = await getVehicleById(vehicle_id);
        setVehicleInfo(response.vehicle);
        const customerId = response.vehicle.customer_id;

        // Update parent component with customerId and vehicleId
        // fetchVehicleData();
        onDataUpdate(customerId, vehicle_id);
      } catch (error) {
        setError("Failed to load vehicle and customer data");
      } finally {
        setLoading(false);
      }
    };

    if (vehicle_id) {
      fetchVehicleData();
    } else {
      setError("No vehicle ID provided in URL");
      setLoading(false);
    }
  }, [vehicle_id, onDataUpdate]);

  if (loading) {
    return <p>Loading data...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!vehicleInfo) {
    return <p>No data available</p>;
  }
  const handleEdit = () => {
    navigate(`/admin/customers/edit-customer/${vehicleInfo.customer_id}`);
  };
  const handlevehicleEdit = () => {
    navigate(`/admin/vehicles/edit-vehicle/${vehicle_id}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.profileContainer}>
        <div className={styles.customerInfo}>
          <div className={styles.customerDetails}>
            <h3 className={styles.customerName}>
              {vehicleInfo.customer_first_name} {vehicleInfo.customer_last_name}
            </h3>
            <p className={styles.detail}>
              <b>Email:</b> {vehicleInfo.customer_email}
            </p>
            <p className={styles.detail}>
              <b>Phone Number:</b> {vehicleInfo.customer_phone_number}
            </p>
            <p className={styles.detail}>
              <b>Active Customer:</b>{" "}
              {vehicleInfo.customer_active_status === 1 ? "Yes" : "No"}
            </p>
            <div className={styles.editContainer} onClick={handleEdit}>
              <FaEdit className={styles.editIcon} />
              <span>Edit customer info</span>
            </div>
          </div>
        </div>

        <div className={styles.vehicleInfo}>
          <div className={styles.vehicleDetails}>
            <h3 className={styles.vehicleName}>
              {vehicleInfo.vehicle_make} {vehicleInfo.vehicle_model}
            </h3>
            <p className={styles.detail}>
              <b>Vehicle color:</b> {vehicleInfo.vehicle_color}
            </p>
            <p className={styles.detail}>
              <b>Vehicle tag:</b> {vehicleInfo.vehicle_tag}
            </p>
            <p className={styles.detail}>
              <b>Vehicle year:</b> {vehicleInfo.vehicle_year}
            </p>
            <p className={styles.detail}>
              <b>Vehicle mileage:</b> {vehicleInfo.vehicle_mileage}
            </p>
            <p className={styles.detail}>
              <b>Vehicle serial:</b> {vehicleInfo.vehicle_serial}
            </p>
            <div className={styles.editContainer} onClick={handlevehicleEdit}>
              <FaEdit className={styles.editIcon} />
              <span>Edit Vehicle info</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceSection;
