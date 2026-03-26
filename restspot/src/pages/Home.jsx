import React from "react";
import "./Home.scss";
import { Link } from "react-router-dom";

const Home = () => {
  const tickerText = "Helping travelers find safe public rest areas nearby";

  return (
    <>
      {/* Announcement Bar — scrolling ticker */}
      <div className="announcement-bar">
        <div className="ticker-inner">
          {[...Array(6)].map((_, i) => (
            <span key={i}>{tickerText}</span>
          ))}
        </div>
      </div>

      {/* Navbar */}
      <header className="home-header">
        <h2 className="brand">
          Rest<span>Area</span> Locator
        </h2>
        <div className="header-badge">Live & updated</div>
      </header>

      {/* Main Content */}
      <main className="home-main">
        <div className="glow-orb glow-orb--teal" />
        <div className="glow-orb glow-orb--amber" />

        <section className="hero">
          <div className="eyebrow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
              <circle cx="12" cy="9" r="2.5"/>
            </svg>
            Public Rest Area Locator
          </div>

          <h1>
            Find Safe Rest Areas
            <em>Near You</em>
          </h1>

          <div className="hero-rule" />

          <p>
            Travelers, delivery workers, tourists, and senior citizens often
            struggle to find safe places to rest. We make those places visible —
            searchable, verified, and always nearby.
          </p>
        </section>

        <div className="actions">
          <Link to="/findplace">
            <button className="btn primary">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21l-4.35-4.35"/>
              </svg>
              Find a Place
            </button>
          </Link>

          <Link to="/add">
            <button className="btn secondary">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="16"/>
                <line x1="8" y1="12" x2="16" y2="12"/>
              </svg>
              Add a Place
            </button>
          </Link>
        </div>

      </main>
    </>
  );
};

export default Home;