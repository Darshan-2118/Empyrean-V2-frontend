<<<<<<<< HEAD:src/pages/loginPage.jsx
import React, { useState } from "react";
import styles from "../styles/register.module.css";

export default function RegisterPage() {
========
import React, { useState, useEffect, useRef } from "react";
import styles from "../styles/login.module.css";
import { checkHealth } from "../api.js";

export default function LoginPage({ onLoginSuccess, onSwitchToRegister }) {
>>>>>>>> main:src/pages/login.jsx
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });
  const [message, setMessage] = useState("");
<<<<<<<< HEAD:src/pages/loginPage.jsx
========
  const [backendStatus, setBackendStatus] = useState("checking");
  const passwordRef = useRef(null);

  useEffect(() => {
    checkHealth().then((result) => {
      setBackendStatus(result.ok ? "ok" : "error");
    });
  }, []);
>>>>>>>> main:src/pages/login.jsx

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setMessage("");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (event.target.name === "identifier") {
        passwordRef.current?.focus();
      } else if (event.target.name === "password") {
        handleSubmit(event);
      }
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const missingFields = [];
    if (!formData.identifier) missingFields.push("name or email");
    if (!formData.password) missingFields.push("password");

    if (missingFields.length) {
      setMessage(`Please fill in the missing field${missingFields.length > 1 ? "s" : ""}: ${missingFields.join(", ")}.`);
      return;
    }

<<<<<<<< HEAD:src/pages/loginPage.jsx
    setMessage(`Welcome, ${formData.name}! Your account has been created.`);
========
    setMessage(`Welcome back! You are signed in.`);

    if (typeof onLoginSuccess === "function") {
      onLoginSuccess();
    }
>>>>>>>> main:src/pages/login.jsx
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
<<<<<<<< HEAD:src/pages/loginPage.jsx
        <h1 className={styles.title}>Create an account</h1>
        <p className={styles.subtitle}>
          Join Empyrean with a few simple details.
        </p>

        <ul className="hidden md:flex items-center gap-9 list-none m-0 p-0">
          {[
            ["Features", "landing"],
            ["Login", "login"],
            ["Register", "register"],
          ].map(([label, target]) => (
            <li key={label}>
              <button
                onClick={() => go(target)}
                className="text-sm font-medium transition-colors"
                style={{ color: c.inkOnNavySoft }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                onMouseLeave={(e) => (e.currentTarget.style.color = c.inkOnNavySoft)}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>

        <button
          onClick={() => go("register")}
          className="hidden md:inline-flex items-center gap-2 font-semibold text-sm px-5 py-2.5 rounded-full transition-transform hover:-translate-y-0.5"
          style={{ background: c.amber, color: "#241606" }}
        >
          Track Your Air Now
        </button>

        <button className="md:hidden text-white p-2" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
========
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

        <h1 className={styles.title}>Welcome back</h1>
        <p className={styles.subtitle}>Sign in to continue to Empyrean.</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label}>
            Name or Email
            <input
              type="text"
              name="identifier"
              value={formData.identifier}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="Enter your name or email"
              className={styles.input}
            />
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
              placeholder="Enter your password"
              className={styles.input}
            />
          </label>

          <button type="submit" className={styles.button}>
            Login
          </button>
        </form>

        <div className={styles.secondaryAction}>
          <span>New to Empyrean?</span>
          <button
            type="button"
            className={styles.linkButton}
            onClick={onSwitchToRegister}
          >
            Create account
          </button>
        </div>

        {message ? <p className={styles.message}>{message}</p> : null}
>>>>>>>> main:src/pages/login.jsx
      </div>

      {open && (
        <div className="md:hidden px-8 pb-6 flex flex-col gap-4" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <button className="text-left text-sm py-2" style={{ color: c.inkOnNavySoft }} onClick={() => { go("landing"); setOpen(false); }}>Features</button>
          <button className="text-left text-sm py-2" style={{ color: c.inkOnNavySoft }} onClick={() => { go("login"); setOpen(false); }}>Login</button>
          <button className="text-left text-sm py-2" style={{ color: c.inkOnNavySoft }} onClick={() => { go("register"); setOpen(false); }}>Register</button>
          <button
            onClick={() => { go("register"); setOpen(false); }}
            className="font-semibold text-sm px-5 py-3 rounded-full"
            style={{ background: c.amber, color: "#241606" }}
          >
            Track Your Air Now
          </button>
        </div>
      )}
    </nav>
  );
}

function Hero({ go }) {
  return (
    <section
      className="relative overflow-hidden pt-[88px]"
      style={{
        background: `linear-gradient(180deg, ${c.navyDeep} 0%, ${c.navy} 55%, ${c.navyMid} 100%)`,
        color: c.inkOnNavy,
      }}
    >
      <div className="max-w-6xl mx-auto px-8 grid md:grid-cols-2 gap-14 items-center pb-20 relative z-10">
        <div>
          <span
            className="inline-flex items-center gap-2 text-xs uppercase mb-5"
            style={{ ...mono, color: c.mint, letterSpacing: "0.14em" }}
          >
            <span className="pulse-dot inline-block w-[7px] h-[7px] rounded-full" style={{ background: c.mint }} />
            Live sensor network · Bengaluru pilot grid
          </span>

          <h1
            className="font-bold text-white mb-5"
            style={{ ...display, fontSize: "clamp(2.6rem, 5vw, 4.1rem)", lineHeight: 1.03, letterSpacing: "-0.02em" }}
          >
            Breathe pure
            <br />
            <span
              style={{
                background: `linear-gradient(90deg, ${c.mint}, ${c.blue})`,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              with Empyrean
            </span>
          </h1>

          <p className="text-lg leading-relaxed max-w-[480px] mb-8" style={{ color: c.inkOnNavySoft }}>
            A wearable air-quality network that reads the block you're standing on, not the district you
            live in — then tells you, in your body's own terms, whether it's safe to keep breathing it.
          </p>

          <div className="flex items-center gap-5 flex-wrap">
            <button
              onClick={() => go("register")}
              className="inline-flex items-center gap-2.5 font-semibold text-base px-7 py-4 rounded-full transition-transform hover:-translate-y-0.5"
              style={{ background: c.amber, color: "#241606", boxShadow: "0 12px 28px -10px rgba(232,163,61,0.55)" }}
            >
              Track Your Air Now
              <ArrowRight size={18} />
            </button>
            <a
              href="#features"
              className="inline-flex items-center gap-2 text-base font-medium pb-1"
              style={{ color: c.inkOnNavy, borderBottom: "1px solid rgba(255,255,255,0.25)" }}
            >
              See how the mapping works
            </a>
          </div>
        </div>

        <HeroVisual />
      </div>
    </section>
  );
}

function SocialProof() {
  return (
    <section className="border-t" style={{ background: c.navyDeep, borderColor: "rgba(255,255,255,0.08)" }}>
      <div className="max-w-6xl mx-auto px-8 grid grid-cols-2 md:grid-cols-4 gap-y-6 py-10">
        <Counter target={12480} unit="+" label="Active wearable sensors" />
        <Counter target={148} unit="cities" label="City-wide networks live" />
        <Counter target={2300000} unit="+" label="Readings aggregated today" />
        <Counter target={13} unit="profiles" label="Personalized health boundaries" />
      </div>
    </section>
  );
}

function FeatureCard({ icon, iconBg, iconColor, title, body, tag }) {
  return (
    <div
      className="bg-white border rounded-[14px] p-8 transition-all hover:-translate-y-1"
      style={{ borderColor: c.paperDim }}
    >
      <div
        className="w-[46px] h-[46px] rounded-xl flex items-center justify-center mb-5"
        style={{ background: iconBg, color: iconColor }}
      >
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2.5" style={{ ...display, color: c.ink }}>
        {title}
      </h3>
      <p className="text-sm leading-relaxed" style={{ color: c.inkSoft }}>
        {body}
      </p>
      <span
        className="block mt-4 text-xs uppercase opacity-65"
        style={{ ...mono, color: c.inkSoft, letterSpacing: "0.06em" }}
      >
        {tag}
      </span>
    </div>
  );
}

function Features() {
  return (
    <section className="py-24" style={{ background: c.paper }} id="features">
      <div className="max-w-6xl mx-auto px-8">
        <div className="max-w-xl mb-14">
          <span
            className="block text-xs uppercase mb-3.5"
            style={{ ...mono, color: "#B5793E", letterSpacing: "0.14em" }}
          >
            What the band actually does
          </span>
          <h2
            className="font-semibold mb-3.5"
            style={{ ...display, fontSize: "clamp(1.8rem, 3vw, 2.5rem)", letterSpacing: "-0.01em", color: c.ink }}
          >
            Three instruments, one reading you can trust
          </h2>
          <p className="text-base leading-relaxed" style={{ color: c.inkSoft }}>
            Empyrean doesn't average your city into a single daily number. It measures the air a few
            centimetres from your face, tags it to the ground you're standing on, and checks it against
            thresholds built for your body.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-7">
          <FeatureCard
            icon={<Radar size={24} />}
            iconBg="rgba(95,178,222,0.15)"
            iconColor="#2E7FAE"
            title="Real-time IoT air mapping"
            body="PM1.0, PM2.5, PM10, CO₂, NH₃ and benzene readings stream to the map the moment they're captured, plotted street by street instead of averaged across a district."
            tag="MQ135 + PMS5003 · 15s cycle"
          />
          <FeatureCard
            icon={<MapPin size={24} />}
            iconBg="rgba(63,216,166,0.16)"
            iconColor="#1D9C74"
            title="Automatic GPS tracking"
            body="Every reading is geo-tagged the instant it's taken, quietly building your exposure path through the day — no check-ins, no manual logging."
            tag="Neo-6M GPS · 1–5m accuracy"
          />
          <FeatureCard
            icon={<ShieldCheck size={24} />}
            iconBg="rgba(232,163,61,0.18)"
            iconColor="#A6691E"
            title="Personalized health boundaries"
            body="Thirteen profiles across ten conditions and three vulnerability groups set thresholds tuned to your body, so an alert means the air has actually crossed a line that matters to you."
            tag="Asthma · Child · Elderly · +10 more"
          />
        </div>
      </div>
    </section>
  );
}

function Field({ label, optional, children }) {
  return (
    <div className="flex flex-col gap-1.5 mb-4.5">
      <label className="text-sm font-semibold" style={{ color: c.ink }}>
        {label} {optional && <span className="font-normal text-xs" style={{ color: c.inkSoft }}>(optional)</span>}
      </label>
      {children}
    </div>
  );
}

const inputStyle = {
  border: `1px solid ${c.fieldBorder}`,
  borderRadius: "10px",
  padding: "12px 14px",
  fontSize: "0.95rem",
  color: c.ink,
  background: c.fieldBg,
  width: "100%",
};

function RegisterPage() {
  const [profile, setProfile] = useState("general");
  const [condition, setCondition] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const base = PROFILES[profile];
  const adjust = condition && CONDITION_ADJUST[condition];
  const severity = adjust ? adjust.severity : base.severity;
  const badgeColor = adjust ? adjust.color : base.color;

  return (
    <div style={{ background: c.paper }}>
      <section className="py-16 border-b" style={{ background: c.navy, color: c.inkOnNavy, borderColor: "rgba(255,255,255,0.08)" }}>
        <div className="max-w-6xl mx-auto px-8 max-w-[760px]">
          <h1 className="font-bold text-white mb-3" style={{ ...display, fontSize: "clamp(2rem, 4vw, 2.7rem)", letterSpacing: "-0.01em" }}>
            Set up your Empyrean profile
          </h1>
        </div>
      </section>

      <section className="py-16 pb-28">
        <div className="max-w-6xl mx-auto px-8">
          <form
            className="bg-white border rounded-[18px] p-9"
            style={{ borderColor: c.paperDim }}
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
          >
            <h2 className="text-xl font-semibold mb-1.5" style={{ ...display, color: c.ink }}>
              Your details
            </h2>
            <p className="text-sm mb-7" style={{ color: c.inkSoft }}>
              Used to create your account and calibrate your device profile.
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Full name">
                <input style={inputStyle} type="text" placeholder="e.g. Ananya Rao" required />
              </Field>
              <Field label="Date of birth">
                <input style={inputStyle} type="date" required />
              </Field>
            </div>

            <Field label="Email">
              <input style={inputStyle} type="email" placeholder="you@domain.com" required />
            </Field>

            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Password">
                <input style={inputStyle} type="password" placeholder="At least 8 characters" minLength={8} required />
              </Field>
              <Field label="Confirm Password">
                <input style={inputStyle} type="password" placeholder="Re-enter password" minLength={8} required />
              </Field>
            </div>

            <div className="mb-2">
              <label className="text-sm font-semibold" style={{ color: c.ink }}>
                Health profile
              </label>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mb-6">
              {Object.entries(PROFILES).map(([key, p]) => (
                <button
                  type="button"
                  key={key}
                  onClick={() => setProfile(key)}
                  className="flex flex-col items-start gap-1.5 text-left rounded-xl p-3.5 transition-colors"
                  style={{
                    border: `1.5px solid ${profile === key ? c.blue : c.fieldBorder}`,
                    background: profile === key ? "rgba(95,178,222,0.09)" : c.fieldBg,
                  }}
                >
                  <span className="text-lg">{p.icon}</span>
                  <span className="font-semibold text-sm" style={{ color: c.ink }}>{p.label}</span>
                  <span className="text-xs leading-tight" style={{ color: c.inkSoft }}>{p.desc}</span>
                </button>
              ))}
            </div>

            <details className="pt-6 mb-4" style={{ borderTop: `1px dashed ${c.fieldBorder}` }}>
              <summary className="cursor-pointer font-semibold text-sm mb-4 flex items-center gap-2" style={{ color: c.ink }}>
                <ChevronRight size={15} />
                Add health context <span className="font-normal text-xs" style={{ color: c.inkSoft }}>(optional — sharpens your baseline)</span>
              </summary>

              <Field label="Diagnosed condition" optional>
                <select style={inputStyle} value={condition} onChange={(e) => setCondition(e.target.value)}>
                  <option value="">None / prefer not to say</option>
                  {CONDITIONS.map((cond) => (
                    <option key={cond} value={cond}>{cond}</option>
                  ))}
                </select>
              </Field>
              <Field label="Notes for your care team" optional>
                <textarea
                  style={{ ...inputStyle, minHeight: "76px", resize: "vertical" }}
                  placeholder="e.g. resting respiratory rate, recent flare-ups, medication in use"
                />
              </Field>
            </details>

            <button
              type="submit"
              disabled={submitted}
              className="w-full mt-2 font-bold text-base py-4 rounded-full transition-transform hover:-translate-y-0.5"
              style={{ background: c.amber, color: "#241606" }}
            >
              {submitted ? "Account created — welcome to Empyrean" : "Create my Empyrean account"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

function LoginPage({ go }) {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div style={{ background: c.paper, minHeight: "80vh" }}>
      <section className="py-16 border-b" style={{ background: c.navy, color: c.inkOnNavy, borderColor: "rgba(255,255,255,0.08)" }}>
        <div className="max-w-6xl mx-auto px-8 max-w-[760px]">
          <h1 className="font-bold text-white mb-3" style={{ ...display, fontSize: "clamp(2rem, 4vw, 2.7rem)", letterSpacing: "-0.01em" }}>
            Welcome back to Empyrean
          </h1>
          <p className="text-base leading-relaxed max-w-[560px]" style={{ color: c.inkOnNavySoft }}>
            Log in to view your live air-quality data and health thresholds.
          </p>
        </div>
      </section>

      <section className="py-16 pb-28">
        <div className="max-w-6xl mx-auto px-8 flex justify-center">
          <form
            className="bg-white border rounded-[18px] p-9 w-full max-w-[480px]"
            style={{ borderColor: c.paperDim }}
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
          >
            <h2 className="text-xl font-semibold mb-1.5" style={{ ...display, color: c.ink }}>
              Log in
            </h2>
            <p className="text-sm mb-7" style={{ color: c.inkSoft }}>
              Enter your credentials to access your dashboard.
            </p>

            <Field label="Email">
              <input style={inputStyle} type="email" placeholder="you@domain.com" required />
            </Field>

            <Field label="Password">
              <input style={inputStyle} type="password" placeholder="Enter your password" required />
            </Field>

            <div className="flex justify-end mb-6 mt-2">
              <a href="#" className="text-sm font-medium" style={{ color: c.blue }}>
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={submitted}
              className="w-full font-bold text-base py-4 rounded-full transition-transform hover:-translate-y-0.5"
              style={{ background: c.amber, color: "#241606" }}
            >
              {submitted ? "Logging in..." : "Log in"}
            </button>

            <div className="mt-6 text-center text-sm" style={{ color: c.inkSoft }}>
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => go("register")}
                className="font-medium hover:underline"
                style={{ color: c.blue }}
              >
                Register here
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}

function Footer({ go }) {
  return (
    <footer className="pt-16 pb-7" style={{ background: c.navyDeep, color: c.inkOnNavySoft }}>
      <div className="max-w-6xl mx-auto px-8">
        <div className="grid md:grid-cols-[1.4fr_1fr_1fr_1.2fr] gap-10 mb-12">
          <div>
            <div className="flex items-center gap-2.5 text-xl font-bold text-white mb-3.5" style={display}>
              <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
                <path d="M16 2C16 2 6 12.5 6 20a10 10 0 0 0 20 0C26 12.5 16 2 16 2Z" fill="url(#footMark)" />
                <defs>
                  <linearGradient id="footMark" x1="6" y1="2" x2="26" y2="30" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#3FD8A6" />
                    <stop offset="1" stopColor="#5FB2DE" />
                  </linearGradient>
                </defs>
              </svg>
              Empyrean
            </div>
            <p className="text-sm leading-relaxed max-w-[280px]">
              A wearable air-quality network built for the people most affected by pollution — one
              reading, one street, one body at a time.
            </p>
          </div>

          <div>
            <h4 className="text-xs uppercase text-white mb-4 font-medium" style={{ ...mono, letterSpacing: "0.1em" }}>Product</h4>
            <ul className="list-none p-0 flex flex-col gap-2.5">
              <li><a href="#features" className="text-sm hover:text-[#3FD8A6]">Features</a></li>
              <li><button onClick={() => go("landing")} className="text-sm hover:text-[#3FD8A6]">How it works</button></li>
              <li><button onClick={() => go("login")} className="text-sm hover:text-[#3FD8A6]">Login</button></li>
              <li><button onClick={() => go("register")} className="text-sm hover:text-[#3FD8A6]">Register</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase text-white mb-4 font-medium" style={{ ...mono, letterSpacing: "0.1em" }}>Support</h4>
            <ul className="list-none p-0 flex flex-col gap-2.5">
              <li><a href="#" className="text-sm hover:text-[#3FD8A6]">Help centre</a></li>
              <li><a href="#" className="text-sm hover:text-[#3FD8A6]">Device setup</a></li>
              <li><a href="#" className="text-sm hover:text-[#3FD8A6]">Contact us</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase text-white mb-4 font-medium" style={{ ...mono, letterSpacing: "0.1em" }}>Contact</h4>
            <ul className="list-none p-0 flex flex-col gap-2.5 text-sm">
              <li><a href="mailto:hello@empyrean.io" className="hover:text-[#3FD8A6]">hello@empyrean.io</a></li>
              <li><a href="tel:+918041234567" className="hover:text-[#3FD8A6]">+91 80 4123 4567</a></li>
              <li>RajaRajeswari College of Engineering, Bengaluru</li>
            </ul>
          </div>
        </div>

        <div
          className="flex justify-between items-center flex-wrap gap-3 pt-6 text-sm"
          style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
        >
          <span>© 2026 Empyrean Technologies. All rights reserved.</span>
          <div className="flex gap-5">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
            <a href="#" className="hover:text-white">Cookie Settings</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function EmpyreanApp() {
  const [route, setRoute] = useState("landing");
  const go = useCallback((r) => {
    setRoute(r);
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", color: c.ink, background: c.paper }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        .pulse-dot { animation: pulseDot 2.2s infinite; }
        @keyframes pulseDot {
          0% { box-shadow: 0 0 0 0 rgba(63,216,166,0.55); }
          70% { box-shadow: 0 0 0 9px rgba(63,216,166,0); }
          100% { box-shadow: 0 0 0 0 rgba(63,216,166,0); }
        }
        .sensor-ring { animation: ringPulse 2.6s ease-out infinite; transform-origin: center; }
        @keyframes ringPulse {
          0% { r: 5; opacity: 0.9; }
          100% { r: 16; opacity: 0; }
        }
        .breath-line {
          stroke-dasharray: 900;
          stroke-dashoffset: 900;
          animation: draw 2.6s ease forwards 0.4s;
        }
        @keyframes draw { to { stroke-dashoffset: 0; } }
        @media (prefers-reduced-motion: reduce) {
          .pulse-dot, .sensor-ring, .breath-line { animation: none !important; }
          .breath-line { stroke-dashoffset: 0; }
        }
      `}</style>

      <Nav route={route} go={go} />

      {route === "landing" && (
        <>
          <Hero go={go} />
          <SocialProof />
          <Features />
        </>
      )}
      {route === "register" && <RegisterPage />}
      {route === "login" && <LoginPage go={go} />}

      <Footer go={go} />
    </div>
  );
}