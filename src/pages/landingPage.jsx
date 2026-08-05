import React, { useEffect, useRef } from "react";
import styles from "../styles/landing.module.css";

/* ===== Feature icons (darker forest green inside sage badges) ===== */

function LeafIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M19.5 4.5c-7 0-13 3.5-13 12 0 1 .5 2 .5 2 8.5 0 12.5-5.5 12.5-14Z" />
      <path d="M19.5 4.5c-3 4-6.5 7.5-11 9" />
      <circle cx="14" cy="15" r="3.4" fill="currentColor" stroke="none" />
      <path d="M12.4 15l1.1 1.1 2.1-2.1" stroke="#8fae9f" strokeWidth="1.6" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="11.5" r="7" />
      <path d="M5 11.5h14" />
      <path d="M12 4.5c-2.5 2-3.5 4.5-3.5 7s1 5 3.5 7c2.5-2 3.5-4.5 3.5-7s-1-5-3.5-7Z" />
      <path d="M15.5 19.5l1 1.5" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 15v-4.5a6 6 0 1 1 12 0V15l1.6 2.2H4.4L6 15Z" />
      <path d="M10 20a2 2 0 0 0 4 0" />
    </svg>
  );
}

function TrendIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3.5 20.5h17" />
      <path d="M3.5 15l4-5 3 3 5-7" />
      <path d="M15.5 6.5h3.5v3.5" />
      <circle cx="7.5" cy="10" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="10.5" cy="13" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="6.5" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

function BatteryIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="8.5" width="15" height="7" rx="1.5" />
      <path d="M20.5 10.5v2.5" />
      <path d="M10.5 9.5l-2.5 3.5h3l-2.5 3.5" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z" />
      <path d="M10 13.5V12a2 2 0 0 1 4 0v1.5" />
      <rect x="9.5" y="13.5" width="5" height="4" rx="0.9" />
    </svg>
  );
}

const FEATURES = [
  { icon: <LeafIcon />, line1: "Real-Time", line2: "Monitoring" },
  { icon: <GlobeIcon />, line1: "Live Location", line2: "Tracking" },
  { icon: <BellIcon />, line1: "Smart", line2: "Notifications" },
  { icon: <TrendIcon />, line1: "Historical", line2: "Trends" },
  { icon: <BatteryIcon />, line1: "Long Battery", line2: "Life" },
  { icon: <EyeIcon />, line1: "Secure Data", line2: "Storage" },
];

/* Six balls sit on the orb's lower semicircle — right, lower-right,
   bottom-right, bottom-left, lower-left, left */
const ORBIT_CLASSES = [
  styles.orbitPos0,
  styles.orbitPos1,
  styles.orbitPos2,
  styles.orbitPos3,
  styles.orbitPos4,
  styles.orbitPos5,
];

export default function LandingPage({ onSwitchToHowItWorks }) {
  const pageRef = useRef(null);

  // Scroll-reveal: fade sections/cards up as they enter the viewport.
  useEffect(() => {
    const root = pageRef.current;
    if (!root) return undefined;

    const revealEls = root.querySelectorAll("[data-reveal]");
    if (!revealEls.length) return undefined;

    // Fallback for browsers without IntersectionObserver — show everything.
    if (!("IntersectionObserver" in window)) {
      revealEls.forEach((el) => el.classList.add(styles.revealed));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.revealed);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -48px 0px" },
    );

    revealEls.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [styles.revealed]);

  return (
    <div className={styles.pageContainer} ref={pageRef}>
      {/* ===== Hero (first viewport) ===== */}
      <section className={styles.hero}>
        <main className={styles.heroContent}>
          <h1 className={styles.wordmark}>EMPYREAN</h1>
          <p className={styles.tagline}>
            See the Invisible. Breathe with Confidence.
          </p>

          <div className={styles.textColumns}>
            <p className={styles.textLeft}>
              Understand the quality of the air around you through a simple,
              intuitive experience
            </p>
            <p className={styles.textRight}>
              Choose cleaner routes, discover healthier places, and make
              smarter decisions every day
            </p>
          </div>
        </main>

        {/* Centerpiece orb — continues into the features section below */}
        <div className={styles.orbWrap} aria-hidden="true">
          <div className={styles.orbOuterRing}></div>
          <div className={styles.orbGlow}></div>
        </div>

        <button
          type="button"
          className={styles.trackButton}
          onClick={() => onSwitchToHowItWorks?.()}
        >
          Track &gt;&gt;&gt;
        </button>
      </section>

      {/* ===== Features (balls on the orb's lower half, labels outside) ===== */}
      <section data-reveal className={`${styles.features} ${styles.reveal}`}>
        <div className={styles.featuresRow}>
          {FEATURES.map((feature, index) => (
            <div
              key={feature.line1 + feature.line2}
              data-reveal
              className={`${styles.featureItem} ${ORBIT_CLASSES[index]} ${styles.reveal}`}
              style={{ "--reveal-delay": `${index * 90}ms` }}
            >
              <div className={styles.featureBadge}>{feature.icon}</div>
              <p className={styles.featureLabel}>
                {feature.line1}
                <span className={styles.labelLine2}>{feature.line2}</span>
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
