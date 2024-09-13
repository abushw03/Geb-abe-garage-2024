import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEdit, FaTimes } from "react-icons/fa"; // Import FaTimes icon for the 'X' button
import styles from "./ChooseVehicle.module.css";
import SideBar from "../../../components/Admin/AdminMenu/AdminMenu";
import VehicleList from "../VehicleList/VehicleList";
import {
  getCustomerVehicles,
  getSingleCustomer,
} from "../../../../Services/customer.service";

const ChooseVehicle = () => {
  const { customer_id } = useParams();
  console.log("customer id is ", customer_id);
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isShrinking, setIsShrinking] = useState(false);

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const response = await getSingleCustomer(customer_id);
        setCustomer(response.customer);
      } catch (error) {
        setError("Failed to load customer data");
      } finally {
        setLoading(false);
      }
    };

    const fetchVehicles = async () => {
      try {
         const response = await getCustomerVehicles(
           customer_id
         );
         setVehicles(response.vehicles);
      } catch (error) {
        setError("This User Doesn't have Vehicles Yet");
        setTimeout(() => {
          navigate(`/admin/customers/customer-profile/${customer_id}`);
        }, 1500);
      }
    };

    fetchCustomerData();
    fetchVehicles();
  }, [customer_id]);

  const handleEdit = () => {
    navigate(`/admin/customers/edit-customer/${customer_id}`);
  };

  const handleClose = () => {
    setIsShrinking(true);
    setTimeout(() => {
      navigate("/admin/add-order");
    });
  };

  const handleVehicleSelect = (vehicle_id) => {
    navigate(`/admin/customers/vehicles/${vehicle_id}`);
  };

  if (loading) {
    return <p>Loading customer data...</p>;
  }

 if (error) {
   return <p className={styles.errorMessage}>{error}</p>;
 }

  return (
    <div className={`${styles.container} ${isShrinking ? styles.shrink : ""}`}>
      <SideBar />
      <div className={styles.profileContainer}>
        <div className={styles.titlediv}>
          <h2 className={styles.title}>Create a new order</h2>
          <div className={styles.titleUnderline}></div>
        </div>
        <div className={styles.customerInfo}>
          <div className={styles.customerDetails}>
            <h3 className={styles.customerName}>
              {customer.customer_first_name} {customer.customer_last_name}
            </h3>
            <p className={styles.detail}>
              <b>Email:</b> {customer.customer_email}
            </p>
            <p className={styles.detail}>
              <b>Phone Number:</b> {customer.customer_phone_number}
            </p>
            <p className={styles.detail}>
              <b>Active Customer:</b>{" "}
              {customer.customer_active_status === 1 ? "Yes" : "No"}
            </p>
            <div className={styles.editContainer} onClick={handleEdit}>
              <FaEdit className={styles.editIcon} />
              <span>Edit customer info</span>
            </div>
          </div>
          <FaTimes className={styles.removeIcon} onClick={handleClose} />
        </div>

        <VehicleList
          customer_first_name={customer.customer_first_name}
          vehicles={vehicles}
          handleVehicleSelect={handleVehicleSelect} // Pass the function directly
        />
      </div>
    </div>
  );
};

export default ChooseVehicle;
