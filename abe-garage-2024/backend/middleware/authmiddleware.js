const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");

// Middleware function to handle authentication by verifying the JWT token.
const authMiddleware = async (req, res, next) => {
  // Extract the authorization header from the incoming request.
  const authHeader = req.headers.authorization;

  // Check if the authorization header exists and starts with "Bearer ".
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: "Authentication invalid" });
  }

  // Extract the token from the authorization header by splitting it at the space.
  const token = authHeader.split(" ")[1];

  try {
    // Verify the token using the JWT secret key.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Extract the email and id from the decoded token and assign them to the request object.
    const { email: employee_email, id: employee_id } = decoded;
    req.employee = { employee_email, employee_id };

    // Call the next middleware function in the stack.
    next();
  } catch (error) {
    // Log the error for debugging purposes.
    console.error("JWT Verification Error:", error.message);

    // If verification fails, respond with a 401 Unauthorized status and an error message.
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: "You're not authorized" });
  }
};

// Export the middleware function so it can be used in other parts of the application.
module.exports = authMiddleware;
