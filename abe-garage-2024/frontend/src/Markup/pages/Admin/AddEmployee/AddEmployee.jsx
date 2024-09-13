import React from "react";
import SideBar from "../../../components/Admin/AdminMenu/AdminMenu";
import styles from "./AddEmployee.module.css";
// add employee form from components
import AddEmployeeForm from "../../../components/Admin/AddEmployeeForm/AddEmployeeForm";
function AddEmployee() {
  
  return (
    <div className={styles.container}>
      <SideBar />
      <AddEmployeeForm />
    </div>
  );
}

export default AddEmployee;
