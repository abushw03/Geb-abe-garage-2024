// Import the query function from the db.config.js file
const conn = require("../config/database");
// Import the bcrypt module
const bcrypt = require("bcrypt");

// A function to check if employee exists in the database
async function checkIfEmployeeExists(employee_email) {
  const query = `SELECT * FROM employee WHERE employee_email = ?`;
  const [rows] = await conn.query(query, [employee_email]);
  return rows.length > 0;
}

async function createEmployee({
  employee_email,
  employee_password,
  employee_first_name,
  employee_last_name,
  employee_phone,
  active_employee,
  company_role_name,
  created_by,
}) {
  try {
    const hashedPassword = await bcrypt.hash(employee_password, 10);

    await conn.query("START TRANSACTION");

    const [result] = await conn.query(
      `INSERT INTO employee (employee_email, active_employee, added_date, created_by)
       VALUES (?, ?, NOW(), ?)`,
      [employee_email, active_employee, created_by]
    );

    const employee_id = result.insertId;

    await conn.query(
      `INSERT INTO employee_info (employee_id, employee_first_name, employee_last_name, employee_phone)
       VALUES (?, ?, ?, ?)`,
      [employee_id, employee_first_name, employee_last_name, employee_phone]
    );

    await conn.query(
      `INSERT INTO employee_pass (employee_id, employee_password_hashed)
       VALUES (?, ?)`,
      [employee_id, hashedPassword]
    );

    const [roleResult] = await conn.query(
      `SELECT company_role_id FROM company_roles WHERE company_role_name = ?`,
      [company_role_name]
    );

    if (roleResult.length === 0) {
      throw new Error("Invalid role name provided.");
    }

    const company_role_id = roleResult[0].company_role_id;

    await conn.query(
      `INSERT INTO employee_role (employee_id, company_role_id)
       VALUES (?, ?)`,
      [employee_id, company_role_id]
    );

    await conn.query("COMMIT");

    return {
      employee_id,
      employee_email,
      employee_first_name,
      employee_last_name,
      employee_phone,
      active_employee,
      company_role_name,
      created_by, // Return created_by in the response
    };
  } catch (error) {
    await conn.query("ROLLBACK");
    console.error("Error creating employee:", error);
    throw error;
  }
}

// A function to get employee by employee_id
async function getEmployeeById(employee_id) {
  const query = `
    SELECT 
      employee.employee_id, 
      employee.employee_email, 
      employee_info.employee_first_name,
      employee_info.employee_last_name,
      employee_info.employee_phone,
      company_roles.company_role_name,
      employee.active_employee
    FROM 
      employee 
    INNER JOIN 
      employee_info ON employee.employee_id = employee_info.employee_id
    INNER JOIN 
      employee_role ON employee.employee_id = employee_role.employee_id
    INNER JOIN 
      company_roles ON employee_role.company_role_id = company_roles.company_role_id
    WHERE 
      employee.employee_id = ?`;

  try {
    const [rows] = await conn.query(query, [employee_id]);
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error("Error executing query:", error.message);
    throw error;
  }
}
// Function to get employee by email
async function getEmployeeByEmail(employee_email) {
  const query = `
    SELECT 
      employee.employee_id, 
      employee.employee_email, 
      employee_info.employee_first_name,
      employee_info.employee_last_name,
      employee_pass.employee_password_hashed,
      company_roles.company_role_name
    FROM 
      employee 
    INNER JOIN 
      employee_info ON employee.employee_id = employee_info.employee_id
    INNER JOIN 
      employee_pass ON employee.employee_id = employee_pass.employee_id
    INNER JOIN
      employee_role ON employee.employee_id = employee_role.employee_id
    INNER JOIN
      company_roles ON employee_role.company_role_id = company_roles.company_role_id
    WHERE 
      employee.employee_email = ?`; // Use the correct placeholder for employee_email

  try {
    const [rows] = await conn.query(query, [employee_email]); // Ensure the email is passed as a parameter
    return rows;
  } catch (error) {
    console.error("Error executing query:", error.message);
    throw error;
  }
}



async function updateEmployee(employee_id, employeeData) {
  const query = `
    UPDATE employee
    INNER JOIN employee_info ON employee.employee_id = employee_info.employee_id
    INNER JOIN employee_role ON employee.employee_id = employee_role.employee_id
    SET
      employee.employee_email = ?,
      employee_info.employee_first_name = ?,
      employee_info.employee_last_name = ?,
      employee_info.employee_phone = ?,
      employee.active_employee = ?,
      employee_role.company_role_id = (
        SELECT company_roles.company_role_id 
        FROM company_roles 
        WHERE company_roles.company_role_name = ?
      )
    WHERE employee.employee_id = ?`;

  const {
    employee_email,
    employee_first_name,
    employee_last_name,
    employee_phone,
    active_employee,
    company_role_name,
  } = employeeData;

  const [result] = await conn.query(query, [
    employee_email,
    employee_first_name,
    employee_last_name,
    employee_phone,
    active_employee,
    company_role_name,
    employee_id,
  ]);

  return result;
}

// Delete employee function
async function deleteEmployee(employee_id) {
  try {
    // Start a transaction since we're deleting from multiple tables
    await conn.query("START TRANSACTION");

    // Delete from dependent tables first
    await conn.query("DELETE FROM employee_pass WHERE employee_id = ?", [
      employee_id,
    ]);
    await conn.query("DELETE FROM employee_info WHERE employee_id = ?", [
      employee_id,
    ]);
    await conn.query("DELETE FROM employee_role WHERE employee_id = ?", [
      employee_id,
    ]);

    // Finally, delete from the employee table
    const [result] = await conn.query(
      "DELETE FROM employee WHERE employee_id = ?",
      [employee_id]
    );

    // Commit the transaction
    await conn.query("COMMIT");

    return result;
  } catch (error) {
    // Rollback the transaction in case of error
    await conn.query("ROLLBACK");
    throw error;
  }
}

// A function to get all employees
async function getAllEmployees() {
  const query =
    "SELECT * FROM employee INNER JOIN employee_info ON employee.employee_id = employee_info.employee_id INNER JOIN employee_role ON employee.employee_id = employee_role.employee_id INNER JOIN company_roles ON employee_role.company_role_id = company_roles.company_role_id ORDER BY employee.added_date DESC limit 7";
  const rows = await conn.query(query);
  return rows;
}

// Function to get employees by role name
async function getEmployeesByRoleName(roleName) {
  const query = `
    SELECT 
      employee.employee_id, 
      employee.employee_email, 
      employee_info.employee_first_name,
      employee_info.employee_last_name,
      employee_info.employee_phone,
      company_roles.company_role_name,
      employee.active_employee
    FROM 
      employee 
    INNER JOIN 
      employee_info ON employee.employee_id = employee_info.employee_id
    INNER JOIN 
      employee_role ON employee.employee_id = employee_role.employee_id
    INNER JOIN 
      company_roles ON employee_role.company_role_id = company_roles.company_role_id
    WHERE 
      company_roles.company_role_name = ?
    ORDER BY employee.added_date DESC`;

  try {
    const [rows] = await conn.query(query, [roleName]);
    return rows;
  } catch (error) {
    console.error("Error fetching employees by role:", error.message);
    throw error;
  }
}
// Export the functions for use in the controller
module.exports = {
  checkIfEmployeeExists,
  createEmployee,
  getEmployeeById,
  getEmployeeByEmail, // Newly added function
  updateEmployee,
  deleteEmployee,
  getAllEmployees,
  getEmployeesByRoleName,
};
