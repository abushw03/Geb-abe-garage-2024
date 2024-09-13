import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./Customers.module.css";
import { FaEdit, FaEye, FaTrashAlt } from "react-icons/fa";
import { format } from "date-fns";
import Sidebar from "../../../components/Admin/AdminMenu/AdminMenu";
import  {
  getAllCustomer,deleteCustomer,
} from "../../../../Services/customer.service";

function Customers() {
  const [loading, setLoading] = useState(true);
  const [customersData, setCustomersData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [customersPerPage] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await getAllCustomer();
        setCustomersData(response.customers);
      } catch (error) {
        console.error("Error fetching customers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const handleEdit = (customer_id) => {
    navigate(`/admin/customers/edit-customer/${customer_id}`);
  };

  const handleView = (customer_id) => {
    navigate(`/admin/customers/customer-profile/${customer_id}`);
  };

  const handleDelete = async (customer_id) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        const response = await deleteCustomer(customer_id);
        if (response) {
          setCustomersData((prevData) =>
            prevData.filter((customer) => customer.customer_id !== customer_id)
          );
          alert("Customer deleted successfully.");
        } else {
          alert("Failed to delete customer.");
        }
      } catch (error) {
        console.error("Error deleting customer:", error);
        alert("An error occurred while deleting the customer.");
      }
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredCustomers = customersData.filter(
    (customer) =>
      customer.customer_first_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      customer.customer_last_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      customer.customer_email
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      customer.customer_phone_number
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);
  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = filteredCustomers.slice(
    indexOfFirstCustomer,
    indexOfLastCustomer
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.contentContainer}>
        <div className={styles.header}>
          <h2 className={styles.title}>Customers</h2>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search by Name, Email or Phone..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Added Date</th>
              <th>Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentCustomers.map((customer) => (
              <tr key={customer.customer_id}>
                <td>{customer.customer_id}</td>
                <td>{customer.customer_first_name}</td>
                <td>{customer.customer_last_name}</td>
                <td>{customer.customer_email}</td>
                <td>{customer.customer_phone_number}</td>
                <td>
                  {customer.customer_added_date
                    ? format(
                        new Date(customer.customer_added_date),
                        "MM/dd/yyyy"
                      )
                    : "N/A"}
                </td>
                <td>
                  {parseInt(customer.customer_active_status) === 1
                    ? "Yes"
                    : "No"}
                </td>
                <td className={styles.actions}>
                  <FaEdit
                    className={styles.editIcon}
                    onClick={() => handleEdit(customer.customer_id)}
                  />
                  <FaEye
                    className={styles.viewIcon}
                    onClick={() => handleView(customer.customer_id)}
                  />
                  <FaTrashAlt
                    className={styles.deleteIcon}
                    onClick={() => handleDelete(customer.customer_id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className={styles.pagination}>
          <button
            className={styles.paginationButton}
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className={styles.pageNumber}>{currentPage}</span>
          <button
            className={styles.paginationButton}
            onClick={() => paginate(currentPage + 1)}
            disabled={indexOfLastCustomer >= filteredCustomers.length}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default Customers;
