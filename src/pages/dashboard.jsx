import { useState, useRef, useEffect } from "react";
import {
  Wind, Search, Bell, ChevronDown, User, Users, LogOut, Settings, Cpu,
  LayoutDashboard, Map as MapIcon, BarChart3, Activity, AlertTriangle, CheckCircle
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
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

  return (
    <div className="dashboard">
      <header className="dashboard__header">
        <div className="dashboard__logo">
          <div className="dashboard__logo-mark"><Wind size={18} color="#fff" strokeWidth={2} /></div>
          <span className="dashboard__logo-text">Empyrean</span>
        </div>
        <AqiTickerSpace />
        <div className="search">
          <Search size={16} color="rgba(255,255,255,0.7)" />
          <input type="text" placeholder="Search areas, devices, alerts" className="search__input" />
        </div>
        <Tooltip label="Notifications"><button className="icon-btn"><Bell size={19} strokeWidth={1.8} /><span className="icon-btn__dot" /></button></Tooltip>
        <ProfileMenu />
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
          {activeTab === "overview" && <OverviewContent />}
          {activeTab !== "overview" && (
            <div className="main__placeholder">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} functionality coming soon!
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
