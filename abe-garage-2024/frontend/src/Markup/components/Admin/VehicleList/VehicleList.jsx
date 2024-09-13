import React from "react";
import { FaHandPointer } from "react-icons/fa";
import styles from "./vehiclelist.module.css";

const VehicleList = ({
  customer_first_name,
  vehicles,
  handleVehicleSelect,
}) => {
  return (
    <div className={styles.vehiclesSection}>
      <h3 className={styles.sectionTitle}>Vehicles of {customer_first_name}</h3>
      <div className={styles.vehicleList}>
        {vehicles.length > 0 ? (
          <table className={styles.vehicleTable}>
            <thead>
              <tr>
                <th>Year</th>
                <th>Make</th>
                <th>Model</th>
                <th>Type</th>
                <th>Mileage</th>
                <th>Tag</th>
                <th>Serial</th>
                <th>Color</th>
                <th>Select</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((vehicle) => (
                <tr key={vehicle.vehicle_id}>
                  <td>{vehicle.vehicle_year}</td>
                  <td>{vehicle.vehicle_make}</td>
                  <td>{vehicle.vehicle_model}</td>
                  <td>{vehicle.vehicle_type}</td>
                  <td>{vehicle.vehicle_mileage}</td>
                  <td>{vehicle.vehicle_tag}</td>
                  <td>{vehicle.vehicle_serial}</td>
                  <td>{vehicle.vehicle_color}</td>
                  <td>
                    <FaHandPointer
                      className={styles.selectIcon}
                      onClick={() => handleVehicleSelect(vehicle.vehicle_id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className={styles.noDataFound}>No vehicle found</p>
        )}
      </div>
    </div>
  );
};

export default VehicleList;
