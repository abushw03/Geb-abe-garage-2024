import React from 'react'
import SideBar from '../../../components/Admin/AdminMenu/AdminMenu'
import styles from './AddOrders.module.css'
import AddOrder from '../../../components/Admin/AddOrder/AddOrder'
function AddOrders() {
  return (
      <div className={styles.container}>
      <SideBar />
      <AddOrder />
      </div>
  )
}

export default AddOrders