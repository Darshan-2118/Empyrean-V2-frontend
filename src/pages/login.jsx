import React, { useState } from "react";
import styles from "../styles/login.module.css";
import logoGraphic from "../assets/landing/final-logo.svg";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login submitted", formData);
  };

  return (
    <div className={styles.pageContainer}>
      <nav className={styles.navbar}>
        <a href="#home">Home</a>
        <a href="#how">How it works?</a>
        <a href="#features">Features</a>
        <a href="#map">Live Map</a>
        <a href="#about">About</a>
      </nav>

      <div className={styles.mainContainer}>
        <div className={styles.glassCard}>
          <div className={styles.leftPanel}>
            {/* Glowing Blobs from Figma */}
            <div className={styles.glowBlob1}></div>
            <div className={styles.glowBlob2}></div>
            <div className={styles.glowBlob3}></div>
            <div className={styles.glowBlob4}></div>

            <div className={styles.logoWrapper}>
              <img
                src={logoGraphic}
                alt="Empyrean Abstract Wave"
                className={styles.logoGraphic}
              />
            </div>
            <h1 className={styles.brandName}>EMPYREAN</h1>
          </div>

          <div className={styles.rightPanel}>
            <div className={styles.loginFormContainer}>
              <h2 className={styles.welcomeText}>Welcome Back</h2>
              <p className={styles.subtitleText}>
                Sign in to continue to{" "}
                <span className={styles.brandSubtitle}>EMPYREAN</span>
              </p>

              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.inputGroup}>
                  <label htmlFor="username">Email or username</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>

                <button type="submit" className={styles.loginButton}>
                  Login
                </button>

                <div className={styles.footerLinks}>
                  <a href="#create">Create an Account</a>
                  <a href="#forgot">Forgot password?</a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
