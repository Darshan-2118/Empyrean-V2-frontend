import React from 'react';
import styles from '../styles/login.module.css';

export default function AboutPage({ onSwitchToLogin, onSwitchToFeatures }) {
  return (
    <div className={styles.pageContainer} style={{ overflowY: 'auto' }}>
      <div className={styles.mainContainer} style={{ padding: '3rem 2rem 4rem 2rem', alignItems: 'flex-start' }}>
        <div 
          className={styles.glassCard} 
          style={{ width: '100%', maxWidth: '1100px', height: 'auto', minHeight: '600px', padding: '4rem', flexDirection: 'column' }}
        >
          {/* Glowing Blobs for background effect removed to keep design clean */}
          
          <div style={{ position: 'relative', zIndex: 2 }}>
            {/* Title Section */}
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <h1 className={styles.brandName} style={{ marginBottom: '0.5rem', fontSize: '2.5rem' }}>
                ABOUT US
              </h1>
            </div>

            {/* Our Story & Our Mission */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
              <div style={{ background: 'rgba(0,0,0,0.25)', padding: '2.5rem', borderRadius: '25px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <h3 style={{ color: '#4cdbaf', fontSize: '1.4rem', marginBottom: '1.5rem', fontWeight: 600, fontFamily: "'Space Grotesk', sans-serif" }}>
                  Our Story
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: '1.6', fontSize: '1.05rem' }}>
                  We're a team of engineering students from the Department of Computer Science and Design at RajaRajeswari College of Engineering. Frustrated by air-quality apps that only tell you the pollution level of an entire city block instead of what's actually in the air around you, we set out to build something more personal.
                </p>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.25)', padding: '2.5rem', borderRadius: '25px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <h3 style={{ color: '#4cdbaf', fontSize: '1.4rem', marginBottom: '1.5rem', fontWeight: 600, fontFamily: "'Space Grotesk', sans-serif" }}>
                  Our Mission
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: '1.6', fontSize: '1.05rem' }}>
                  To turn air-quality monitoring from passive environmental data into an active, personal health-protection tool — especially for people whose lungs can't afford to guess.
                </p>
              </div>
            </div>

            {/* Meet the Team */}
            <div style={{ marginBottom: '3rem', background: 'rgba(0,0,0,0.15)', padding: '2.5rem', borderRadius: '25px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <h3 style={{ color: '#4cdbaf', fontSize: '1.4rem', marginBottom: '1.5rem', fontWeight: 600, fontFamily: "'Space Grotesk', sans-serif", textAlign: 'center' }}>
                Meet the Team
              </h3>
              <div className={styles.teamGrid}>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <h4 style={{ color: '#fff', fontSize: '1.1rem', margin: '0 0 0.5rem 0', fontWeight: 600 }}>Darshan R</h4>
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', margin: 0, lineHeight: '1.4' }}>Backend Development and Cloud Infrastructure</p>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <h4 style={{ color: '#fff', fontSize: '1.1rem', margin: '0 0 0.5rem 0', fontWeight: 600 }}>Vyshali D D</h4>
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', margin: 0, lineHeight: '1.4' }}>UI/UX Design and Prototype Development</p>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <h4 style={{ color: '#fff', fontSize: '1.1rem', margin: '0 0 0.5rem 0', fontWeight: 600 }}>Chirag J Shetru</h4>
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', margin: 0, lineHeight: '1.4' }}> React Frontend Development & Responsive Web Implementation</p>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <h4 style={{ color: '#fff', fontSize: '1.1rem', margin: '0 0 0.5rem 0', fontWeight: 600 }}>Kushal U</h4>
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', margin: 0, lineHeight: '1.4' }}>React Frontend Development & Responsive Web Implementation</p>
                </div>
              </div>
            </div>

            {/* How We Work Together & Our Approach */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              <div style={{ borderLeft: '4px solid #4cdbaf', paddingLeft: '1.5rem' }}>
                <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '1rem', fontWeight: 600 }}>How We Work Together</h3>
                <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: '1.6', fontSize: '1rem' }}>
                  Building Empyrean meant blending hardware, embedded systems, machine learning, and design into one cohesive product. We leaned on regular discussions, shared problem-solving, and a lot of trial and error to make sure every part of the system — from the sensor readings to the final dashboard — worked in harmony. It's a project shaped by teamwork as much as technology.
                </p>
              </div>

              <div style={{ borderLeft: '4px solid #4cdbaf', paddingLeft: '1.5rem' }}>
                <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '1rem', fontWeight: 600 }}>Our Approach</h3>
                <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: '1.6', fontSize: '1rem' }}>
                  Affordable IoT sensors + GPS + fuzzy logic + machine learning (Random Forest, DBSCAN), built by a small team that believed personalized air-quality data shouldn't be a luxury.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}