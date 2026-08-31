import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Polyline, CircleMarker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// CSS for the page layout (using inline styles for simplicity in boilerplate)
const pageStyle = {
  display: "flex",
  flexDirection: "column",
  height: "100vh",
  width: "100%",
  background: "var(--background-dark)",
  color: "var(--text-primary)",
};

const mapContainerStyle = {
  flexGrow: 1,
  width: "100%",
  position: "relative",
  zIndex: 1, // Keep below navbar
};

const controlsStyle = {
  position: "absolute",
  bottom: "40px",
  left: "50%",
  transform: "translateX(-50%)",
  background: "rgba(20, 40, 35, 0.85)",
  backdropFilter: "blur(10px)",
  padding: "1rem 2rem",
  borderRadius: "16px",
  border: "1px solid rgba(76, 219, 175, 0.3)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "10px",
  zIndex: 1000,
  minWidth: "350px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
};

// --- Mock Data ---
// A mock route through Bangalore, with simulated AQI values at each point
const MOCK_ROUTE = [
  { lat: 12.9716, lng: 77.5946, aqi: 45, time: "08:00 AM" },
  { lat: 12.9725, lng: 77.5955, aqi: 52, time: "08:05 AM" },
  { lat: 12.9735, lng: 77.5962, aqi: 85, time: "08:10 AM" },
  { lat: 12.9748, lng: 77.5950, aqi: 120, time: "08:15 AM" }, // High traffic area
  { lat: 12.9760, lng: 77.5935, aqi: 155, time: "08:20 AM" }, // Spike!
  { lat: 12.9775, lng: 77.5920, aqi: 90, time: "08:25 AM" },
  { lat: 12.9785, lng: 77.5910, aqi: 60, time: "08:30 AM" },
  { lat: 12.9790, lng: 77.5895, aqi: 40, time: "08:35 AM" }, // Park area
];

const DEFAULT_CENTER = [12.9750, 77.5930];

// Helper to color segments based on AQI
function getAqiColor(aqi) {
  if (aqi <= 50) return "#4cdbaf"; // Good (Green)
  if (aqi <= 100) return "#ffd43b"; // Moderate (Yellow)
  if (aqi <= 150) return "#ff922b"; // Unhealthy for Sensitive (Orange)
  if (aqi <= 200) return "#ff6b6b"; // Unhealthy (Red)
  return "#cc5de8"; // Very Unhealthy / Hazardous (Purple)
}

function RecenterMap({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [map, center]);
  return null;
}

export default function LiveMapPage() {
  const [playbackIndex, setPlaybackIndex] = useState(MOCK_ROUTE.length - 1);
  const [isPlaying, setIsPlaying] = useState(false);

  // Playback effect
  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setPlaybackIndex((prev) => {
          if (prev >= MOCK_ROUTE.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1000); // 1 second per step
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  const handlePlayPause = () => {
    if (playbackIndex >= MOCK_ROUTE.length - 1 && !isPlaying) {
      setPlaybackIndex(0); // Restart if at the end
    }
    setIsPlaying(!isPlaying);
  };

  // Generate colored segments up to the current playback index
  const visibleRoute = MOCK_ROUTE.slice(0, playbackIndex + 1);
  const segments = [];
  for (let i = 0; i < visibleRoute.length - 1; i++) {
    const p1 = visibleRoute[i];
    const p2 = visibleRoute[i + 1];
    // Color segment based on the destination point's AQI
    segments.push({
      positions: [[p1.lat, p1.lng], [p2.lat, p2.lng]],
      color: getAqiColor(p2.aqi),
    });
  }

  const currentPoint = visibleRoute[visibleRoute.length - 1];

  return (
    <div style={pageStyle}>
      {/* Spacer for Navbar */}
      <div style={{ height: "70px", flexShrink: 0 }}></div>

      <div style={mapContainerStyle}>
        <MapContainer
          center={DEFAULT_CENTER}
          zoom={15}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <RecenterMap center={currentPoint ? [currentPoint.lat, currentPoint.lng] : DEFAULT_CENTER} />

          {/* Render Route Segments */}
          {segments.map((seg, idx) => (
            <Polyline
              key={idx}
              positions={seg.positions}
              pathOptions={{ color: seg.color, weight: 6, opacity: 0.8 }}
            />
          ))}

          {/* Render Current Position Marker */}
          {currentPoint && (
            <CircleMarker
              center={[currentPoint.lat, currentPoint.lng]}
              radius={8}
              pathOptions={{
                color: "#fff",
                weight: 2,
                fillColor: getAqiColor(currentPoint.aqi),
                fillOpacity: 1,
              }}
            >
              <Popup>
                <div style={{ color: "#333", padding: "5px" }}>
                  <strong>Time:</strong> {currentPoint.time}
                  <br />
                  <strong>AQI:</strong> {currentPoint.aqi}
                </div>
              </Popup>
            </CircleMarker>
          )}
        </MapContainer>

        {/* Floating Playback Controls */}
        <div style={controlsStyle}>
          <div style={{ color: "#fff", fontWeight: "bold", marginBottom: "5px", fontSize: "1.1rem" }}>
            Historical Route Playback
          </div>
          
          <div style={{ display: "flex", alignItems: "center", gap: "15px", width: "100%" }}>
            <button
              onClick={handlePlayPause}
              style={{
                background: "#4cdbaf",
                border: "none",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "#0B2F28",
                fontWeight: "bold",
                fontSize: "18px"
              }}
            >
              {isPlaying ? "⏸" : "▶"}
            </button>
            
            <input
              type="range"
              min="0"
              max={MOCK_ROUTE.length - 1}
              value={playbackIndex}
              onChange={(e) => setPlaybackIndex(Number(e.target.value))}
              style={{ flexGrow: 1, accentColor: "#4cdbaf" }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", width: "100%", fontSize: "0.95rem", color: "rgba(255,255,255,0.8)", marginTop: "5px" }}>
            <span>Start</span>
            <span style={{color: getAqiColor(currentPoint?.aqi), fontWeight: "bold"}}>
              {currentPoint?.time} (AQI: {currentPoint?.aqi})
            </span>
            <span>End</span>
          </div>
        </div>
      </div>
    </div>
  );
}
