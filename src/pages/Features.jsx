import React, { useState, useEffect } from 'react';
import styles from '../styles/login.module.css';

const INITIAL_FEATURES = [
  {
    id: 1,
    title: "Real-Time Tracking",
    desc: "A wearable device with ESP32, MQ135 gas sensor, and GPS that captures exactly what you breathe.",
    icon: "📡",
    color: "#4cdbaf"
  },
  {
    id: 2,
    title: "Health Modes",
    desc: "Asthma, Child, and Elderly modes recalibrate danger thresholds specifically to your body.",
    icon: "🫀",
    color: "#ff6b6b"
  },
  {
    id: 3,
    title: "Smart AQI Engine",
    desc: "Fuzzy inference converts raw sensor data into a clear 0–100 AQI score right on the device.",
    icon: "🧠",
    color: "#4dabf7"
  },
  {
    id: 4,
    title: "Live Geo-Visualization",
    desc: "An interactive Leaflet map paints your route green-to-red, showing safe zones vs. hotspots.",
    icon: "🗺️",
    color: "#ffd43b"
  },
  {
    id: 5,
    title: "Multi-Modal Alerts",
    desc: "Buzzer, LED, and push notifications, tiered by severity, so you're warned instantly.",
    icon: "🔔",
    color: "#ff922b"
  },
  {
    id: 6,
    title: "Analytics Dashboard",
    desc: "Daily/weekly exposure trends and anomaly detection for you and your healthcare provider.",
    icon: "📊",
    color: "#cc5de8"
  },
  {
    id: 7,
    title: "Smart-City Contribution",
    desc: "Anonymized crowd data builds city-wide heatmaps for planners and public health authorities.",
    icon: "🏙️",
    color: "#20c997"
  }
];

export default function FeaturesPage({ onSwitchToLogin }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % INITIAL_FEATURES.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + INITIAL_FEATURES.length) % INITIAL_FEATURES.length);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % INITIAL_FEATURES.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.pageContainer} style={{ overflowY: 'auto' }}>
      <div className={styles.mainContainer} style={{ padding: '3rem 2rem 4rem 2rem' }}>
        <div 
          className={styles.glassCard} 
          style={{ width: '100%', maxWidth: '1150px', height: 'auto', minHeight: '650px', padding: '4rem 2rem', display: 'flex', flexWrap: 'wrap', gap: '4rem', alignItems: 'center', justifyContent: 'center' }}
        >
          {/* Left Side: Typography and Controls */}
          <div style={{ flex: '1 1 350px', zIndex: 2, paddingLeft: '2rem' }}>
            <h2 style={{ color: '#4cdbaf', fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.2rem', letterSpacing: '2px', marginBottom: '1rem', textTransform: 'uppercase' }}>
              Core Capabilities
            </h2>
            <h1 className={styles.brandName} style={{ fontSize: '3.2rem', marginBottom: '1.5rem', lineHeight: '1.1', textTransform: 'none', letterSpacing: '1px' }}>
              Next-Gen <br /> <span style={{ color: 'rgba(255,255,255,0.7)' }}>Air Quality</span>
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '3rem', maxWidth: '400px' }}>
              We seamlessly connect advanced hardware sensors with intelligent cloud analytics. Explore the features that make Empyrean a life-saving tool.
            </p>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                onClick={handlePrev}
                style={{ 
                  background: 'rgba(255,255,255,0.05)', 
                  border: '1px solid rgba(255,255,255,0.1)', 
                  borderRadius: '50%', 
                  width: '50px', 
                  height: '50px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'white',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
              >
                ←
              </button>
              <button 
                onClick={handleNext}
                style={{ 
                  background: '#4cdbaf', 
                  border: 'none', 
                  borderRadius: '50%', 
                  width: '50px', 
                  height: '50px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#0B2F28',
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 15px rgba(76, 219, 175, 0.4)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)' }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
              >
                →
              </button>
            </div>

            {typeof onSwitchToLogin === 'function' && (
              <div className={styles.footerLinks} style={{ marginTop: '2.5rem' }}>
                <span className={styles.secondaryActionText}>
                  Already have an account?{' '}
                  <a
                    href="#login"
                    onClick={(e) => {
                      e.preventDefault();
                      onSwitchToLogin();
                    }}
                  >
                    Log in
                  </a>
                </span>
              </div>
            )}
          </div>

          {/* Right Side: Stacking Cards */}
          <div style={{ flex: '1 1 420px', position: 'relative', height: '480px', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2 }}>
            {INITIAL_FEATURES.map((card, i) => {
              const relativeIndex = (i - activeIndex + INITIAL_FEATURES.length) % INITIAL_FEATURES.length;
              const isTop = relativeIndex === 0;
              
              let yOffset = 0;
              let scale = 1;
              let opacity = 0;
              let zIndex = INITIAL_FEATURES.length - relativeIndex;

              if (relativeIndex === 0) {
                yOffset = 0;
                scale = 1;
                opacity = 1;
              } else if (relativeIndex === 1) {
                yOffset = 40;
                scale = 0.95;
                opacity = 0.8;
              } else if (relativeIndex === 2) {
                yOffset = 80;
                scale = 0.9;
                opacity = 0.5;
              } else {
                yOffset = 120;
                scale = 0.85;
                opacity = 0;
              }

              // The card that just left (moved to the end of the stack) floats up and fades
              if (relativeIndex === INITIAL_FEATURES.length - 1) {
                yOffset = -50;
                scale = 1.05;
                opacity = 0;
                zIndex = INITIAL_FEATURES.length + 1; // Stay on top while fading out
              }

              return (
                <div 
                  key={card.id}
                  onClick={() => !isTop && handleNext()}
                  style={{
                    position: 'absolute',
                    width: '100%',
                    maxWidth: '480px',
                    height: '350px',
                    background: 'rgba(20, 40, 35, 0.85)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    borderRadius: '24px',
                    border: `1px solid ${isTop ? card.color : 'rgba(255, 255, 255, 0.08)'}`,
                    padding: '3rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    boxShadow: isTop ? `0 20px 50px rgba(0,0,0,0.5), 0 0 30px ${card.color}15` : '0 10px 30px rgba(0,0,0,0.3)',
                    transform: `translateY(${yOffset}px) scale(${scale})`,
                    opacity: opacity,
                    zIndex: zIndex,
                    transition: 'all 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)',
                    cursor: isTop ? 'default' : 'pointer',
                    pointerEvents: relativeIndex > 2 && relativeIndex !== INITIAL_FEATURES.length - 1 ? 'none' : 'auto'
                  }}
                >
                  <div style={{ fontSize: '4rem', marginBottom: '1.2rem', filter: isTop ? 'drop-shadow(0 0 10px rgba(255,255,255,0.2))' : 'none', transition: 'all 0.6s ease' }}>
                    {card.icon}
                  </div>
                  <h3 style={{ color: '#fff', fontSize: '1.7rem', margin: '0 0 1rem 0', fontFamily: "'Space Grotesk', sans-serif", fontWeight: '600' }}>
                    {card.title}
                  </h3>
                  <p style={{ color: 'rgba(255,255,255,0.7)', margin: 0, lineHeight: '1.7', fontSize: '1.15rem' }}>
                    {card.desc}
                  </p>

                  {/* Aesthetic glowing dot in the corner */}
                  {isTop && (
                    <div style={{
                      position: 'absolute',
                      top: '2rem',
                      right: '2rem',
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      background: card.color,
                      boxShadow: `0 0 15px ${card.color}`
                    }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
