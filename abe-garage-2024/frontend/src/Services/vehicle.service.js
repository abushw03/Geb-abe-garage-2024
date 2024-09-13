import axios from "axios";

import api from "../utils/axios"


export const createVehicle = async (customer_id, formData) => {
  try {
    const response = await api.post(
      `/customers/${customer_id}/vehicles`,
      formData
    );
    return response.data;
  } catch (error) {
    console.error("Error in createCustomer service:", error);
    throw error;
  }
};

export const getVehicle = async (customer_id) => {
  try {
    const response = await api.get(
      `/customers/${customer_id}/vehicles`
    );

    return response.data;
  } catch (error) {
    console.error("Error in createCustomer service:", error);
    throw error;
  }
};


export const getVehicleById = async (vehicleId) => {
  try {
    const response = await api.get(`/vehicles/${vehicleId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching vehicle by ID:', error);
    throw error;
  }
};

export const updateVehicle = async (vehicle_id, vehicleData) => {
  try {
    const response = await api.put(`/vehicles/${vehicle_id}`, vehicleData);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.error ||
      "An error occurred while updating the vehicle."
    );
  }
};

const VehicleService = {
  createVehicle,
  getVehicle,
  getVehicleById
};

export default VehicleService;
