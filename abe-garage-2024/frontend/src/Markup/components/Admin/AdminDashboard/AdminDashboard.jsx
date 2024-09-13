import React, { useEffect, useState } from 'react'
import styles from './AdminDashboard.module.css';
import {
  FaPowerOff,
  FaCog,
  FaCar,
  FaTachometerAlt,
  FaPaintBrush,
} from "react-icons/fa";
import { Link } from "react-router-dom";
function AdminDashboard() {
     const [loading, setLoading] = useState(true);
     useEffect(() => {
       // Simulate data fetching
       setTimeout(() => {
         setLoading(false);
       }, 2000);
     }, []);

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.header}>
        <h2 className={styles.dashboardTitle}>Admin Dashboard</h2>
        <div className={styles.greenLine}></div>
      </div>
      <p className={styles.dashboardDescription}>
        Bring to the table win-win survival strategies to ensure proactive
        domination. At the end of the day, going forward, a new normal that has
        evolved from generation X is on the runway heading towards a streamlined
        cloud solution.
      </p>
      <section className={styles.servicesSection}>
        <div className={styles.autoContainer}>
          <div className={styles.row}>
            <div className={styles.serviceBlockOne}>
              <div className={styles.innerBox}>
                <h5>OPEN FOR ALL</h5>
                <h2>All Orders</h2>
                <a href="#" className={styles.readMore}>
                  Read More +
                </a>
                <div className={styles.icon}>
                  <FaPowerOff />
                </div>
              </div>
            </div>
            <div className={styles.serviceBlockOne}>
              <div className={styles.innerBox}>
                <h5>OPEN FOR LEADS</h5>
                <h2>New Orders</h2>
                <a href="#" className={styles.readMore}>
                  Read More +
                </a>
                <div className={styles.icon}>
                  <FaCog />
                </div>
              </div>
            </div>
            <div className={styles.serviceBlockOne}>
              <div className={styles.innerBox}>
                <h5>OPEN FOR ADMINS</h5>
                <h2>Add Employee</h2>
                <a href="#" className={styles.readMore}>
                  Read More +
                </a>
                <div className={styles.icon}>
                  <FaTachometerAlt />
                </div>
              </div>
            </div>
            <div className={styles.serviceBlockOne}>
              <div className={styles.innerBox}>
                <h5>OPEN FOR ADMINS</h5>
                <h2>Employees</h2>
                <a href="#" className={styles.readMore}>
                  Read More +
                </a>
                <div className={styles.icon}>
                  <FaCar />
                </div>
              </div>
            </div>
            <div className={styles.serviceBlockOne}>
              <div className={styles.innerBox}>
                <h5>Service and Repairs</h5>
                <h2>Engine Service & Repair</h2>
                <a href="#" className={styles.readMore}>
                  Read More +
                </a>
                <div className={styles.icon}>
                  <FaTachometerAlt />
                </div>
              </div>
            </div>
            <div className={styles.serviceBlockOne}>
              <div className={styles.innerBox}>
                <h5>Service and Repairs</h5>
                <h2>Denting & Painting</h2>
                <a href="#" className={styles.readMore}>
                  Read More +
                </a>
                <div className={styles.icon}>
                  <FaPaintBrush />
                </div>
              </div>
            </div>
            <div className={styles.serviceBlockOne}>
              <div className={styles.innerBox}>
                <h5>Service and Repairs</h5>
                <h2>Denting & Painting</h2>
                <a href="#" className={styles.readMore}>
                  Read More +
                </a>
                <div className={styles.icon}>
                  <FaPaintBrush />
                </div>
              </div>
            </div>
            <div className={styles.serviceBlockOne}>
              <div className={styles.innerBox}>
                <h5>Service and Repairs</h5>
                <h2>Tyre & Wheels</h2>
                <a href="#" className={styles.readMore}>
                  Read More +
                </a>
                <div className={styles.icon}>
                  <FaPaintBrush />
                </div>
              </div>
            </div>
            <div className={styles.serviceBlockOne}>
              <div className={styles.innerBox}>
                <h5>Service and Repairs</h5>
                <h2>Performance Upgrading</h2>
                <a href="#" className={styles.readMore}>
                  Read More +
                </a>
                <div className={styles.icon}>
                  <FaPaintBrush />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AdminDashboard