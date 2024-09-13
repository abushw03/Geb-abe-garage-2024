import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./ServiceList.module.css";
import { FaEdit, FaTrashAlt, FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  deleteService,
  fetchServicesApi,
} from "../../../../Services/service.service";

const ServiceList = () => {
  const [services, setServices] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      console.log("Fetching services from the backend...");

      try {
 const response = await fetchServicesApi(currentPage, searchQuery);
        if (response && response.services) {
          setServices(response.services);
          setTotalPages(response.totalPages);
        } else {
          console.error("Unexpected data format received:", response);
        }
      } catch (error) {
        console.error(
          "Error fetching services:",
          error.response ? error.response.data : error.message
        );
      }
    };

    fetchServices();
  }, [currentPage, searchQuery]);

  const handleView = (id) => {
    navigate(`/admin/services`);
  };

  const handleEdit = (id) => {
    navigate(`/admin/services/edit-services/${id}`);
  };

  // Updated handleDelete function with confirmation and backend call
  const handleDelete = async (service_id) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
         await deleteService(service_id);
        // Remove the deleted service from the state
        setServices((prevServices) =>
          prevServices.filter((service) => service.service_id !== service_id)
        );
      } catch (error) {
        console.error("Error deleting service:", error);
      }
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when search query changes
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className={styles.serviceListContainer}>
      <div className={styles.header}>
        <h2 className={styles.sectionTitle}>
          Services we provide <span className={styles.titleUnderline}></span>
        </h2>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search services by their service name..."
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>
      <p>
        We understand the importance of keeping your vehicle in top condition.
        Our comprehensive range of car maintenance and repair services is
        designed to meet the needs of every car owner. From routine oil changes
        and tire rotations to complex engine diagnostics and transmission
        repairs, our skilled technicians use the latest tools and technology to
        ensure your vehicle runs smoothly and safely. We take pride in
        delivering high-quality service with a focus on customer satisfaction,
        offering transparent pricing and honest advice. Whether you need a quick
        fix or a detailed inspection, we're here to provide reliable and
        efficient service that you can trust.
      </p>
      {services.length > 0 ? (
        <>
          {services.map((service) => (
            <div key={service.service_id} className={styles.serviceItem}>
              <div className={styles.serviceInfo}>
                <h4 className={styles.serviceName}>{service.service_name}</h4>
                <p className={styles.serviceDescription}>
                  {service.service_description}
                </p>
              </div>

              <div className={styles.serviceIcons}>
                <FaEye
                  className={styles.icon}
                  onClick={() => handleView(service.service_id)}
                />
                <FaEdit
                  className={styles.icon}
                  onClick={() => handleEdit(service.service_id)}
                />
                <FaTrashAlt
                  className={styles.icon}
                  onClick={() => handleDelete(service.service_id)}
                />
              </div>
            </div>
          ))}

          <div className={styles.pagination}>
            <button
              className={styles.paginationButton}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className={styles.pageNumber}>{currentPage}</span>
            <button
              className={styles.paginationButton}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <p>No services found.</p>
      )}
    </div>
  );
};

export default ServiceList;
