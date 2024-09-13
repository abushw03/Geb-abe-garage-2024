// Import the mysql2/promise module to enable working with MySQL databases asynchronously using promises.
const mysql = require("mysql2/promise");
// Import the dotenv module to load environment variables from a .env file into process.env.
require("dotenv").config();

// Define the connection parameters for the MySQL connection pool.
// mysql.createPool creates a pool of connections that can be reused, allowing for better performance with multiple queries.
const dbPoolConnection = mysql.createPool({
  // Hostname of the database server.
  host: "localhost",

  // MySQL username, fetched from environment variables for security purposes.
  user: process.env.USER,

  // MySQL password, also fetched from environment variables to keep it secure.
  password: process.env.PASSWORD,

  // The name of the database to connect to, fetched from environment variables.
  database: process.env.DATABASE,

  // Set the maximum number of connections in the pool to 10.
  connectionLimit: 10,
});

// Export the dbPoolConnection object so it can be used in other parts of the application.
module.exports = dbPoolConnection;
