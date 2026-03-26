import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./AddPlace.scss";

const LocationPicker = ({ setLocation }) => {
  useMapEvents({
    click(e) { setLocation(e.latlng); },
  });
  return null;
};

const RecenterMap = ({ location }) => {
  const map = useMap();
  useEffect(() => {
    if (location) map.setView([location.lat, location.lng], 15);
  }, [location, map]);
  return null;
};

const AddPlace = () => {
  const [form, setForm] = useState({
    name: "",
    type: "Temple",
    restType: "Quick",
    confirmPublic: false,
  });

  const [location, setLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState("");
  const [existingPlaces, setExistingPlaces] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");

  const fetchPlaces = () => {
    fetch("https://rest-spots-backend.onrender.com/api/places")
      .then((res) => res.json())
      .then((data) => setExistingPlaces(data))
      .catch((err) => console.error("Fetch error:", err));
  };

  useEffect(() => { fetchPlaces(); }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus("Geolocation is not supported.");
      return;
    }
    setLocationStatus("Getting location...");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationStatus("Location detected.");
      },
      () => setLocationStatus("Permission denied. Select manually.")
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccessMessage("");
    if (!form.confirmPublic) { alert("Please confirm this is a public place."); return; }
    if (!location) { alert("Please select a location."); return; }

    const newPlace = {
      name: form.name,
      type: form.type,
      restType: form.restType,
      lat: location.lat,
      lng: location.lng,
    };

    fetch("https://rest-spots-backend.onrender.com/api/places", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPlace),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to save");
        return data;
      })
      .then(() => {
        setSuccessMessage("Place submitted successfully.");
        setForm({ name: "", type: "Temple", restType: "Quick", confirmPublic: false });
        setLocation(null);
        fetchPlaces();
      })
      .catch((err) => {
        console.error("ERROR:", err);
        alert("Failed to add place");
      });
  };

  return (
    <div className="add-page">

      {/* ── Header ── */}
      <header className="add-header">
        <Link to="/" className="add-header__back">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M19 12H5M5 12l7-7M5 12l7 7"/>
          </svg>
          Back
        </Link>
        <h2 className="add-header__brand">
          Rest<span>Area</span> Locator
        </h2>
        <div className="add-header__spacer" />
      </header>

      {/* ── Page Body ── */}
      <main className="add-main">

        {/* Decorative watermark */}
        <div className="add-watermark" aria-hidden="true">ADD</div>

        <div className="add-card">

          {/* Card Header */}
          <div className="add-card__head">
            <div className="add-card__eyebrow">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="16"/>
                <line x1="8" y1="12" x2="16" y2="12"/>
              </svg>
              Contribute
            </div>
            <h1 className="add-card__title">
              Add a Public<em> Rest Place</em>
            </h1>
            <div className="add-card__rule" />
            <p className="add-card__subtitle">
              Help fellow travelers by marking a verified public rest area on the map.
            </p>
          </div>

          {/* Form */}
          <form className="add-form" onSubmit={handleSubmit}>

            {/* Place Name */}
            <div className="field">
              <label className="field__label" htmlFor="name">Place Name</label>
              <input
                id="name"
                className="field__input"
                required
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Gandhi Park, Central Bus Stand"
              />
            </div>

            {/* Two-col row */}
            <div className="field-row">
              <div className="field">
                <label className="field__label" htmlFor="type">Place Type</label>
                <select id="type" className="field__input field__select" name="type" value={form.type} onChange={handleChange}>
                  <option>Temple</option>
                  <option>Bus Stand</option>
                  <option>Park</option>
                  <option>Samshan</option>
                  <option>Other Public Place</option>
                </select>
              </div>

              <div className="field">
                <label className="field__label" htmlFor="restType">Rest Type</label>
                <select id="restType" className="field__input field__select" name="restType" value={form.restType} onChange={handleChange}>
                  <option>Quick</option>
                  <option>Calm</option>
                </select>
              </div>
            </div>

            {/* Location */}
            <div className="field">
              <label className="field__label">Location</label>
              <button type="button" className="btn-locate" onClick={useMyLocation}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>
                  <circle cx="12" cy="12" r="8" strokeDasharray="2 2"/>
                </svg>
                Use My Current Location
              </button>
              {locationStatus && (
                <p className={`location-status ${locationStatus.includes("detected") ? "location-status--ok" : ""}`}>
                  {locationStatus}
                </p>
              )}
            </div>

            {/* Map */}
            <div className="field">
              <p className="field__map-hint">Or click on the map to pin your location</p>
              <div className="map-wrap">
                <MapContainer center={[22.3072, 73.1812]} zoom={13} className="map">
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <LocationPicker setLocation={setLocation} />
                  <RecenterMap location={location} />
                  {existingPlaces.map((place) => (
                    <Marker key={place._id} position={[place.lat, place.lng]} />
                  ))}
                  {location && <Marker position={[location.lat, location.lng]} />}
                </MapContainer>
              </div>
            </div>

            {/* Checkbox */}
            <label className="checkbox-label">
              <input
                className="checkbox-input"
                type="checkbox"
                name="confirmPublic"
                checked={form.confirmPublic}
                onChange={handleChange}
              />
              <span className="checkbox-box" />
              This is a free, publicly accessible place
            </label>

            {/* Actions */}
            <div className="form-actions">
              <button type="submit" className="btn btn--primary">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M5 13l4 4L19 7"/>
                </svg>
                Submit Place
              </button>
              <Link to="/">
                <button type="button" className="btn btn--secondary">Cancel</button>
              </Link>
            </div>

            {/* Success */}
            {successMessage && (
              <div className="success-msg">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 13l4 4L19 7"/>
                </svg>
                {successMessage}
              </div>
            )}

          </form>
        </div>
      </main>
    </div>
  );
};

export default AddPlace;