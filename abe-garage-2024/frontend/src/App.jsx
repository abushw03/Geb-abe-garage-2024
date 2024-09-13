import React from "react";
import { Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./Markup/pages/Root/Home/Home";
import Login from "./Markup/pages/Login/Login";
import AddEmployee from "./Markup/pages/Admin/AddEmployee/AddEmployee";
import Header from "./Markup/components/mainHeader/Header";
import Footer from "./Markup/components/footer/Footer";
import ContactUs from "./Markup/pages/Root/ContactUs/ContactUs";

import AboutUs from "./Markup/pages/Root/AboutUs/AboutUs";
import Services from "./Markup/pages/Root/Services/Services";
import { UserProvider } from "./context/UserContext";
import Dashboard from "./Markup/pages/Admin/AdminDashboard/Dashboard";
import AllEmployees from "./Markup/pages/Admin/AllEmployees/AllEmployees";
import UnAuthorized from "./Markup/pages/UnAuthorized/UnAuthorized";
import EditEmployee from "./Markup/pages/Admin/EditEployee/EditEmployee";
import ProtectedRoute from "./routes/protectedRoutes/ProtectedRoutes";
import { ROLES } from "./constants/roles";
import Orders from "./Markup/pages/Admin/Orders/Orders";
import AddCustomer from "./Markup/pages/Admin/AddCustomer/AddCustomer";
import Customers from "./Markup/pages/Admin/Custmers/Customers";
import EditCustomer from "./Markup/pages/Admin/EditCustomer/EditCustomerPage";
import CustomerProfileWrapper from "./Markup/components/Admin/CustomerProfileWrapper/CustomerProfileWrapper";
import CustomerService from "./Markup/pages/Admin/CustomerService/CustomerService";
import EditVehicle from "./Markup/pages/Admin/EditVehicle/EditVehicle";
import OurServices from "./Markup/pages/Admin/OurServices/OurServices";
import EditServicePage from "./Markup/pages/Admin/EditService/EditService";
import EditOrders from "./Markup/pages/Admin/EditOrders/EditOrders";
import OrderDetailPage from "./Markup/pages/Admin/OrderDetailPage/OrderDetailPage";
import AddOrders from "./Markup/pages/Admin/AddOrders/AddOrders";

function AdminLayout() {
  return (
    <Routes>
      <Route path="add-order" element={<AddOrders />} />
      <Route path="step-three" element={<CustomerService />} />
      <Route path="orders" element={<Orders />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="employees" element={<AllEmployees />} />
      <Route path="add-employee" element={<AddEmployee />} />
      <Route path="employees/:employee_id" element={<EditEmployee />} />
      <Route path="add-customer" element={<AddCustomer />} />
      <Route path="customers" element={<Customers />} />
      <Route
        path="services/edit-services/:service_id"
        element={<EditServicePage />}
      />
      <Route
        path="customers/vehicles/:vehicle_id"
        element={<CustomerService />}
      />
      <Route path="services" element={<OurServices />} />
      <Route
        path="customers/edit-customer/:customer_id"
        element={<EditCustomer />}
      />
      <Route
        path="customers/customer-profile/:customer_id"
        element={<CustomerProfileWrapper />}
      />
      <Route
        path="vehicles/edit-vehicle/:vehicle_id"
        element={<EditVehicle />}
      />
    </Routes>
  );
}

function App() {
  return (
    <UserProvider>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute
              allowedRoles={[ROLES.EMPLOYEE, ROLES.ADMIN, ROLES.MANAGER]}
            >
              <Orders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders/edit/:order_hash"
          element={
            <ProtectedRoute
              allowedRoles={[ROLES.EMPLOYEE, ROLES.ADMIN, ROLES.MANAGER]}
            >
              <EditOrders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/orders/view/:order_hash"
          element={<OrderDetailPage />}
        />

        <Route path="/contactus" element={<ContactUs />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/services" element={<Services />} />
        <Route path="/unauthorized" element={<UnAuthorized />} />
      </Routes>
      <Footer />
    </UserProvider>
  );
}

export default App;
