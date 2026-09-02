import React, { useEffect, useRef, useState } from "react";
import styles from "../styles/Features.module.css";

import realTimeIcon from "../assets/landing/real-time.svg";
import locationIcon from "../assets/landing/location-tracking.svg";
import secureIcon from "../assets/landing/secure-data.svg";
import notificationIcon from "../assets/landing/notification.svg";
import trendsIcon from "../assets/landing/trends.svg";
import batteryIcon from "../assets/landing/battery.svg";
import profileIcon from "../assets/landing/Profile-icon.svg";
import trackingIcon from "../assets/landing/Tracking.svg";

/* ===== Core capabilities shipped with Empyrean ===== */

const FEATURES = [
  {
    num: "01",
    icon: realTimeIcon,
    title: "Real-Time Tracking",
    text: "A wearable device with ESP32, MQ135 gas sensor, and GPS that captures exactly what you breathe — every second, wherever you go.",
  },
  {
    num: "02",
    icon: profileIcon,
    title: "Health Modes",
    text: "Asthma, Child, and Elderly modes recalibrate danger thresholds specifically to your body and your condition.",
  },
  {
    num: "03",
    icon: batteryIcon,
    title: "Smart AQI Engine",
    text: "Fuzzy inference converts raw sensor data into a clear 0–100 AQI score right on the device — no guessing, no apps required.",
  },
  {
    num: "04",
    icon: locationIcon,
    title: "Live Geo-Visualization",
    text: "An interactive Leaflet map paints your route green-to-red, showing safe zones vs. hotspots as you move.",
  },
  {
    num: "05",
    icon: notificationIcon,
    title: "Multi-Modal Alerts",
    text: "Buzzer, LED, and push notifications, tiered by severity, so you're warned instantly — even before symptoms appear.",
  },
  {
    num: "06",
    icon: trendsIcon,
    title: "Analytics Dashboard",
    text: "Daily and weekly exposure trends plus anomaly detection, shared with you and your healthcare provider in one view.",
  },
  {
    num: "07",
    icon: trackingIcon,
    title: "Smart-City Contribution",
    text: "Anonymized crowd data builds city-wide heatmaps for planners and public-health authorities.",
  },
];

/* ===== The three pillars of the product ===== */

const PILLARS = [
  {
    name: "Personal Protection",
    meta: "built around you",
    desc: "Empyrean is first a health device. It measures the air in your immediate bubble and protects you the moment conditions turn risky — using thresholds tuned to you, not a city average.",
    bullets: [
      "Wearable real-time sensor keeps you covered everywhere",
      "Health-specific threshold profiles for Asthma, Child & Elderly",
      "Tiered buzzer, LED, and push alerts the second danger appears",
    ],
  },
  {
    name: "Intelligent Insight",
    meta: "data made decidable",
    desc: "Raw sensor noise is turned into decisions humans can act on. A fuzzy AQI engine scores the air, and the dashboard turns readings into trends a doctor can actually read.",
    bullets: [
      "Fuzzy-inference AQI scoring straight on the device",
      "Live map that paints safe zones vs. hotspots",
      "Exposure trends and anomaly detection you can share",
    ],
  },
  {
    name: "Community Impact",
    meta: "your data, crowdsourced",
    desc: "Every anonymized reading contributes to a shared picture of the city. What protects you personally also warns your neighbourhood and informs the planners who shape it.",
    bullets: [
      "Crowd-sourced city-wide air quality heatmaps",
      "Anonymized data that can never be traced back to you",
      "Trusted inputs for urban planners and public health",
    ],
  },
];

export default function FeaturesPage({ onSwitchToLogin, onSwitchToRegister }) {
  const pageRef = useRef(null);
  const [active, setActive] = useState(0);
  const current = PILLARS[active];

  // Scroll-reveal: fade elements up as they enter the viewport.
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
      {/* Glowing background accents */}
      <div className={styles.glowBlob1}></div>
      <div className={styles.glowBlob2}></div>

      <div className={styles.page}>
        {/* Hero */}
        <header className={styles.hero}>
          <p className={styles.eyebrow}>Empyrean</p>
          <h1 className={styles.heroTitle}>Features</h1>
          <p className={styles.heroSubtitle}>
            Empyrean connects advanced hardware sensors with intelligent cloud
            analytics. Explore the capabilities that turn raw air readings into
            a life-saving, personal health tool.
          </p>
        </header>

        {/* Core capabilities */}
        <section data-reveal className={`${styles.section} ${styles.reveal}`}>
          <h2 className={styles.sectionTitle}>Core Capabilities</h2>
          <p className={styles.sectionSubtitle}>
            Seven features, one purpose — protecting your lungs with data that
            is personal, precise, and actionable.
          </p>

          <div className={styles.featureGrid}>
            {FEATURES.map((feature, index) => (
              <div
                key={feature.num}
                data-reveal
                className={`${styles.featureCard} ${styles.reveal}`}
                style={{ "--reveal-delay": `${(index % 3) * 110}ms` }}
              >
                <span className={styles.featureNum}>{feature.num}</span>
                <img
                  src={feature.icon}
                  alt=""
                  className={styles.featureIcon}
                />
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureText}>{feature.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Three pillars — interactive selector */}
        <section data-reveal className={`${styles.section} ${styles.reveal}`}>
          <h2 className={styles.sectionTitle}>Three Pillars</h2>
          <p className={styles.sectionSubtitle}>
            Every Empyrean feature maps to one of three pillars — protection,
            insight, or collective impact. Pick a pillar to see how they work
            together.
          </p>

          <div className={styles.pillarSelector}>
            <div className={styles.pillarTabs} role="tablist">
              {PILLARS.map((pillar, index) => (
                <button
                  key={pillar.name}
                  type="button"
                  role="tab"
                  aria-selected={active === index}
                  className={`${styles.pillarTab} ${active === index ? styles.pillarTabActive : ""
                    }`}
                  onClick={() => setActive(index)}
                >
                  {pillar.name}
                </button>
              ))}
            </div>

            <div className={styles.pillarPanel} role="tabpanel">
              <div className={styles.panelHead}>
                <h3 className={styles.pillarName}>{current.name}</h3>
                <span className={styles.panelMeta}>{current.meta}</span>
              </div>

              <p className={styles.pillarDesc}>{current.desc}</p>

              <div className={styles.pillarBullets}>
                {current.bullets.map((bullet) => (
                  <span key={bullet} className={styles.pillarBullet}>
                    {bullet}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section data-reveal className={`${styles.cta} ${styles.reveal}`}>
          <div className={styles.ctaGlow}></div>
          <h2 className={styles.ctaTitle}>Ready to breathe smarter?</h2>
          <p className={styles.ctaText}>
            Create your Empyrean account, set your health profile, and start
            using every feature today.
          </p>
          <div className={styles.ctaButtons}>
            {typeof onSwitchToRegister === "function" && (
              <button
                type="button"
                className={styles.primaryButton}
                onClick={() => onSwitchToRegister()}
              >
                Get Started
              </button>
            )}

          </div>
        </section>
      </div>
    </div>
  );
}