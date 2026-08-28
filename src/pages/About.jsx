import React from 'react';
import styles from '../styles/login.module.css';
import aboutStyles from '../styles/About.module.css';

export default function AboutPage({ onSwitchToLogin, onSwitchToFeatures }) {
  return (
    <div className={`${styles.pageContainer} ${aboutStyles['about-scroll-container']}`}>
      <div className={`${styles.mainContainer} ${aboutStyles['about-main-wrapper']}`}>
        <div 
          className={`${styles.glassCard} ${aboutStyles['about-glass-card-override']}`}
        >
          {/* Glowing Blobs for background effect removed to keep design clean */}
          
          <div className={aboutStyles['about-content-wrapper']}>
            {/* Title Section */}
            <div className={aboutStyles['about-title-section']}>
              <h1 className={`${styles.brandName} ${aboutStyles['about-brand-title']}`}>
                ABOUT US
              </h1>
            </div>

            {/* Our Story & Our Mission */}
            <div className={aboutStyles['about-grid-section']}>
              <div className={aboutStyles['about-info-card']}>
                <h3 className={aboutStyles['about-card-title']}>
                  Our Story
                </h3>
                <p className={aboutStyles['about-card-text']}>
                  We're a team of engineering students from the Department of Computer Science and Design at RajaRajeswari College of Engineering. Frustrated by air-quality apps that only tell you the pollution level of an entire city block instead of what's actually in the air around you, we set out to build something more personal.
                </p>
              </div>

              <div className={aboutStyles['about-info-card']}>
                <h3 className={aboutStyles['about-card-title']}>
                  Our Mission
                </h3>
                <p className={aboutStyles['about-card-text']}>
                  To turn air-quality monitoring from passive environmental data into an active, personal health-protection tool ?" especially for people whose lungs can't afford to guess.
                </p>
              </div>
            </div>

            {/* Meet the Team */}
            <div className={aboutStyles['about-team-section']}>
              <h3 className={aboutStyles['about-team-title']}>
                Meet the Team
              </h3>
              <div className={styles.teamGrid}>
                <div className={aboutStyles['about-team-member']}>
                  <h4 className={aboutStyles['about-member-name']}>Darshan R</h4>
                  <p className={aboutStyles['about-member-role']}>Backend Development and Cloud Infrastructure</p>
                </div>
                <div className={aboutStyles['about-team-member']}>
                  <h4 className={aboutStyles['about-member-name']}>Vyshali D D</h4>
                  <p className={aboutStyles['about-member-role']}>UI/UX Design and Prototype Development</p>
                </div>
                <div className={aboutStyles['about-team-member']}>
                  <h4 className={aboutStyles['about-member-name']}>Chirag J Shetru</h4>
                  <p className={aboutStyles['about-member-role']}> React Frontend Development & Responsive Web Implementation</p>
                </div>
                <div className={aboutStyles['about-team-member']}>
                  <h4 className={aboutStyles['about-member-name']}>Kushal U</h4>
                  <p className={aboutStyles['about-member-role']}>React Frontend Development & Responsive Web Implementation</p>
                </div>
              </div>
            </div>

            {/* How We Work Together & Our Approach */}
            <div className={aboutStyles['about-approach-section']}>
              <div className={aboutStyles['about-approach-item']}>
                <h3 className={aboutStyles['about-approach-title']}>How We Work Together</h3>
                <p className={aboutStyles['about-approach-text']}>
                  Building Empyrean meant blending hardware, embedded systems, machine learning, and design into one cohesive product. We leaned on regular discussions, shared problem-solving, and a lot of trial and error to make sure every part of the system ?" from the sensor readings to the final dashboard ?" worked in harmony. It's a project shaped by teamwork as much as technology.
                </p>
              </div>

              <div className={aboutStyles['about-approach-item']}>
                <h3 className={aboutStyles['about-approach-title']}>Our Approach</h3>
                <p className={aboutStyles['about-approach-text']}>
                  Affordable IoT sensors + GPS + fuzzy logic + machine learning (Random Forest, DBSCAN), built by a small team that believed personalized air-quality data shouldn't be a luxury.
                </p>
              </div>
            </div>

            {typeof onSwitchToLogin === 'function' && (
              <div className={`${styles.footerLinks} ${styles.footerLinksCenter}`} style={{ marginTop: '3rem' }}>
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
        </div>
      </div>
    </div>
  );
}