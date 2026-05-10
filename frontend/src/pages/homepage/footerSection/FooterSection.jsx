import React from "react";
import "./FooterSection.css";

const FooterSection = () => {
  return (
    <footer className="footer py-5">
      <div className="container">
        {/* Top section */}
        <div className="row gy-4 align-items-start">
          {/* About */}
          <div className="col-lg-4 col-md-6 col-12">
            <h3 className="footer-title">LibraManager</h3>
            <p>
              LibraManager is a smart library management system designed to
              simplify book tracking, user management, and library operations
              efficiently.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-lg-4 col-md-6 col-12">
            <h4 className="footer-title">Quick Links</h4>
            <ul className="footer-links">
              <li>
                <a href="#home">
                  <i className="fa-solid fa-house me-2"></i> Home
                </a>
              </li>
              <li>
                <a href="#about">
                  <i className="fa-solid fa-circle-info me-2"></i> About
                </a>
              </li>
              <li>
                <a href="#roles">
                  <i className="fa-solid fa-user-gear me-2"></i> Roles
                </a>
              </li>
              <li>
                <a href="#explore">
                  <i className="fa-brands fa-wpexplorer me-2"></i> Explore
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-lg-4 col-md-6 col-12">
            <h4 className="footer-title">Contact</h4>
            <p>
              <i className="fa-solid fa-envelope me-2"></i> library@college.edu
            </p>
            <p>
              <i className="fa-solid fa-phone me-2"></i> +91 98765 43210
            </p>
            <p>
              <i className="fa-solid fa-location-dot me-2"></i> Coimbatore,
              Tamil Nadu
            </p>

            {/* Social Media */}
            <div className="social-icons mt-3">
              <a href="#" aria-label="Facebook">
                <i className="fa-brands fa-facebook-f"></i>
              </a>
              <a href="#" aria-label="Twitter">
                <i className="fa-brands fa-x-twitter"></i>
              </a>
              <a href="#" aria-label="Instagram">
                <i className="fa-brands fa-instagram"></i>
              </a>
              <a href="#" aria-label="LinkedIn">
                <i className="fa-brands fa-linkedin-in"></i>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom text-center mt-4 pt-3">
          <p className="mb-0">© 2026 LibraManager. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
