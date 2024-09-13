import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "../../context/UserContext"; 
import { createOrder } from "../../../../Services/order.service";
const CreateOrder = ({ customer_id, vehicle_id, service_ids }) => {
  const { user } = useUser(); // Get the logged-in user's data
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState({
    order_total_price: 0,
    additional_request: "",
    notes_for_internal_use: "",
    notes_for_customer: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      console.error("User is not logged in.");
      return;
    }

    const orderPayload = {
      employee_id: user.employee_id, 
      customer_id,
      vehicle_id,
      service_ids,
      ...orderData,
    };

    try {
   const response = await createOrder(orderPayload);
      console.log("Order created successfully:", response);
      setTimeout(()=>{
        navigate(`/admin/customers/customer-profile/${customer_id}`); 
      }, 1000)
    } catch (error) {
      console.error(
        "Error creating order:",
        error.response ? error.response : error.message
      );
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Add form fields for additional_request, notes_for_internal_use, notes_for_customer, etc. */}
      <button type="submit">Submit Order</button>
    </form>
  );
};

export default CreateOrder;
