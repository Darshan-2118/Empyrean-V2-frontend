import React, { useState, useEffect } from 'react';
import { ChevronDown, Eye, EyeOff, X } from 'lucide-react';
import styles from '../styles/AccountSettings.module.css';

export default function AccountSettings({ user, activeProfile, onProfileChange, onSignOut, onHasUnsavedChanges }) {
  const initialFormState = {
    fullName: user?.name || "Test User",
    email: user?.email || "testuser@example.com",
    age: "34",
    condition: activeProfile || "asthma"
  };

  const [formState, setFormState] = useState(initialFormState);
  const [originalState, setOriginalState] = useState(initialFormState);
  
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const [showPwd, setShowPwd] = useState({ current: false, new: false, confirm: false });
  
  const [saveMessage, setSaveMessage] = useState("");

  const hasChanges = JSON.stringify(formState) !== JSON.stringify(originalState) || (showPasswordSection && passwords.new.length > 0);
  
  useEffect(() => {
    onHasUnsavedChanges?.(hasChanges);
  }, [hasChanges, onHasUnsavedChanges]);

  const handleChange = (field, value) => {
    setFormState(prev => ({ ...prev, [field]: value }));
    setSaveMessage("");
  };

  const handlePasswordChange = (field, value) => {
    setPasswords(prev => ({ ...prev, [field]: value }));
    setSaveMessage("");
  };

  const isPasswordValid = (pwd) => {
    const hasUpper = /[A-Z]/.test(pwd);
    const hasLower = /[a-z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);
    const isLongEnough = pwd.length >= 8;
    return hasUpper && hasLower && hasNumber && hasSpecial && isLongEnough;
  };

  const handleSave = () => {
    if (showPasswordSection) {
      if (passwords.new !== passwords.confirm) return;
      if (!isPasswordValid(passwords.new)) return;
    }

    setOriginalState(formState);
    if (showPasswordSection) {
      setShowPasswordSection(false);
      setPasswords({ current: "", new: "", confirm: "" });
    }
    
    if (formState.condition !== originalState.condition) {
      onProfileChange(formState.condition);
    }
    
    setSaveMessage("Profile changes saved successfully ✓");
    setTimeout(() => setSaveMessage(""), 3000);
  };

  const pwdChecks = {
    length: passwords.new.length >= 8,
    upper: /[A-Z]/.test(passwords.new),
    lower: /[a-z]/.test(passwords.new),
    number: /[0-9]/.test(passwords.new),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(passwords.new)
  };
  
  const passwordsMatch = passwords.new === passwords.confirm && passwords.confirm !== "";

  return (
    <div className={`settings-grid ${styles.container}`} style={{ gridTemplateColumns: '1fr' }}>
      <div className={`widget widget--full ${styles.accountWidget}`}>
        <div className="widget__header">
          <h3>Account Information</h3>
        </div>
        <div className="settings-list">
          <div className="setting-item" style={{ flexDirection: 'column', alignItems: 'flex-start', borderBottom: 'none' }} id="account-setting-item">
            
            <div className={styles.formContainer}>
              <div>
                <label className={styles.label}>Full Name</label>
                <input type="text" value={formState.fullName} onChange={(e) => handleChange('fullName', e.target.value)} className={styles.input} />
              </div>

              <div>
                <label className={styles.label}>Email Address</label>
                <input type="email" value={formState.email} onChange={(e) => handleChange('email', e.target.value)} className={styles.input} />
              </div>

              <div>
                <label className={styles.label}>Age</label>
                <input type="number" value={formState.age} onChange={(e) => handleChange('age', e.target.value)} className={styles.input} />
              </div>

              <div>
                <label className={styles.label}>Primary Condition</label>
                <div className={styles.inputWrapper}>
                  <select value={formState.condition} onChange={(e) => handleChange('condition', e.target.value)} className={`${styles.input} ${styles.select}`}>
                    <option value="asthma" className={styles.option}>Asthma / COPD</option>
                    <option value="child" className={styles.option}>Child (Under 12)</option>
                    <option value="elderly" className={styles.option}>Elderly (Over 65)</option>
                    <option value="general" className={styles.option}>General (Healthy Adult)</option>
                  </select>
                  <div className={styles.dropdownIcon}>
                    <ChevronDown size={18} color="var(--text-secondary)" />
                  </div>
                </div>
              </div>

              {!showPasswordSection ? (
                <button 
                  className={styles.btnOutline}
                  onClick={() => setShowPasswordSection(true)}
                >
                  Change Password
                </button>
              ) : (
                <div className={styles.pwdSection}>
                  <div className={styles.pwdHeader}>
                    <h4 className={styles.pwdTitle}>Change Password</h4>
                    <button onClick={() => { setShowPasswordSection(false); setPasswords({ current: "", new: "", confirm: "" }); }} className={styles.closeBtn}>
                      <X size={18} />
                    </button>
                  </div>
                  
                  {['current', 'new', 'confirm'].map((field) => (
                    <div key={field}>
                      <label className={styles.label}>{field === 'current' ? 'Current Password' : field === 'new' ? 'New Password' : 'Confirm New Password'}</label>
                      <div className={styles.inputWrapper}>
                        <input 
                          type={showPwd[field] ? "text" : "password"} 
                          value={passwords[field]} 
                          onChange={(e) => handlePasswordChange(field, e.target.value)} 
                          className={styles.input}
                          style={{ paddingRight: '48px', borderColor: field === 'confirm' && passwords.confirm ? (passwordsMatch ? 'var(--safe-color)' : 'var(--danger-color)') : 'var(--border-color)' }} 
                        />
                        <button 
                          type="button"
                          onClick={() => setShowPwd(prev => ({...prev, [field]: !prev[field]}))}
                          className={styles.pwdToggle}
                        >
                          {showPwd[field] ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                  ))}

                  <div className={styles.pwdChecklist}>
                    <div style={{ color: pwdChecks.length ? 'var(--safe-color)' : 'inherit' }}>{pwdChecks.length ? '✓' : '○'} At least 8 characters</div>
                    <div style={{ color: pwdChecks.upper ? 'var(--safe-color)' : 'inherit' }}>{pwdChecks.upper ? '✓' : '○'} One uppercase letter</div>
                    <div style={{ color: pwdChecks.lower ? 'var(--safe-color)' : 'inherit' }}>{pwdChecks.lower ? '✓' : '○'} One lowercase letter</div>
                    <div style={{ color: pwdChecks.number ? 'var(--safe-color)' : 'inherit' }}>{pwdChecks.number ? '✓' : '○'} One number</div>
                    <div style={{ color: pwdChecks.special ? 'var(--safe-color)' : 'inherit' }}>{pwdChecks.special ? '✓' : '○'} One special character</div>
                    <div style={{ color: passwordsMatch ? 'var(--safe-color)' : 'inherit' }}>{passwordsMatch ? '✓' : '○'} Passwords match</div>
                  </div>
                </div>
              )}

              {saveMessage && (
                <div className={styles.successMsg}>
                  {saveMessage}
                </div>
              )}

              <div style={{ marginTop: '8px' }}>
                <button 
                  disabled={!hasChanges}
                  onClick={handleSave}
                  className={`${styles.btnSave} ${hasChanges ? styles.btnSaveActive : styles.btnSaveDisabled}`}
                >
                  Save Profile Changes
                </button>
              </div>

              <div className={styles.logoutContainer}>
                <button 
                  className={styles.btnLogout}
                  onClick={onSignOut}
                >
                  Logout
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
