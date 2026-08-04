import React from 'react';
import styles from '../styles/login.module.css';

export default function FeaturesPage({ onSwitchToLogin, onSwitchToAbout }) {
  const features = [
    {
      title: "Real-Time Personal Exposure Tracking",
      desc: "A wearable device with ESP32, MQ135 gas sensor, and GPS that follows you, not a fixed spot, capturing what you actually breathe as you move."
    },
    {
      title: "Personalized Health Modes",
      desc: "Asthma, Child, and Elderly modes recalibrate danger thresholds to your body, not a generic city-wide number."
    },
    {
      title: "Smart Fuzzy-Logic AQI Engine",
      desc: "Tsukamoto fuzzy inference converts raw sensor data into a clear 0–100 AQI score, right on the device."
    },
    {
      title: "Live Geo-Visualization",
      desc: "An interactive Leaflet.js map paints your route green-to-red, showing safe zones vs. pollution hotspots."
    },
    {
      title: "Instant Multi-Modal Alerts",
      desc: "Buzzer, LED, and push notifications, tiered by severity, so you're warned without being overwhelmed."
    },
    {
      title: "Exposure Analytics Dashboard",
      desc: "Daily/weekly trends and anomaly detection for you and your healthcare provider."
    },
    {
      title: "Smart-City Contribution",
      desc: "Anonymized crowd data builds city-wide heatmaps for planners and public health authorities."
    }
  ];

  return (
    <div className={styles.pageContainer}>
      <nav className={styles.navbar}>
        <a href="#home" onClick={(e) => { e.preventDefault(); onSwitchToLogin?.(); }}>Home</a>
        <a href="#how">How it works?</a>
        <a href="#features">Features</a>
        <a href="#map">Live Map</a>
        <a href="#about" onClick={(e) => { e.preventDefault(); onSwitchToAbout?.(); }}>About</a>
      </nav>

      <div className={styles.mainContainer} style={{ padding: '0 2rem' }}>
        <div 
          className={styles.glassCard} 
          style={{ width: '100%', maxWidth: '1100px', height: 'auto', minHeight: '600px', padding: '4rem', flexDirection: 'column' }}
        >
          {/* Glowing Blobs for background effect removed to keep design clean */}
          <div style={{ position: 'relative', zIndex: 2 }}>
            <h1 className={styles.brandName} style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
              CORE FEATURES
            </h1>
            <p className={styles.subtitleText} style={{ fontSize: '1.1rem', marginBottom: '3rem' }}>
              Seamlessly connecting advanced hardware sensors with intelligent cloud analytics.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              {features.map((feature, i) => (
                <div key={i} style={{ 
                  background: 'rgba(0,0,0,0.25)', 
                  padding: '2rem', 
                  borderRadius: '25px', 
                  border: '1px solid rgba(255,255,255,0.05)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                >
                  <h3 style={{ color: '#4cdbaf', fontSize: '1.25rem', marginBottom: '1rem', fontWeight: 600, fontFamily: "'Space Grotesk', sans-serif" }}>
                    {feature.title}
                  </h3>
                  <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: '1.6', fontSize: '0.95rem' }}>
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
