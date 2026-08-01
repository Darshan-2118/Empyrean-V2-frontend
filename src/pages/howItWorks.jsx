import React, { useEffect, useRef } from "react";
import styles from "../styles/howItWorks.module.css";

import realTimeIcon from "../assets/landing/real-time.svg";
import locationIcon from "../assets/landing/location-tracking.svg";
import secureIcon from "../assets/landing/secure-data.svg";
import notificationIcon from "../assets/landing/notification.svg";
import trendsIcon from "../assets/landing/trends.svg";

/* ===== Hardware that ships with the Empyrean device ===== */

const DEVICE = [
  {
    icon: realTimeIcon,
    title: "Air Quality Sensors",
    tag: "MQ135 + PMS5003",
    text: "Continuously measure particulate matter (PM2.5, PM10) and chemical compounds such as CO₂, NH₃, and benzene.",
  },
  {
    icon: locationIcon,
    title: "GPS Module",
    text: "Records real-time latitude and longitude, so every single reading is geo-tagged to a precise location.",
  },
  {
    icon: secureIcon,
    title: "ESP32 Processor",
    text: "The on-board brain reads all sensor values and GPS coordinates at defined intervals, then packages them into structured data.",
  },
  {
    icon: trendsIcon,
    title: "Wi-Fi Link",
    text: "Streams timestamped JSON payloads to the cloud over MQTT/HTTP — no cables, no manual syncing.",
  },
];

/* ===== The four stages of a single reading =====
   Condensed from the full 10-step data flow (sensors → GPS → ESP32 →
   JSON payload → Wi-Fi → cloud DB → alert engine → dashboard → notify). */

const STAGES = [
  {
    icon: realTimeIcon,
    step: "01",
    title: "Sense",
    text: "MQ135 + PMS5003 continuously measure air quality while the GPS module logs real-time coordinates.",
  },
  {
    icon: secureIcon,
    step: "02",
    title: "Transmit",
    text: "The ESP32 formats sensor values into a structured JSON payload with a timestamp and sends it to the cloud over Wi-Fi.",
  },
  {
    icon: notificationIcon,
    step: "03",
    title: "Personalize & Alert",
    text: "The cloud indexes the reading and the alert engine checks it against your health profile's thresholds. If exceeded, an alert is generated.",
  },
  {
    icon: locationIcon,
    step: "04",
    title: "Visualize",
    text: "The dashboard map updates with a geo-tagged marker, you get a visual notification, and optionally a push to your phone.",
  },
];

/* ===== Personalized Health Profile System ===== */

const CONDITIONS = [
  {
    name: "Allergic Rhinitis",
    sensitivity: "PM2.5, PM10, pollen, NH₃, benzene",
    response:
      "Moderately lowered PM thresholds with early alerts — for pre-emptive antihistamine use or exposure avoidance.",
  },
  {
    name: "Asthma",
    sensitivity: "PM2.5, NO₂, ozone, smoke",
    response:
      "Significantly lowered thresholds with immediate alerts recommending rescue medication or relocation to cleaner air.",
  },
  {
    name: "Bronchiectasis",
    sensitivity: "PM2.5, PM10, CO₂",
    response:
      "Prioritises cumulative and sustained exposure, which progressively worsens airway inflammation.",
  },
  {
    name: "Chronic Bronchitis",
    sensitivity: "PM2.5, MQ135-detected compounds, CO₂",
    response:
      "Lowered thresholds aimed at preventing prolonged irritant exposure.",
  },
  {
    name: "COPD",
    sensitivity: "All pollutants — even small PM2.5 or NO₂ rises",
    response:
      "The strictest thresholds across all pollutants, with escalating multi-level alerts (moderate → high → critical).",
  },
];

const GROUPS = [
  {
    icon: trendsIcon,
    title: "+5 more conditions",
    text: "Empyrean supports ten medical condition profiles in total — each matched to documented AQI sensitivity.",
  },
  {
    icon: trendsIcon,
    title: "Vulnerability Group Profiles",
    text: "Tuned thresholds and alert sensitivities for users in heightened-risk groups, even without a diagnosed condition.",
  },
];

export default function HowItWorksPage({
  onBackHome,
  onSwitchToLogin,
  onSwitchToRegister,
}) {
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
      {/* Glowing background accents */}
      <div className={styles.glowBlob1}></div>
      <div className={styles.glowBlob2}></div>

      <nav className={styles.navbar}>
        <a href="#home" onClick={(e) => { e.preventDefault(); onBackHome?.(); }}>
          Home
        </a>
        <a href="#how" className={styles.navActive}>
          How it works?
        </a>
        <a href="#features">Features</a>
        <a href="#map">Live Map</a>
        <a href="#about">About</a>
      </nav>

      <div className={styles.page}>
        {/* Hero */}
        <header className={styles.hero}>
          <p className={styles.eyebrow}>Empyrean</p>
          <h1 className={styles.heroTitle}>How It Works</h1>
          <p className={styles.heroSubtitle}>
            Empyrean is a portable air quality monitor. It measures the
            pollutants around you, streams them to the cloud, and alerts you
            the moment levels threaten your health — using thresholds tuned to
            your personal profile, not a population average.
          </p>
        </header>

        {/* The Device */}
        <section data-reveal className={`${styles.section} ${styles.reveal}`}>
          <h2 className={styles.sectionTitle}>The Device</h2>
          <p className={styles.sectionSubtitle}>
            A small, self-contained unit that fits in your pocket.
          </p>
          <div className={styles.features}>
            {DEVICE.map((item, index) => (
              <div
                key={item.title}
                data-reveal
                className={`${styles.featureCard} ${styles.reveal}`}
                style={{ "--reveal-delay": `${(index % 4) * 90}ms` }}
              >
                <img
                  src={item.icon}
                  alt={item.title}
                  className={styles.featureIcon}
                />
                <h3 className={styles.featureTitle}>{item.title}</h3>
                {item.tag ? <span className={styles.deviceTag}>{item.tag}</span> : null}
                <p className={styles.featureText}>{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Data flow */}
        <section data-reveal className={`${styles.section} ${styles.reveal}`}>
          <h2 className={styles.sectionTitle}>How a reading becomes an alert</h2>
          <p className={styles.sectionSubtitle}>
            From sensor to your screen in four stages.
          </p>
          <div className={styles.steps}>
            {STAGES.map((stage, index) => (
              <div
                key={stage.title}
                data-reveal
                className={`${styles.stepCard} ${styles.reveal}`}
                style={{ "--reveal-delay": `${(index % 4) * 90}ms` }}
              >
                <span className={styles.stepNumber}>{stage.step}</span>
                <img
                  src={stage.icon}
                  alt=""
                  className={styles.stepIcon}
                />
                <h3 className={styles.stepTitle}>{stage.title}</h3>
                <p className={styles.stepText}>{stage.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Health profiles */}
        <section data-reveal className={`${styles.section} ${styles.reveal}`}>
          <h2 className={styles.sectionTitle}>Personalized Health Profiles</h2>
          <p className={styles.sectionSubtitle}>
            The core of Empyrean: choose the profile that matches you, and
            thresholds are applied specifically to your condition or
            vulnerability group — so warnings are genuinely relevant to your
            health.
          </p>

          <div className={styles.conditionGrid}>
            {CONDITIONS.map((condition, index) => (
              <div
                key={condition.name}
                data-reveal
                className={`${styles.conditionCard} ${styles.reveal}`}
                style={{ "--reveal-delay": `${(index % 3) * 90}ms` }}
              >
                <h3 className={styles.conditionName}>{condition.name}</h3>
                <p className={styles.conditionSensitivity}>
                  <span className={styles.conditionLabel}>Sensitive to</span>
                  {condition.sensitivity}
                </p>
                <p className={styles.conditionResponse}>{condition.response}</p>
              </div>
            ))}
          </div>

          <div className={styles.groupGrid}>
            {GROUPS.map((group, index) => (
              <div
                key={group.title}
                data-reveal
                className={`${styles.groupCard} ${styles.reveal}`}
                style={{ "--reveal-delay": `${(index % 2) * 90}ms` }}
              >
                <img
                  src={group.icon}
                  alt=""
                  className={styles.groupIcon}
                />
                <h3 className={styles.groupTitle}>{group.title}</h3>
                <p className={styles.groupText}>{group.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section data-reveal className={`${styles.cta} ${styles.reveal}`}>
          <div className={styles.ctaGlow}></div>
          <h2 className={styles.ctaTitle}>Ready to breathe smarter?</h2>
          <p className={styles.ctaText}>
            Create your Empyrean account, set your health profile, and get
            alerts that actually match your health.
          </p>
          <div className={styles.ctaButtons}>
            <button
              type="button"
              className={styles.primaryButton}
              onClick={() => onSwitchToRegister?.()}
            >
              Get Started
            </button>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={() => onSwitchToLogin?.()}
            >
              Back to Login
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
