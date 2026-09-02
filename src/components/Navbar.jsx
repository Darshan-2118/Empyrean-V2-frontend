import React, { useEffect, useState } from "react";
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
  about: "about",
};

const SCROLL_SPY_OFFSET = 120;

export default function Navbar({ active, onNavigate, auth }) {
  const [landingSection, setLandingSection] = useState("home");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <nav className={styles.navbar}>
      <a
        href="#home"
        className={styles.brand}
        aria-label="Empyrean — go to home"
        onClick={go("landing")}
      >
        <img src={empyreanLogo} alt="Empyrean" className={styles.logoIcon} />
        <span className={styles.logoText}>EMPYREAN</span>
      </a>

      {/* Desktop Links */}
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
                href={'#' + item.path}
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
            <span className={styles.authUser}>
              {auth.user?.username ?? "Account"}
            </span>
          ) : (
            <>
              <button
                type="button"
                className={styles.authBtn}
                onClick={() => { setIsSidebarOpen(false); onNavigate?.("login"); }}
              >
                Login
              </button>
              <button
                type="button"
                className={styles.authBtn + ' ' + styles.authBtnPrimary}
                onClick={() => { setIsSidebarOpen(false); onNavigate?.("register"); }}
              >
                Register
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile Hamburger */}
      <button className={styles.hamburger} onClick={toggleSidebar} aria-label="Toggle Menu">
        {isSidebarOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Mobile Sidebar */}
      <div className={styles.sidebar + ' ' + (isSidebarOpen ? styles.sidebarOpen : '')}>
        <div className={styles.sidebarLinks}>
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
                href={'#' + item.path}
                className={item.path === displayActive ? styles.navActive : undefined}
                onClick={go(item.path)}
              >
                {item.label}
              </a>
            ),
          )}
        </div>
        <div className={styles.sidebarAuth}>
          {auth?.isAuthenticated ? (
            <span className={styles.authUser}>
              {auth.user?.username ?? "Account"}
            </span>
          ) : (
            <>
              <button
                type="button"
                className={styles.authBtn}
                onClick={() => { setIsSidebarOpen(false); onNavigate?.("login"); }}
              >
                Login
              </button>
              <button
                type="button"
                className={styles.authBtn + ' ' + styles.authBtnPrimary}
                onClick={() => { setIsSidebarOpen(false); onNavigate?.("register"); }}
              >
                Register
              </button>
            </>
          )}
        </div>
      </div>
      
      {/* Overlay for sidebar */}
      {isSidebarOpen && <div className={styles.overlay} onClick={() => setIsSidebarOpen(false)}></div>}
    </nav>
  );
}