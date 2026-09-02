import React, { useEffect, useRef, useState } from "react";
import styles from "../styles/login.module.css";
import logoGraphic from "../assets/landing/final-logo.svg";
import { forgotPassword, resetPassword, ApiError, getErrorMessage } from "../api";

function getResetToken() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
  return token ? token.trim() : null;
}

export default function ForgotPasswordPage({
  onResetSuccess,
  onSwitchToLogin,
}) {
  const initialToken = useRef(getResetToken());
  const hasToken = Boolean(initialToken.current);

  const [formData, setFormData] = useState(() =>
    hasToken
      ? { token: initialToken.current, password: "", confirmPassword: "" }
      : { email: "" },
  );
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [requested, setRequested] = useState(false);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  const fieldRefs = {
    email: emailRef,
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
    const labels = hasToken
      ? {
          email: "Email",
          password: "New password",
          confirmPassword: "Confirm password",
        }
      : { email: "Email", password: "New password", confirmPassword: "Confirm password" };

    if (!value) {
      setErrors((prev) => ({
        ...prev,
        [field]: `${labels[field]} is required`,
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

    const fieldOrder = hasToken
      ? ["password", "confirmPassword"]
      : ["email"];
    const currentIndex = fieldOrder.indexOf(event.target.name);
    const nextField = fieldOrder[currentIndex + 1];

    if (nextField && fieldRefs[nextField]) {
      fieldRefs[nextField].current?.focus();
    } else {
      event.target.form?.requestSubmit();
    }
  };

  const handleRequestLink = async (event) => {
    event.preventDefault();
    if (submitting || requested) return;

    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    }
    setErrors(newErrors);

    if (Object.keys(newErrors).length) {
      emailRef.current?.focus();
      return;
    }

    setSubmitting(true);
    setMessage("");
    try {
      await forgotPassword({ email: formData.email });
      setRequested(true);
      setMessage(
        "If an account exists for that email, a password reset link has been sent.",
      );
    } catch (err) {
      setMessage(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();
    if (submitting || success) return;

    const newErrors = {};
    for (const field of ["password", "confirmPassword"]) {
      if (!formData[field]) {
        newErrors[field] =
          field === "password" ? "New password is required" : "Confirm password is required";
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
        token: formData.token,
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

  const handleSubmit = hasToken ? handleResetPassword : handleRequestLink;

  return (
    <div className={styles.pageContainer}>
      <div className={styles.mainContainer}>
        <div className={`${styles.glassCard} ${styles.forgotCard}`}>
          {/* Form fields on the LEFT */}
          <div className={`${styles.formPanel} ${styles.formSlide}`}>
            <div className={styles.loginFormContainer}>
              {!hasToken ? (
                <h2 className={styles.welcomeText}>Forgot Password</h2>
              ) : (
                <h2 className={styles.welcomeText}>Reset Password</h2>
              )}
              <p className={styles.subtitleText}>
                {!hasToken
                  ? "Enter your account email and we'll send you a reset link."
                  : "Enter your new password below."}
              </p>

              <form
                onSubmit={handleSubmit}
                className={`${styles.form} ${styles.forgotForm}`}
              >
                {!hasToken ? (
                  <div className={styles.inputGroup}>
                    <label htmlFor="email">Email</label>
                    <input
                      ref={emailRef}
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onKeyDown={handleKeyDown}
                      onBlur={() => handleBlur("email")}
                      placeholder="Enter your email"
                      disabled={requested}
                    />
                    <span className={styles.fieldError}>{errors.email}</span>
                  </div>
                ) : (
                  <>
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
                  </>
                )}

                <button
                  type="submit"
                  className={styles.loginButton}
                  disabled={submitting || (hasToken ? success : requested)}
                >
                  {hasToken
                    ? submitting
                      ? "Resetting…"
                      : "Reset Password"
                    : submitting
                      ? "Sending…"
                      : "Send Reset Link"}
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
                    success || requested ? styles.formMessage : styles.formError
                  }
                >
                  {message}
                </p>
              ) : null}
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
