import React, { useState, useRef } from "react";
import styles from "../styles/login.module.css";
import logoGraphic from "../assets/landing/final-logo.svg";
import { register, setSession, getErrorMessage } from "../api";

const FIELD_LABELS = {
  username: "Username",
  email: "Email",
  password: "Password",
  confirmPassword: "Confirm Password",
};

export default function RegisterPage({ onRegisterSuccess, onSwitchToLogin, onSwitchToAbout, onSwitchToFeatures }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const usernameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  const fieldRefs = {
    username: usernameRef,
    email: emailRef,
    password: passwordRef,
    confirmPassword: confirmPasswordRef,
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setMessage("");

    if (name === "password" && formData.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        password: "",
        confirmPassword:
          formData.confirmPassword === value ? "" : "Passwords do not match",
      }));
      return;
    }
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleBlur = (field) => {
    const value = formData[field] || "";

    if (!value) {
      setErrors((prev) => ({
        ...prev,
        [field]: `${FIELD_LABELS[field]} is required`,
      }));
      return;
    }

    if (field === "email" && !/\S+@\S+\.\S+/.test(value)) {
      setErrors((prev) => ({ ...prev, email: "Invalid email format" }));
      return;
    }

    if (field === "confirmPassword" && formData.password !== value) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match",
      }));
      return;
    }

    if (
      field === "password" &&
      formData.confirmPassword &&
      formData.confirmPassword !== value
    ) {
      setErrors((prev) => ({
        ...prev,
        password: "",
        confirmPassword: "Passwords do not match",
      }));
      return;
    }

    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleKeyDown = (event) => {
    if (event.key !== "Enter") return;

    event.preventDefault();

    const fieldOrder = [
      "username",
      "email",
      "password",
      "confirmPassword",
    ];
    const currentIndex = fieldOrder.indexOf(event.target.name);
    const nextField = fieldOrder[currentIndex + 1];

    if (nextField && fieldRefs[nextField]) {
      fieldRefs[nextField].current?.focus();
    } else {
      event.target.form?.requestSubmit();
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting) return;

    const newErrors = {};
    for (const field of Object.keys(FIELD_LABELS)) {
      if (!formData[field]) {
        newErrors[field] = `${FIELD_LABELS[field]} is required`;
      }
    }
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (
      formData.confirmPassword &&
      formData.password !== formData.confirmPassword
    ) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (
      formData.username &&
      !/^[A-Za-z0-9_]{3,50}$/.test(formData.username.trim())
    ) {
      newErrors.username =
        "Username must be 3-50 characters (letters, numbers, underscores only)";
    }
    if (formData.password) {
      const passwordBytes = new TextEncoder().encode(formData.password).length;
      if (passwordBytes < 6 || passwordBytes > 72) {
        newErrors.password = "Password must be 6-72 characters";
      }
    }
    if (formData.email && formData.email.trim().length > 255) {
      newErrors.email = "Email is too long";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length) {
      const firstErrorField = Object.keys(newErrors)[0];
      fieldRefs[firstErrorField]?.current?.focus();
      return;
    }

    setSubmitting(true);
    setMessage("");
    try {
      await register({
        username: formData.username.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });
      setSession({ role: "user" });
      setMessage("Registration successful!");
      if (typeof onRegisterSuccess === "function") {
        onRegisterSuccess();
      }
    } catch (err) {
      setMessage(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.mainContainer}>
        <div className={`${styles.glassCard} ${styles.registerCard}`}>
          {/* Form fields on the LEFT */}
          <div className={`${styles.formPanel} ${styles.formSlide}`}>
            <div className={styles.loginFormContainer}>
              <h2 className={styles.welcomeText}>Create an Account</h2>
              <p className={`${styles.subtitleText} ${styles.registerSubtitle}`}>
                Join{" "}
                <span className={styles.brandSubtitle}>EMPYREAN</span> with a few
                simple details.
              </p>

              <form
                onSubmit={handleSubmit}
                noValidate
                className={`${styles.form} ${styles.registerForm}`}
              >
                <div className={styles.inputGroup}>
                  <label htmlFor="username">Username</label>
                  <input
                    ref={usernameRef}
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    onBlur={() => handleBlur("username")}
                    placeholder="Choose a username"
                  />
                  <span className={styles.fieldError}>{errors.username}</span>
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="email">Email</label>
                  <input
                    ref={emailRef}
                    type="email"
                    id="email"
                    name="email"
                    autoComplete="off"
                    value={formData.email}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    onBlur={() => handleBlur("email")}
                    placeholder="you@example.com"
                  />
                  <span className={styles.fieldError}>{errors.email}</span>
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
                    placeholder="Enter a password"
                  />
                  <span className={styles.fieldError}>{errors.password}</span>
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <input
                    ref={confirmPasswordRef}
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    onBlur={() => handleBlur("confirmPassword")}
                    placeholder="Re-enter your password"
                  />
                  <span className={styles.fieldError}>
                    {errors.confirmPassword}
                  </span>
                </div>

                <button type="submit" className={styles.loginButton} disabled={submitting}>
                  {submitting ? "Creating account…" : "Register"}
                </button>

                <p className={styles.helperText}>
                  Further profile customization can be done in profile settings
                  once you’re logged in.
                </p>

                <div
                  className={`${styles.footerLinks} ${styles.footerLinksCenter}`}
                >
                  <span className={styles.secondaryActionText}>
                    Already have an account?{" "}
                    <a
                      href="#login"
                      onClick={(e) => {
                        e.preventDefault();
                        if (typeof onSwitchToLogin === "function") {
                          onSwitchToLogin();
                        }
                      }}
                    >
                      Go to login
                    </a>
                  </span>
                </div>
              </form>

              {message ? <p className={styles.formMessage}>{message}</p> : null}
            </div>
          </div>

          {/* Empyrean logo on the RIGHT */}
          <div className={`${styles.brandPanel} ${styles.brandSlide}`}>
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
        </div>
      </div>
    </div>
  );
}
