import React from "react";
import "./GeneralFooterPage.css";
import { Link } from "react-router-dom";

const GeneralFooterPage = () => {
  return (
    <footer className="general-footer py-5">
      <div className="container">
        {/* Top content */}
        <div className="row gy-4 align-items-center">
          {/* About */}
          <div className="col-lg-4 col-md-6 col-12">
            <h3 className="general-footer-title">LibraManager</h3>
            <p>
              LibraManager is a smart library management system designed to
              simplify book tracking, user management, and library operations
              efficiently.
            </p>
          </div>

          {/* Contact */}
          <div className="col-lg-4 col-md-6 col-12">
            <h4 className="general-footer-title">Contact</h4>
            <p>Email: library@college.edu</p>
            <p>Phone: +91 98765 43210</p>
            <p>Location: Coimbatore, Tamil Nadu</p>
          </div>

        
        </div>

        {/* Bottom bar */}
        <div className="general-footer-bottom text-center mt-4 pt-3">
          <p>© 2026 LibraManager. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default GeneralFooterPage;
