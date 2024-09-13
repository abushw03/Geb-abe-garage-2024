const {
  checkIfEmployeeExists,
  createEmployee,
  getEmployeeById,
  getEmployeeByEmail, // Importing the getEmployeeByEmail function
  updateEmployee,
  deleteEmployee,
  getAllEmployees,
  getEmployeesByRoleName
} = require("../services/employeeServices");

async function createEmployeeHandler(req, res) {
  const {
    employee_email,
    employee_password,
    employee_first_name,
    employee_last_name,
    employee_phone,
    active_employee = 1,
    company_role_name,
    created_by, // Include the created_by field
  } = req.body;

  console.log("createEmployeeHandler: received data", req.body); // Log the data received in the request body

  if (
    !employee_email ||
    !employee_password ||
    !employee_first_name ||
    !employee_last_name ||
    !employee_phone ||
    !company_role_name ||
    !created_by // Validate that created_by is provided
  ) {
    return res.status(400).json({
      error: "All fields are required!",
    });
  }

  // Email format validation
  const emailRegex = /\S+@\S+\.\S+/;
  if (!emailRegex.test(employee_email)) {
    return res.status(400).json({
      error: "Please enter a valid email address.",
    });
  }

  // Password length validation
  if (employee_password.length < 8) {
    return res.status(400).json({
      error: "Password must be at least 8 characters long.",
    });
  }

  try {
    // Check if the employee already exists
    const existingEmployee = await checkIfEmployeeExists(employee_email);

    if (existingEmployee.length > 0) {
      return res.status(409).json({
        error: "Employee with this email already exists.",
      });
    }

    // Proceed with employee creation if the email is not already in use
    const newEmployee = await createEmployee({
      employee_email,
      employee_password,
      employee_first_name,
      employee_last_name,
      employee_phone,
      active_employee,
      company_role_name,
      created_by, // Pass created_by to the service
    });

    console.log("createEmployeeHandler: newEmployee created", newEmployee); // Log the new employee data

    return res.status(201).json({
      status: "true",
      message: "Employee created successfully",
      employee: newEmployee,
    });
  } catch (error) {
    console.error("Error creating employee:", error);
    return res.status(500).json({
      error: "Failed to create the employee. Please try again.",
    });
  }
}


// Get employee by employee_id
async function getEmployeeHandler(req, res) {
  const { employee_id } = req.params; // Get the employee_id from the request parameters
  console.log("Received employee ID:", employee_id); // Debugging log
  const employee = await getEmployeeById(employee_id);
  if (employee.length === 0) {
    return res.status(404).json({
      error: "No Employee found with this employee_id!",
    });
  }
  console.log("Sending employee data:", employee); // Debugging log
  res.status(200).json({
    status: "true",
    message:"Employee found",
    employee: employee,
  });
}

// Get employee by employee_email
async function getEmployeeByEmailHandler(req, res) {
  const { employee_email } = req.params; // Get the employee_email from the request parameters
  const employee = await getEmployeeByEmail(employee_email);
  if (employee.length === 0) {
    return res.status(404).json({
      error: "No Employee found with this email!",
    });
  }

  res.status(200).json({
    status: "true",
    employee: employee[0],
  });
}

// Update employee
async function updateEmployeeHandler(req, res) {
  const { employee_id } = req.params;
  const {
    employee_email,
    employee_password,
    employee_first_name,
    employee_last_name,
    employee_phone,
    company_role_name,
    active_employee,
  } = req.body;

  // Backend validation
  if (
    !employee_email ||
    !employee_password ||
    !employee_first_name ||
    !employee_last_name ||
    !employee_phone ||
    !company_role_name
  ) {
    return res.status(400).json({
      error: "All fields are required!",
    });
  }

  if (employee_password.length < 8) {
    return res.status(400).json({
      error: "Password must be at least 8 characters.",
    });
  }

  const emailRegex = /\S+@\S+\.\S+/;
  if (!emailRegex.test(employee_email)) {
    return res.status(400).json({
      error: "Please enter a valid email address.",
    });
  }

  try {
    const result = await updateEmployee(employee_id, {
      employee_email,
      employee_password,
      employee_first_name,
      employee_last_name,
      employee_phone,
      active_employee,
      company_role_name,
    });

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.status(200).json({
      status: "success",
      message: ` ${employee_first_name} information updated successfully`,
    });
  } catch (error) {
    console.error("Error updating employee:", error);
    res.status(500).json({ error: "Failed to update employee" });
  }
}

// Delete employee
async function deleteEmployeeHandler(req, res) {
  const { employee_id } = req.params;

  try {
    const result = await deleteEmployee(employee_id);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.status(200).json({
      status: "success",
      message: `Employee with ID ${employee_id} deleted successfully`,
    });
  } catch (error) {
    console.error("Error deleting employee:", error);
    res.status(500).json({ error: `Failed to delete this employee ` });
  }
}

// Get all employees
async function getAllEmployeesHandler(req, res) {
  const employees = await getAllEmployees();

  if (employees.length === 0) {
    return res.status(404).json({
      error: "No employees found!",
    });
  }

  res.status(200).json({
    status: "true",
    employees: employees,
  });
}

// Controller function to fetch employees with the role "Employee"
async function getEmployeesByRoleHandler(req, res) {
  try {
    const roleName = "Employee"; // Hardcoded role to fetch employees
    const employees = await getEmployeesByRoleName(roleName);

    if (employees.length === 0) {
      return res.status(404).json({
        error: "No employees with the role 'Employee' found!",
      });
    }

    return res.status(200).json({
      status: "true",
      employees: employees,
    });
  } catch (error) {
    console.error("Error fetching employees with role 'Employee':", error);
    return res.status(500).json({
      error: "Failed to fetch employees with role 'Employee'.",
    });
  }
}
module.exports = {
  createEmployeeHandler,
  getEmployeeHandler,
  getEmployeeByEmailHandler, // Exporting the getEmployeeByEmailHandler function
  updateEmployeeHandler,
  deleteEmployeeHandler,
  getAllEmployeesHandler,
  getEmployeesByRoleHandler,
};
