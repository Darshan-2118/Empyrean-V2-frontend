import { useState, useRef, useEffect } from "react";
import {
  Wind,
  Search,
  Bell,
  ChevronDown,
  User,
  Users,
  LogOut,
  Settings,
  Cpu,
  LayoutDashboard,
  Map as MapIcon,
  BarChart3,
} from "lucide-react";
import "../styles/dashboardLayout.css";

function Tooltip({ label, children, position = "bottom" }) {
  return (
    <div className={`tooltip ${position === "right" ? "tooltip--right" : ""}`}>
      {children}
      <span className="tooltip__label">{label}</span>
    </div>
  );
}

function IconRailButton({ icon: Icon, label, active }) {
  return (
    <Tooltip label={label} position="right">
      <button
        aria-label={label}
        className={`rail-btn ${active ? "rail-btn--active" : ""}`}
      >
        <Icon size={20} strokeWidth={1.8} />
      </button>
    </Tooltip>
  );
}

function AqiTickerSpace() {
  // Ranking data will populate this space once the mapped areas are wired in.
  // Left empty on purpose -- placeholder skeleton chips only, no place names or scores yet.
  const placeholders = new Array(6).fill(0);
  return (
    <div className="ticker">
      <div className="ticker__gradient" />
      <div className="ticker__content">
        <span className="ticker__label">Bengaluru · AQI rank</span>
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
        <button
          onClick={() => setOpen((v) => !v)}
          className={`profile-btn ${open ? "profile-btn--open" : ""}`}
        >
          <div className="profile-avatar">
            <User size={16} strokeWidth={2} />
          </div>
          <ChevronDown
            size={16}
            className={`profile-chevron ${open ? "profile-chevron--open" : ""}`}
          />
        </button>
      </Tooltip>

      {open && (
        <div className="dropdown">
          <div className="dropdown__header">
            <p className="dropdown__title">Signed in</p>
            <p className="dropdown__subtitle">Field operator account</p>
          </div>
          <MenuItem icon={Users} text="Switch user" />
          <MenuItem icon={User} text="Account settings" />
          <MenuItem icon={LogOut} text="Sign out" danger />
        </div>
      )}
    </div>
  );
}

function MenuItem({ icon: Icon, text, danger }) {
  return (
    <button className={`menu-item ${danger ? "menu-item--danger" : ""}`}>
      <Icon size={16} strokeWidth={1.8} />
      {text}
    </button>
  );
}

function NotificationBell() {
  return (
    <Tooltip label="Notifications">
      <button className="icon-btn" aria-label="Notifications">
        <Bell size={19} strokeWidth={1.8} />
        <span className="icon-btn__dot" />
      </button>
    </Tooltip>
  );
}

export default function EmpyreanDashboardLayout() {
  return (
    <div className="dashboard">
      {/* Top bar: full width, logo lives here */}
      <header className="dashboard__header">
        {/* Logo + wordmark */}
        <div className="dashboard__logo">
          <div className="dashboard__logo-mark">
            <Wind size={18} color="#fff" strokeWidth={2} />
          </div>
          <span className="dashboard__logo-text">Empyrean</span>
        </div>

        {/* AQI ranking ticker space */}
        <AqiTickerSpace />

        {/* Search */}
        <div className="search">
          <Search size={16} color="#7b8290" />
          <input
            type="text"
            placeholder="Search areas, devices, alerts"
            className="search__input"
          />
        </div>

        {/* Bell */}
        <NotificationBell />

        {/* Profile */}
        <ProfileMenu />
      </header>

      {/* Below top bar: left rail + main content */}
      <div className="dashboard__body">
        {/* Left icon rail -- starts below the top bar */}
        <aside className="rail">
          <nav className="rail__nav">
            <IconRailButton icon={LayoutDashboard} label="Overview" active />
            <IconRailButton icon={MapIcon} label="Map" />
            <IconRailButton icon={BarChart3} label="Analytics" />
          </nav>

          <div className="rail__spacer" />

          <div className="rail__bottom">
            <IconRailButton icon={Cpu} label="Devices" />
            <div className="rail__divider" />
            <IconRailButton icon={Settings} label="Settings" />
          </div>
        </aside>

        {/* Main content placeholder */}
        <main className="main">
          <div className="main__placeholder">Main content area</div>
        </main>
      </div>
    </div>
  );
}
