

import api from "../utils/axios"

export const createCustomer = async (formData) => {
  try {
    const response = await api.post(`/customers/`, formData);
    return response.data;
  } catch (error) {
    console.error("Error in createCustomer service:", error);
    throw error;
  }
};


export const getAllCustomer = async () => {
  try {
    const response = await api.get(`/customers`);
    // console.log("Backend response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in getAllCustomer service:", error);
    throw error;
  }
};

export const getSingleCustomer = async (customer_id) => {
  try {
    const response = await api.get(`/customers/${customer_id}`);
    // console.log("Backend response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in createCustomer service:", error);
    throw error;
  }
};

export const editCustomer = async (customer_id, customerData) => {
  try {
    const response = await api.put(
      `/customers/${customer_id}`,
      customerData
    );
    return response.data;
  } catch (error) {
    console.error("Error in createCustomer service:", error);
    throw error;
  }
};

export const deleteCustomer = async (customer_id) => {
  try {
    const response = await api.delete(
      `/customers/${customer_id}`
    );
    return response.data;
  } catch (error) {
    console.error("Error in createCustomer service:", error);
    throw error;
  }
};
export const getCustomerVehicles = async (customer_id) => {
  try {
    const response = await api.get(`/customers/${customer_id}/vehicles`);
    return response.data;
  } catch (error) {
    console.error("Error in getCustomerVehicles service:", error);
    throw error;
  }
};

export const fetchCustomers = async (page, itemsPerPage) => {
  try {
    const response = await api.get(
      `/customers/?page=${page}&limit=${itemsPerPage}`
    );
    const { data, total } = response.data;
    return {
      customers: Array.isArray(data) ? data : [],
      total,
    };
  } catch (error) {
    console.error("Error fetching customers:", error);
    throw error; 
  }
};

const customerService = {
  createCustomer,
  getAllCustomer,
  editCustomer,
  deleteCustomer,
  getCustomerVehicles,
  fetchCustomers,
};

export default customerService;
