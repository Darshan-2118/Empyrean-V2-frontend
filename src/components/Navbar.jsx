import React, { useEffect, useState, useRef } from "react";
import { Menu, X } from "lucide-react";
import styles from "../styles/Navbar.module.css";
import empyreanLogo from "../assets/landing/final-logo.svg";

const NAV = [
  { label: "Home", path: "landing" },
  { label: "How it works?", path: "howItWorks" },
  { label: "Features", path: "features" },
  { label: "Live Map", path: "liveMap" },
  { label: "About", path: "about" },
];

const LANDING_SECTIONS = {
  landing: "home",
  howItWorks: "howItWorks",
  features: "features",
  liveMap: "liveMap",
  about: "about",
};

const SECTION_PATHS = {
  home: "landing",
  howItWorks: "howItWorks",
  features: "features",
  liveMap: "liveMap",
  about: "landing",
};

const SCROLL_SPY_OFFSET = 120;

function ProfileDropdown({ user, onNavigate, onSettings, onSignOut }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const initial = (user?.username ?? "U").charAt(0).toUpperCase();

  return (
    <div className={styles.profileDropdown} ref={ref}>
      <button
        className={styles.profileAvatar}
        onClick={() => setOpen(!open)}
        aria-label="User menu"
      >
        <span className={styles.profileAvatarText}>{initial}</span>
      </button>
      {open && (
        <div className={styles.profileDropdownMenu}>
          <div className={styles.profileDropdownHeader}>
            <span className={styles.profileDropdownName}>{user?.username ?? "User"}</span>
            <span className={styles.profileDropdownEmail}>{user?.email ?? ""}</span>
          </div>
          <button
            className={styles.profileDropdownItem}
            onClick={() => { setOpen(false); onNavigate?.("dashboard"); }}
          >
            Dashboard
          </button>
          <button
            className={styles.profileDropdownItem}
            onClick={() => { setOpen(false); onSettings?.(); }}
          >
            Account Settings
          </button>
          <button
            className={`${styles.profileDropdownItem} ${styles.profileDropdownItemDanger}`}
            onClick={() => { setOpen(false); onSignOut?.(); }}
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}

export default function Navbar({ active, onNavigate, auth, onSettings, onSignOut }) {
  const [landingSection, setLandingSection] = useState("home");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isDashboard = active === "dashboard";
  const isAdminDashboard = active === "adminDashboard";
  const isCompact = isDashboard || isAdminDashboard;

  // Scroll-spy: while on the landing page, keep the matching nav item active
  // (with its underline animation) as the user scrolls between sections.
  useEffect(() => {
    if (active !== "landing") {
      setLandingSection("home");
      return undefined;
    }

    const sectionIds = Object.values(LANDING_SECTIONS);
    let ticking = false;

    const update = () => {
      let current = "home";
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= SCROLL_SPY_OFFSET) {
          current = id;
        }
      }
      setLandingSection(current);
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          update();
          ticking = false;
        });
        ticking = true;
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [active]);

  const displayActive = active === "landing" ? SECTION_PATHS[landingSection] : active;
  const go = (path) => (e) => {
    e.preventDefault();
    setIsSidebarOpen(false);
    onNavigate?.(path);
  };

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  // On the user dashboard the global Navbar is not rendered (the dashboard has
  // its own header bar with the logo).
  if (isDashboard) return null;

  return (
    <nav className={`${styles.navbar} ${isAdminDashboard ? styles.navbarCompact : ""}`}>
      <a
        href="#home"
        className={styles.brand}
        aria-label="Empyrean — go to home"
        onClick={go("landing")}
      >
        <img src={empyreanLogo} alt="Empyrean" className={styles.logoIcon} />
        <span className={styles.logoText}>EMPYREAN</span>
      </a>

      {!isAdminDashboard && (
        <>
          <div className={styles.desktopLinks}>
            <div className={styles.links}>
              {NAV.map((item) =>
                item.disabled ? (
                  <a
                    key={item.label}
                    href="#map"
                    className={styles.disabled}
                    aria-disabled="true"
                    role="link"
                    onClick={(e) => e.preventDefault()}
                  >
                    {item.label}
                  </a>
                ) : (
                  <a
                    key={item.label}
                    href={`#${item.path}`}
                    className={item.path === displayActive ? styles.navActive : undefined}
                    onClick={go(item.path)}
                  >
                    {item.label}
                  </a>
                ),
              )}
            </div>

            <div className={styles.authActions}>
              {auth?.isAuthenticated ? (
                <ProfileDropdown
                  user={auth.user}
                  onNavigate={onNavigate}
                  onSettings={onSettings}
                  onSignOut={onSignOut}
                />
              ) : (
                <>
                  <button
                    type="button"
                    className={styles.authBtn}
                    onClick={() => onNavigate?.("login")}
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    className={`${styles.authBtn} ${styles.authBtnPrimary}`}
                    onClick={() => onNavigate?.("register")}
                  >
                    Register
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Mobile Hamburger */}
          <button
            className={styles.hamburger}
            onClick={toggleSidebar}
            aria-label="Toggle Menu"
          >
            {isSidebarOpen ? <X size={28} /> : <Menu size={28} />}
          </button>

          {/* Mobile Sidebar */}
          <div
            className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ""}`}
          >
            <div className={styles.sidebarLinks}>
              {NAV.map((item) =>
                item.disabled ? (
                  <span
                    key={item.label}
                    className={styles.disabled}
                    aria-disabled="true"
                    role="link"
                  >
                    {item.label}
                  </span>
                ) : (
                  <button
                    key={item.label}
                    type="button"
                    className={
                      item.path === displayActive ? styles.navActive : undefined
                    }
                    onClick={go(item.path)}
                  >
                    {item.label}
                  </button>
                ),
              )}
            </div>
            <div className={styles.sidebarAuth}>
              {auth?.isAuthenticated ? (
                <ProfileDropdown
                  user={auth.user}
                  onNavigate={onNavigate}
                  onSettings={onSettings}
                  onSignOut={onSignOut}
                />
              ) : (
                <>
                  <button
                    type="button"
                    className={`${styles.authBtn} ${styles.authBtnPrimary}`}
                    onClick={() => { setIsSidebarOpen(false); onNavigate?.("login"); }}
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    className={`${styles.authBtn} ${styles.authBtnPrimary}`}
                    onClick={() => { setIsSidebarOpen(false); onNavigate?.("register"); }}
                  >
                    Register
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Overlay for sidebar */}
          {isSidebarOpen && (
            <div className={styles.overlay} onClick={toggleSidebar} />
          )}
        </>
      )}
    </nav>
  );
}
