import React, { useState } from "react";
import style from "./CustomerService.module.css";
import ServiceSection from "../../../components/Admin/ServiceSection/ServiceSection";
import SideBar from "../../../components/Admin/AdminMenu/AdminMenu";
import ChooseServices from "../../../components/Admin/ChooseServices/ChooseServices";

function CustomerService() {
  const [customerId, setCustomerId] = useState(null);
  const [vehicleId, setVehicleId] = useState(null);

  const handleDataUpdate = (newCustomerId, newVehicleId) => {
    setCustomerId(newCustomerId);
    setVehicleId(newVehicleId);
  };

  return (
    <div className={style.container}>
      <SideBar />
      <div>
        <ServiceSection onDataUpdate={handleDataUpdate} />
        <ChooseServices customerId={customerId} vehicleId={vehicleId} />
      </div>
    </div>
  );
}

export default CustomerService;
