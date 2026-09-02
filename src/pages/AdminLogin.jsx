import React, { useState, useRef } from "react";
import styles from "../styles/adminLogin.module.css";

const ADMIN_USERNAME = "Darshan";
const ADMIN_PASSWORD = "Darsh@2118";

export default function AdminLoginPage({ onLoginSuccess, onBackToHome }) {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setMessage("");
  };

  const handleBlur = (field) => {
    if (!formData[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: `${field === "username" ? "Username" : "Password"} is required`,
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const newErrors = {};
    if (!formData.username) newErrors.username = "Username is required";
    if (!formData.password) newErrors.password = "Password is required";

    setErrors(newErrors);
    if (Object.keys(newErrors).length) {
      if (newErrors.username) usernameRef.current?.focus();
      else passwordRef.current?.focus();
      return;
    }

    setSubmitting(true);
    setMessage("");

    await new Promise((r) => setTimeout(r, 500));

    if (
      formData.username === ADMIN_USERNAME &&
      formData.password === ADMIN_PASSWORD
    ) {
      onLoginSuccess();
    } else {
      setMessage("Invalid admin credentials");
    }
    setSubmitting(false);
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.glassCard}>
        <div className={styles.brandStrip} />
        <div className={styles.formPanel}>
          <div className={styles.adminBadge}>Admin Access</div>
          <h2 className={styles.welcomeText}>Admin Panel</h2>
          <p className={styles.subtitleText}>
            Sign in with your admin credentials
          </p>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="admin-username">Username</label>
              <input
                ref={usernameRef}
                type="text"
                id="admin-username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                onBlur={() => handleBlur("username")}
                placeholder="Enter admin username"
                autoComplete="username"
              />
              <span className={styles.fieldError}>{errors.username}</span>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="admin-password">Password</label>
              <input
                ref={passwordRef}
                type="password"
                id="admin-password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                onBlur={() => handleBlur("password")}
                placeholder="Enter admin password"
                autoComplete="current-password"
              />
              <span className={styles.fieldError}>{errors.password}</span>
            </div>

            <button
              type="submit"
              className={styles.loginButton}
              disabled={submitting}
            >
              {submitting ? "Signing in\u2026" : "Login"}
            </button>
          </form>

          {message ? <p className={styles.formError}>{message}</p> : null}

          <div className={styles.backLink}>
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                onBackToHome();
              }}
            >
              Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
