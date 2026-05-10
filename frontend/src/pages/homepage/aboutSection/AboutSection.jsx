import React from "react";
import "./AboutSection.css";

function AboutSection() {
  return (
    <section id="about" className="py-5">
      <div className="container">
        {/* Title */}
        <h1 className="about-title text-center mb-5">
          "Our Digital Library Portal"
        </h1>

        {/* Cards */}
        <div className="row g-4 justify-content-center">
          <div className="col-lg-4 col-md-6 col-12">
            <div className="about-card text-center">
              <i className="fa-solid fa-book-atlas about-icon"></i>
              <h3 className="about-card-title mt-3">
                ✅ Smart Book Management
              </h3>
              <ul className="about-card-list">
                <li>Easily manage issued, returned & reserved books</li>
                <li>Quick search using title, author or category</li>
                <li>Real-time inventory updates</li>
              </ul>
            </div>
          </div>

          <div className="col-lg-4 col-md-6 col-12">
            <div className="about-card text-center">
              <i className="fa-solid fa-handshake about-icon"></i>
              <h3 className="about-card-title mt-3">
                📚 Student-Friendly Portal
              </h3>
              <ul className="about-card-list">
                <li>View & check book availability anytime</li>
                <li>Simple login to track issued books</li>
                <li>Notifications for due dates</li>
              </ul>
            </div>
          </div>

          <div className="col-lg-4 col-md-6 col-12">
            <div className="about-card text-center">
              <i className="fa-solid fa-globe about-icon"></i>
              <h3 className="about-card-title mt-3">
                🌐 Digital Learning Experience
              </h3>
              <ul className="about-card-list">
                <li>Access library anytime, anywhere</li>
                <li>Reduces paperwork & manual work</li>
                <li>Modern and user-friendly interface</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
