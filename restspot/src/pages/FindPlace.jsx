import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Link } from "react-router-dom";

const RecenterMap = ({ location }) => {
  const map = useMap();

  useEffect(() => {
    if (location) {
      map.setView([location.lat, location.lng], 14);
    }
  }, [location, map]);

  return null;
};

const FindPlace = () => {
  const [allPlaces, setAllPlaces] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [status, setStatus] = useState("");

  // Fetch places from backend
  useEffect(() => {
    setStatus("Loading places...");

    fetch("http://localhost:5000/api/places")
      .then((res) => res.json())
      .then((data) => {
        setAllPlaces(data);
        setStatus(""); // ✅ clear status
      })
      .catch(() => {
        setStatus("Failed to load places");
      });
  }, []);

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setStatus("Geolocation is not supported by your browser.");
      return;
    }

    setStatus("Fetching your location...");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setStatus(""); // ✅ clear status after success
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setStatus("Location access denied.");
        } else {
          setStatus("Unable to fetch location.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      }
    );
  };

  return (
    <div style={{ maxWidth: "900px", margin: "30px auto" }}>
      <h2>Find Public Rest Places</h2>

      <button onClick={useMyLocation} style={{ marginBottom: 10 }}>
        📍 Use My Current Location
      </button>

      <Link to="/">
        <button style={{ marginLeft: 10, marginBottom: 10 }}>
          Back to Home
        </button>
      </Link>

      {status && <p style={{ fontSize: 14 }}>{status}</p>}

      <MapContainer
        center={[22.3072, 73.1812]}
        zoom={13}
        style={{ height: "450px", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {userLocation && (
          <>
            <RecenterMap location={userLocation} />
            <Marker position={[userLocation.lat, userLocation.lng]}>
              <Popup>You are here</Popup>
            </Marker>
          </>
        )}

        {allPlaces.map((place) => (
          <Marker
            key={place._id}
            position={[place.lat, place.lng]}
          >
            <Popup>
              <strong>{place.name}</strong>
              <br />
              Type: {place.type}
              <br />
              Rest: {place.restType}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default FindPlace;
