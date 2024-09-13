import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../../context/UserContext";
import styles from "./lowerheader.module.css";
import logo from "../../../assets/images/logo.png";

const LowerHeader = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  // Function to handle the logout process
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Function to determine the correct route based on the user's role
  const getHomeRoute = () => {
    if (user) {
      if (user.role === "Admin" || user.role === "Manager") {
        return "/admin/dashboard";
      } else if (user.role === "Employee") {
        return "/admin/orders";
      }
    }
    return "/"; // Default route if no user is logged in
  };

  return (
    <div className={styles.headerUpper}>
      <div className={styles.container}>
        <div className={styles.logoBox}>
          <div className={styles.logo}>
            <Link to={getHomeRoute()}>
              <img src={logo} alt="Abie-garage" />
            </Link>
          </div>
        </div>

        <div className={styles.rightColumn}>
          <nav className={`${styles.mainMenu} navbar-expand-md navbar-light`}>
            <ul className={styles.navigation}>
              <li className={styles.navItem}>
                <Link to={getHomeRoute()}>Home</Link>
              </li>
              <li className={styles.navItem}>
                <Link to="/aboutus">About Us</Link>
              </li>
              <li className={styles.navItem}>
                <Link to="/services">Services</Link>
              </li>
              <li className={styles.navItem}>
                <Link to="/contactus">Contact Us</Link>
              </li>
            </ul>
          </nav>

          <div className={styles.linkBtn}>
            {user ? (
              <button onClick={handleLogout} className={styles.bookButton}>
                Logout
              </button>
            ) : (
              <Link to="/login" className={styles.bookButton}>
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LowerHeader;
