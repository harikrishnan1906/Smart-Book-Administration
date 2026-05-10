import React from "react";
import "./GeneralHeaderPage.css";
import LogoImage from "../../assets/libraryImage.jpg";
import { Link } from "react-router-dom";

function GeneralHeaderPage() {
  return (
    <nav className="navbar navbar-expand-lg general-navbar">
      <div className="container-fluid">
        {/* Logo */}
        <Link to="/" className="navbar-brand d-flex align-items-center">
          <img src={LogoImage} alt="Logo" className="general-logo-image" />
          <span className="general-logo-name">Libra_Manager</span>
        </Link>

       
      </div>
    </nav>
  );
}

export default GeneralHeaderPage;
