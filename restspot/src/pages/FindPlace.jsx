import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Link } from "react-router-dom";
import "./FindPlace.scss";

const RecenterMap = ({ location }) => {
  const map = useMap();
  useEffect(() => {
    if (location) map.setView([location.lat, location.lng], 14);
  }, [location, map]);
  return null;
};

const FindPlace = () => {
  const [allPlaces, setAllPlaces]       = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [status, setStatus]             = useState("");

  useEffect(() => {
    setStatus("Loading places...");
    fetch("https://rest-spots-backend.onrender.com/api/places")
      .then((res) => res.json())
      .then((data) => { setAllPlaces(data); setStatus(""); })
      .catch(() => setStatus("Failed to load places."));
  }, []);

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setStatus("Geolocation is not supported by your browser.");
      return;
    }
    setStatus("Fetching your location...");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setStatus("");
      },
      (err) => {
        setStatus(err.code === err.PERMISSION_DENIED
          ? "Location access denied."
          : "Unable to fetch location.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="find-page">

      {/* ── Header ── */}
      <header className="find-header">
        <Link to="/" className="find-header__back">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M19 12H5M5 12l7-7M5 12l7 7"/>
          </svg>
          Back
        </Link>
        <h2 className="find-header__brand">
          Rest<span>Area</span> Locator
        </h2>
        <div className="find-header__spacer" />
      </header>

      {/* ── Main ── */}
      <main className="find-main">
        <div className="find-watermark" aria-hidden="true">FIND</div>

        <div className="find-card">

          {/* Head */}
          <div className="find-card__head">
            <div className="find-card__eyebrow">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                <circle cx="12" cy="9" r="2.5"/>
              </svg>
              Explore
            </div>
            <h1 className="find-card__title">
              Find Public Rest Places
              <em>Near You</em>
            </h1>
            <div className="find-card__rule" />
            <p className="find-card__subtitle">
              Browse verified rest areas on the map or share your location
              to see what's closest to you.
            </p>
          </div>

          {/* Toolbar */}
          <div className="find-toolbar">
            <button className="btn btn--primary" onClick={useMyLocation}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <circle cx="12" cy="12" r="3"/>
                <path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>
                <circle cx="12" cy="12" r="8" strokeDasharray="2 2"/>
              </svg>
              Use My Location
            </button>

            <Link to="/">
              <button className="btn btn--secondary">Back to Home</button>
            </Link>

            {status && <span className="find-status">{status}</span>}
          </div>

          {/* Map */}
          <div className="map-wrap">
            <MapContainer center={[22.3072, 73.1812]} zoom={13} className="map">
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

              {userLocation && (
                <>
                  <RecenterMap location={userLocation} />
                  <Marker position={[userLocation.lat, userLocation.lng]}>
                    <Popup><strong>You are here</strong></Popup>
                  </Marker>
                </>
              )}

              {allPlaces.map((place) => (
                <Marker key={place._id} position={[place.lat, place.lng]}>
                  <Popup>
                    <strong>{place.name}</strong>
                    Type: {place.type}<br />
                    Rest: {place.restType}
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

        </div>
      </main>
    </div>
  );
};

export default FindPlace;