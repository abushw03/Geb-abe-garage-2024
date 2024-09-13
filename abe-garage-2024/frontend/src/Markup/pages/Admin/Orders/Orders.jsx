import React from 'react'
import SideBar from '../../../components/Admin/AdminMenu/AdminMenu'
import CustomerOrders from '../../../components/Admin/CustomerOrders/CustomerOrders'
import styles from './Orders.module.css'
function Orders() {
  return (
     <div className={styles.container}>
      <SideBar />
      <CustomerOrders />
    </div>
  )
}

export default Orders