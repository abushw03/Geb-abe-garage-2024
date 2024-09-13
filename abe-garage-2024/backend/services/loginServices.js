const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { getEmployeeByEmail } = require("../services/employeeServices");

async function logIn(employee_email, password) {
  try {
    const employee = await getEmployeeByEmail(employee_email);

    if (employee.length === 0) {
      throw new Error("No User found with this email & password");
    }

    const hashedPassword = employee[0].employee_password_hashed;
    const isMatch = await bcrypt.compare(password, hashedPassword);

    if (!isMatch) {
      throw new Error("Invalid Password");
    }

    // Generate a JWT token with employee_email and employee_id
    const token = jwt.sign(
      {
        email: employee[0].employee_email,
        id: employee[0].employee_id,
        role: employee[0].company_role_name,
        employee_id: employee[0].employee_id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Return the employee data including first name, last name, email, role, and the token
    return {
      employee_id: employee[0].employee_id,
      employee_first_name: employee[0].employee_first_name,
      employee_last_name: employee[0].employee_last_name, // Added employee_last_name
      employee_email: employee[0].employee_email,
      role: employee[0].company_role_name,
      token,
    };
  } catch (error) {
    console.error("Error during login:", error.message);
    throw error;
  }
}

module.exports = {
  logIn,
};
