import React, { useEffect, useState } from "react";
import styles from "../styles/Navbar.module.css";
import empyreanLogo from "../assets/landing/final-logo.svg";

/*
 * Shared navbar rendered once at the top of every page.
 * Brand (logo + name) on the left always routes home; the page links are the
 * single source of navigation between pages. On the landing page the inline
 * sections are reused for smooth one-page scrolling, and the URL is updated
 * with a matching hash so deep links work; on any other page the links
 * navigate to their dedicated route.
 */
const NAV = [
  { label: "Home", path: "landing" },
  { label: "How it works?", path: "howItWorks" },
  { label: "Features", path: "features" },
  { label: "Live Map", path: "liveMap" },
  { label: "About", path: "about" },
];

/* Landing-page section id served by each nav target when on the landing page. */
const LANDING_SECTIONS = {
  landing: "home",
  howItWorks: "howItWorks",
  features: "features",
  liveMap: "liveMap",
  about: "about",
};

/* Reverse mapping: section id -> nav path, for the landing scroll-spy. */
const SECTION_PATHS = {
  home: "landing",
  howItWorks: "howItWorks",
  features: "features",
  liveMap: "liveMap",
  about: "about",
};

/* Distance from the top at which a section counts as the current one. */
const SCROLL_SPY_OFFSET = 120;

export default function Navbar({ active, onNavigate, auth }) {
  const [landingSection, setLandingSection] = useState("home");

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
    // Navigate to the page route
    onNavigate?.(path);
  };

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
          <span className={styles.authUser}>
            {auth.user?.username ?? "Account"}
          </span>
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
    </nav>
  );
}