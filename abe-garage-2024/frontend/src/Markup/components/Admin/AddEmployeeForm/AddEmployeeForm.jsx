import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AddEmployeeForm.module.css";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useUser } from "../../../../context/UserContext";
import EmployeeService from "../../../../Services/employee.service";

function AddEmployee() {
  const { user } = useUser();
  const [responseMessage, setResponseMessage] = useState(null);
  const [responseMessageType, setResponseMessageType] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const [employeeForm, setEmployeeForm] = useState({
    employee_first_name: "",
    employee_last_name: "",
    employee_phone: "",
    company_role_name: "",
    active_employee: 1,
    employee_email: "",
    employee_password: "",
    created_by: user?.employee_first_name, 
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployeeForm((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateFields()) {
      return;
    }


    try {
     const response = await EmployeeService.createEmployee(employeeForm);

      if (response) {
        setResponseMessage(response.message);
        setResponseMessageType("success");
        setEmployeeForm({
          employee_first_name: "",
          employee_last_name: "",
          employee_phone: "",
          company_role_name: "",
          active_employee: 1,
          employee_email: "",
          employee_password: "",
          created_by: user?.employee_first_name, 
        });

        // Redirect to the employee list after a successful addition
        setTimeout(() => {
          navigate("/admin/employees");
        }, 1000);
      } else {
        setResponseMessage(response.error || "An unexpected error occurred.");
        setResponseMessageType("error");
      }
    } catch (error) {
      setResponseMessage("An error occurred. Please try again.");
      setResponseMessageType("error"); 
    }
  };

  const validateFields = () => {
    const {
      employee_first_name,
      employee_last_name,
      employee_email,
      employee_password,
    } = employeeForm;
    if (
      !employee_first_name ||
      !employee_last_name ||
      !employee_email ||
      !employee_password
    ) {
      setResponseMessage("Please fill in all required fields.");
      setResponseMessageType("error"); // Set message type to error
      return false;
    }
    return true;
  };

  return (
    <div>
      <div className={styles.formContainer}>
        <h2 className={styles.formTitle}>Add a new employee</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div
            className={`${styles.responseMessage} ${
              responseMessageType === "success"
                ? styles.successMessage
                : styles.errorMessage
            }`}
          >
            {responseMessage && <h4>{responseMessage}</h4>}{" "}
            {/* Display the backend response message */}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="employee_first_name" className={styles.label}>
              First Name
            </label>
            <input
              type="text"
              id="employee_first_name"
              name="employee_first_name"
              value={employeeForm.employee_first_name}
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
              value={employeeForm.employee_last_name}
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
              value={employeeForm.employee_phone}
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
              value={employeeForm.company_role_name}
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
              value={employeeForm.employee_email}
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
                value={employeeForm.employee_password}
                onChange={handleChange}
                className={styles.input}
                placeholder="Enter Employee Password"
              />
              <span
                className={styles.passwordToggle}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </span>
            </div>
          </div>

          <button type="submit" className={styles.submitButton}>
            Add Employee
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddEmployee;
