import React, { useState } from "react";

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
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Create an account</h1>
        <p style={styles.subtitle}>Join Empyrean with a few simple details.</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>
            Full Name
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              style={styles.input}
            />
          </label>

          <label style={styles.label}>
            Email
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              style={styles.input}
            />
          </label>

          <label style={styles.label}>
            Password
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter a password"
              style={styles.input}
            />
          </label>

          <button type="submit" style={styles.button}>
            Register
          </button>
        </form>

        {message ? <p style={styles.message}>{message}</p> : null}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #0b1d3a 0%, #1f4d7a 100%)",
    padding: "24px",
    fontFamily: "Inter, Arial, sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: "420px",
    background: "#ffffff",
    padding: "32px",
    borderRadius: "16px",
    boxShadow: "0 20px 45px rgba(0, 0, 0, 0.2)",
  },
  title: {
    margin: "0 0 8px",
    fontSize: "28px",
    color: "#102542",
  },
  subtitle: {
    margin: "0 0 24px",
    color: "#5f6b7a",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  label: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    fontWeight: "600",
    color: "#223245",
  },
  input: {
    padding: "12px 14px",
    border: "1px solid #d7dce2",
    borderRadius: "10px",
    fontSize: "15px",
    outline: "none",
  },
  button: {
    marginTop: "8px",
    padding: "12px 16px",
    border: "none",
    borderRadius: "10px",
    background: "#e8a33d",
    color: "#1f1403",
    fontWeight: "700",
    cursor: "pointer",
  },
  message: {
    marginTop: "16px",
    color: "#1f7a4b",
    fontWeight: "600",
  },
};
