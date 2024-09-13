import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./CustomerTable.module.css";
import { fetchCustomers } from "../../../../Services/customer.service";

const CustomerTable = () => {
  const [customers, setCustomers] = useState([]); // Initialize with an empty array
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  const getCustomers = async (page) => {
    try {
      const { data, total } = await fetchCustomers(page, itemsPerPage);
      setCustomers(Array.isArray(data) ? data : []);
      setTotalPages(Math.ceil(total / itemsPerPage));
    } catch (error) {
      console.error("Error fetching customers:", error);
      if (error.response) {
      } else if (error.request) {
        // Request was made but no response was received
        console.error("Request data:", error.request);
      } else {
        // Something else happened while setting up the request
        console.error("Error message:", error.message);
      }
      setCustomers([]);
    }
  };

  useEffect(() => {
    getCustomers(currentPage);
  }, [currentPage]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleEdit = (customer_id) => {
    navigate(`/admin/customers/edit-customer/${customer_id}`);
  };

  const handleView = (customer_id) => {
    navigate(`/admin/customers/customer-profile/${customer_id}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.contentContainer}>
        <h2 className={styles.title}>Customers</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Name</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.length > 0 ? (
              customers.map((customer) => (
                <tr key={customer.customer_id}>
                  <td>{customer.customer_id}</td>
                  <td>{customer.customer_email}</td>
                  <td>{customer.customer_phone_number}</td>
                  <td>
                    {customer.customer_first_name} {customer.customer_last_name}
                  </td>
                  <td>{customer.active_customer_status}</td>
                  <td>
                    <button
                      className={styles.editButton}
                      onClick={() => handleEdit(customer.customer_id)}
                    >
                      Edit
                    </button>
                    <button
                      className={styles.viewButton}
                      onClick={() => handleView(customer.customer_id)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No customers found.</td>
              </tr>
            )}
          </tbody>
        </table>
        <div className={styles.pagination}>
          <button
            className={`${styles.pageButton} ${
              currentPage === 1 && styles.disabled
            }`}
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span
            className={styles.pageNumber}
          >{`Page ${currentPage} of ${totalPages}`}</span>
          <button
            className={`${styles.pageButton} ${
              currentPage === totalPages && styles.disabled
            }`}
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerTable;
