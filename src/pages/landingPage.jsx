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

  // Dynamic scroll listener: updates CSS variables for smooth GPU-accelerated scroll animations
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const root = pageRef.current;
          if (root) {
            const scrollY = window.scrollY || window.pageYOffset || 0;
            const viewportH = window.innerHeight || 800;

            // 1. Hero text fade-out & parallax translateY
            const heroProgress = Math.min(1, Math.max(0, scrollY / (viewportH * 0.45)));
            const heroOpacity = Math.max(0, 1 - heroProgress * 1.3);
            const heroY = -heroProgress * 80;
            const textLeftX = -heroProgress * 60;
            const textRightX = heroProgress * 60;

            // 2. Orb rise & scale-up
            const orbProgress = Math.min(1, Math.max(0, scrollY / (viewportH * 0.7)));
            const orbScale = 0.88 + orbProgress * 0.24;
            const orbTranslateY = -orbProgress * 90;
            const orbGlowSpread = orbProgress * 40;

            root.style.setProperty("--hero-opacity", heroOpacity.toFixed(3));
            root.style.setProperty("--hero-y", `${heroY.toFixed(1)}px`);
            root.style.setProperty("--text-left-x", `${textLeftX.toFixed(1)}px`);
            root.style.setProperty("--text-right-x", `${textRightX.toFixed(1)}px`);
            root.style.setProperty("--orb-scale", orbScale.toFixed(3));
            root.style.setProperty("--orb-y", `${orbTranslateY.toFixed(1)}px`);
            root.style.setProperty("--orb-glow-spread", `${orbGlowSpread.toFixed(1)}px`);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={styles.pageContainer} ref={pageRef}>
      {/* ===== Section 1: Hero (first viewport) ===== */}
      <section id="home" className={styles.hero}>
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
          onClick={() => {
            const el = document.getElementById("howItWorks");
            if (el) el.scrollIntoView({ behavior: "smooth" });
            else onSwitchToHowItWorks?.();
          }}
        >
          Track &gt;&gt;&gt;
        </button>
      </section>

      {/* ===== Section 2: Orb Orbital Features ===== */}
      <section id="orb-features" data-reveal className={`${styles.features} ${styles.reveal}`}>
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

      {/* ===== Section 3: How It Works (Hardware & 4-Stage Pipeline) ===== */}
      <section id="howItWorks" data-reveal className={`${styles.sectionContainer} ${styles.reveal}`}>
        <header className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>How Empyrean Works</h2>
          <p className={styles.sectionSubtitle}>
            From physical air particles to real-time, actionable intelligence
          </p>
        </header>

        {/* Hardware Modules Showcase */}
        <div className={styles.hardwareGrid}>
          <div className={styles.hardwareCard} data-reveal>
            <span className={styles.cardNum}>01</span>
            <div className={styles.cardIcon}>
              <LeafIcon />
            </div>
            <h3 className={styles.cardTitle}>Air Quality Sensors</h3>
            <span className={styles.cardTag}>MQ135 + PMS5003</span>
            <p className={styles.cardText}>
              Continuously measures particulate matter (PM2.5, PM10) and hazardous chemical gases like CO₂ and NH₃.
            </p>
          </div>

          <div className={styles.hardwareCard} data-reveal>
            <span className={styles.cardNum}>02</span>
            <div className={styles.cardIcon}>
              <GlobeIcon />
            </div>
            <h3 className={styles.cardTitle}>GPS Location Module</h3>
            <span className={styles.cardTag}>GEO-TAGGING</span>
            <p className={styles.cardText}>
              Logs exact latitude and longitude in real time, pairing every air quality reading with precise coordinates.
            </p>
          </div>

          <div className={styles.hardwareCard} data-reveal>
            <span className={styles.cardNum}>03</span>
            <div className={styles.cardIcon}>
              <BatteryIcon />
            </div>
            <h3 className={styles.cardTitle}>ESP32 Microcontroller</h3>
            <span className={styles.cardTag}>ON-BOARD PROCESSOR</span>
            <p className={styles.cardText}>
              The device brain packages raw readings into structured JSON payloads with precise microsecond timestamps.
            </p>
          </div>

          <div className={styles.hardwareCard} data-reveal>
            <span className={styles.cardNum}>04</span>
            <div className={styles.cardIcon}>
              <TrendIcon />
            </div>
            <h3 className={styles.cardTitle}>Cloud Wi-Fi Sync</h3>
            <span className={styles.cardTag}>MQTT / HTTP LINK</span>
            <p className={styles.cardText}>
              Streams telemetry data directly to cloud storage for instant alert triggers and interactive analytics.
            </p>
          </div>
        </div>

        {/* 4-Stage Data Pipeline */}
        <div className={styles.pipelineRow} data-reveal>
          <div className={styles.pipelineStep}>
            <div className={styles.stepBadge}>1</div>
            <h4 className={styles.stepTitle}>Sense</h4>
            <p className={styles.stepText}>Sensors detect airborne particles & gases in real time.</p>
          </div>
          <div className={styles.pipelineStep}>
            <div className={styles.stepBadge}>2</div>
            <h4 className={styles.stepTitle}>Transmit</h4>
            <p className={styles.stepText}>ESP32 sends encrypted JSON payloads over Wi-Fi.</p>
          </div>
          <div className={styles.pipelineStep}>
            <div className={styles.stepBadge}>3</div>
            <h4 className={styles.stepTitle}>Personalize</h4>
            <p className={styles.stepText}>Alert engine evaluates thresholds for your health profile.</p>
          </div>
          <div className={styles.pipelineStep}>
            <div className={styles.stepBadge}>4</div>
            <h4 className={styles.stepTitle}>Visualize</h4>
            <p className={styles.stepText}>View clean route recommendations on your dashboard map.</p>
          </div>
        </div>
      </section>

      {/* ===== Section 4: Features Deep-Dive ===== */}
      <section id="features" data-reveal className={`${styles.sectionContainer} ${styles.reveal}`}>
        <header className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Intelligent Features</h2>
          <p className={styles.sectionSubtitle}>
            Built to safeguard your lungs and empower smart-city environmental health
          </p>
        </header>

        <div className={styles.featuresDeepGrid}>
          <div className={styles.featureDeepCard} data-reveal>
            <div className={styles.featureHeader}>
              <div className={styles.featureIconBadge}>📡</div>
              <h3 className={styles.cardTitle}>Real-Time Tracking</h3>
            </div>
            <p className={styles.cardText}>
              Wearable ESP32 hardware logs exact PM2.5, PM10, and gas values anywhere you travel.
            </p>
          </div>

          <div className={styles.featureDeepCard} data-reveal>
            <div className={styles.featureHeader}>
              <div className={styles.featureIconBadge}>🫀</div>
              <h3 className={styles.cardTitle}>Calibrated Health Modes</h3>
            </div>
            <p className={styles.cardText}>
              Asthma, Child, and Senior modes dynamically adjust warning thresholds based on sensitivity.
            </p>
          </div>

          <div className={styles.featureDeepCard} data-reveal>
            <div className={styles.featureHeader}>
              <div className={styles.featureIconBadge}>🧠</div>
              <h3 className={styles.cardTitle}>Smart AQI Engine</h3>
            </div>
            <p className={styles.cardText}>
              Fuzzy inference transforms complex multi-gas telemetry into a clear, intuitive 0–100 score.
            </p>
          </div>

          <div className={styles.featureDeepCard} data-reveal>
            <div className={styles.featureHeader}>
              <div className={styles.featureIconBadge}>🗺️</div>
              <h3 className={styles.cardTitle}>Live Geo-Visualization</h3>
            </div>
            <p className={styles.cardText}>
              Interactive spatial heatmaps color-code your daily routes from green (safe) to red (hotspot).
            </p>
          </div>

          <div className={styles.featureDeepCard} data-reveal>
            <div className={styles.featureHeader}>
              <div className={styles.featureIconBadge}>🔔</div>
              <h3 className={styles.cardTitle}>Instant Alerts</h3>
            </div>
            <p className={styles.cardText}>
              Multi-modal notifications via buzzer, LED, and push messages warn you immediately.
            </p>
          </div>

          <div className={styles.featureDeepCard} data-reveal>
            <div className={styles.featureHeader}>
              <div className={styles.featureIconBadge}>🏙️</div>
              <h3 className={styles.cardTitle}>Smart-City Heatmaps</h3>
            </div>
            <p className={styles.cardText}>
              Anonymized data streams help urban planners identify pollution corridors and improve public health.
            </p>
          </div>
        </div>
      </section>

      {/* ===== Section 5: Live Map Preview ===== */}
      <section id="liveMap" data-reveal className={`${styles.sectionContainer} ${styles.reveal}`}>
        <header className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Live Air Map</h2>
          <p className={styles.sectionSubtitle}>
            Track real-time air quality along your daily commute
          </p>
        </header>

        <div className={styles.mapPreviewBox}>
          <div className={styles.mapVisual}>
            <div style={{ position: "relative", zIndex: 2 }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🗺️</div>
              <div style={{ fontSize: "1.1rem", color: "#4ade9c", letterSpacing: "0.1em" }}>
                SPATIAL AIR QUALITY MAP ACTIVE
              </div>
              <p style={{ fontSize: "0.85rem", color: "rgba(220, 235, 228, 0.7)", margin: "0.5rem 0 0" }}>
                Bangalore Central Route — Live AQI Telemetry Stream
              </p>
            </div>
          </div>

          <div className={styles.mapBadgeRow}>
            <div className={styles.mapPill}>
              <span className={styles.dotGood}></span> Good (AQI 0-50)
            </div>
            <div className={styles.mapPill}>
              <span className={styles.dotMod}></span> Moderate (AQI 51-100)
            </div>
            <div className={styles.mapPill}>
              <span className={styles.dotHigh}></span> Unhealthy (AQI 101+)
            </div>
          </div>
        </div>
      </section>

      {/* ===== Section 6: About, Metrics & CTA ===== */}
      <section id="about" data-reveal className={`${styles.sectionContainer} ${styles.reveal}`}>
        <header className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Precision & Impact</h2>
          <p className={styles.sectionSubtitle}>
            Breathing intelligence into every air data point
          </p>
        </header>

        <div className={styles.metricsGrid}>
          <div className={styles.metricCard} data-reveal>
            <div className={styles.metricValue}>99.9%</div>
            <div className={styles.metricLabel}>Sensor Calibration Precision</div>
          </div>
          <div className={styles.metricCard} data-reveal>
            <div className={styles.metricValue}>&lt;100ms</div>
            <div className={styles.metricLabel}>Cloud Alert Latency</div>
          </div>
          <div className={styles.metricCard} data-reveal>
            <div className={styles.metricValue}>100%</div>
            <div className={styles.metricLabel}>Geo-Tagged Telemetry</div>
          </div>
          <div className={styles.metricCard} data-reveal>
            <div className={styles.metricValue}>24/7</div>
            <div className={styles.metricLabel}>Continuous Protection</div>
          </div>
        </div>

        {/* Call to Action Banner */}
        <div className={styles.ctaBanner} data-reveal>
          <h2 className={styles.ctaTitle}>Breathe With Confidence Today</h2>
          <p className={styles.ctaText}>
            Join Empyrean to monitor your air quality, discover cleaner routes, and protect your health.
          </p>
          <div className={styles.ctaButtons}>
            <button
              type="button"
              className={styles.primaryCtaBtn}
              onClick={() => onSwitchToHowItWorks?.()}
            >
              Get Started Now
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
