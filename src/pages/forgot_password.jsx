import React, { useEffect, useRef, useState } from "react";
import styles from "../styles/login.module.css";
import { checkHealth } from "../api.js";

export default function ForgotPasswordPage({ onResetSuccess, onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [backendStatus, setBackendStatus] = useState("checking");
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  useEffect(() => {
    checkHealth().then((result) => {
      setBackendStatus(result.ok ? "ok" : "error");
    });
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setMessage("");
  };

  const handleKeyDown = (event) => {
    if (event.key !== "Enter") return;

    event.preventDefault();
    if (event.target.name === "identifier") {
      passwordRef.current?.focus();
    } else if (event.target.name === "password") {
      confirmPasswordRef.current?.focus();
    } else if (event.target.name === "confirmPassword") {
      event.target.form?.requestSubmit();
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const missingFields = [];
    if (!formData.identifier) missingFields.push("email or username");
    if (!formData.password) missingFields.push("new password");
    if (!formData.confirmPassword) missingFields.push("confirm password");

    if (missingFields.length) {
      setMessage(`Please fill in the missing field${missingFields.length > 1 ? "s" : ""}: ${missingFields.join(", ")}.`);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match. Please re-enter them.");
      return;
    }

    setMessage("Password reset successfully. You can now sign in with your new password.");

    if (typeof onResetSuccess === "function") {
      onResetSuccess();
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.statusBar}>
          <span
            className={
              backendStatus === "checking"
                ? styles.statusChecking
                : backendStatus === "ok"
                  ? styles.statusOk
                  : styles.statusError
            }
          >
            {backendStatus === "checking"
              ? "Connecting to server..."
              : backendStatus === "ok"
                ? "Server connected"
                : "Server unavailable"}
          </span>
        </div>

        <h1 className={styles.title}>Reset password</h1>
        <p className={styles.subtitle}>Enter your account details and choose a new password.</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label}>
            Email or Username
            <input
              type="text"
              name="identifier"
              value={formData.identifier}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="Enter your email or username"
              className={styles.input}
            />
          </label>

          <label className={styles.label}>
            New Password
            <input
              ref={passwordRef}
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="Enter a new password"
              className={styles.input}
            />
          </label>

          <label className={styles.label}>
            Confirm Password
            <input
              ref={confirmPasswordRef}
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="Re-enter your new password"
              className={styles.input}
            />
          </label>

          <button type="submit" className={styles.button}>
            Reset Password
          </button>
        </form>

        <div className={styles.secondaryAction}>
          <span>Remembered your password?</span>
          <button
            type="button"
            className={styles.linkButton}
            onClick={() => {
              if (typeof onSwitchToLogin === "function") {
                onSwitchToLogin();
              }
            }}
          >
            Back to login
          </button>
        </div>

        {message ? <p className={styles.message}>{message}</p> : null}
      </div>
    </div>
  );
}
