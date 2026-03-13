import React from "react";
import "./home.scss"
import { Link, Links } from "react-router-dom";
const Home = () => {
  return (
    <>
      {/* Announcement Bar */}
      <div className="announcement-bar">
        Helping travelers find safe public rest areas nearby
      </div>

      {/* Navbar / Brand */}
      <div className="home-header">
        <h2 className="brand">Public Rest Area Locator</h2>
      </div>

      {/* Main Content */}
      <div className="home-main">
        <div className="hero">
          <h1>Find Safe Public Rest Areas Around You</h1>
          <p>
            Travelers, delivery workers, tourists, and senior citizens often
            struggle to find safe places to rest. We make those places visible.
          </p>
        </div>

        <div className="actions">
         <Link to={"/findplace"} ><button className="btn primary">Find a Place</button></Link> 
         <Link to={"/add"}><button className="btn secondary">Add a Place</button></Link> 
        </div>
      </div>
    </>
  );
};

export default Home;
