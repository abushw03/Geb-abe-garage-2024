
import api from "../utils/axios"


export const createEmployee = async (formData) => {
  try {
    const response = await api.post("/employee/", formData, {
    });

    return response.data;
  } catch (error) {
    console.error("Error in createCustomer service:", error);
    throw error;
  }
};

export const getAllEmployee = async () => {
  try {
    const response = await api.get("/employees");

    return response.data;
  } catch (error) {
    console.error("Error fetching employees:", error);
    throw error;
  }
};
export const fetchEmployees = async () => {
  try {
    const response = await api.get(`/employees/role/employee`);
    console.log("Employees fetched:", response.data.employees); // Log fetched employees
    return response.data.employees;
  } catch (error) {
    console.error("Error fetching employees:", error);
  }
};

export const getSingleEmployee = async (employee_id) => {
  try {
    const response = await api.get(`/employees/${employee_id}`, {
    });
    return response.data;
  } catch (error) {
    console.error("Error in createCustomer service:", error);
    throw error;
  }
};

export const editEmployee = async (employee_id, employeeData) => {
  try {
    const response = await api.put(
      `/employees/${employee_id}`,
      employeeData,
    );

    return response.data;
  } catch (error) {
    console.error("Error in createCustomer service:", error);
    throw error;
  }
};

export const deleteEmployee = async (employee_id) => {
  try {
    const response = await api.delete(
      `/employees/${employee_id}`,
    );

    return response.data;
  } catch (error) {
    console.error("Error in createCustomer service:", error);
    throw error;
  }
};

const EmployeeService = {
  createEmployee,
  getAllEmployee,
  deleteEmployee,
  fetchEmployees,
};

export default EmployeeService;
