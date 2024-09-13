
import api from '../utils/axios';

export const addService = async (serviceData) => {
  try {
    const response = await api.post("/services", serviceData);
    return response.data; 
  } catch (error) {
    console.error("Error adding service:", error);
    throw error.response ? error.response.data : error.message; 
  }
};

export const getActiveServices = async () => {
  try {
    const response = await api.get(`/services`);
    return response.data;
  } catch (error) {
    console.error('Error fetching active services:', error);
    throw error;
  }
};


// Fetch services with optional pagination and search query
export const fetchServicesApi = async (page = 1, searchQuery = "") => {
  try {
    const response = await api.get("/services", {
      params: { page, q: searchQuery },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching services:", error);
    throw error;
  }
};

// Delete a service by id
export const deleteService = async (serviceId) => {
  try {
    await api.delete(`/services/${serviceId}`);
  } catch (error) {
    console.error("Error deleting service:", error);
    throw error;
  }
};

export const getServiceById = async (service_id) => {
  try {
    const response = await api.get(`/services/${service_id}`); 
    return response.data.service;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const updateService = async (service_id, serviceData) => {
  try {
    await api.put(`/services/${service_id}`, serviceData); 
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};


export const fetchTotalServices = async (page, limit) => {
  try {
    const response = await api.get(`/services`, {
      params: { page, limit },
    });
    return response.data.services;
  } catch (error) {
    console.error("Error fetching services:", error);
    throw error;
  }
};

