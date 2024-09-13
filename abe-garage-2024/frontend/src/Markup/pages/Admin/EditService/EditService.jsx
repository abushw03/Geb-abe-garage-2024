import React from 'react'
import SideBar from '../../../components/Admin/AdminMenu/AdminMenu';
import EditService from '../../../components/Admin/EditService/EditService';
import styles from './EditService.module.css';
function EditServicePage() {
  return (
    <div className={styles.container}>
      <SideBar />
      <EditService />
    </div>
  );
}

export default EditServicePage