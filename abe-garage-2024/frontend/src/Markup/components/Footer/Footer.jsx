// Import React to create a functional component.
import React from "react";

// Import CSS module for styling the footer component.
import styles from "./footer.module.css";

// Import icons from react-icons library.
import { SiMinutemailer } from "react-icons/si";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaTwitter,
  FaGooglePlusG,
} from "react-icons/fa";

// Define the Footer functional component.
const Footer = () => {
  return (
    <footer className={styles.mainFooter}>
      {/* Upper Box: Contains the contact information. */}
      <div className={styles.upperBox}>
        <div className={styles.container}>
          <div className={styles.row}>
            {/* Footer Info Box: Address */}
            <div className={`${styles.footerInfoBox} ${styles.col}`}>
              <div className={styles.infoInner}>
                <div className={styles.content}>
                  <div className={styles.icon}>
                    <span className="flaticon-pin"></span>{" "}
                    {/* Placeholder icon class */}
                  </div>
                  <div className={styles.text}>
                    54B, Tailstoi Town 5238 MT,
                    <br />
                    La city, IA 522364
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Info Box: Email */}
            <div className={`${styles.footerInfoBox} ${styles.col}`}>
              <div className={styles.infoInner}>
                <div className={styles.content}>
                  <div className={styles.icon}>
                    <span className="flaticon-email"></span>{" "}
                    {/* Placeholder icon class */}
                  </div>
                  <div className={styles.text}>
                    Email us :<br />
                    <a href="mailto:gebrye.gizaw@gmail.com">
                      info@gebrye.gizaw@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Info Box: Phone */}
            <div className={`${styles.footerInfoBox} ${styles.col}`}>
              <div className={styles.infoInner}>
                <div className={styles.content}>
                  <div className={styles.icon}>
                    <span className="flaticon-phone"></span>{" "}
                    {/* Placeholder icon class */}
                  </div>
                  <div className={styles.text}>
                    Call us on :<br />
                    <strong>+ 1800 456 7890</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Widgets Section: Contains additional information and links. */}
      <div className={styles.widgetsSection}>
        <div className={styles.container}>
          <div className={styles.widgetsInnerContainer}>
            <div className={styles.row}>
              {/* Footer Column - About: Brief description of the company. */}
              <div className={`${styles.footerColumn} ${styles.col}`}>
                <div className={styles.widgetAbout}>
                  <div className={styles.text}>
                    Capitalize on low hanging fruit to identify a ballpark value
                    added activity to beta test. Override the digital divide
                    additional clickthroughs.
                  </div>
                </div>
              </div>

              {/* Footer Column - Links: Useful links and services. */}
              <div className={`${styles.footerColumn} ${styles.col}`}>
                <div className={styles.row}>
                  <div className={styles.col}>
                    <div className={styles.widgetLinks}>
                      <h4 className={styles.widgetTitle}>Useful Links</h4>
                      <ul className={styles.list}>
                        <li>
                          <a href="/">Home</a>
                        </li>
                        <li>
                          <a href="/aboutus">About Us</a>
                        </li>
                        <li>
                          <a href="#">Appointment</a>
                        </li>
                        <li>
                          <a href="#">Testimonials</a>
                        </li>
                        <li>
                          <a href="contactus">Contact Us</a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className={styles.col}>
                    <div className={styles.widgetLinks}>
                      <h4 className={styles.widgetTitle}>Our Services</h4>
                      <ul className={styles.list}>
                        <li>
                          <a href="#">Performance Upgrade</a>
                        </li>
                        <li>
                          <a href="#">Transmission Service</a>
                        </li>
                        <li>
                          <a href="#">Break Repair & Service</a>
                        </li>
                        <li>
                          <a href="#">Engine Service & Repair</a>
                        </li>
                        <li>
                          <a href="#">Tyre & Wheels</a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Column - Newsletter: Subscription form and social media links. */}
              <div className={`${styles.footerColumn} ${styles.col}`}>
                <div className={styles.widgetNewsletter}>
                  <h4 className={styles.widgetTitle}>Newsletter</h4>
                  <div className={styles.text}>
                    Get latest updates and offers.
                  </div>
                  <div className={styles.newsletterForm}>
                    <form className={styles.SubForm} method="post">
                      <div className={styles.formGroup}>
                        <input
                          type="email"
                          placeholder="Enter your email"
                          id="subscription-email"
                        />
                        <button className={styles.themeBtn} type="submit">
                          <SiMinutemailer />{" "}
                          {/* Email icon for the submit button */}
                        </button>
                        <label
                          className={styles.subscriptionLabel}
                          htmlFor="subscription-email"
                        ></label>
                      </div>
                    </form>
                    {/* Social Links: Icons for social media platforms. */}
                    <div className={styles.socialLinks}>
                      <a href="#">
                        <FaFacebookF /> {/* Facebook icon */}
                      </a>
                      <a href="#">
                        <FaLinkedinIn /> {/* LinkedIn icon */}
                      </a>
                      <a href="#">
                        <FaTwitter /> {/* Twitter icon */}
                      </a>
                      <a href="#">
                        <FaGooglePlusG /> {/* Google Plus icon */}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom: Copyright and creator credits. */}
      <div className={styles.footerBottom}>
        <div className={styles.copyrightText}>
          © Copyright <a href="#">AbyssiniaCoders.com</a> 2024. All right reserved.
        </div>
        <div className={styles.text}>
          Created by <a href="#">Abyssinia Coders</a>
        </div>
      </div>
    </footer>
  );
};

// Export the Footer component for use in other parts of the application.
export default Footer;
