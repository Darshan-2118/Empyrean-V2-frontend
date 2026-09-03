import React from "react";
import styles from "../styles/Footer.module.css";
import empyreanLogo from "../assets/landing/final-logo.svg";

/*
 * Shared footer rendered once at the bottom of every page.
 * Links that map to a real route navigate (Dashboard, About Us); the rest are
 * rendered muted until their pages exist — same approach as the navbar.
 */
const PRODUCT_LINKS = [
  { label: "Dashboard", path: "dashboard" },
  { label: "API" },
  { label: "Sensor Hardware" },
  { label: "Data Archive" },
  { label: "Integrations" },
];

const COMPANY_LINKS = [
  { label: "About Us", path: "about" },
  { label: "Blog" },
  { label: "Careers" },
  { label: "Press" },
  { label: "Contact" },
];

const RESOURCE_LINKS = [
  { label: "Documentation" },
  { label: "Community" },
  { label: "Status" },
  { label: "Changelog" },
  { label: "Open Data" },
];

export default function Footer({ onNavigate }) {
  const renderLink = (item) => (
    <li key={item.label}>
      {item.path ? (
        <a
          href={`#${item.path}`}
          onClick={(e) => {
            e.preventDefault();
            onNavigate?.(item.path);
          }}
        >
          {item.label}
        </a>
      ) : (
        <a
          href="#"
          className={styles.linkMuted}
          aria-disabled="true"
          onClick={(e) => e.preventDefault()}
        >
          {item.label}
        </a>
      )}
    </li>
  );

  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.footerGrid}>
          <div className={styles.brandBlock}>
            <div className={styles.brandRow}>
              <img
                src={empyreanLogo}
                alt="Empyrean"
                className={styles.logoIcon}
              />
              <span className={styles.brandName}>EMPYREAN</span>
            </div>
            <p className={styles.brandTagline}>
              Real-time air quality monitoring for smarter, healthier cities.
            </p>
          </div>

          <div className={styles.footerCol}>
            <h3 className={styles.colTitle}>Product</h3>
            <ul className={styles.footerLinks}>
              {PRODUCT_LINKS.map(renderLink)}
            </ul>
          </div>

          <div className={styles.footerCol}>
            <h3 className={styles.colTitle}>Company</h3>
            <ul className={styles.footerLinks}>
              {COMPANY_LINKS.map(renderLink)}
            </ul>
          </div>

          <div className={styles.footerCol}>
            <h3 className={styles.colTitle}>Resources</h3>
            <ul className={styles.footerLinks}>
              {RESOURCE_LINKS.map(renderLink)}
            </ul>
          </div>
        </div>

        <div className={styles.footerBottom}>
          © {new Date().getFullYear()} Empyrean. All rights reserved.
        </div>
      </div>
    </footer>
  );
}