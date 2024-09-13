import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../context/UserContext";
import styles from "./Login.module.css";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Loading from "../../components/Loading/Loading";
import axios from "axios";

function Login() {
  const [employee_email, setEmployeeEmail] = useState("");
  const [employee_password, setEmployeePassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [responseMessage, setResponseMessage] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false); // Track if the message is a success message
  const navigate = useNavigate();
  const { login } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      employee_email,
      employee_password,
    };

    const apiUrl = "http://localhost:2030/api/login";

    try {
      const response = await axios.post(apiUrl, data);

      if (response.status === 200) {
        const {
          employee_id,
          employee_first_name,
          employee_email,
          employee_last_name,
          role,
          token,
        } = response.data.employee;

        // Store the token in localStorage
        localStorage.setItem("token", token);

        // Update context with user’s information, including employee_id
        login({
          employee_id,
          employee_first_name,
          employee_last_name,
          employee_email,
          role,
        });

        // Show a success message and set the isSuccess state to true
        setIsSuccess(true);
        setResponseMessage("Login successfully! Redirecting...");

        // Redirect based on the user's role after a short delay to show the success message
        setTimeout(() => {
          if (role === "Admin" || role === "Manager") {
            navigate("/admin/dashboard");
          } else if (role === "Employee") {
            navigate("/admin/orders");
          }
        }, 1500); // 1.5 second delay to show the success message
      } else {
        setIsSuccess(false);
        setResponseMessage("Login failed. Please try again.");
      }
    } catch (error) {
      setIsSuccess(false);
      // Check if the error has a response and if the backend has sent an error message
      if (error.response && error.response.data && error.response.data.error) {
        setResponseMessage(error.response.data.error); // Display the backend error message
      } else {
        setResponseMessage("An error occurred. Please try again.");
      }
    }
  };



  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.header}>
        <h3 className={styles.loginheader}>Login to your Account Here</h3>
        <div className={styles.greenLine}></div>
      </div>
      <div
        className={styles.responseMessage}
        style={{ color: isSuccess ? "green" : "darkorange" }} // Apply green color for success and red for errors
      >
        {responseMessage && <h4>{responseMessage}</h4>}
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="employee_email" className={styles.label}>
          Email
        </label>
        <input
          type="email"
          id="employee_email"
          name="employee_email"
          value={employee_email}
          onChange={(e) => setEmployeeEmail(e.target.value)}
          className={styles.input}
          placeholder="Enter your email"
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
            value={employee_password}
            onChange={(e) => setEmployeePassword(e.target.value)}
            className={styles.input}
            placeholder="Enter your password"
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
        Login
      </button>
    </form>
  );
}

export default Login;
