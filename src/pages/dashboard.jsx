import { useState, useRef, useEffect, useCallback } from "react";
import {
  Wind, Search, Bell, ChevronDown, User, Users, LogOut, Settings, Cpu,
  LayoutDashboard, Map as MapIcon, BarChart3, Activity, AlertTriangle, CheckCircle,
  Battery, MapPin, RefreshCw, Plus
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
import { MapContainer, TileLayer, Popup, CircleMarker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {
  getLatestReadings, getReadingsHistory, getNodes, getAlerts,
  acknowledgeAlert, getProfile, updateProfile, logout, connectAlertsSocket,
  ApiError, getErrorMessage,
} from "../api";
import "../styles/EmpyreanDashboardLayout.css";

const DEFAULT_CENTER = [12.9716, 77.5946];

function fmtTime(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function timeAgo(iso) {
  if (!iso) return "never";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "unknown";
  const secs = Math.max(0, Math.round((Date.now() - d.getTime()) / 1000));
  if (secs < 60) return `${secs} seconds ago`;
  const mins = Math.round(secs / 60);
  if (mins < 60) return `${mins} minute${mins === 1 ? "" : "s"} ago`;
  const hours = Math.round(mins / 60);
  return `${hours} hour${hours === 1 ? "" : "s"} ago`;
}

function parseLocation(node) {
  const loc = node?.location ?? node?.coordinates;
  if (!loc) return null;
  if (typeof loc === "string") {
    const [lat, lng] = loc.split(",").map((v) => Number(v.trim()));
    return Number.isFinite(lat) && Number.isFinite(lng) ? [lat, lng] : null;
  }
  if (Array.isArray(loc)) {
    const [lat, lng] = loc;
    return Number.isFinite(lat) && Number.isFinite(lng) ? [lat, lng] : null;
  }
  if (typeof loc === "object") {
    if (Array.isArray(loc.coordinates)) {
      const [lng, lat] = loc.coordinates;
      if (Number.isFinite(lat) && Number.isFinite(lng)) return [lat, lng];
    }
    const lat = Number(loc.latitude ?? loc.lat);
    const lng = Number(loc.longitude ?? loc.lng ?? loc.lon);
    return Number.isFinite(lat) && Number.isFinite(lng) ? [lat, lng] : null;
  }
  return null;
}

function aqiColor(aqi) {
  if (aqi == null) return "#4cdbaf";
  if (aqi <= 50) return "#4cdbaf";
  if (aqi <= 100) return "#fbbf24";
  return "#ff6b6b";
}

function nodeIdOf(node) {
  return node?.node_id ?? node?.id;
}

function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div
      role="status"
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 1000,
        background: "rgba(10, 31, 31, 0.95)",
        border: "1px solid var(--border-color)",
        borderLeft: `3px solid ${toast.kind === "error" ? "#ff6b6b" : "#4cdbaf"}`,
        color: "#fff",
        padding: "12px 16px",
        borderRadius: "12px",
        fontSize: "0.85rem",
        maxWidth: "320px",
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.4)",
      }}
    >
      {toast.message}
    </div>
  );
}

function Tooltip({ label, children, position = "bottom" }) {
  return (
    <div className={`tooltip ${position === "right" ? "tooltip--right" : ""}`}>
      {children}
      <span className="tooltip__label">{label}</span>
    </div>
  );
}

function IconRailButton({ icon: Icon, label, active, onClick }) {
  return (
    <Tooltip label={label} position="right">
      <button
        onClick={onClick}
        aria-label={label}
        className={`rail-btn ${active ? "rail-btn--active" : ""}`}
      >
        <Icon size={20} strokeWidth={1.8} />
      </button>
    </Tooltip>
  );
}

function AqiTickerSpace({ reading, nodeId, backendDown }) {
  const placeholders = new Array(6).fill(0);
  const label = backendDown
    ? "Live data unavailable — check the server"
    : reading && reading.aqi != null
      ? `${nodeId} · AQI: ${reading.aqi} (${reading.aqi_category ?? "Unknown"})`
      : "Waiting for live data…";
  return (
    <div className="ticker">
      <div className="ticker__gradient" />
      <div className="ticker__content">
        <span className="ticker__label">{label}</span>
        {placeholders.map((_, i) => (
          <span key={i} className="ticker__chip" />
        ))}
      </div>
    </div>
  );
}

function ProfileMenu({ user, onSignOut, onSettings }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

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
            <p className="dropdown__title">{user?.username || "Signed in"}</p>
            <p className="dropdown__subtitle">{user?.email || ""}</p>
          </div>
          <MenuItem icon={Users} text="Switch Profile" />
          <MenuItem icon={Settings} text="Account settings" onClick={() => { setOpen(false); onSettings?.(); }} />
          <MenuItem icon={LogOut} text="Sign out" danger onClick={() => { setOpen(false); onSignOut?.(); }} />
        </div>
      )}
    </div>
  );
}

function MenuItem({ icon: Icon, text, danger, onClick }) {
  return (
    <button onClick={onClick} className={`menu-item ${danger ? "menu-item--danger" : ""}`}>
      <Icon size={16} strokeWidth={1.8} /> {text}
    </button>
  );
}

function Recenter({ center }) {
  const map = useMap();
  const [lat, lng] = center;
  useEffect(() => {
    map.setView([lat, lng]);
  }, [map, lat, lng]);
  return null;
}

function MapContent({ nodes, latest }) {
  const markers = nodes
    .map((node) => ({ node, position: parseLocation(node) }))
    .filter((m) => m.position);
  const center = markers.length ? markers[0].position : DEFAULT_CENTER;

  return (
    <div className="map-wrapper" style={{ height: "100%", width: "100%", borderRadius: "24px", overflow: "hidden", border: "1px solid var(--border-color)", zIndex: 0 }}>
      <MapContainer center={center} zoom={13} style={{ height: "100%", width: "100%", zIndex: 1 }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Recenter center={center} />
        {markers.map(({ node, position }, index) => {
          const id = nodeIdOf(node);
          const reading = latest[id];
          const color = aqiColor(reading?.aqi);
          return (
            <CircleMarker key={id ?? index} center={position} radius={15} pathOptions={{ color, fillColor: color, fillOpacity: 0.4 }}>
              <Popup>
                <div style={{ color: '#333' }}>
                  <strong>Device: {node?.name || id}</strong><br />
                  AQI: {reading?.aqi != null ? `${reading.aqi} (${reading.aqi_category ?? "Unknown"})` : "No data"}<br />
                  PM2.5: {reading?.pm25 != null ? `${reading.pm25} µg/m³` : "—"}
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}

function AnalyticsContent({ history }) {
  const detailedChartData = history.map((b) => ({
    time: fmtTime(b.bucket),
    pm25: b.avg_pm25,
    pm10: b.avg_pm10,
    aqi: b.avg_aqi,
  }));

  const avgPm25 = history.length
    ? (history.reduce((sum, b) => sum + (b.avg_pm25 || 0), 0) / history.length).toFixed(1)
    : null;
  const peakBucket = history.reduce(
    (best, b) => ((b.max_aqi || 0) > (best?.max_aqi || 0) ? b : best),
    null,
  );
  const safeHours = history.filter((b) => (b.max_aqi ?? 0) <= 100).length;

  return (
    <div className="analytics-grid">
      <div className="widget widget--full">
        <div className="widget__header">
          <h3>24-Hour Exposure Trends</h3>
          <BarChart3 size={18} className="text-accent" />
        </div>
        <div className="chart-container" style={{ width: '100%', height: '350px', marginTop: '16px' }}>
          <ResponsiveContainer>
            <LineChart data={detailedChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="time" stroke="rgba(255,255,255,0.5)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis yAxisId="left" stroke="rgba(255,255,255,0.5)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis yAxisId="right" orientation="right" stroke="rgba(255,255,255,0.5)" fontSize={12} tickLine={false} axisLine={false} />
              <RechartsTooltip 
                contentStyle={{ backgroundColor: 'rgba(10, 31, 31, 0.95)', border: '1px solid var(--border-color)', borderRadius: '12px' }}
                itemStyle={{ color: '#fff', fontSize: '14px', padding: '4px 0' }}
              />
              <Line yAxisId="left" type="monotone" name="PM2.5 (µg/m³)" dataKey="pm25" stroke="#ff6b6b" strokeWidth={3} dot={{ r: 4 }} />
              <Line yAxisId="left" type="monotone" name="PM10 (µg/m³)" dataKey="pm10" stroke="#fbbf24" strokeWidth={3} dot={{ r: 4 }} />
              <Line yAxisId="right" type="monotone" name="AQI" dataKey="aqi" stroke="#4cdbaf" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="widget widget--stats">
        <div className="widget__header">
          <h3>Daily Summary</h3>
        </div>
        <div className="widget__body">
          <p className="profile-desc" style={{ marginBottom: '24px' }}>
            {peakBucket && peakBucket.max_aqi != null
              ? `Your highest exposure occurred at ${fmtTime(peakBucket.bucket)} (AQI ${peakBucket.max_aqi}).`
              : "No exposure data in the last 24 hours."}
          </p>
          <div className="stat-row">
            <span className="stat-label">Avg PM2.5:</span> 
            <span className="stat-val">{avgPm25 != null ? `${avgPm25} µg/m³` : "—"}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Peak AQI:</span> 
            <span className="stat-val" style={{ color: '#fbbf24' }}>{peakBucket?.max_aqi != null ? peakBucket.max_aqi : "—"}</span>
          </div>
          <div className="stat-row" style={{ borderBottom: 'none' }}>
            <span className="stat-label">Safe Hours:</span> 
            <span className="stat-val" style={{ color: '#4cdbaf' }}>{safeHours} hours</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function DevicesContent({ nodes, latest }) {
  return (
    <div className="devices-grid">
      <div className="widget widget--full" style={{ padding: '0', overflow: 'hidden' }}>
        <div className="widget__header" style={{ padding: '24px 24px 0 24px' }}>
          <h3>Paired Devices</h3>
          <button className="add-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--accent-color)', color: '#08201a', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
            <Plus size={16} /> Add Device
          </button>
        </div>
        <div className="device-list" style={{ padding: '24px' }}>
          {nodes.length === 0 && (
            <p className="profile-desc">No sensor nodes registered yet.</p>
          )}
          {nodes.map((node, index) => {
            const id = nodeIdOf(node);
            const reading = latest[id];
            const online = node.is_active !== false;
            return (
              <div className="device-card" key={id ?? index}>
                <div className="device-card__header">
                  <div className="device-info">
                    <h4>{node.name || id} ({id})</h4>
                    <span className={`device-status ${online ? "device-status--online" : ""}`}>
                      <span className="status-dot"></span> {online ? "Online" : "Inactive"}
                    </span>
                  </div>
                  <div className="device-battery">
                    <Battery size={20} className="text-accent" />
                    <span>{reading?.battery_v != null ? `${reading.battery_v}V` : "—"}</span>
                  </div>
                </div>
                
                <div className="device-diagnostics">
                  <div className="diag-item">
                    <Cpu size={16} style={{ color: 'var(--text-secondary)' }} />
                    <span>Node ID</span>
                    <strong style={{ color: 'var(--safe-color)' }}>{id}</strong>
                  </div>
                  <div className="diag-item">
                    <Wind size={16} style={{ color: 'var(--text-secondary)' }} />
                    <span>AQI</span>
                    <strong style={{ color: 'var(--safe-color)' }}>{reading?.aqi != null ? `${reading.aqi} (${reading.aqi_category ?? "Unknown"})` : "—"}</strong>
                  </div>
                  <div className="diag-item">
                    <Activity size={16} style={{ color: 'var(--text-secondary)' }} />
                    <span>PM2.5</span>
                    <strong style={{ color: 'var(--safe-color)' }}>{reading?.pm25 != null ? `${reading.pm25} µg/m³` : "—"}</strong>
                  </div>
                  <div className="diag-item">
                    <MapPin size={16} style={{ color: 'var(--text-secondary)' }} />
                    <span>Location</span>
                    <strong style={{ color: 'var(--warning-color)' }}>{typeof node.location === "string" && node.location ? node.location : (parseLocation(node) ? parseLocation(node).join(", ") : "—")}</strong>
                  </div>
                </div>
                
                <div className="device-footer">
                  <span className="sync-time"><RefreshCw size={14} /> Last sync: {reading?.time ? timeAgo(reading.time) : "never"} via MQTT</span>
                  <button className="manage-btn">Manage Settings</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function SettingsContent({ profile, onTogglePref, activeProfile, onProfileChange }) {
  const prefs = profile?.notification_prefs || {};

  return (
    <div className="settings-grid">
      <div className="widget widget--full">
        <div className="widget__header" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
          <h3>Health Profile Configuration</h3>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Customize your alert thresholds based on your specific health needs.</p>
        </div>
        <div className="profiles-container">
          
          <div className={`profile-card ${activeProfile === 'asthma' ? 'profile-card--active' : ''}`} onClick={() => onProfileChange('asthma')}>
            <div className="profile-card__header">
              <h4>Asthma Mode</h4>
              {activeProfile === 'asthma' && <CheckCircle size={18} className="text-accent" />}
            </div>
            <p>For Asthma / COPD patients. High sensitivity; triggers on mild breach of PM2.5, NO&#8322;, Ozone.</p>
          </div>

          <div className={`profile-card ${activeProfile === 'child' ? 'profile-card--active' : ''}`} onClick={() => onProfileChange('child')}>
            <div className="profile-card__header">
              <h4>Child Mode</h4>
              {activeProfile === 'child' && <CheckCircle size={18} className="text-accent" />}
            </div>
            <p>For children under 12. Highest sensitivity; strictest limits across all pollutants.</p>
          </div>

          <div className={`profile-card ${activeProfile === 'elderly' ? 'profile-card--active' : ''}`} onClick={() => onProfileChange('elderly')}>
            <div className="profile-card__header">
              <h4>Elderly Mode</h4>
              {activeProfile === 'elderly' && <CheckCircle size={18} className="text-accent" />}
            </div>
            <p>For adults over 65. Moderate sensitivity; focus on sustained exposure to PM2.5, CO&#8322;, NO&#8322;.</p>
          </div>

          <div className={`profile-card ${activeProfile === 'general' ? 'profile-card--active' : ''}`} onClick={() => onProfileChange('general')}>
            <div className="profile-card__header">
              <h4>General Mode</h4>
              {activeProfile === 'general' && <CheckCircle size={18} className="text-accent" />}
            </div>
            <p>For healthy adults. Standard WHO guidelines across all pollutants.</p>
          </div>

        </div>
      </div>
      
      <div className="widget widget--full">
        <div className="widget__header">
          <h3>Notification Preferences</h3>
        </div>
        <div className="settings-list">
          <div className="setting-item">
            <div className="setting-info">
              <h4>Push Notifications</h4>
              <p>Receive alerts directly on your mobile device.</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={prefs.push_notifications !== false}
                onChange={(e) => onTogglePref("push_notifications", e.target.checked)}
              />
              <span className="slider"></span>
            </label>
          </div>
          <div className="setting-item">
            <div className="setting-info">
              <h4>Email Reports</h4>
              <p>Receive daily exposure summary reports.</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={Boolean(prefs.email_reports)}
                onChange={(e) => onTogglePref("email_reports", e.target.checked)}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

// THE NEW DASHBOARD CONTENT WIDGETS
function OverviewContent({ reading, history, alerts, onAcknowledge }) {
  const chartData = history.map((b) => ({
    time: fmtTime(b.bucket),
    pm25: b.avg_pm25,
  }));

  return (
    <div className="overview-grid">
      {/* Widget 1: Health Profile */}
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

      {/* Widget 2: Chart */}
      <div className="widget widget--chart">
        <div className="widget__header">
          <h3>PM2.5 Exposure Trend</h3>
          <BarChart3 size={18} className="text-accent" />
        </div>
        <div className="chart-container" style={{ width: '100%', height: '180px' }}>
          <ResponsiveContainer>
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="time" stroke="rgba(255,255,255,0.5)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} tickLine={false} axisLine={false} />
              <RechartsTooltip 
                contentStyle={{ backgroundColor: 'rgba(10, 31, 31, 0.9)', border: '1px solid #4cdbaf', borderRadius: '8px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Line type="monotone" dataKey="pm25" stroke="#4cdbaf" strokeWidth={3} dot={{ r: 4, fill: '#00FFE6' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Widget 3: Live Sensor Telemetry */}
      <div className="widget widget--sensors">
        <div className="widget__header">
          <h3>Live Telemetry</h3>
          <Cpu size={18} className="text-accent" />
        </div>
        <div className="sensor-grid">
          <div className="sensor-card">
            <span className="sensor-label">PM2.5</span>
            <span className="sensor-value">{reading?.pm25 != null ? reading.pm25 : "—"} <small>µg/m³</small></span>
          </div>
          <div className="sensor-card">
            <span className="sensor-label">PM10</span>
            <span className="sensor-value">{reading?.pm10 != null ? reading.pm10 : "—"} <small>µg/m³</small></span>
          </div>
          <div className="sensor-card">
            <span className="sensor-label">AQI</span>
            <span className="sensor-value">{reading?.aqi != null ? reading.aqi : "—"}</span>
          </div>
          <div className="sensor-card">
            <span className="sensor-label">Temp</span>
            <span className="sensor-value">{reading?.temperature != null ? reading.temperature : "—"} <small>°C</small></span>
          </div>
        </div>
      </div>

      {/* Widget 4: Alerts */}
      <div className="widget widget--alerts">
        <div className="widget__header">
          <h3>Recent Alerts</h3>
          <Bell size={18} className="text-accent" />
        </div>
        <div className="alerts-feed">
          {alerts.length === 0 ? (
            <div className="alert-item alert-item--moderate">
              <CheckCircle size={18} />
              <div>
                <p className="alert-title">No unacknowledged alerts</p>
                <span className="alert-time">All clear</span>
              </div>
            </div>
          ) : (
            alerts.slice(0, 4).map((alert, index) => (
              <div
                key={alert.id ?? alert.alert_id ?? index}
                className="alert-item alert-item--moderate"
                style={{ cursor: "pointer" }}
                title="Click to acknowledge"
                onClick={() => onAcknowledge(alert)}
              >
                <AlertTriangle size={18} />
                <div>
                  <p className="alert-title">
                    {alert.severity === "critical" ? "Critical" : "Warning"}: {alert.message || alert.description || `Threshold breach on ${alert.node_id}`}
                  </p>
                  <span className="alert-time">{fmtTime(alert.created_at || alert.timestamp)} • {alert.node_id}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default function EmpyreanDashboardLayout({ user, onSignedOut }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [nodes, setNodes] = useState([]);
  const [latest, setLatest] = useState({});
  const [selectedNodeId, setSelectedNodeId] = useState("");
  const [history, setHistory] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [profile, setProfile] = useState(null);
  const [healthProfile, setHealthProfile] = useState("asthma");
  const [backendDown, setBackendDown] = useState(false);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);
  const historySeq = useRef(0);
  const initialLoadRef = useRef(false);

  const showToast = useCallback((message, kind = "error") => {
    setToast({ message, kind });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 5000);
  }, []);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const loadLatest = useCallback(async () => {
    try {
      const data = await getLatestReadings();
      const map = {};
      for (const r of data?.readings || []) map[r.node_id] = r;
      setLatest(map);
      setBackendDown(false);
    } catch {
      setBackendDown(true);
    }
  }, []);

  const loadAlerts = useCallback(async () => {
    try {
      const data = await getAlerts({ limit: 20 });
      setAlerts(data?.alerts || []);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    loadLatest();
    const id = setInterval(loadLatest, 5000);
    return () => clearInterval(id);
  }, [loadLatest]);

  useEffect(() => {
    loadAlerts();
    const id = setInterval(loadAlerts, 30000);
    return () => clearInterval(id);
  }, [loadAlerts]);

  useEffect(() => {
    if (initialLoadRef.current) return;
    initialLoadRef.current = true;
    let active = true;
    getNodes()
      .then((data) => {
        if (active) setNodes(Array.isArray(data) ? data : data?.nodes || []);
      })
      .catch((err) => {
        if (active && err instanceof ApiError) showToast(getErrorMessage(err));
      });
    getProfile()
      .then((data) => {
        if (active) {
          setProfile(data);
          if (data?.health_profile) setHealthProfile(data.health_profile);
        }
      })
      .catch((err) => {
        if (active && err instanceof ApiError) showToast(getErrorMessage(err));
      });
    return () => {
      active = false;
    };
  }, [showToast]);

  useEffect(() => {
    const socket = connectAlertsSocket({
      onAlert: () => {
        loadAlerts();
        loadLatest();
      },
    });
    return () => socket.close();
  }, [loadAlerts, loadLatest]);

  useEffect(() => {
    if (!selectedNodeId && nodes.length) {
      setSelectedNodeId(nodeIdOf(nodes[0]));
    }
  }, [nodes, selectedNodeId]);

  useEffect(() => {
    if (!selectedNodeId) return;
    let active = true;
    const load = async () => {
      const seq = ++historySeq.current;
      try {
        const to = new Date();
        const from = new Date(Date.now() - 24 * 3600 * 1000);
        const data = await getReadingsHistory({
          from: from.toISOString(),
          to: to.toISOString(),
          nodeId: selectedNodeId,
          bucket: "1h",
        });
        if (active && seq === historySeq.current) setHistory(data?.buckets || []);
      } catch (err) {
        if (active && seq === historySeq.current) {
          setHistory([]);
          if (err instanceof ApiError) showToast(getErrorMessage(err, "Couldn't load history"));
        }
      }
    };
    load();
    const id = setInterval(load, 60000);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, [selectedNodeId, showToast]);

  const handleAcknowledge = async (alert) => {
    const id = alert.id ?? alert.alert_id;
    if (id == null) return;
    try {
      await acknowledgeAlert(id);
      showToast("Alert acknowledged", "success");
      await loadAlerts();
    } catch (err) {
      showToast(getErrorMessage(err, "Couldn't acknowledge the alert"));
    }
  };

  const handleTogglePref = async (key, value) => {
    const prevPrefs = profile?.notification_prefs || {};
    const nextPrefs = { ...prevPrefs, [key]: value };
    setProfile((p) => ({ ...(p || {}), notification_prefs: nextPrefs }));
    try {
      const updated = await updateProfile({ notification_prefs: nextPrefs });
      if (updated) setProfile(updated);
    } catch (err) {
      setProfile((p) => ({ ...(p || {}), notification_prefs: prevPrefs }));
      showToast(getErrorMessage(err, "Couldn't save your notification preferences"));
    }
  };

  const handleProfileChange = async (profile) => {
    setHealthProfile(profile);
    try {
      const updated = await updateProfile({ health_profile: profile });
      if (updated) setProfile(updated);
      showToast("Health profile updated", "success");
    } catch (err) {
      setHealthProfile(healthProfile);
      showToast(getErrorMessage(err, "Couldn't save your health profile"));
    }
  };

  const handleSignOut = async () => {
    await logout();
    onSignedOut?.();
  };

  const selectedReading = latest[selectedNodeId];

  return (
    <div className="dashboard">
      <header className="dashboard__header">
        <div className="dashboard__logo">
          <div className="dashboard__logo-mark"><Wind size={18} color="#fff" strokeWidth={1.8} /></div>
          <span className="dashboard__logo-text">Empyrean</span>
        </div>
        <AqiTickerSpace reading={selectedReading} nodeId={selectedNodeId} backendDown={backendDown} />
        <div className="search">
          <Search size={16} color="rgba(255,255,255,0.7)" />
          <input type="text" placeholder="Search areas, devices, alerts" className="search__input" />
        </div>
        <Tooltip label="Notifications"><button className="icon-btn"><Bell size={19} strokeWidth={1.8} /><span className="icon-btn__dot" /></button></Tooltip>
        <ProfileMenu user={user ?? profile} onSignOut={handleSignOut} onSettings={() => setActiveTab("settings")} />
      </header>

      <div className="dashboard__body">
        <aside className="rail">
          <nav className="rail__nav">
            <IconRailButton icon={LayoutDashboard} label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
            <IconRailButton icon={MapIcon} label="Map (Geo-Visualisation)" active={activeTab === 'map'} onClick={() => setActiveTab('map')} />
            <IconRailButton icon={BarChart3} label="Analytics" active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} />
          </nav>
          <div className="rail__spacer" />
          <div className="rail__bottom">
            <IconRailButton icon={Cpu} label="Devices" active={activeTab === 'devices'} onClick={() => setActiveTab('devices')} />
            <div className="rail__divider" />
            <IconRailButton icon={Settings} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
          </div>
        </aside>

        <main className="main">
          {activeTab === "overview" && (
            <OverviewContent
              reading={selectedReading}
              history={history}
              alerts={alerts}
              onAcknowledge={handleAcknowledge}
            />
          )}
          {activeTab === "map" && <MapContent nodes={nodes} latest={latest} />}
          {activeTab === "analytics" && <AnalyticsContent history={history} />}
          {activeTab === "devices" && <DevicesContent nodes={nodes} latest={latest} />}
          {activeTab === "settings" && (
            <SettingsContent
              profile={profile}
              onTogglePref={handleTogglePref}
              activeProfile={healthProfile}
              onProfileChange={handleProfileChange}
            />
          )}
        </main>
      </div>

      <Toast toast={toast} />
    </div>
  );
}
