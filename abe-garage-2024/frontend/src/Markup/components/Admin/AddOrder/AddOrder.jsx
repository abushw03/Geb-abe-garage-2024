import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./AddOrder.module.css";
import { FaHandPointer } from "react-icons/fa";
import customerService from "../../../../Services/customer.service";

function AddOrder() {
  const [customersData, setCustomersData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await customerService.getAllCustomer();
        setCustomersData(response.customers);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };

    fetchCustomers();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query) {
      const filtered = customersData.filter(
        (customer) =>
          customer.customer_first_name
            .toLowerCase()
            .includes(query.toLowerCase()) ||
          customer.customer_last_name
            .toLowerCase()
            .includes(query.toLowerCase()) ||
          customer.customer_email.toLowerCase().includes(query.toLowerCase()) ||
          customer.customer_phone_number
            .toLowerCase()
            .includes(query.toLowerCase())
      );
      setFilteredCustomers(filtered);
    } else {
      setFilteredCustomers([]);
    }
  };

  const handleSelectCustomer = (customer_id) => {
    navigate(
      `/admin/customers/customer-profile/${customer_id}?view=chooseVehicle`
    );
  };

  const handleAddCustomer = () => {
    navigate("/admin/add-customer"); // Navigate to the "Add Customer" page
  };

  return (
    <div className={styles.container}>
      <div className={styles.titlediv}>
        <h2 className={styles.title}>Create a new order</h2>
        <div className={styles.titleUnderline}></div>
      </div>

      <div className={styles.searchContainer}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search by Name, Email, or Phone"
          value={searchQuery}
          onChange={handleSearch}
        />
        {!searchQuery && (
          <button className={styles.addButton} onClick={handleAddCustomer}>
            Add New Customer
          </button>
        )}
      </div>

      {searchQuery && filteredCustomers.length > 0 && (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((customer) => (
              <tr key={customer.customer_id}>
                <td>{customer.customer_first_name}</td>
                <td>{customer.customer_last_name}</td>
                <td>{customer.customer_email}</td>
                <td>{customer.customer_phone_number}</td>
                <td>
                  <FaHandPointer
                    className={styles.pointerIcon}
                    onClick={() => handleSelectCustomer(customer.customer_id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {searchQuery && filteredCustomers.length === 0 && (
        <>
          <p className={styles.noResults}>No customers found.</p>
          <button className={styles.addButton} onClick={handleAddCustomer}>
            ADD NEW CUSTOMER
          </button>
        </>
      )}
    </div>
  );
}

export default AddOrder;
