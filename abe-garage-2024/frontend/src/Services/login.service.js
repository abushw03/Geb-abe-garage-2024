const api_url = process.env.REACT_APP_API_URL;
import api from "../utils/axios"
// A function to send the login request to the server
const logIn = async (formData) => {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  };

  const response = api.post(`/employee/login`, requestOptions);
  return response;
}

// A function to log out the user
const logOut = () => {
  localStorage.removeItem("employee");
};


// Export the functions
module.exports = {
  logIn,
  logOut
}
