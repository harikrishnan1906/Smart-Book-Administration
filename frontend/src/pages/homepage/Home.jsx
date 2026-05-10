import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { DataContext } from "../../context/DataContext";
import "./Home.css";
import HeaderSection from "./headerSection/HeaderSection.jsx";
import HomeSection from "./homeSection/HomeSection.jsx";
import AboutSection from "./aboutSection/AboutSection.jsx";
import RolesSection from "./rolesSection/RolesSection.jsx";
import ExploreSection from "./exploreSection/ExploreSection.jsx";
import FooterSection from "./footerSection/FooterSection.jsx";


function Home() {
  const { token, role } = useContext(DataContext);
  const navigate = useNavigate();

  // Check if token exists, and auto-redirect to respective dashboards
  useEffect(() => {
    if (token && role) {
      if (role === 'admin') navigate('/admin');
      else if (role === 'librarian') navigate('/librarian');
      else if (role === 'staff') navigate('/staff');
      else if (role === 'student') navigate('/student');
    }
  }, [token, role, navigate]);

  return (
    <>
      <HeaderSection />

      <HomeSection />

      <AboutSection/>

      <RolesSection/>
     
      <ExploreSection/>
    
     

      <FooterSection/>
    </>
  );
}

export default Home;
