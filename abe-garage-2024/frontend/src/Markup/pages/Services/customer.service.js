import axios from "axios";

const apiUrl = "http://localhost:2030"; // Ensure this matches your backend's base URL

const createCustomer = async (formData) => {
  try {
    const response = await axios.post(`${apiUrl}/api/customers/`, formData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("Backend response:", response.data); // Log backend response
    return response.data;
  } catch (error) {
    console.error("Error in createCustomer service:", error); // Log any error that occurs in the service
    throw error; // Re-throw the error to be caught in the component
  }
};

const customerService = {
  createCustomer,
};

export default customerService;
