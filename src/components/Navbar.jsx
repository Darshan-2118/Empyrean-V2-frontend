import React from "react";
import styles from "../styles/Navbar.module.css";
import empyreanLogo from "../assets/landing/final-logo.svg";

/*
 * Shared navbar rendered once at the top of every page.
 * Brand (logo + name) on the left always routes home; the page links are the
 * single source of navigation between pages. "Live Map" has no page yet, so it
 * stays visible but disabled until a real map page exists.
 */
const NAV = [
  { label: "Home", path: "landing" },
  { label: "How it works?", path: "howItWorks" },
  { label: "Features", path: "features" },
  { label: "Live Map", disabled: true },
  { label: "About", path: "about" },
];

export default function Navbar({ active, onNavigate }) {
  const go = (path) => (e) => {
    e.preventDefault();
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
            >
              {item.label}
            </a>
          ) : (
            <a
              key={item.label}
              href={`#${item.path}`}
              className={item.path === active ? styles.navActive : undefined}
              onClick={go(item.path)}
            >
              {item.label}
            </a>
          ),
        )}
      </div>
    </nav>
  );
}