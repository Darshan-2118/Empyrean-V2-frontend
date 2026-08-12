import React, { useState } from "react";
import { ArrowLeft, User, Mail, Lock, Camera } from "lucide-react";
import styles from "../styles/login.module.css";
import accountStyles from "../styles/account.module.css";
import logoGraphic from "../assets/landing/final-logo.svg";

export default function AccountSettingsPage({ onBack }) {
  const [formData, setFormData] = useState({
    username: "johndoe",
    email: "john@empyrean.com",
    currentPassword: "",
    newPassword: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("Account settings updated successfully.");
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.navbar}>
        <a href="#back" onClick={(e) => { e.preventDefault(); onBack && onBack(); }} className={accountStyles.backLink}>
          <ArrowLeft size={18} /> Back to Dashboard
        </a>
      </div>

      <div className={styles.mainContainer}>
        <div className={`${styles.glassCard} ${accountStyles.accountCard}`}>
          <div className={accountStyles.headerPanel}>
            <h2 className={accountStyles.pageTitle}>Account Settings</h2>
            <p className={accountStyles.pageSubtitle}>Manage your profile and security</p>
          </div>

          <div className={accountStyles.contentPanel}>
            <form onSubmit={handleSubmit} className={accountStyles.form}>
              <div className={accountStyles.profileSection}>
                <div className={accountStyles.avatarContainer}>
                  <div className={accountStyles.avatarPlaceholder}>
                    <User size={40} />
                  </div>
                  <button type="button" className={accountStyles.avatarUploadBtn}>
                    <Camera size={16} />
                  </button>
                </div>
                <div className={accountStyles.profileInfo}>
                  <h3>Profile Picture</h3>
                  <p>Upload a new avatar. Max size 2MB.</p>
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="username"><User size={14} className={accountStyles.inputIcon}/> Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter your username"
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="email"><Mail size={14} className={accountStyles.inputIcon}/> Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                />
              </div>

              <div className={accountStyles.divider}></div>
              <h3 className={accountStyles.sectionTitle}>Change Password</h3>

              <div className={styles.inputGroup}>
                <label htmlFor="currentPassword"><Lock size={14} className={accountStyles.inputIcon}/> Current Password</label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  placeholder="Enter current password"
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="newPassword"><Lock size={14} className={accountStyles.inputIcon}/> New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Enter new password"
                />
              </div>

              <div className={accountStyles.actionRow}>
                <button type="submit" className={styles.loginButton}>
                  Save Changes
                </button>
                {message && <span className={accountStyles.successMessage}>{message}</span>}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
