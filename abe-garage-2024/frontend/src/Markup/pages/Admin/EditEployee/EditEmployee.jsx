import React from "react";
import styles from "./EditEmployee.module.css";
import SideBar from "../../../components/Admin/AdminMenu/AdminMenu";
import EditEmployeeForm from "../../../components/Admin/EditEployeeList/EditEmployeeList";
function EditEmployee() {
    return (
    <div className={styles.container}>
      <SideBar />
     <EditEmployeeForm/>
    </div>
  );
}

export default EditEmployee;
