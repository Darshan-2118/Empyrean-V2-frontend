import React, { useEffect, useRef, useState } from "react";
import styles from "../styles/login.module.css";
import logoGraphic from "../assets/landing/final-logo.svg";
import { resetPassword, ApiError, getErrorMessage } from "../api";

const FIELD_LABELS = {
  identifier: "Email or username",
  password: "New password",
  confirmPassword: "Confirm password",
};

export default function ForgotPasswordPage({
  onResetSuccess,
  onSwitchToLogin,
}) {
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const identifierRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  const fieldRefs = {
    identifier: identifierRef,
    password: passwordRef,
    confirmPassword: confirmPasswordRef,
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setMessage("");

    if (name === "password") {
      setErrors((prev) => ({
        ...prev,
        password: "",
        confirmPassword:
          prev.confirmPassword && prev.confirmPassword !== value
            ? "Passwords do not match"
            : "",
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

    if (
      field === "confirmPassword" &&
      formData.confirmPassword &&
      formData.password !== value
    ) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match",
      }));
      return;
    }

    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleKeyDown = (event) => {
    if (event.key !== "Enter") return;

    event.preventDefault();

    const fieldOrder = ["identifier", "password", "confirmPassword"];
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
    if (submitting || success) return;

    const newErrors = {};
    for (const field of Object.keys(FIELD_LABELS)) {
      if (!formData[field]) {
        newErrors[field] = `${FIELD_LABELS[field]} is required`;
      }
    }
    if (formData.password && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (
      formData.confirmPassword &&
      formData.password !== formData.confirmPassword
    ) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length) {
      fieldRefs[Object.keys(newErrors)[0]]?.current?.focus();
      return;
    }

    setSubmitting(true);
    setMessage("");
    try {
      await resetPassword({
        identifier: formData.identifier,
        newPassword: formData.password,
      });
      setSuccess(true);
      setMessage(
        "Password reset successfully. Redirecting you to login…",
      );
      setTimeout(() => onResetSuccess?.(), 2000);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setMessage("Unable to reset password with those details");
      } else {
        setMessage(getErrorMessage(err));
      }
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => () => clearTimeout(), []);

  return (
    <div className={styles.pageContainer}>
      <div className={styles.mainContainer}>
        <div className={`${styles.glassCard} ${styles.forgotCard}`}>
          {/* Empyrean logo on the LEFT */}
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

          {/* Form fields on the RIGHT */}
          <div className={`${styles.rightPanel} ${styles.formSlideRight}`}>
            <div className={styles.loginFormContainer}>
              <h2 className={styles.welcomeText}>Reset Password</h2>
              <p className={styles.subtitleText}>
                Enter your account details and choose a new password.
              </p>

              <form
                onSubmit={handleSubmit}
                className={`${styles.form} ${styles.forgotForm}`}
              >
                <div className={styles.inputGroup}>
                  <label htmlFor="identifier">Email or Username</label>
                  <input
                    ref={identifierRef}
                    type="text"
                    id="identifier"
                    name="identifier"
                    value={formData.identifier}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    onBlur={() => handleBlur("identifier")}
                    placeholder="Enter your email or username"
                  />
                  <span className={styles.fieldError}>{errors.identifier}</span>
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="password">New Password</label>
                  <input
                    ref={passwordRef}
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    onBlur={() => handleBlur("password")}
                    placeholder="Enter a new password"
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
                    placeholder="Re-enter your new password"
                  />
                  <span className={styles.fieldError}>
                    {errors.confirmPassword}
                  </span>
                </div>

                <button
                  type="submit"
                  className={styles.loginButton}
                  disabled={submitting}
                >
                  {submitting ? "Resetting…" : "Reset Password"}
                </button>

                <div
                  className={`${styles.footerLinks} ${styles.footerLinksCenter}`}
                >
                  <span className={styles.secondaryActionText}>
                    Remembered your password?{" "}
                    <a
                      href="#login"
                      onClick={(e) => {
                        e.preventDefault();
                        onSwitchToLogin?.();
                      }}
                    >
                      Back to login
                    </a>
                  </span>
                </div>
              </form>

              {message ? (
                <p
                  className={
                    success ? styles.formMessage : styles.formError
                  }
                >
                  {message}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}