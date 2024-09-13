import React from "react";
import AdminMenu from "../../../components/Admin/AdminMenu/AdminMenu";
import AddCustomerForm from "../../../components/Admin/AddCustomerForm/AddCustomer";
import style from  "./AddCustomer.module.css"; // Import the CSS

const AddCustomer = () => {
  return (
      <div className={style.container}>
            <AdminMenu />
          <AddCustomerForm />
 
    </div>
  );
};

export default AddCustomer;
