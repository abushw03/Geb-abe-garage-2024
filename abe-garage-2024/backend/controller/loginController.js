const { logIn } = require("../services/loginServices");

async function logInHandler(req, res) {
  try {
    const { employee_email, employee_password } = req.body;

    if (!employee_email || !employee_password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const employee = await logIn(employee_email, employee_password);

    return res.status(200).json({
      status: "success",
      employee: {
        employee_id: employee.employee_id,
        employee_first_name: employee.employee_first_name,
        employee_last_name: employee.employee_last_name, // Include last name in response
        employee_email: employee.employee_email,
        role: employee.role,
        token: employee.token,
      },
    });
  } catch (error) {
    console.error("Error during login:", error.message);
    return res.status(500).json({ error: error.message });
  }
}

module.exports = {
  logInHandler,
};
