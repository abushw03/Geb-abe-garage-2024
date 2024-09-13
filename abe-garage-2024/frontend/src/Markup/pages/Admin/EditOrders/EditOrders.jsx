import React from "react";
import { useParams } from "react-router-dom"; // Import useParams from react-router-dom
import SideBar from "../../../components/Admin/AdminMenu/AdminMenu";
import EditOrder from "../../../components/Admin/EditOrder/EditOrder";
import styles from "./EditOrders.module.css";

function EditOrders() {
  // Use useParams to extract orderId from the URL
  const { order_hash } = useParams();

  return (
    <div className={styles.container}>
      <SideBar />
      <EditOrder order_hash={order_hash} /> {/* Pass the orderId as a prop */}
    </div>
  );
}

export default EditOrders;
