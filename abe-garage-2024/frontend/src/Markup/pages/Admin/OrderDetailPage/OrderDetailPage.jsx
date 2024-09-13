import React from "react";
import { useParams } from "react-router-dom"; // To get orderId from URL params
import styles from "./OrderDetailPage.module.css";
import OrderDetail from "../../../components/Admin/OrderDetail/OrderDetail";

function OrderDetailPage() {
  // Use useParams hook to get the orderId from the URL
  const { order_hash } = useParams();

  return (
    <div className={styles.container}>
      <OrderDetail order_hash={order_hash} /> {/* Pass orderId as a prop */}
    </div>
  );
}

export default OrderDetailPage;
