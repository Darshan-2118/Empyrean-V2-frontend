import React, { useState, useRef } from "react";
import styles from "../styles/login.module.css";
import logoGraphic from "../assets/landing/final-logo.svg";

const FIELD_LABELS = {
  name: "Full Name",
  username: "Username",
  email: "Email",
  age: "Age",
  gender: "Gender",
  password: "Password",
  confirmPassword: "Confirm Password",
};

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
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const nameRef = useRef(null);
  const usernameRef = useRef(null);
  const emailRef = useRef(null);
  const ageRef = useRef(null);
  const genderRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  const fieldRefs = {
    name: nameRef,
    username: usernameRef,
    email: emailRef,
    age: ageRef,
    gender: genderRef,
    password: passwordRef,
    confirmPassword: confirmPasswordRef,
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    // Age accepts digits only — no minus signs, decimals or 'e', max 3 digits
    const nextValue =
      name === "age" ? value.replace(/\D/g, "").slice(0, 3) : value;
    setFormData((prev) => ({ ...prev, [name]: nextValue }));
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

    if (field === "confirmPassword" && formData.password !== value) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match",
      }));
      return;
    }

    if (field === "password" && formData.confirmPassword !== value) {
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

    if (nextField && fieldRefs[nextField]) {
      fieldRefs[nextField].current?.focus();
    } else {
      event.target.form?.requestSubmit();
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const newErrors = {};
    for (const field of Object.keys(FIELD_LABELS)) {
      if (!formData[field]) {
        newErrors[field] = `${FIELD_LABELS[field]} is required`;
      }
    }
    if (
      formData.confirmPassword &&
      formData.password !== formData.confirmPassword
    ) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length) {
      const firstErrorField = Object.keys(newErrors)[0];
      fieldRefs[firstErrorField]?.current?.focus();
      return;
    }

    setMessage(`Welcome, ${formData.name}! Your account has been created.`);

    if (typeof onRegisterSuccess === "function") {
      onRegisterSuccess();
    }
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
                  <label htmlFor="name">Full Name</label>
                  <input
                    ref={nameRef}
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    onBlur={() => handleBlur("name")}
                    placeholder="Enter your name"
                  />
                  <span className={styles.fieldError}>{errors.name}</span>
                </div>

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
                  <label htmlFor="age">Age</label>
                  <input
                    ref={ageRef}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={3}
                    id="age"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    onBlur={() => handleBlur("age")}
                    placeholder="Enter your age"
                  />
                  <span className={styles.fieldError}>{errors.age}</span>
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="gender">Gender</label>
                  <select
                    ref={genderRef}
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    onBlur={() => handleBlur("gender")}
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                  <span className={styles.fieldError}>{errors.gender}</span>
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

                <button type="submit" className={styles.loginButton}>
                  Register
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
