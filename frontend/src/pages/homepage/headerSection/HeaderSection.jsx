import React from "react";
import { Link } from "react-router-dom";
import LogoImage from "../../../assets/libraryImage.jpg";
import "./HeaderSection.css";
import AdminLoginModal from "../../loginpage/AdminLoginModal";
import LibrarianLoginModal from "../../loginpage/LibrarianLoginModal";
import StudentLoginModal from "../../loginpage/StudentLoginModal";
import StudentRegisterModal from "../../registerPage/StudentRegisterModal";
import LibrarianRegisterModal from "../../registerPage/LibrarianRegisterModal";
import SupportModal from "../supportSection/SupportModal";
import StaffLoginModal from "../../loginpage/StaffLoginModal";
import StaffRegisterModal from "../../registerPage/StaffRegisterModal";

function HeaderSection() {
  return (
    <>
      {/* Support section modal goes here */}
      <SupportModal />

      {/* Login Modals*/}
      {/* Admin Login Modal goes here */}
      <AdminLoginModal />

      {/* Librarian Login Modal goes here */}
      <LibrarianLoginModal />

      {/* Staff Login Modal goes here */}
      <StaffLoginModal />

      {/* Student Login Modal goes here */}
      <StudentLoginModal />

      {/* Register Modals*/}

      {/* Librarian Register Modal */}
      <LibrarianRegisterModal />

      {/* Staff Register Modal */}
      <StaffRegisterModal/>
      
      {/* Student Register Modal goes here */}
      <StudentRegisterModal />

      {/* header section goes here */}
      <header id="homepage-header">
        <nav className="navbar navbar-expand-lg custom-navbar">
          <div className="container-fluid">
            {/* Logo */}
            <Link className="navbar-brand d-flex align-items-center" to="/">
              <img src={LogoImage} alt="Logo" className="navbar-logo" />
              <span className="navbar-title"></span>
            </Link>

            {/* Toggle button (mobile) */}
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#mainNavbar"
              aria-controls="mainNavbar"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            {/* Collapsible content */}
            <div className="collapse navbar-collapse" id="mainNavbar">
              {/* Middle navigation links */}
              <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <a className="nav-link" href="#home">
                    <i className="fa-regular fa-house"></i> Home
                  </a>
                </li>

                <li className="nav-item">
                  <a className="nav-link" href="#about">
                    <i className="fa-solid fa-circle-info"></i> About
                  </a>
                </li>

                <li className="nav-item">
                  <a className="nav-link" href="#roles">
                    <i className="fa-solid fa-user-gear"></i> Roles
                  </a>
                </li>

                <li className="nav-item">
                  <a className="nav-link" href="#explore">
                    <i className="fa-brands fa-wpexplorer"></i> Explore
                  </a>
                </li>

                <li className="nav-item">
                  <a
                    className="nav-link"
                    data-bs-toggle="modal"
                    data-bs-target="#supportModal"
                    href="#"
                  >
                    <i className="fa-regular fa-envelope"></i> Support
                  </a>
                </li>
              </ul>

              {/* Right buttons */}
              <div className="d-flex gap-2">
                <div className="dropdown">
                  <button
                    className="btn btn-secondary dropdown-toggle custom-btn"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i className="fa-solid fa-right-to-bracket"></i> Login &
                    Register
                  </button>
                  <ul className="dropdown-menu">
                    <li>
                      <a
                        data-bs-toggle="modal"
                        data-bs-target="#adminLoginModal"
                        className="dropdown-item btn"
                        href="#"
                      >
                        <i className="fa-solid fa-user-gear"></i> Admin
                      </a>
                    </li>
                    <li>
                      <a
                        data-bs-toggle="modal"
                        data-bs-target="#librarianLoginModal"
                        className="dropdown-item"
                        href="#"
                      >
                        <i className="fa-solid fa-book-open-reader"></i>{" "}
                        Librarian
                      </a>
                    </li>
                    <li>
                      <a
                        className="dropdown-item"
                        data-bs-toggle="modal"
                        data-bs-target="#staffLoginModal"
                        href="#"
                      >
                        <i className="fa-brands fa-google-scholar"></i> Staff
                      </a>
                    </li>
                    <li>
                      <a
                        className="dropdown-item"
                        data-bs-toggle="modal"
                        data-bs-target="#studentLoginModal"
                        href="#"
                      >
                        <i className="fa-solid fa-graduation-cap"></i> Student
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}

export default HeaderSection;
