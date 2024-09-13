import React from "react";
import { useLocation, useParams } from "react-router-dom";
import CustomerProfile from "../../../pages/Admin/CustomerProfile/CustomerProfile";
import ChooseVehicle from "../ChooseVehicle/ChooseVehicle";

const CustomerProfileWrapper = () => {
  const { customer_id } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const view = queryParams.get("view");

  if (view === "chooseVehicle") {
    return <ChooseVehicle customer_id={customer_id} />;
  } else {
    return <CustomerProfile customer_id={customer_id} />;
  }
};

export default CustomerProfileWrapper;
