import React from "react";
import styles from "./EditCustomer.module.css";
import SideBar from "../../../components/Admin/AdminMenu/AdminMenu";
import EditCustomerForm from "../../../components/Admin/EditCustomerForm/EditCustomerForm";

function EditCustomer() {
  return (
    <div className={styles.container}>
      <SideBar />
      <EditCustomerForm/>
    </div>
  );
}

export default EditCustomer;
