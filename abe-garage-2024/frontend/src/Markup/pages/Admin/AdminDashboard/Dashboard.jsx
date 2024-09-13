import React, { useEffect, useState } from "react";
import styles from "./Dashboard.module.css";
import SideBar from "../../../components/Admin/AdminMenu/AdminMenu";
import AdminDashboard from "../../../components/Admin/AdminDashboard/AdminDashboard";
function Dashboard() {
  return (
    <div className={styles.container}>
    <SideBar />
     <AdminDashboard/>
    </div>
  );
}

export default Dashboard;
