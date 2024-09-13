import React from 'react'
import SideBar from '../../../components/Admin/AdminMenu/AdminMenu';
import AddServiceForm from '../../../components/Admin/AddServiceForm/AddServiceForm';
import styles from './AddService.module.css'
function AddService() {
  return (
    <div className={styles.container}>
      <SideBar />
      <AddServiceForm />
    </div>
  );
  
}

export default AddService