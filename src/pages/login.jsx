import React, { useState, useRef } from "react";
import styles from "../styles/login.module.css";
import logoGraphic from "../assets/landing/final-logo.svg";

const FIELD_LABELS = {
  username: "Email or username",
  password: "Password",
};

export default function LoginPage({
  onSwitchToRegister,
  onSwitchToForgotPassword,
}) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleBlur = (field) => {
    if (!formData[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: `${FIELD_LABELS[field]} is required`,
      }));
      return;
    }
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleKeyDown = (e) => {
    if (e.key !== "Enter") return;

    e.preventDefault();

    if (e.target.name === "username") {
      passwordRef.current?.focus();
    } else {
      e.target.form?.requestSubmit();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    for (const field of Object.keys(FIELD_LABELS)) {
      if (!formData[field]) {
        newErrors[field] = `${FIELD_LABELS[field]} is required`;
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length) {
      const firstErrorField = Object.keys(newErrors)[0];
      if (firstErrorField === "username") {
        usernameRef.current?.focus();
      } else {
        passwordRef.current?.focus();
      }
      return;
    }

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
        <div className={`${styles.glassCard} ${styles.loginCard}`}>
          <div className={`${styles.leftPanel} ${styles.logoSlide}`}>
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

          <div className={`${styles.rightPanel} ${styles.formSlideRight}`}>
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
                    ref={usernameRef}
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    onBlur={() => handleBlur("username")}
                    placeholder="Enter your email or username"
                  />
                  <span className={styles.fieldError}>{errors.username}</span>
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="password">Password</label>
                  <input
                    ref={passwordRef}
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    onBlur={() => handleBlur("password")}
                    placeholder="Enter your password"
                  />
                  <span className={styles.fieldError}>{errors.password}</span>
                </div>

                <button type="submit" className={styles.loginButton}>
                  Login
                </button>

                <div className={styles.footerLinks}>
                  <a
                    href="#create"
                    onClick={(e) => {
                      e.preventDefault();
                      if (typeof onSwitchToRegister === "function") {
                        onSwitchToRegister();
                      }
                    }}
                  >
                    Create an Account
                  </a>
                  <a
                    href="#forgot"
                    onClick={(e) => {
                      e.preventDefault();
                      if (typeof onSwitchToForgotPassword === "function") {
                        onSwitchToForgotPassword();
                      }
                    }}
                  >
                    Forgot password?
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
