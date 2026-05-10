import React from "react";
import "./HomeSection.css";
import homeImage from "../../../assets/homeImage.jpg";
import introImageOne from "../../../assets/introImageOne.jpg";
import introImageTwo from "../../../assets/introImageTwo.jpg";
import introImageThree from "../../../assets/introImageThree.png";
import introImageFour from "../../../assets/introImageFour.jpg";

function HomeSection() {
  return (
    <>
      <section className="home-container">
        <section id="home" className="container my-5">
          <div className="home-wrapper row align-items-center shadow">
            {/* LEFT CONTENT */}
            <div className="col-lg-6 col-md-12 mb-4 mb-lg-0">
              <h1 className="home-title">
                "Discover 1,000+ Books Instantly..."
              </h1>

              <div className="home-description-container">
                <p>
                  Welcome to Department of Information Technology Digital
                  Library –
                </p>
                <p>
                  your gateway to our 1000+ books, seamless search, and instant
                  access.
                </p>
                <p>
                  Track availability, manage borrowings, and explore resources
                  24/7 with
                </p>
                <p>modern, student-friendly platform.</p>
              </div>

              {/* STATS */}
              <div className="d-flex flex-wrap gap-3 mt-4">
                <div className="home-stat-card">
                  <h3>📚 1,000+</h3>
                  <p>Books Available</p>
                </div>

                <div className="home-stat-card">
                  <h3>📖 200</h3>
                  <p>Books Issued</p>
                </div>

                <div className="home-stat-card">
                  <h3>👥 100</h3>
                  <p>Active Members</p>
                </div>
              </div>
            </div>

            {/* RIGHT IMAGE */}
            <div className="col-lg-6 col-md-12 text-center">
              <div className="home-carousel-wrapper">
                <div
                  id="carouselExampleSlidesOnly"
                  className="carousel slide carousel-fade"
                  data-bs-ride="carousel"
                  data-bs-interval="3000"
                >
                  <div className="carousel-inner">
                    <div className="carousel-item active">
                      <img src={homeImage} alt="Library" />
                    </div>
                    <div className="carousel-item">
                      <img src={introImageOne} alt="Books" />
                    </div>
                    <div className="carousel-item">
                      <img src={introImageTwo} alt="Reading" />
                    </div>
                    <div className="carousel-item">
                      <img src={introImageThree} alt="Study" />
                    </div>
                    <div className="carousel-item">
                      <img src={introImageFour} alt="Knowledge" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>
    </>
  );
}

export default HomeSection;
