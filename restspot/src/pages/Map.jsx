import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import { places } from "../data/places";
const userPlaces =
  JSON.parse(localStorage.getItem("userPlaces")) || [];

const allPlaces = [...places, ...userPlaces];

// Fix default marker icon issue in Leaflet + React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const Map = () => {
  // Default center (Vadodara, Gujarat — change if you want)
  const centerPosition = [22.3072, 73.1812];

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <MapContainer
        center={centerPosition}
        zoom={14}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {allPlaces.map((place) => (
  <Marker key={place.id} position={[place.lat, place.lng]}>
    <Popup>
      <strong>{place.name}</strong>
      <br />
      Type: {place.type}
      <br />
      Rest: {place.restType}
      <br /><br />
      <a
        href={`https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        Navigate
      </a>
    </Popup>
  </Marker>
))}

      </MapContainer>
    </div>
  );
};

export default Map;
