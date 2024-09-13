import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import SideBar from "../../../components/Admin/AdminMenu/AdminMenu";
import Loading from "../../../components/Loading/Loading";
import EmployeesList from "../../../components/Admin/EmployeesList/EmployeesList";
import styles from "./AllEmployees.module.css";
function AllEmployees() {
 
  return (
    <div className={styles.container}>
      <SideBar />
     <EmployeesList/>
    </div>
  );
}

export default AllEmployees;
