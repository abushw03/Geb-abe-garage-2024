// Import the express module to create the Express application.
const express = require("express");

// Load environment variables from the .env file into process.env.
require("dotenv").config();

// Initialize an instance of an Express application.
const app = express();

// Import the cors module to enable Cross-Origin Resource Sharing.
const cors = require("cors");

// Import the express-rate-limit module to limit the number of requests from a single IP.
const rateLimit = require("express-rate-limit");

// Middleware to parse incoming JSON requests and automatically populate req.body.
app.use(express.json());

// Enable CORS for all routes, allowing cross-origin requests.
app.use(cors());

// Apply rate limiting to all routes to prevent abuse.
// Limit each IP to 200 requests per 5-minute window.
app.use(
  rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 200, // Maximum 200 requests per IP per windowMs
    message: "Too many requests from this IP, please try again after 5 minutes", // Message sent when limit is reached
  })
);

// Import user-related routes from the userRoutes module.
const userRoutes = require("./routes");

// Import the database connection pool to interact with the MySQL database.
const dbPoolConnection = require("./config/database");

// Use the userRoutes for all routes under the /api/employee path.
app.use(userRoutes); // Ensure the path starts with a leading slash

// Asynchronous function to start the server and test the database connection.
async function starter() {
  try {
    // Execute a test query to ensure the database connection is working.
    await dbPoolConnection.execute("SELECT 'test Approved'");

    // Start the server on the specified port (from .env) or default to port 3000.
    await app.listen(process.env.PORT || 3000);

    // Log a message indicating that the database connection is established.
    console.log(`Your Database connection is established`);

    // Log a message indicating that the server is listening on the specified port.
    console.log(`Your server is listening @ port Number ${process.env.PORT}`);
  } catch (err) {
    // If an error occurs, log the error message.
    console.log(err.message);
  }
}

// Call the starter function to initiate the server and database connection.
starter();
