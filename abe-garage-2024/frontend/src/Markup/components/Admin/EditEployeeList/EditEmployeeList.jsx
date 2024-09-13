import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./EditEmployeeList.module.css";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Loading from "../../Loading/Loading";
import {
  getSingleEmployee,
  editEmployee,
} from "../../../../Services/employee.service";

function EditEmployeeList() {
  const { employee_id } = useParams(); // Get the employee_id from the URL
  const navigate = useNavigate(); // For navigating after the edit is done
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [responseMessage, setResponseMessage] = useState(null);
  const [employeeData, setEmployeeData] = useState({
    employee_first_name: "",
    employee_last_name: "",
    employee_phone: "",
    company_role_name: "",
    active_employee: 1,
    employee_email: "",
    employee_password: "",
  });

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        console.log("Fetching employee data for ID:", employee_id);

        const response = await getSingleEmployee(employee_id);

        console.log("Fetched employee data:", response);

        // Ensure employee data is set correctly, including the active status
        setEmployeeData({
          ...response.employee,
          active_employee: response.employee.active_employee === 1 ? 1 : 0,
        });

        console.log("State after setting employee data:", employeeData); // Check if state is updated
      } catch (error) {
        console.error("Error fetching employee data:", error);
        setResponseMessage("Error fetching employee data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [employee_id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEmployeeData({
      ...employeeData,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await editEmployee(employee_id, employeeData);
      setResponseMessage(response.message);
      setTimeout(() => {
        navigate("/admin/employees");
      }, 2000);
    } catch (error) {
      setResponseMessage(
        error.response?.data?.error ||
          "An error occurred while updating the employee."
      );
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.formTitle}>Edit Employee</h2>
      {responseMessage && (
        <div className={styles.responseMessage}>
          <h4>{responseMessage}</h4>
        </div>
      )}
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="employee_first_name" className={styles.label}>
            First Name
          </label>
          <input
            type="text"
            id="employee_first_name"
            name="employee_first_name"
            value={employeeData.employee_first_name || ""}
            onChange={handleChange}
            className={styles.input}
            placeholder="Enter Employee First Name"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="employee_last_name" className={styles.label}>
            Last Name
          </label>
          <input
            type="text"
            id="employee_last_name"
            name="employee_last_name"
            value={employeeData.employee_last_name || ""}
            onChange={handleChange}
            className={styles.input}
            placeholder="Enter Employee Last Name"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="employee_phone" className={styles.label}>
            Phone Number
          </label>
          <input
            type="text"
            id="employee_phone"
            name="employee_phone"
            value={employeeData.employee_phone || ""}
            onChange={handleChange}
            className={styles.input}
            placeholder="Enter Employee Phone Number"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="company_role_name" className={styles.label}>
            Role
          </label>
          <select
            id="company_role_name"
            name="company_role_name"
            value={employeeData.company_role_name || ""}
            onChange={handleChange}
            className={styles.input}
          >
            <option value="">Select a role</option>
            <option value="Admin">Admin</option>
            <option value="Manager">Manager</option>
            <option value="Employee">Employee</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="employee_email" className={styles.label}>
            Email
          </label>
          <input
            type="email"
            id="employee_email"
            name="employee_email"
            value={employeeData.employee_email || ""}
            onChange={handleChange}
            className={styles.input}
            placeholder="Enter Employee Email"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="employee_password" className={styles.label}>
            Password
          </label>
          <div className={styles.passwordWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              id="employee_password"
              name="employee_password"
              value={employeeData.employee_password || ""}
              onChange={handleChange}
              className={styles.input}
              placeholder="Enter New Employee Password"
            />
            <span
              className={styles.passwordToggle}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </span>
          </div>
        </div>

        <div className={styles.lastformGroup}>
          <input
            type="checkbox"
            id="active_employee"
            name="active_employee"
            checked={employeeData.active_employee === 1}
            onChange={(e) =>
              handleChange({
                target: {
                  name: "active_employee",
                  value: e.target.checked ? 1 : 0,
                  type: "checkbox",
                  checked: e.target.checked,
                },
              })
            }
            className={styles.inputCheckbox}
          />
          <label htmlFor="active_employee" className={styles.label}>
            Is Active
          </label>
        </div>

        <button type="submit" className={styles.submitButton}>
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default EditEmployeeList;
