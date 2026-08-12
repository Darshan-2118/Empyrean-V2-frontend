import { useState, useRef, useEffect } from "react";
import {
  Wind, Search, Bell, ChevronDown, User, Users, LogOut, Settings, Cpu,
  LayoutDashboard, Map as MapIcon, BarChart3, Activity, AlertTriangle, CheckCircle,
  Battery, RefreshCw, Info, Droplets, Thermometer, Gauge
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
import { MapContainer, TileLayer, Popup, CircleMarker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./EmpyreanDashboardLayout.css";
import {
  getSession, subscribeToAuth, getLatestReadings, getHistory, getForecast,
  getProfile, updateProfile, changePassword,
} from "../api.js";

// ---------------------------------------------------------------------------
// Live-data helpers
// ---------------------------------------------------------------------------

const iso = (d) => d.toISOString();
const hoursAgo = (hours) => new Date(Date.now() - hours * 3600 * 1000);

/** Map an AQI value to a color + human label per the standard 0–500 scale. */
function aqiStyle(aqi) {
  if (aqi == null) return { color: "#94a3b8", label: "No data" };
  if (aqi <= 50) return { color: "#4cdbaf", label: "Good" };
  if (aqi <= 100) return { color: "#fbbf24", label: "Moderate" };
  if (aqi <= 150) return { color: "#ff9f43", label: "Unhealthy (Sensitive)" };
  if (aqi <= 200) return { color: "#ff6b6b", label: "Unhealthy" };
  if (aqi <= 300) return { color: "#c084fc", label: "Very Unhealthy" };
  return { color: "#ad4444", label: "Hazardous" };
}

/**
 * Placeholder node coordinates until the /nodes endpoint (which carries
 * lat/lng) is implemented — see docs/frontend-integration.md §4. A stable hash
 * of the node id scatters markers around the city centre deterministically.
 */
const CITY_CENTER = [12.9716, 77.5946];
function nodeCoords(nodeId) {
  const hash = String(nodeId).split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const dx = (((hash * 37) % 100) - 50) / 9000;
  const dy = (((hash * 71) % 100) - 50) / 9000;
  return [CITY_CENTER[0] + dy, CITY_CENTER[1] + dx];
}

/** Poll GET /readings/latest every 5s (docs §4: ~12 req/min, under 200 cap). */
function useLatestReadings() {
  const [readings, setReadings] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    let timer;
    async function poll() {
      try {
        const data = await getLatestReadings();
        if (!active) return;
        setReadings(data.readings || []);
        setError("");
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active) timer = setTimeout(poll, 5000);
      }
    }
    poll();
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, []);
  return { readings, error };
}

function useHistory({ bucket = "1h", hours = 24, node_id } = {}) {
  const [buckets, setBuckets] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    setLoading(true);
    getHistory({ from: iso(hoursAgo(hours)), to: iso(new Date()), bucket, node_id })
      .then((d) => { if (active) setBuckets(d.buckets || []); })
      .catch(() => { if (active) setBuckets([]); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [bucket, hours, node_id]);
  return { buckets, loading };
}

function useForecast(node_id) {
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!node_id) return;
    let active = true;
    setLoading(true);
    getForecast(node_id)
      .then((d) => { if (active) setPoints(d.points || []); })
      .catch(() => { if (active) setPoints([]); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [node_id]);
  return { points, loading };
}

const fmt = (n) => (n === null || n === undefined || Number.isNaN(n) ? "—" : Number(n).toFixed(1));

// ---------------------------------------------------------------------------
// Small presentational pieces
// ---------------------------------------------------------------------------

function Tooltip({ label, children, position = "bottom" }) {
  return (
    <div className={`tooltip ${position === "right" ? "tooltip--right" : ""}`}>
      {children}
      <span className="tooltip__label">{label}</span>
    </div>
  );
}

function IconRailButton({ icon: Icon, label, active, onClick, isOpen }) {
  const content = (
    <button
      onClick={onClick}
      aria-label={label}
      className={`rail-btn ${active ? "rail-btn--active" : ""} ${isOpen ? "rail-btn--open" : ""}`}
    >
      <Icon size={20} strokeWidth={1.8} />
      {isOpen && <span className="rail-btn__text">{label}</span>}
    </button>
  );

  if (isOpen) {
    return content;
  }

  return (
    <Tooltip label={label} position="right">
      {content}
    </Tooltip>
  );
}

function AqiTicker({ readings }) {
  const active = readings.length;
  const overall = active
    ? Math.round(readings.reduce((sum, r) => sum + (r.aqi || 0), 0) / active)
    : null;
  const overallStyle = aqiStyle(overall);

  return (
    <div className="ticker">
      <div className="ticker__gradient" />
      <div className="ticker__content">
        <span className="ticker__label">
          {active > 0
            ? `Live AQI · ${readings.length} node${readings.length === 1 ? "" : "s"} · Average ${overall} (${overallStyle.label})`
            : "Live AQI · Waiting for sensor data…"}
        </span>
        {readings.map((r) => (
          <span
            key={r.node_id}
            className="ticker__chip"
            style={{ background: aqiStyle(r.aqi).color }}
            title={`${r.node_id}: AQI ${r.aqi}`}
          />
        ))}
      </div>
    </div>
  );
}

function ProfileMenu({ session, onLogout }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const username = session?.user?.username || "Guest";
  const role = session?.user?.role || "user";

  return (
    <div className="profile" ref={ref}>
      <Tooltip label="Account menu">
        <button onClick={() => setOpen(!open)} className={`profile-btn ${open ? "profile-btn--open" : ""}`}>
          <div className="profile-avatar"><User size={16} strokeWidth={2} /></div>
          <ChevronDown size={16} className={`profile-chevron ${open ? "profile-chevron--open" : ""}`} />
        </button>
      </Tooltip>
      {open && (
        <div className="dropdown">
          <div className="dropdown__header">
            <p className="dropdown__title">{username}</p>
            <p className="dropdown__subtitle">Role: {role}</p>
          </div>
          <MenuItem icon={Users} text="Switch Profile" />
          <MenuItem icon={Settings} text="Account settings" />
          <MenuItem icon={LogOut} text="Sign out" danger onClick={onLogout} />
        </div>
      )}
    </div>
  );
}

function MenuItem({ icon: Icon, text, danger, onClick }) {
  return (
    <button className={`menu-item ${danger ? "menu-item--danger" : ""}`} onClick={onClick}>
      <Icon size={16} strokeWidth={1.8} /> {text}
    </button>
  );
}

function EmptyState({ message }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--text-secondary)", fontSize: "0.9rem", padding: "16px 0" }}>
      <Info size={16} />
      <span>{message}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Map — markers from live readings, coloured by AQI
// ---------------------------------------------------------------------------

function MapContent({ readings, error }) {
  return (
    <div className="map-wrapper" style={{ height: "100%", width: "100%", borderRadius: "24px", overflow: "hidden", border: "1px solid var(--border-color)", zIndex: 0, position: "relative" }}>
      <MapContainer center={CITY_CENTER} zoom={13} style={{ height: "100%", width: "100%", zIndex: 1 }}>
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; CARTO'
        />
        {readings.length === 0 ? null : readings.map((r) => {
          const s = aqiStyle(r.aqi);
          const pos = nodeCoords(r.node_id);
          const radius = Math.min(14 + (r.aqi || 0) / 20, 30);
          return (
            <CircleMarker
              key={r.node_id}
              center={pos}
              radius={radius}
              pathOptions={{ color: s.color, fillColor: s.color, fillOpacity: 0.5 }}
            >
              <Popup>
                <div style={{ color: "#333", minWidth: 160 }}>
                  <strong>Node: {r.node_id}</strong><br />
                  AQI: {(r.aqi ?? "—")} ({s.label})<br />
                  PM2.5: {fmt(r.pm25)} µg/m³ · PM10: {fmt(r.pm10)} µg/m³<br />
                  Temp: {fmt(r.temperature)}°C · Humidity: {fmt(r.humidity)}%<br />
                  Battery: {r.battery_v != null ? `${r.battery_v.toFixed(1)}V` : "—"}
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
      <div style={{ position: "absolute", bottom: 12, left: 12, zIndex: 1000, display: "flex", gap: 6, flexWrap: "wrap" }}>
        {error ? <span className="map-hint" style={{ background: "rgba(255,107,107,.9)" }}>{error}</span> : null}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Analytics — history + forecast charts
// ---------------------------------------------------------------------------

function AnalyticsContent({ readings }) {
  const nodeId = readings[0]?.node_id;
  const { buckets, loading } = useHistory({ bucket: "1h", hours: 24, node_id: nodeId });
  const { points, loading: fLoading } = useForecast(nodeId);

  const chartData = buckets.map((b) => ({
    time: new Date(b.bucket).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    pm25: b.avg_pm25,
    pm10: b.avg_pm10,
    aqi: b.avg_aqi,
  }));
  const forecastData = points.map((p) => ({
    time: new Date(p.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    aqi: p.aqi,
  }));

  const avgPm25 = buckets.length
    ? buckets.reduce((s, b) => s + (b.avg_pm25 || 0), 0) / buckets.length : null;
  const peakPm10 = buckets.length
    ? Math.max(...buckets.map((b) => b.avg_pm10 || 0)) : null;

  return (
    <div className="analytics-grid">
      <div className="widget widget--full">
        <div className="widget__header">
          <h3>24-Hour Exposure Trends</h3>
          <BarChart3 size={18} className="text-accent" />
        </div>
        {loading ? (
          <EmptyState message="Loading historical readings…" />
        ) : chartData.length === 0 ? (
          <EmptyState message="No historical readings available yet." />
        ) : (
          <div className="chart-container" style={{ width: '100%', height: '320px', marginTop: '16px' }}>
            <ResponsiveContainer>
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="time" stroke="rgba(255,255,255,0.5)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} tickLine={false} axisLine={false} />
                <RechartsTooltip
                  contentStyle={{ backgroundColor: 'rgba(10, 31, 31, 0.95)', border: '1px solid var(--border-color)', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff', fontSize: '14px', padding: '4px 0' }}
                />
                <Line type="monotone" name="PM2.5 (µg/m³)" dataKey="pm25" stroke="#ff6b6b" strokeWidth={3} dot={false} />
                <Line type="monotone" name="PM10 (µg/m³)" dataKey="pm10" stroke="#fbbf24" strokeWidth={3} dot={false} />
                <Line type="monotone" name="AQI" dataKey="aqi" stroke="#4cdbaf" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="widget widget--full">
        <div className="widget__header">
          <h3>60-Minute AQI Forecast{nodeId ? ` · ${nodeId}` : ""}</h3>
          <Activity size={18} className="text-accent" />
        </div>
        {!nodeId ? (
          <EmptyState message="Connect a sensor node to see its AQI forecast." />
        ) : fLoading ? (
          <EmptyState message="Computing forecast…" />
        ) : forecastData.length === 0 ? (
          <EmptyState message="Not enough data to train a forecast model (< 30 readings in 7 days)." />
        ) : (
          <div className="chart-container" style={{ width: '100%', height: '260px', marginTop: '16px' }}>
            <ResponsiveContainer>
              <LineChart data={forecastData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="time" stroke="rgba(255,255,255,0.5)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} tickLine={false} axisLine={false} />
                <RechartsTooltip
                  contentStyle={{ backgroundColor: 'rgba(10, 31, 31, 0.95)', border: '1px solid var(--border-color)', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Line type="monotone" name="Forecast AQI" dataKey="aqi" stroke="#7dd3fc" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="widget widget--stats">
        <div className="widget__header">
          <h3>Daily Summary</h3>
        </div>
        <div className="widget__body">
          <p className="profile-desc" style={{ marginBottom: '24px' }}>
            {nodeId ? `Averaged from ${nodeId} over the last 24 hours.` : "No sensor data yet — summary appears once nodes report readings."}
          </p>
          <div className="stat-row">
            <span className="stat-label">Avg PM2.5:</span>
            <span className="stat-val">{avgPm25 != null ? `${avgPm25.toFixed(1)} µg/m³` : "—"}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Peak PM10:</span>
            <span className="stat-val" style={{ color: '#fbbf24' }}>{peakPm10 != null ? `${peakPm10.toFixed(1)} µg/m³` : "—"}</span>
          </div>
          <div className="stat-row" style={{ borderBottom: 'none' }}>
            <span className="stat-label">Buckets:</span>
            <span className="stat-val" style={{ color: '#4cdbaf' }}>{buckets.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Devices — derived from live readings (nodes API not deployed yet)
// ---------------------------------------------------------------------------

function DevicesContent({ readings }) {
  return (
    <div className="devices-grid">
      <div className="widget widget--full" style={{ padding: '0', overflow: 'hidden' }}>
        <div className="widget__header" style={{ padding: '24px 24px 0 24px' }}>
          <h3>Sensor Nodes</h3>
        </div>
        <div className="device-list" style={{ padding: '24px' }}>
          {readings.length === 0 ? (
            <EmptyState message="No sensor nodes have reported readings yet." />
          ) : (
            readings.map((r) => {
              const s = aqiStyle(r.aqi);
              return (
                <div className="device-card" key={r.node_id}>
                  <div className="device-card__header">
                    <div className="device-info">
                      <h4>Air Quality Node ({r.node_id})</h4>
                      <span className="device-status device-status--online">
                        <span className="status-dot"></span> Reporting
                      </span>
                    </div>
                    <div className="device-battery">
                      <Battery size={20} className="text-accent" />
                      <span>{r.battery_v != null ? `${r.battery_v.toFixed(1)}V` : "—"}</span>
                    </div>
                  </div>

                  <div className="device-diagnostics">
                    <div className="diag-item">
                      <Gauge size={16} style={{ color: s.color }} />
                      <span>AQI</span>
                      <strong style={{ color: s.color }}>{r.aqi ?? "—"} · {s.label}</strong>
                    </div>
                    <div className="diag-item">
                      <Wind size={16} style={{ color: 'var(--text-secondary)' }} />
                      <span>PM2.5</span>
                      <strong style={{ color: 'var(--safe-color)' }}>{fmt(r.pm25)} µg/m³</strong>
                    </div>
                    <div className="diag-item">
                      <Droplets size={16} style={{ color: 'var(--text-secondary)' }} />
                      <span>Humidity</span>
                      <strong style={{ color: 'var(--safe-color)' }}>{fmt(r.humidity)}%</strong>
                    </div>
                    <div className="diag-item">
                      <Thermometer size={16} style={{ color: 'var(--text-secondary)' }} />
                      <span>Temperature</span>
                      <strong style={{ color: 'var(--warning-color)' }}>{fmt(r.temperature)}°C</strong>
                    </div>
                    {r.is_anomaly ? (
                      <div className="diag-item">
                        <AlertTriangle size={16} style={{ color: 'var(--danger-color, #ff6b6b)' }} />
                        <span>Reading</span>
                        <strong style={{ color: '#ff6b6b' }}>Anomaly flagged</strong>
                      </div>
                    ) : null}
                  </div>

                  <div className="device-footer">
                    <span className="sync-time"><RefreshCw size={14} /> Last reading: {r.time ? new Date(r.time).toLocaleString() : "—"}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Overview — live telemetry, chart, active profile, anomaly alerts
// ---------------------------------------------------------------------------

function OverviewContent({ readings, error }) {
  const nodeId = readings[0]?.node_id;
  const { buckets, loading } = useHistory({ bucket: "1h", hours: 24, node_id: nodeId });

  const chartData = buckets.map((b) => ({
    time: new Date(b.bucket).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    pm25: b.avg_pm25,
  }));

  // Use the most complete reading for the live telemetry panel.
  const primary = readings.find((r) => r.pm25 != null) || readings[0];

  const anomalies = readings.filter((r) => r.is_anomaly);

  return (
    <div className="overview-grid">
      {/* Widget 1: Health Profile (frontend concept — static choice) */}
      <div className="widget widget--profile">
        <div className="widget__header">
          <h3>Active Health Profile</h3>
          <Activity size={18} className="text-accent" />
        </div>
        <div className="widget__body">
          <h2 className="profile-name">Asthma Mode</h2>
          <p className="profile-desc">High sensitivity. Alerts trigger on mild PM2.5 & NO2 breaches.</p>
          <div className="status-badge status-badge--safe">
            <CheckCircle size={14} /> Safe Zone
          </div>
        </div>
      </div>

      {/* Widget 2: PM2.5 exposure trend from /readings/history */}
      <div className="widget widget--chart">
        <div className="widget__header">
          <h3>PM2.5 Exposure Trend</h3>
          <BarChart3 size={18} className="text-accent" />
        </div>
        {error ? (
          <EmptyState message={error} />
        ) : loading ? (
          <EmptyState message="Loading trends…" />
        ) : chartData.length === 0 ? (
          <EmptyState message="No readings yet." />
        ) : (
          <div className="chart-container" style={{ width: '100%', height: '180px' }}>
            <ResponsiveContainer>
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="time" stroke="rgba(255,255,255,0.5)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} tickLine={false} axisLine={false} />
                <RechartsTooltip
                  contentStyle={{ backgroundColor: 'rgba(10, 31, 31, 0.9)', border: '1px solid #4cdbaf', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Line type="monotone" dataKey="pm25" name="PM2.5 (µg/m³)" stroke="#4cdbaf" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Widget 3: Live telemetry */}
      <div className="widget widget--sensors">
        <div className="widget__header">
          <h3>Live Telemetry</h3>
          {primary ? <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{primary.node_id}</span> : <Cpu size={18} className="text-accent" />}
        </div>
        {!primary ? (
          <EmptyState message="Waiting for sensor data…" />
        ) : (
          <div className="sensor-grid">
            <div className="sensor-card">
              <span className="sensor-label">AQI</span>
              <span className="sensor-value" style={{ color: aqiStyle(primary.aqi).color }}>{primary.aqi ?? "—"} <small>· {aqiStyle(primary.aqi).label}</small></span>
            </div>
            <div className="sensor-card">
              <span className="sensor-label">PM2.5</span>
              <span className="sensor-value">{fmt(primary.pm25)} <small>µg/m³</small></span>
            </div>
            <div className="sensor-card">
              <span className="sensor-label">PM10</span>
              <span className="sensor-value">{fmt(primary.pm10)} <small>µg/m³</small></span>
            </div>
            <div className="sensor-card">
              <span className="sensor-label">Temperature</span>
              <span className="sensor-value">{fmt(primary.temperature)} <small>°C</small></span>
            </div>
            <div className="sensor-card">
              <span className="sensor-label">Humidity</span>
              <span className="sensor-value">{fmt(primary.humidity)} <small>%</small></span>
            </div>
            <div className="sensor-card">
              <span className="sensor-label">Battery</span>
              <span className="sensor-value">{primary.battery_v != null ? primary.battery_v.toFixed(1) : "—"} <small>V</small></span>
            </div>
          </div>
        )}
      </div>

      {/* Widget 4: Alerts — anomalies flagged in live data (alerts API not deployed) */}
      <div className="widget widget--alerts">
        <div className="widget__header">
          <h3>Recent Alerts</h3>
          <Bell size={18} className="text-accent" />
        </div>
        {error ? (
          <EmptyState message={error} />
        ) : anomalies.length === 0 ? (
          <EmptyState message="All nodes reporting normally." />
        ) : (
          <div className="alerts-feed">
            {anomalies.slice(0, 4).map((r) => (
              <div className="alert-item alert-item--moderate" key={r.node_id}>
                <AlertTriangle size={18} />
                <div>
                  <p className="alert-title">Anomaly flagged on {r.node_id}</p>
                  <span className="alert-time">AQI {(r.aqi ?? "—")} · {r.time ? new Date(r.time).toLocaleTimeString() : ""}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Settings — real profile (username/email/notification prefs) + change password
// ---------------------------------------------------------------------------

const INPUT_STYLE = {
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid var(--border-color)',
  borderRadius: '8px',
  color: '#fff',
  padding: '10px 12px',
  width: '100%',
  fontSize: '0.9rem',
  marginTop: '6px',
};

function SettingsContent() {
  const [profile, setProfile] = useState(null);
  const [loadError, setLoadError] = useState("");

  // Profile edit form
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [saveMsg, setSaveMsg] = useState("");
  const [saveErr, setSaveErr] = useState("");
  const [saving, setSaving] = useState(false);

  // Change-password form
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [pwMsg, setPwMsg] = useState("");
  const [pwErr, setPwErr] = useState("");
  const [pwSaving, setPwSaving] = useState(false);

  // Load profile once
  useEffect(() => {
    let active = true;
    getProfile()
      .then((p) => {
        if (!active) return;
        setProfile(p);
        setUsername(p.username || "");
        setEmail(p.email || "");
      })
      .catch((err) => { if (active) setLoadError(err.message); });
    return () => { active = false; };
  }, []);

  // Load notification prefs into a checkbox state
  const [emailAlerts, setEmailAlerts] = useState(true);
  useEffect(() => {
    if (profile && profile.notification_prefs && typeof profile.notification_prefs.email_on_critical === "boolean") {
      setEmailAlerts(profile.notification_prefs.email_on_critical);
    }
  }, [profile]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaveMsg(""); setSaveErr(""); setSaving(true);
    try {
      const patch = { username, email, notification_prefs: { ...(profile?.notification_prefs || {}), email_on_critical: emailAlerts } };
      const updated = await updateProfile(patch);
      setProfile(updated);
      setSaveMsg("Profile updated.");
    } catch (err) {
      setSaveErr(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwMsg(""); setPwErr(""); setPwSaving(true);
    try {
      await changePassword({ current_password: current, new_password: next });
      setPwMsg("Password changed successfully.");
      setCurrent(""); setNext("");
    } catch (err) {
      setPwErr(err.message);
    } finally {
      setPwSaving(false);
    }
  };

  return (
    <div className="settings-grid">
      {loadError ? (
        <div className="widget widget--full">
          <EmptyState message={`Couldn't load your profile: ${loadError}`} />
        </div>
      ) : (
        <>
          <div className="widget widget--full">
            <div className="widget__header">
              <h3>Account</h3>
              <User size={18} className="text-accent" />
            </div>
            <form onSubmit={handleSaveProfile} style={{ padding: '8px 0' }}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Username</label>
                <input style={INPUT_STYLE} value={username} onChange={(e) => setUsername(e.target.value)} placeholder="username" />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Email</label>
                <input type="email" style={INPUT_STYLE} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Role</label>
                <p style={{ margin: '6px 0 0', fontSize: '0.9rem' }}>{profile?.role || "user"}</p>
              </div>
              {saveMsg ? <p style={{ color: '#4cdbaf', fontSize: '0.85rem' }}>{saveMsg}</p> : null}
              {saveErr ? <p style={{ color: '#ff6b6b', fontSize: '0.85rem' }}>{saveErr}</p> : null}
              <button
                type="submit"
                disabled={saving}
                style={{ background: 'var(--accent-color)', color: '#08201a', border: 'none', borderRadius: '8px', padding: '10px 18px', fontWeight: 600, cursor: 'pointer' }}
              >
                {saving ? "Saving…" : "Save changes"}
              </button>
            </form>
          </div>

          <div className="widget widget--full">
            <div className="widget__header">
              <h3>Notification Preferences</h3>
            </div>
            <div className="settings-list">
              <div className="setting-item">
                <div className="setting-info">
                  <h4>Email me on critical AQI</h4>
                  <p>Receive an email when AQI crosses the critical threshold.</p>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" checked={emailAlerts} onChange={(e) => setEmailAlerts(e.target.checked)} />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          </div>

          <div className="widget widget--full">
            <div className="widget__header">
              <h3>Change Password</h3>
            </div>
            <form onSubmit={handleChangePassword} style={{ padding: '8px 0' }}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Current password</label>
                <input type="password" style={INPUT_STYLE} value={current} onChange={(e) => setCurrent(e.target.value)} placeholder="••••••••" />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>New password</label>
                <input type="password" style={INPUT_STYLE} value={next} onChange={(e) => setNext(e.target.value)} placeholder="6–72 characters" />
              </div>
              {pwMsg ? <p style={{ color: '#4cdbaf', fontSize: '0.85rem' }}>{pwMsg}</p> : null}
              {pwErr ? <p style={{ color: '#ff6b6b', fontSize: '0.85rem' }}>{pwErr}</p> : null}
              <button
                type="submit"
                disabled={pwSaving}
                style={{ background: 'var(--accent-color)', color: '#08201a', border: 'none', borderRadius: '8px', padding: '10px 18px', fontWeight: 600, cursor: 'pointer' }}
              >
                {pwSaving ? "Updating…" : "Change password"}
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Layout
// ---------------------------------------------------------------------------

export default function EmpyreanDashboardLayout({ onLogout }) {
  const [activeTab, setActiveTab] = useState("overview");
  const { readings, error } = useLatestReadings();
  const session = getSession();

  // Keep the profile menu's user up to date after refresh swaps the session.
  const [_, forceRender] = useState(0);
  useEffect(() => subscribeToAuth(() => forceRender((n) => n + 1)), []);

  return (
    <div className="dashboard">
      <header className="dashboard__header">
        <div className="dashboard__logo">
          <div className="dashboard__logo-mark"><Wind size={18} color="#fff" strokeWidth={2} /></div>
          <span className="dashboard__logo-text">Empyrean</span>
        </div>
        <AqiTicker readings={readings} />
        <div className="search">
          <Search size={16} color="rgba(255,255,255,0.7)" />
          <input type="text" placeholder="Search areas, devices, alerts" className="search__input" />
        </div>
        <Tooltip label="Notifications"><button className="icon-btn"><Bell size={19} strokeWidth={1.8} /><span className="icon-btn__dot" /></button></Tooltip>
        <ProfileMenu session={session} onLogout={onLogout} />
      </header>

      <div className="dashboard__body">
        <aside className={`rail ${isSidebarOpen ? 'rail--open' : ''}`}>

          <nav className="rail__nav">
            <IconRailButton isOpen={isSidebarOpen} icon={LayoutDashboard} label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
            <IconRailButton isOpen={isSidebarOpen} icon={MapIcon} label="Geo-Map" active={activeTab === 'map'} onClick={() => setActiveTab('map')} />
            <IconRailButton isOpen={isSidebarOpen} icon={BarChart3} label="Analytics" active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} />
          </nav>
          <div className="rail__spacer" />
          <div className="rail__bottom">
            <IconRailButton isOpen={isSidebarOpen} icon={Cpu} label="Devices" active={activeTab === 'devices'} onClick={() => setActiveTab('devices')} />
            <div className="rail__divider" />
            <IconRailButton isOpen={isSidebarOpen} icon={Settings} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
          </div>
        </aside>

        <main className="main">
          {activeTab === "overview" && <OverviewContent readings={readings} error={error} />}
          {activeTab === "map" && <MapContent readings={readings} error={error} />}
          {activeTab === "analytics" && <AnalyticsContent readings={readings} />}
          {activeTab === "devices" && <DevicesContent readings={readings} />}
          {activeTab === "settings" && <SettingsContent />}
        </main>
      </div>
    </div>
  );
}