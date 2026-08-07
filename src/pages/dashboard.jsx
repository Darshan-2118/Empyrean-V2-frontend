import { useState, useRef, useEffect } from "react";
import {
  Wind, Search, Bell, ChevronDown, User, Users, LogOut, Settings, Cpu,
  LayoutDashboard, Map as MapIcon, BarChart3, Activity, AlertTriangle, CheckCircle,
  Battery, MapPin, RefreshCw, Plus, Wifi, Menu
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./EmpyreanDashboardLayout.css";

// Sample Data for Recharts
const mockChartData = [
  { time: '08:00', pm25: 12 },
  { time: '09:00', pm25: 15 },
  { time: '10:00', pm25: 25 },
  { time: '11:00', pm25: 45 },
  { time: '12:00', pm25: 30 },
  { time: '13:00', pm25: 18 },
  { time: '14:00', pm25: 22 },
];

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

function AqiTickerSpace() {
  const placeholders = new Array(6).fill(0);
  return (
    <div className="ticker">
      <div className="ticker__gradient" />
      <div className="ticker__content">
        <span className="ticker__label">Bengaluru · AQI: 85 (Moderate)</span>
        {placeholders.map((_, i) => (
          <span key={i} className="ticker__chip" />
        ))}
      </div>
    </div>
  );
}

function ProfileMenu() {
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
            <p className="dropdown__title">Signed in</p>
            <p className="dropdown__subtitle">Asthma Profile Active</p>
          </div>
          <MenuItem icon={Users} text="Switch Profile" />
          <MenuItem icon={Settings} text="Account settings" />
          <MenuItem icon={LogOut} text="Sign out" danger />
        </div>
      )}
    </div>
  );
}

function MenuItem({ icon: Icon, text, danger }) {
  return (
    <button className={`menu-item ${danger ? "menu-item--danger" : ""}`}>
      <Icon size={16} strokeWidth={1.8} /> {text}
    </button>
  );
}

function MapContent() {
  const center = [12.9716, 77.5946];
  return (
    <div className="map-wrapper" style={{ height: "100%", width: "100%", borderRadius: "24px", overflow: "hidden", border: "1px solid var(--border-color)", zIndex: 0 }}>
      <MapContainer center={center} zoom={13} style={{ height: "100%", width: "100%", zIndex: 1 }}>
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; CARTO'
        />
        <CircleMarker center={[12.9716, 77.5946]} radius={20} pathOptions={{ color: '#ff6b6b', fillColor: '#ff6b6b', fillOpacity: 0.4 }}>
          <Popup>
            <div style={{ color: '#333' }}>
              <strong>Device: WQM_001</strong><br />
              AQI: 145 (Unhealthy)<br />
              PM2.5: 55 &mu;g/m&sup3;
            </div>
          </Popup>
        </CircleMarker>
        <CircleMarker center={[12.9650, 77.6000]} radius={15} pathOptions={{ color: '#fbbf24', fillColor: '#fbbf24', fillOpacity: 0.4 }}>
          <Popup>
            <div style={{ color: '#333' }}>
              <strong>Device: WQM_002</strong><br />
              AQI: 85 (Moderate)<br />
              PM2.5: 22 &mu;g/m&sup3;
            </div>
          </Popup>
        </CircleMarker>
        <CircleMarker center={[12.9800, 77.5800]} radius={15} pathOptions={{ color: '#4cdbaf', fillColor: '#4cdbaf', fillOpacity: 0.4 }}>
          <Popup>
            <div style={{ color: '#333' }}>
              <strong>Device: WQM_003</strong><br />
              AQI: 40 (Good)<br />
              PM2.5: 10 &mu;g/m&sup3;
            </div>
          </Popup>
        </CircleMarker>
      </MapContainer>
    </div>
  );
}

function AnalyticsContent() {
  const detailedChartData = [
    { time: '00:00', pm25: 15, pm10: 20, co2: 400 },
    { time: '04:00', pm25: 12, pm10: 18, co2: 390 },
    { time: '08:00', pm25: 35, pm10: 45, co2: 450 },
    { time: '12:00', pm25: 55, pm10: 70, co2: 520 },
    { time: '16:00', pm25: 45, pm10: 60, co2: 480 },
    { time: '20:00', pm25: 25, pm10: 35, co2: 420 },
  ];

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
              <Line yAxisId="right" type="monotone" name="CO2 (ppm)" dataKey="co2" stroke="#4cdbaf" strokeWidth={3} dot={{ r: 4 }} />
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
            Your highest exposure occurred at 12:00 PM (Moderate Risk).
          </p>
          <div className="stat-row">
            <span className="stat-label">Avg PM2.5:</span> 
            <span className="stat-val">31 µg/m³</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Peak PM10:</span> 
            <span className="stat-val" style={{ color: '#fbbf24' }}>70 µg/m³</span>
          </div>
          <div className="stat-row" style={{ borderBottom: 'none' }}>
            <span className="stat-label">Safe Hours:</span> 
            <span className="stat-val" style={{ color: '#4cdbaf' }}>14 hours</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function DevicesContent() {
  return (
    <div className="devices-grid">
      <div className="widget widget--full" style={{ padding: '0', overflow: 'hidden' }}>
        <div className="widget__header" style={{ padding: '24px 24px 0 24px' }}>
          <h3>Paired Devices</h3>
          <button className="add-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--accent-color)', color: '#08201a', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
            <Plus size={16} /> Add Device
          </button>
        </div>
        <div className="device-list" style={{ padding: '24px' }}>
          <div className="device-card">
            <div className="device-card__header">
              <div className="device-info">
                <h4>Wearable AQI Monitor (WQM_001)</h4>
                <span className="device-status device-status--online">
                  <span className="status-dot"></span> Online
                </span>
              </div>
              <div className="device-battery">
                <Battery size={20} className="text-accent" />
                <span>78%</span>
              </div>
            </div>
            
            <div className="device-diagnostics">
              <div className="diag-item">
                <Cpu size={16} style={{ color: 'var(--text-secondary)' }} />
                <span>ESP32 Core</span>
                <strong style={{ color: 'var(--safe-color)' }}>Active</strong>
              </div>
              <div className="diag-item">
                <Wind size={16} style={{ color: 'var(--text-secondary)' }} />
                <span>MQ135 (Gas)</span>
                <strong style={{ color: 'var(--safe-color)' }}>Calibrated</strong>
              </div>
              <div className="diag-item">
                <Activity size={16} style={{ color: 'var(--text-secondary)' }} />
                <span>PMS5003 (PM)</span>
                <strong style={{ color: 'var(--safe-color)' }}>Reading</strong>
              </div>
              <div className="diag-item">
                <MapPin size={16} style={{ color: 'var(--text-secondary)' }} />
                <span>Neo-6M GPS</span>
                <strong style={{ color: 'var(--warning-color)' }}>3D Fix</strong>
              </div>
            </div>
            
            <div className="device-footer">
              <span className="sync-time"><RefreshCw size={14} /> Last sync: 15 seconds ago via MQTT</span>
              <button className="manage-btn">Manage Settings</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsContent() {
  const [activeProfile, setActiveProfile] = useState("asthma");

  return (
    <div className="settings-grid">
      <div className="widget widget--full">
        <div className="widget__header" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
          <h3>Health Profile Configuration</h3>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Customize your alert thresholds based on your specific health needs.</p>
        </div>
        <div className="profiles-container">
          
          <div className={`profile-card ${activeProfile === 'asthma' ? 'profile-card--active' : ''}`} onClick={() => setActiveProfile('asthma')}>
            <div className="profile-card__header">
              <h4>Asthma Mode</h4>
              {activeProfile === 'asthma' && <CheckCircle size={18} className="text-accent" />}
            </div>
            <p>For Asthma / COPD patients. High sensitivity; triggers on mild breach of PM2.5, NO&amp;#8322;, Ozone.</p>
          </div>

          <div className={`profile-card ${activeProfile === 'child' ? 'profile-card--active' : ''}`} onClick={() => setActiveProfile('child')}>
            <div className="profile-card__header">
              <h4>Child Mode</h4>
              {activeProfile === 'child' && <CheckCircle size={18} className="text-accent" />}
            </div>
            <p>For children under 12. Highest sensitivity; strictest limits across all pollutants.</p>
          </div>

          <div className={`profile-card ${activeProfile === 'elderly' ? 'profile-card--active' : ''}`} onClick={() => setActiveProfile('elderly')}>
            <div className="profile-card__header">
              <h4>Elderly Mode</h4>
              {activeProfile === 'elderly' && <CheckCircle size={18} className="text-accent" />}
            </div>
            <p>For adults over 65. Moderate sensitivity; focus on sustained exposure to PM2.5, CO&amp;#8322;, NO&amp;#8322;.</p>
          </div>

          <div className={`profile-card ${activeProfile === 'general' ? 'profile-card--active' : ''}`} onClick={() => setActiveProfile('general')}>
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
              <input type="checkbox" defaultChecked />
              <span className="slider"></span>
            </label>
          </div>
          <div className="setting-item">
            <div className="setting-info">
              <h4>Email Reports</h4>
              <p>Receive daily exposure summary reports.</p>
            </div>
            <label className="toggle-switch">
              <input type="checkbox" />
              <span className="slider"></span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

// THE NEW DASHBOARD CONTENT WIDGETS
function OverviewContent() {
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
            <LineChart data={mockChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
            <span className="sensor-value">22 <small>µg/m³</small></span>
          </div>
          <div className="sensor-card">
            <span className="sensor-label">PM10</span>
            <span className="sensor-value">34 <small>µg/m³</small></span>
          </div>
          <div className="sensor-card">
            <span className="sensor-label">CO2</span>
            <span className="sensor-value">412 <small>ppm</small></span>
          </div>
          <div className="sensor-card">
            <span className="sensor-label">NH3</span>
            <span className="sensor-value">0.8 <small>ppm</small></span>
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
          <div className="alert-item alert-item--moderate">
            <AlertTriangle size={18} />
            <div>
              <p className="alert-title">Moderate PM2.5 detected</p>
              <span className="alert-time">11:00 AM • Recommend reducing outdoor activity</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EmpyreanDashboardLayout() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="dashboard">
      <header className="dashboard__header">
        <button className="icon-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          <Menu size={24} strokeWidth={1.8} />
        </button>
        <AqiTickerSpace />
        <div className="search">
          <Search size={16} color="rgba(255,255,255,0.7)" />
          <input type="text" placeholder="Search areas, devices, alerts" className="search__input" />
        </div>
        <Tooltip label="Notifications"><button className="icon-btn"><Bell size={19} strokeWidth={1.8} /><span className="icon-btn__dot" /></button></Tooltip>
        <ProfileMenu />
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
          {activeTab === "overview" && <OverviewContent />}
          {activeTab === "map" && <MapContent />}
          {activeTab === "analytics" && <AnalyticsContent />}
          {activeTab === "devices" && <DevicesContent />}
          {activeTab === "settings" && <SettingsContent />}
        </main>
      </div>
    </div>
  );
}
