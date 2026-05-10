import React from "react";
import "./RolesSection.css";

function RolesSection() {
  return (
    
    <section id="roles" className="py-5">
      <div className="container">
        {/* Title */}
        <h1 className="roles-title text-center mb-5">"System Access Levels"</h1>

        {/* Cards */}
        <div className="row g-4 justify-content-center">
          {/* Admin */}
          <div className="col-lg-4 col-md-6 col-12">
            <div className="roles-card text-center">
              <i className="fa-solid fa-user-tie roles-icon"></i>
              <h2 className="roles-card-title mt-3">🧑‍💼 Admin</h2>
              <ul className="roles-card-list">
                <li>Controls overall system and settings</li>
                <li>Manages librarian & student permissions</li>
                <li>Generates reports & monitors inventory</li>
              </ul>
            </div>
          </div>

          {/* Librarian */}
          <div className="col-lg-4 col-md-6 col-12">
            <div className="roles-card text-center">
              <i className="fa-solid fa-book-open roles-icon"></i>
              <h2 className="roles-card-title mt-3">📖 Librarian</h2>
              <ul className="roles-card-list">
                <li>Adds, updates & maintains book records</li>
                <li>Issues, renews & returns books</li>
                <li>Tracks due dates & late returns</li>
              </ul>
            </div>
          </div>

          {/* Student */}
          <div className="col-lg-4 col-md-6 col-12">
            <div className="roles-card text-center">
              <i className="fa-solid fa-graduation-cap roles-icon"></i>
              <h2 className="roles-card-title mt-3">🎓 Student / User</h2>
              <ul className="roles-card-list">
                <li>Searches & views available books</li>
                <li>Requests or reserves books</li>
                <li>Checks issued history & due dates</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default RolesSection;
