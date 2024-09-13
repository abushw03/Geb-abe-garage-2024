import React from 'react'
import SideBar from '../../../components/Admin/AdminMenu/AdminMenu';
import ServiceList from '../../../components/Admin/ServiceList/ServiceList';
import AddServiceForm from '../../../components/Admin/AddServiceForm/AddServiceForm';
import style from './OurServices.module.css'
function OurServices() {
  return (
    <>
      <div className={style.container}>
        <SideBar />
        <div>
         <ServiceList />
         <AddServiceForm />
        </div>
      </div>
    </>
  );
}

export default OurServices