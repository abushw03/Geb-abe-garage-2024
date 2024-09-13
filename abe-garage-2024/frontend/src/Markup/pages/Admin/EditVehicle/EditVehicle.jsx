import React from 'react'
import SideBar from "../../../components/Admin/AdminMenu/AdminMenu";
import EditVehicleForm from '../../../components/Admin/EditVehicle/EditVehicleForm';
import styles from "./EditVehicle.module.css";
function EditVehicle() {
  return (
    <div className={styles.container}>
      <SideBar />
      <EditVehicleForm/>
    </div>
  );
}

export default EditVehicle