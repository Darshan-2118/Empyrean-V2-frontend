import React, { useState } from "react";
import styles from "../styles/register.module.css";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      setMessage("Please fill in all fields before continuing.");
      return;
    }

    setMessage(`Welcome, ${formData.name}! Your account has been created.`);
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
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
              placeholder="Enter your name"
              className={styles.input}
            />
          </label>

          <label className={styles.label}>
            Email
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className={styles.input}
            />
          </label>

          <label className={styles.label}>
            Password
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter a password"
              className={styles.input}
            />
          </label>

          <button type="submit" className={styles.button}>
            Register
          </button>
        </form>

        {message ? <p className={styles.message}>{message}</p> : null}
      </div>
    </div>
  );
}
