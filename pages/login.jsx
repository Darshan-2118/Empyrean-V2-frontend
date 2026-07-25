import React, { useState, useEffect, useRef } from "react";
import styles from "../styles/register.module.css";
import { checkHealth } from "../src/api.js";

export default function LoginPage({ onLoginSuccess, onSwitchToRegister }) {
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [backendStatus, setBackendStatus] = useState("checking");
  const passwordRef = useRef(null);

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
    if (event.key === "Enter") {
      event.preventDefault();
      if (event.target.name === "identifier") {
        passwordRef.current?.focus();
      } else if (event.target.name === "password") {
        handleSubmit(event);
      }
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const missingFields = [];
    if (!formData.identifier) missingFields.push("name or email");
    if (!formData.password) missingFields.push("password");

    if (missingFields.length) {
      setMessage(`Please fill in the missing field${missingFields.length > 1 ? "s" : ""}: ${missingFields.join(", ")}.`);
      return;
    }

    setMessage(`Welcome back! You are signed in.`);

    if (typeof onLoginSuccess === "function") {
      onLoginSuccess();
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

        <h1 className={styles.title}>Welcome back</h1>
        <p className={styles.subtitle}>Sign in to continue to Empyrean.</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label}>
            Name or Email
            <input
              type="text"
              name="identifier"
              value={formData.identifier}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="Enter your name or email"
              className={styles.input}
            />
          </label>

          <label className={styles.label}>
            Password
            <input
              ref={passwordRef}
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="Enter your password"
              className={styles.input}
            />
          </label>

          <button type="submit" className={styles.button}>
            Login
          </button>
        </form>

        <div className={styles.secondaryAction}>
          <span>New to Empyrean?</span>
          <button
            type="button"
            className={styles.linkButton}
            onClick={onSwitchToRegister}
          >
            Create account
          </button>
        </div>

        {message ? <p className={styles.message}>{message}</p> : null}
      </div>
    </div>
  );
}
