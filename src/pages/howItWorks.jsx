import React, { Fragment, useEffect, useRef, useState } from "react";
import styles from "../styles/howItWorks.module.css";

import { Wind, MapPin, Cpu, Wifi } from "lucide-react";

/* ===== Hardware that ships with the Empyrean device =====
   Each part maps to a numbered pin on the annotated diagram below. */

const DEVICE_PARTS = [
  {
    num: "01",
    icon: Wind,
    title: "Air Quality Sensors",
    tag: "MQ135 + PMS5003",
    text: "Continuously measure particulate matter (PM2.5, PM10) and chemical compounds such as CO₂, NH₃, and benzene.",
  },
  {
    num: "02",
    icon: MapPin,
    title: "GPS Module",
    text: "Records real-time latitude and longitude, so every single reading is geo-tagged to a precise location.",
  },
  {
    num: "03",
    icon: Cpu,
    title: "ESP32 Processor",
    text: "The on-board brain reads all sensor values and GPS coordinates at defined intervals, then packages them into structured data.",
  },
  {
    num: "04",
    icon: Wifi,
    title: "Wi-Fi Link",
    text: "Streams timestamped JSON payloads to the cloud over MQTT/HTTP — no cables, no manual syncing.",
  },
];

/* ===== The four stages of a single reading =====
   Condensed from the full 10-step data flow (sensors → GPS → ESP32 →
   JSON payload → Wi-Fi → cloud DB → alert engine → dashboard → notify). */

const STAGES = [
  {
    step: "01",
    title: "Sense",
    text: "MQ135 + PMS5003 continuously measure air quality while the GPS module logs real-time coordinates.",
  },
  {
    step: "02",
    title: "Transmit",
    text: "The ESP32 formats sensor values into a structured JSON payload with a timestamp and sends it to the cloud over Wi-Fi.",
  },
  {
    step: "03",
    title: "Personalize & Alert",
    text: "The cloud indexes the reading and the alert engine checks it against your health profile's thresholds. If exceeded, an alert is generated.",
  },
  {
    step: "04",
    title: "Visualize",
    text: "The dashboard map updates with a geo-tagged marker, you get a visual notification, and optionally a push to your phone.",
  },
];

/* ===== Personalized Health Profile System =====
   level 1–5 = how strict the thresholds get for that profile. */

const CONDITIONS = [
  {
    name: "Allergic Rhinitis",
    level: 3,
    sensitivity: ["PM2.5", "PM10", "pollen", "NH₃", "benzene"],
    response:
      "Moderately lowered PM thresholds with early alerts — for pre-emptive antihistamine use or exposure avoidance.",
  },
  {
    name: "Asthma",
    level: 4,
    sensitivity: ["PM2.5", "NO₂", "ozone", "smoke"],
    response:
      "Significantly lowered thresholds with immediate alerts recommending rescue medication or relocation to cleaner air.",
  },
  {
    name: "Bronchiectasis",
    level: 3,
    sensitivity: ["PM2.5", "PM10", "CO₂"],
    response:
      "Prioritises cumulative and sustained exposure, which progressively worsens airway inflammation.",
  },
  {
    name: "Chronic Bronchitis",
    level: 3,
    sensitivity: ["PM2.5", "MQ135 compounds", "CO₂"],
    response:
      "Lowered thresholds aimed at preventing prolonged irritant exposure.",
  },
  {
    name: "COPD",
    level: 5,
    sensitivity: ["all pollutants"],
    response:
      "The strictest thresholds across all pollutants, with escalating multi-level alerts (moderate → high → critical).",
  },
];

export default function HowItWorksPage({
  onSwitchToLogin,
  onSwitchToRegister,
}) {
  const pageRef = useRef(null);
  const [active, setActive] = useState(0);
  const current = CONDITIONS[active];

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
          <h1 className={styles.heroTitle}>How It Works</h1>
          <p className={styles.heroSubtitle}>
            Empyrean is a portable air quality monitor. It measures the
            pollutants around you, streams them to the cloud, and alerts you
            the moment levels threaten your health — using thresholds tuned to
            your personal profile, not a population average.
          </p>
        </header>

        {/* The Device — annotated diagram */}
        <section data-reveal className={`${styles.section} ${styles.reveal}`}>
          <h2 className={styles.sectionTitle}>The Device</h2>
          <p className={styles.sectionSubtitle}>
            A small, self-contained unit that fits in your pocket.
          </p>

          <div className={styles.deviceDiagram}>
            <div
              className={`${styles.deviceChassis} ${styles.reveal}`}
              data-reveal
            >
              <span className={`${styles.devicePin} ${styles.pinTL}`}>01</span>
              <span className={`${styles.devicePin} ${styles.pinBL}`}>02</span>
              <span className={`${styles.devicePin} ${styles.pinTR}`}>03</span>
              <span className={`${styles.devicePin} ${styles.pinBR}`}>04</span>

              <div className={styles.deviceScreen}>
                <span className={styles.screenLabel}>sample aqi</span>
                <span className={styles.screenValue}>74</span>
                <span className={styles.screenSub}>PM2.5 · 42.1 µg/m³</span>
                <span className={styles.screenCursor} aria-hidden="true" />
              </div>

              <div className={styles.deviceCaption}>EMP·YREAN</div>
              <span className={styles.deviceLed} aria-hidden="true" />
            </div>
          </div>

          <div className={styles.deviceLegend}>
            {DEVICE_PARTS.map((part, index) => (
              <div
                key={part.num}
                data-reveal
                className={`${styles.partItem} ${styles.reveal}`}
                style={{ "--reveal-delay": `${(index % 4) * 90}ms` }}
              >
                <span className={styles.partNum}>{part.num}</span>
                <div className={styles.partIconWrapper}>
                  <part.icon size={28} color="#4cdbaf" strokeWidth={1.5} className={styles.partIcon} />
                </div>
                <div className={styles.partBody}>
                  <h3 className={styles.partTitle}>{part.title}</h3>
                  {part.tag ? (
                    <span className={styles.partTag}>{part.tag}</span>
                  ) : null}
                  <p className={styles.partText}>{part.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Data flow — connected pipeline */}
        <section data-reveal className={`${styles.section} ${styles.reveal}`}>
          <h2 className={styles.sectionTitle}>
            How a reading becomes an alert
          </h2>
          <p className={styles.sectionSubtitle}>
            From sensor to your screen in four stages.
          </p>

          <div className={styles.flowTrack}>
            {STAGES.map((stage, index) => (
              <Fragment key={stage.step}>
                {index > 0 ? (
                  <div className={styles.flowLink} aria-hidden="true" />
                ) : null}
                <div
                  data-reveal
                  className={`${styles.flowNode} ${styles.reveal}`}
                  style={{ "--reveal-delay": `${(index % 4) * 110}ms` }}
                >
                  <span className={styles.flowNodeDot}>{stage.step}</span>
                  <h3 className={styles.flowNodeTitle}>{stage.title}</h3>
                  <p className={styles.flowNodeText}>{stage.text}</p>
                </div>
              </Fragment>
            ))}
          </div>
        </section>

        {/* Health profiles — interactive selector */}
        <section data-reveal className={`${styles.section} ${styles.reveal}`}>
          <h2 className={styles.sectionTitle}>Personalized Health Profiles</h2>
          <p className={styles.sectionSubtitle}>
            The core of Empyrean: choose the profile that matches you, and
            thresholds are applied specifically to your condition or
            vulnerability group — so warnings are genuinely relevant to your
            health.
          </p>

          <div className={styles.profileSelector}>
            <div className={styles.profileTabs} role="tablist">
              {CONDITIONS.map((condition, index) => (
                <button
                  key={condition.name}
                  type="button"
                  role="tab"
                  aria-selected={active === index}
                  className={`${styles.profileTab} ${
                    active === index ? styles.profileTabActive : ""
                  }`}
                  onClick={() => setActive(index)}
                >
                  {condition.name}
                </button>
              ))}
            </div>

            <div className={styles.profilePanel} role="tabpanel">
              <div className={styles.panelHead}>
                <h3 className={styles.profileName}>{current.name}</h3>
                <span className={styles.panelMeta}>threshold strictness</span>
              </div>

              <div
                className={styles.profileMeter}
                role="img"
                aria-label={`${current.name} strictness ${current.level} of 5`}
              >
                <div
                  className={styles.meterFill}
                  style={{ width: `${(current.level / 5) * 100}%` }}
                />
              </div>
              <div className={styles.meterScale}>
                <span>lenient</span>
                <span>strictest</span>
              </div>

              <p className={styles.sensitiveLabel}>Sensitive to</p>
              <div className={styles.profileChips}>
                {current.sensitivity.map((s) => (
                  <span key={s} className={styles.chip}>
                    {s}
                  </span>
                ))}
              </div>

              <p className={styles.profileResponse}>{current.response}</p>

              <div className={styles.profileNote}>
                <span className={styles.noteItem}>
                  <span className={styles.noteDot} />
                  +5 more condition profiles
                </span>
                <span className={styles.noteItem}>
                  <span className={styles.noteDot} />
                  Vulnerability group profiles
                </span>
              </div>
            </div>
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
