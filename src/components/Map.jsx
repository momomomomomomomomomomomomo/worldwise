import { useNavigate } from "react-router-dom";
import Button from "./Button";
import {
  MapContainer,
  TileLayer,
  Popup,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";

import styles from "./Map.module.css";
import { useEffect, useState } from "react";
import { useCities } from "../contexts/CitiesContext";
import { useGeolocation } from "../hooks/useGeolocation";
import { useUrlPosition } from "../hooks/useUrlPosition";
function Map() {
  const { cities } = useCities();
  const [mapLat, mapLng] = useUrlPosition();
  const {
    isLoading: isLoadingGeolocation,
    position: geoLocationPosition,
    getPosition,
  } = useGeolocation();

  const [citiesPositions, setCitiesPositions] = useState([[40, 0]]);
  useEffect(
    function () {
      if (mapLat !== null && mapLng !== null)
        setCitiesPositions([[mapLat, mapLng]]);
    },
    [mapLat, mapLng]
  );

  useEffect(
    function () {
      if (cities.length)
        setCitiesPositions([
          cities.map((city) => [city.position.lat, city.position.lng]),
        ]);
    },
    [cities]
  );
  useEffect(
    function () {
      if (geoLocationPosition)
        setCitiesPositions([
          [geoLocationPosition.lat, geoLocationPosition.lng],
        ]);
    },
    [geoLocationPosition]
  );
  return (
    <div className={styles.mapContainer}>
      {!geoLocationPosition && (
        <Button type="position" onClick={getPosition}>
          {isLoadingGeolocation ? "Loading..." : "Get your position"}
        </Button>
      )}
      <MapContainer
        className={styles.map}
        center={citiesPositions[0]}
        zoom={6}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {cities.map((city) => (
          <Marker
            key={city.id}
            position={[city.position.lat, city.position.lng]}
          >
            <Popup>
              <span className="emoji">{city.emoji}</span>{" "}
              <span>{city.cityName}</span>
            </Popup>
          </Marker>
        ))}

        <FitBounds positions={citiesPositions} />
        <DetectClick />
      </MapContainer>
    </div>
  );
}
// replacing it with fitBounds
// function ChangeCenter({ position }) {
//   const map = useMap();
//   map.setView(position);
//   return null;
// }
function DetectClick() {
  const navigate = useNavigate();
  useMapEvents({
    click: (e) => navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`),
  });
}
function FitBounds({ positions }) {
  const map = useMap();

  useEffect(
    function () {
      map.fitBounds(positions, {
        maxZoom: map.getZoom(),
      });
    },
    [map, positions]
  );

  return null;
}

export default Map;
