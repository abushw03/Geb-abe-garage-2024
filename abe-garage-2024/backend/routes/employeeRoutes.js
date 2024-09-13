// Import the express module
const express = require("express");
// Call the router method from express to create the router
const router = express.Router();
// Import the employee controller functions
const {
  createEmployeeHandler,
  getEmployeeHandler,
  updateEmployeeHandler,
  deleteEmployeeHandler,
  getAllEmployeesHandler,
  getEmployeesByRoleHandler,
} = require("../controller/employeeController");

// Create a route to handle the add employee request on POST
router.post("/api/employee", createEmployeeHandler);

// Create a route to get an employee by employee_id on GET
router.get("/api/employees/:employee_id", getEmployeeHandler);
//update employee 
router.put("/api/employees/:employee_id", updateEmployeeHandler);
//delete employee
router.delete("/api/employees/:employee_id", deleteEmployeeHandler);
// Create a route to get all employees on GET
router.get("/api/employees", getAllEmployeesHandler);
// Create a route to get employees by role on GET
router.get("/api/employees/role/employee", getEmployeesByRoleHandler);
// Export the router
module.exports = router;
