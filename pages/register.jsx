import React, { useState, useEffect, useRef } from "react";
import styles from "../styles/register.module.css";
import { checkHealth } from "../src/api.js";

export default function RegisterPage({ onRegisterSuccess, onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    age: "",
    gender: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [backendStatus, setBackendStatus] = useState("checking"); // "checking" | "ok" | "error"
  const usernameRef = useRef(null);
  const emailRef = useRef(null);
  const ageRef = useRef(null);
  const genderRef = useRef(null);
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

    const fieldOrder = [
      "name",
      "username",
      "email",
      "age",
      "gender",
      "password",
      "confirmPassword",
    ];
    const currentIndex = fieldOrder.indexOf(event.target.name);
    const nextField = fieldOrder[currentIndex + 1];

    if (nextField === "confirmPassword") {
      confirmPasswordRef.current?.focus();
    } else if (nextField === "password") {
      passwordRef.current?.focus();
    } else if (nextField === "gender") {
      genderRef.current?.focus();
    } else if (nextField === "age") {
      ageRef.current?.focus();
    } else if (nextField === "email") {
      emailRef.current?.focus();
    } else if (nextField === "username") {
      usernameRef.current?.focus();
    } else {
      event.target.form?.requestSubmit();
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const missingFields = [];
    if (!formData.name) missingFields.push("Full Name");
    if (!formData.username) missingFields.push("Username");
    if (!formData.email) missingFields.push("Email");
    if (!formData.age) missingFields.push("Age");
    if (!formData.gender) missingFields.push("Gender");
    if (!formData.password) missingFields.push("Password");
    if (!formData.confirmPassword) missingFields.push("Confirm Password");

    if (missingFields.length) {
      setMessage(`Please fill in the missing field${missingFields.length > 1 ? "s" : ""}: ${missingFields.join(", ")}.`);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match. Please re-enter them.");
      return;
    }

    setMessage(`Welcome, ${formData.name}! Your account has been created.`);

    if (typeof onRegisterSuccess === "function") {
      onRegisterSuccess();
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

        <h1 className={styles.title}>Create an account</h1>
        <p className={styles.subtitle}>
          Join Empyrean with a few simple details.
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label}>
            Full Name
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="Enter your name"
              className={styles.input}
            />
          </label>

          <label className={styles.label}>
            Username
            <input
              ref={usernameRef}
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="Choose a username"
              className={styles.input}
            />
          </label>

          <label className={styles.label}>
            Email
            <input
              ref={emailRef}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="you@example.com"
              className={styles.input}
            />
          </label>

          <label className={styles.label}>
            Age
            <input
              ref={ageRef}
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="Enter your age"
              className={styles.input}
            />
          </label>

          <label className={styles.label}>
            Gender
            <select
              ref={genderRef}
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              className={styles.input}
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
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
              placeholder="Enter a password"
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
              placeholder="Re-enter your password"
              className={styles.input}
            />
          </label>

          <button type="submit" className={styles.button}>
            Register
          </button>
          <p className={styles.helperText}>
            Further profile customization can be done in profile settings once you’re logged in.
          </p>
        </form>

        <div className={styles.secondaryAction}>
          <span>Already have an account?</span>
          <button
            type="button"
            className={styles.linkButton}
            onClick={() => {
              if (typeof onSwitchToLogin === "function") {
                onSwitchToLogin();
              }
            }}
          >
            Go to login
          </button>
        </div>

        {message ? <p className={styles.message}>{message}</p> : null}
      </div>
    </div>
  );
}
