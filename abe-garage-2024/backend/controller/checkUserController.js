const { getEmployeeById } = require("../services/employeeServices");

async function checkEmployeeHandler(req, res) {
  try {
    // Assuming the decoded token contains the employee_id
    const employeeId = req.employee.employee_id;

    // Fetch the employee details by ID
    const employee = await getEmployeeById(employeeId);

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    // Respond with the employee's details
    return res.status(200).json({
      status: "success",
      employee: {
        employee_first_name: employee.employee_first_name,
        employee_email: employee.employee_email,
        company_role_name: employee.company_role_name,
        // Add other necessary fields here
      },
    });
  } catch (error) {
    console.error("Error checking employee:", error.message);
    return res.status(500).json({ error: error.message });
  }
}

module.exports = {
  checkEmployeeHandler,
};
