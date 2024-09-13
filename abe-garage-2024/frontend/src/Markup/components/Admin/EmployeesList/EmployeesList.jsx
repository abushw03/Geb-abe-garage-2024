import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import axios from "axios";
import styles from "./EmployeesList.module.css";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import Loading from "../../Loading/Loading";
import { format } from "date-fns";
import { getAllEmployee } from "../../../../Services/employee.service";

function EmployeesList() {
  const [loading, setLoading] = useState(true);
  const [employeesData, setEmployeesData] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [currentPage, setCurrentPage] = useState(1);
  const [employeesPerPage] = useState(5); // Set number of employees per page
  const navigate = useNavigate(); // Initialize useNavigate for navigation

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await getAllEmployee();

        // Assuming response.data.employees is an array with a single nested array of employee objects
        const employeesArray = response.employees[0];

        setEmployeesData(employeesArray);
      } catch (error) {
        console.error("Error fetching employees:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleEdit = (employee_id) => {
    navigate(`/admin/employees/${employee_id}`);
  };

  const handleDelete = async (employee_id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await deleteEmployee(employee_id);
        setEmployeesData((prevData) =>
          prevData.filter((employee) => employee.employee_id !== employee_id)
        );
      } catch (error) {
        console.error("Error deleting employee:", error);
      }
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredEmployees = employeesData.filter(
    (employee) =>
      employee.employee_first_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      employee.employee_last_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = filteredEmployees.slice(
    indexOfFirstEmployee,
    indexOfLastEmployee
  );
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.contentContainer}>
        <div className={styles.header}>
          <h2 className={styles.title}>Employees</h2>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search by Employee Name..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Active</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Added Date</th>
              <th>Role</th>
              <th>Created By</th> {/* New Created By column */}
              <th>Edit/Delete</th>
            </tr>
          </thead>
          <tbody>
            {currentEmployees.map((employee) => (
              <tr key={employee.employee_id}>
                <td>{employee.active_employee === 1 ? "Yes" : "No"}</td>
                <td>{employee.employee_first_name}</td>
                <td>{employee.employee_last_name}</td>
                <td>{employee.employee_email}</td>
                <td>{employee.employee_phone}</td>
                <td>
                  {employee.added_date
                    ? format(new Date(employee.added_date), "MM/dd/yyyy")
                    : "N/A"}
                </td>
                <td>{employee.company_role_name}</td>
                <td>{employee.created_by || "Unknown"}</td>{" "}
                {/* Display Created By */}
                <td className={styles.actions}>
                  <FaEdit
                    className={styles.editIcon}
                    onClick={() => handleEdit(employee.employee_id)}
                  />
                  <FaTrashAlt
                    className={styles.deleteIcon}
                    onClick={() => handleDelete(employee.employee_id)}
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
            disabled={indexOfLastEmployee >= filteredEmployees.length}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default EmployeesList;
