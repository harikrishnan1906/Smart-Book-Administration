import React from "react";
import "./ExploreSection.css";
import { Link } from "react-router-dom";

function ExploreSection() {
  return (
    <section id="explore" className="py-5">
      <div className="container explore-wrapper text-center">
        {/* Title */}
        <h1 className="explore-title mb-3">"Explore Our Features"</h1>

        <p className="explore-description mx-auto mb-5">
          Browse through the tools and options available in our library portal.
          Whether you're a student or librarian, you can easily navigate, search
          books, manage records, and stay updated.
        </p>

        {/* Cards */}
        <div className="row g-4 justify-content-center mb-5">
          <div className="col-lg-5 col-md-6 col-12">
            <div className="explore-card">
              <h3 className="explore-card-title">
                <i className="fa-solid fa-magnifying-glass"></i> Search Books
                Online
              </h3>
              <ul>
                <li>Find books by title, author, or subject</li>
                <li>Quick filters for easy search</li>
                <li>Instant search suggestions</li>
              </ul>
            </div>
          </div>

          <div className="col-lg-5 col-md-6 col-12">
            <div className="explore-card">
              <h3 className="explore-card-title">
                <i className="fa-solid fa-database"></i> Track Borrowed Books
              </h3>
              <ul>
                <li>View due dates and returned history</li>
                <li>Receive reminders for overdue books</li>
                <li>Keeps your reading organized</li>
              </ul>
            </div>
          </div>

          <div className="col-lg-5 col-md-6 col-12">
            <div className="explore-card">
              <h3 className="explore-card-title">
                <i className="fa-regular fa-hand"></i> Reserve & Request Books
              </h3>
              <ul>
                <li>Reserve books when all copies are issued</li>
                <li>Request approval from librarian</li>
                <li>Notification when book becomes available</li>
              </ul>
            </div>
          </div>

          <div className="col-lg-5 col-md-6 col-12">
            <div className="explore-card">
              <h3 className="explore-card-title">
                <i className="fa-solid fa-book-open"></i> View Library Updates
              </h3>
              <ul>
                <li>Check new arrivals & announcements</li>
                <li>Library timings & holiday info</li>
                <li>Stay informed anytime</li>
              </ul>
            </div>
          </div>
        </div>

        
      </div>
    </section>
  );
}

export default ExploreSection;
