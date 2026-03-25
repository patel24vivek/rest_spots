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

/* ---------- Map Helpers ---------- */

const LocationPicker = ({ setLocation }) => {
  useMapEvents({
    click(e) {
      setLocation(e.latlng);
    },
  });
  return null;
};

const RecenterMap = ({ location }) => {
  const map = useMap();

  useEffect(() => {
    if (location) {
      map.setView([location.lat, location.lng], 15);
    }
  }, [location, map]);

  return null;
};

/* ---------- Main Component ---------- */

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

  /* ---------- Fetch places ---------- */

  const fetchPlaces = () => {
    fetch("https://rest-spots-backend.onrender.com/api/places")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched places:", data);
        setExistingPlaces(data);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
      });
  };

  useEffect(() => {
    fetchPlaces();
  }, []);

  /* ---------- Form Handling ---------- */

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus("Geolocation is not supported.");
      return;
    }

    setLocationStatus("Getting location...");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setLocationStatus("Location detected.");
      },
      () => {
        setLocationStatus("Permission denied. Select manually.");
      }
    );
  };

  /* ---------- Submit ---------- */

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccessMessage("");

    if (!form.confirmPublic) {
      alert("Please confirm this is a public place.");
      return;
    }

    if (!location) {
      alert("Please select a location.");
      return;
    }

    const newPlace = {
      name: form.name,
      type: form.type,
      restType: form.restType,
      lat: location.lat,
      lng: location.lng,
    };

    fetch("https://rest-spots-backend.onrender.com/api/places", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPlace),
    })
      .then(async (res) => {
        const data = await res.json();

        console.log("STATUS:", res.status);
        console.log("RESPONSE:", data);

        if (!res.ok) {
          throw new Error(data.message || "Failed to save");
        }

        return data;
      })
      .then((data) => {
        console.log("Saved:", data);

        setSuccessMessage("✅ Place submitted successfully.");

        setForm({
          name: "",
          type: "Temple",
          restType: "Quick",
          confirmPublic: false,
        });

        setLocation(null);

        // 🔥 sync UI with DB
        fetchPlaces();
      })
      .catch((err) => {
        console.error("ERROR:", err);
        alert("❌ Failed to add place");
      });
  };

  /* ---------- UI ---------- */

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto" }}>
      <h2>Add a Public Rest Place</h2>

      <form onSubmit={handleSubmit}>
        <label>Place Name</label>
        <input
          required
          name="name"
          value={form.name}
          onChange={handleChange}
          style={{ width: "100%", marginBottom: 12 }}
        />

        <label>Place Type</label>
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          style={{ width: "100%", marginBottom: 12 }}
        >
          <option>Temple</option>
          <option>Bus Stand</option>
          <option>Park</option>
          <option>samsan</option>
          <option>Other Public Place</option>
        </select>

        <label>Rest Type</label>
        <select
          name="restType"
          value={form.restType}
          onChange={handleChange}
          style={{ width: "100%", marginBottom: 12 }}
        >
          <option>Quick</option>
          <option>Calm</option>
        </select>

        <button type="button" onClick={useMyLocation}>
          📍 Use My Current Location
        </button>

        {locationStatus && (
          <p style={{ marginTop: 8 }}>{locationStatus}</p>
        )}

        <p style={{ margin: "12px 0" }}>Or select on map:</p>

        <MapContainer
          center={[22.3072, 73.1812]}
          zoom={13}
          style={{ height: "300px", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          <LocationPicker setLocation={setLocation} />
          <RecenterMap location={location} />

          {existingPlaces.map((place) => (
            <Marker key={place._id} position={[place.lat, place.lng]} />
          ))}

          {location && (
            <Marker position={[location.lat, location.lng]} />
          )}
        </MapContainer>

        <label style={{ marginTop: 12, display: "block" }}>
          <input
            type="checkbox"
            name="confirmPublic"
            checked={form.confirmPublic}
            onChange={handleChange}
          />
          This is a free public place
        </label>

        <button type="submit" style={{ marginTop: 20 }}>
          Add Place
        </button>

        <Link to="/">
          <button type="button" style={{ marginLeft: 10 }}>
            Back
          </button>
        </Link>
      </form>

      {successMessage && (
        <p style={{ marginTop: 15, color: "green", fontWeight: "bold" }}>
          {successMessage}
        </p>
      )}
    </div>
  );
};

export default AddPlace;