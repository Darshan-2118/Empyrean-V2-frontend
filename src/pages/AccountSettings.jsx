import React, { useState, useEffect } from 'react';
import { ChevronDown, LogOut, Eye, EyeOff, Check, X } from 'lucide-react';

export default function AccountSettings({ user, activeProfile, onProfileChange, onSignOut, onHasUnsavedChanges }) {
  const initialFormState = {
    fullName: user?.name || "Test User",
    username: user?.username || "testuser",
    email: user?.email || "testuser@example.com",
    phone: "+91 98765 43210",
    age: "34",
    condition: activeProfile || "asthma"
  };

  const [formState, setFormState] = useState(initialFormState);
  const [originalState, setOriginalState] = useState(initialFormState);
  
  const [usernameStatus, setUsernameStatus] = useState(''); // 'checking', 'available', 'unavailable'
  
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const [showPwd, setShowPwd] = useState({ current: false, new: false, confirm: false });
  
  const [saveMessage, setSaveMessage] = useState("");

  const hasChanges = JSON.stringify(formState) !== JSON.stringify(originalState) || (showPasswordSection && passwords.new.length > 0);
  
  useEffect(() => {
    onHasUnsavedChanges?.(hasChanges);
  }, [hasChanges, onHasUnsavedChanges]);

  // Username validation simulation
  useEffect(() => {
    if (formState.username === originalState.username) {
      setUsernameStatus('');
      return;
    }
    
    if (formState.username.length < 3) {
      setUsernameStatus('invalid');
      return;
    }

    setUsernameStatus('checking');
    const timer = setTimeout(() => {
      if (formState.username === 'admin' || formState.username === 'root') {
        setUsernameStatus('unavailable');
      } else {
        setUsernameStatus('available');
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [formState.username, originalState.username]);

  const handleChange = (field, value) => {
    setFormState(prev => ({ ...prev, [field]: value }));
    setSaveMessage("");
  };

  const handlePasswordChange = (field, value) => {
    setPasswords(prev => ({ ...prev, [field]: value }));
    setSaveMessage("");
  };

  const handleSave = () => {
    // Validate everything
    if (usernameStatus === 'unavailable' || usernameStatus === 'invalid') {
      return; // Can't save
    }

    if (showPasswordSection) {
      if (passwords.new !== passwords.confirm) return;
      if (!isPasswordValid(passwords.new)) return;
    }

    // Simulate save
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

  const isPasswordValid = (pwd) => {
    const hasUpper = /[A-Z]/.test(pwd);
    const hasLower = /[a-z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);
    const isLongEnough = pwd.length >= 8;
    return hasUpper && hasLower && hasNumber && hasSpecial && isLongEnough;
  };

  const pwdChecks = {
    length: passwords.new.length >= 8,
    upper: /[A-Z]/.test(passwords.new),
    lower: /[a-z]/.test(passwords.new),
    number: /[0-9]/.test(passwords.new),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(passwords.new)
  };
  
  const passwordsMatch = passwords.new === passwords.confirm && passwords.confirm !== "";
  
  const inputStyle = { width: '100%', padding: '12px 16px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', borderRadius: '12px', fontSize: '1rem', color: 'var(--text-primary)', boxSizing: 'border-box' };
  const labelStyle = { display: 'block', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '8px' };

  return (
    <div className="settings-grid" style={{ gridTemplateColumns: '1fr', paddingBottom: '40px' }}>
      <div className="widget widget--full" style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }}>
        <div className="widget__header">
          <h3>Account Information</h3>
        </div>
        <div className="settings-list">
          <div className="setting-item" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '24px', padding: '24px', borderBottom: 'none' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
              <div>
                <label style={labelStyle}>Full Name</label>
                <input type="text" value={formState.fullName} onChange={(e) => handleChange('fullName', e.target.value)} style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>Email Address</label>
                <input type="email" value={formState.email} onChange={(e) => handleChange('email', e.target.value)} style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>Age</label>
                <input type="number" value={formState.age} onChange={(e) => handleChange('age', e.target.value)} style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>Primary Condition</label>
                <div style={{ position: 'relative' }}>
                  <select value={formState.condition} onChange={(e) => handleChange('condition', e.target.value)} style={{ ...inputStyle, fontFamily: 'Gugi', appearance: 'none', cursor: 'pointer' }}>
                    <option value="asthma" style={{ background: '#0d1f18', color: '#fff' }}>Asthma / COPD</option>
                    <option value="child" style={{ background: '#0d1f18', color: '#fff' }}>Child (Under 12)</option>
                    <option value="elderly" style={{ background: '#0d1f18', color: '#fff' }}>Elderly (Over 65)</option>
                    <option value="general" style={{ background: '#0d1f18', color: '#fff' }}>General (Healthy Adult)</option>
                  </select>
                  <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                    <ChevronDown size={18} color="var(--text-secondary)" />
                  </div>
                </div>
              </div>

              {!showPasswordSection ? (
                <button 
                  style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', padding: '12px 16px', borderRadius: '12px', cursor: 'pointer', fontWeight: 500, textAlign: 'left', transition: 'background 0.2s', marginTop: '8px' }}
                  onClick={() => setShowPasswordSection(true)}
                >
                  Change Password
                </button>
              ) : (
                <div style={{ background: 'rgba(0,0,0,0.1)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '20px', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1rem' }}>Change Password</h4>
                    <button onClick={() => { setShowPasswordSection(false); setPasswords({ current: "", new: "", confirm: "" }); }} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                      <X size={18} />
                    </button>
                  </div>
                  
                  {['current', 'new', 'confirm'].map((field) => (
                    <div key={field}>
                      <label style={labelStyle}>{field === 'current' ? 'Current Password' : field === 'new' ? 'New Password' : 'Confirm New Password'}</label>
                      <div style={{ position: 'relative' }}>
                        <input 
                          type={showPwd[field] ? "text" : "password"} 
                          value={passwords[field]} 
                          onChange={(e) => handlePasswordChange(field, e.target.value)} 
                          style={{...inputStyle, paddingRight: '48px', borderColor: field === 'confirm' && passwords.confirm ? (passwordsMatch ? 'var(--safe-color)' : 'var(--danger-color)') : 'var(--border-color)'}} 
                        />
                        <button 
                          type="button"
                          onClick={() => setShowPwd(prev => ({...prev, [field]: !prev[field]}))}
                          style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex' }}
                        >
                          {showPwd[field] ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                  ))}

                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '4px' }}>
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
                <div style={{ color: 'var(--safe-color)', fontSize: '0.95rem', textAlign: 'center', marginTop: '8px', fontWeight: 500 }}>
                  {saveMessage}
                </div>
              )}

              <div style={{ marginTop: '8px' }}>
                <button 
                  disabled={!hasChanges}
                  onClick={handleSave}
                  style={{ background: hasChanges ? 'var(--accent-color)' : 'rgba(255,255,255,0.1)', color: hasChanges ? '#08201a' : 'var(--text-secondary)', border: 'none', padding: '12px 24px', borderRadius: '12px', cursor: hasChanges ? 'pointer' : 'not-allowed', fontWeight: 600, width: '100%', fontSize: '1rem', transition: 'all 0.2s' }}
                >
                  Save Profile Changes
                </button>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
                <button 
                  style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.85rem', textDecoration: 'underline' }}
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
