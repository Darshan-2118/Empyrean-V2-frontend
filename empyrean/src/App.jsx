import { useState, useEffect, useRef, useCallback } from "react";
import {
  ArrowRight,
  Radar,
  MapPin,
  ShieldCheck,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";

const c = {
  navy: "#0B1D3A",
  navyDeep: "#071429",
  navyMid: "#12335c",
  amber: "#E8A33D",
  blue: "#5FB2DE",
  mint: "#3FD8A6",
  paper: "#F6F4EF",
  paperDim: "#EAE7DE",
  fieldBg: "#FCFBF8",
  fieldBorder: "#D7D2C4",
  ink: "#142033",
  inkSoft: "#4C5A70",
  inkOnNavy: "#DCE6F2",
  inkOnNavySoft: "#8FA3BE",
};

const display = { fontFamily: "'Space Grotesk', sans-serif" };
const mono = { fontFamily: "'IBM Plex Mono', monospace" };

const PROFILES = {
  general: {
    label: "General",
    icon: "◎",
    desc: "Standard WHO guideline thresholds",
    pm25: "35 µg/m³",
    pm10: "70 µg/m³",
    gas: "1000 ppm",
    style: "Standard",
    severity: "Standard",
    color: c.mint,
  },
  asthma: {
    label: "Asthma",
    icon: "◐",
    desc: "Alerts on the mildest threshold breach",
    pm25: "12 µg/m³",
    pm10: "30 µg/m³",
    gas: "700 ppm",
    style: "Immediate on mild breach",
    severity: "Elevated",
    color: c.amber,
  },
  child: {
    label: "Child",
    icon: "◒",
    desc: "Strictest limits, under 12",
    pm25: "9 µg/m³",
    pm10: "25 µg/m³",
    gas: "600 ppm",
    style: "All pollutants — strict",
    severity: "Strictest",
    color: c.amber,
  },
  elderly: {
    label: "Elderly",
    icon: "◑",
    desc: "Sustained-exposure focus, 65+",
    pm25: "15 µg/m³",
    pm10: "35 µg/m³",
    gas: "750 ppm",
    style: "Sustained exposure focus",
    severity: "Elevated",
    color: c.blue,
  },
};

const CONDITIONS = [
  "Allergic Rhinitis",
  "Asthma",
  "Bronchiectasis",
  "Chronic Bronchitis",
  "COPD",
  "Cystic Fibrosis",
  "Emphysema",
  "Hypersensitivity Pneumonitis",
  "Pulmonary Fibrosis",
  "Sleep Apnea",
];

const CONDITION_ADJUST = {
  COPD: { severity: "Critical", color: "#E8637A" },
  "Cystic Fibrosis": { severity: "Critical", color: "#E8637A" },
  "Pulmonary Fibrosis": { severity: "Elevated", color: c.amber },
  Bronchiectasis: { severity: "Elevated", color: c.amber },
};

function formatNum(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  return n.toLocaleString();
}

function Counter({ target, unit, label }) {
  const [value, setValue] = useState(0);
  const ref = useRef(null);
  const done = useRef(false);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !done.current) {
            done.current = true;
            if (reduced) {
              setValue(target);
              return;
            }
            const duration = 1400;
            const start = performance.now();
            function tick(now) {
              const p = Math.min((now - start) / duration, 1);
              const eased = 1 - Math.pow(1 - p, 3);
              setValue(Math.floor(eased * target));
              if (p < 1) requestAnimationFrame(tick);
            }
            requestAnimationFrame(tick);
            io.unobserve(node);
          }
        });
      },
      { threshold: 0.4 }
    );
    io.observe(node);
    return () => io.disconnect();
  }, [target]);

  return (
    <div
      className="text-left px-6 first:pl-0 first:border-l-0 border-l"
      style={{ borderColor: "rgba(255,255,255,0.09)" }}
    >
      <div
        ref={ref}
        className="flex items-baseline gap-1 text-3xl font-semibold text-white"
        style={mono}
      >
        {formatNum(value)}
        <span className="text-sm font-medium" style={{ color: c.mint }}>
          {unit}
        </span>
      </div>
      <div className="text-sm mt-1" style={{ color: c.inkOnNavySoft }}>
        {label}
      </div>
    </div>
  );
}

function SensorDot({ cx, cy, tipX, tipY, tipW, aqi, statusLabel, color }) {
  const [hover, setHover] = useState(false);
  return (
    <g
      tabIndex={0}
      style={{ cursor: "pointer" }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
    >
      <circle
        className="sensor-ring"
        cx={cx}
        cy={cy}
        r={5}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
      />
      <circle cx={cx} cy={cy} r={5} fill={color} />
      <g
        transform={`translate(${tipX},${tipY})`}
        style={{
          opacity: hover ? 1 : 0,
          transform: hover
            ? `translate(${tipX}px,${tipY}px)`
            : `translate(${tipX}px,${tipY + 4}px)`,
          transition: "opacity .18s ease, transform .18s ease",
          pointerEvents: "none",
        }}
      >
        <rect width={tipW} height="34" rx="8" fill={c.navy} stroke={color} strokeWidth="1" />
        <text x="12" y="22" fontFamily="IBM Plex Mono, monospace" fontSize="11" fill={color}>
          AQI {aqi} · {statusLabel}
        </text>
      </g>
    </g>
  );
}

function HeroVisual() {
  return (
    <div>
      <div
        className="relative rounded-[20px] overflow-hidden border"
        style={{
          borderColor: "rgba(255,255,255,0.12)",
          boxShadow: "0 30px 60px -20px rgba(0,0,0,0.55)",
        }}
      >
        <svg viewBox="0 0 560 420" className="w-full h-auto block" role="img"
          aria-label="Live map showing atmosphere clarity from ground level smog to clear upper air, with sensor readings across the city grid">
          <defs>
            <linearGradient id="atmo" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0B1D3A" />
              <stop offset="45%" stopColor="#164067" />
              <stop offset="78%" stopColor="#3E6E5B" />
              <stop offset="100%" stopColor="#8A6A2E" />
            </linearGradient>
            <radialGradient id="glow" cx="50%" cy="15%" r="60%">
              <stop offset="0%" stopColor="#5FB2DE" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#5FB2DE" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="560" height="420" fill="url(#atmo)" />
          <rect width="560" height="420" fill="url(#glow)" />

          <g fill="#08152B" opacity="0.55">
            <rect x="0" y="360" width="560" height="60" />
            <rect x="30" y="320" width="34" height="60" />
            <rect x="80" y="300" width="26" height="80" />
            <rect x="120" y="335" width="40" height="45" />
            <rect x="400" y="310" width="30" height="70" />
            <rect x="440" y="330" width="24" height="50" />
            <rect x="480" y="295" width="36" height="85" />
          </g>

          <path
            className="breath-line"
            d="M20 260 C 100 190, 160 300, 230 220 S 380 150, 460 200 S 540 130, 550 90"
            fill="none"
            stroke="#3FD8A6"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.85"
          />

          <SensorDot cx={230} cy={220} tipX={190} tipY={178} tipW={118} aqi={42} statusLabel="Good" color={c.mint} />
          <SensorDot cx={460} cy={200} tipX={370} tipY={158} tipW={128} aqi={58} statusLabel="Moderate" color={c.blue} />
          <SensorDot cx={120} cy={300} tipX={60} tipY={335} tipW={126} aqi={121} statusLabel="Caution" color={c.amber} />
        </svg>
      </div>
      <div
        className="flex justify-between items-center text-xs mt-3.5 tracking-wide"
        style={{ ...mono, color: c.inkOnNavySoft }}
      >
        <span>YOUR EXPOSURE PATH · TODAY 07:12–08:40</span>
        <span style={{ color: c.mint }}>● 3 SENSORS IN RANGE</span>
      </div>
    </div>
  );
}

function Nav({ route, go }) {
  const [open, setOpen] = useState(false);
  return (
    <nav
      className="sticky top-0 z-50 border-b backdrop-blur"
      style={{ background: "rgba(11,29,58,0.92)", borderColor: "rgba(255,255,255,0.08)" }}
    >
      <div className="max-w-6xl mx-auto px-8 h-[76px] flex items-center justify-between">
        <button
          onClick={() => go("landing")}
          className="flex items-center gap-2.5 text-xl font-bold text-white"
          style={{ ...display, letterSpacing: "-0.01em" }}
        >
          <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
            <path d="M16 2C16 2 6 12.5 6 20a10 10 0 0 0 20 0C26 12.5 16 2 16 2Z" fill="url(#navMark)" />
            <defs>
              <linearGradient id="navMark" x1="6" y1="2" x2="26" y2="30" gradientUnits="userSpaceOnUse">
                <stop stopColor="#3FD8A6" />
                <stop offset="1" stopColor="#5FB2DE" />
              </linearGradient>
            </defs>
          </svg>
          Empyrean
        </button>

        <ul className="hidden md:flex items-center gap-9 list-none m-0 p-0">
          {[
            ["Features", "landing"],
            ["How it works", "landing"],
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
      </div>

      {open && (
        <div className="md:hidden px-8 pb-6 flex flex-col gap-4" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <button className="text-left text-sm py-2" style={{ color: c.inkOnNavySoft }} onClick={() => { go("landing"); setOpen(false); }}>Features</button>
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
          <span className="block text-xs uppercase mb-3" style={{ ...mono, color: c.mint, letterSpacing: "0.14em" }}>
            02 minutes to set up
          </span>
          <h1 className="font-bold text-white mb-3" style={{ ...display, fontSize: "clamp(2rem, 4vw, 2.7rem)", letterSpacing: "-0.01em" }}>
            Set up your Empyrean profile
          </h1>
          <p className="text-base leading-relaxed max-w-[560px]" style={{ color: c.inkOnNavySoft }}>
            Tell the band who's wearing it. We'll set your alert boundaries before your first reading ever comes in.
          </p>
        </div>
      </section>

      <section className="py-16 pb-28">
        <div className="max-w-6xl mx-auto px-8 grid md:grid-cols-[1.15fr_0.85fr] gap-10 items-start">
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

            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Email">
                <input style={inputStyle} type="email" placeholder="you@domain.com" required />
              </Field>
              <Field label="Password">
                <input style={inputStyle} type="password" placeholder="At least 8 characters" minLength={8} required />
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

          <aside
            className="rounded-[18px] p-8 md:sticky md:top-24"
            style={{ background: c.navy, color: c.inkOnNavy }}
          >
            <div
              className="inline-flex items-center gap-2 text-xs uppercase px-3.5 py-1.5 rounded-full mb-5"
              style={{ ...mono, color: badgeColor, background: badgeColor + "26", letterSpacing: "0.05em" }}
            >
              <span className="w-[7px] h-[7px] rounded-full" style={{ background: badgeColor }} />
              Baseline: {severity}
            </div>

            <h3 className="font-semibold text-white mb-1" style={{ ...display, fontSize: "1.05rem" }}>
              Initial severity baseline
            </h3>
            <p className="text-sm mb-5" style={{ color: c.inkOnNavySoft }}>
              {condition
                ? `Based on the ${base.label} profile, refined for ${condition}.`
                : `Based on the ${base.label} profile. Add health context to refine it.`}
            </p>

            {[
              ["PM2.5 alert", base.pm25],
              ["PM10 alert", base.pm10],
              ["CO₂ / gas alert", base.gas],
              ["Trigger style", base.style],
            ].map(([label, val], i) => (
              <div
                key={label}
                className="flex justify-between items-center py-3 text-sm"
                style={{ borderTop: i === 0 ? "none" : "1px solid rgba(255,255,255,0.09)" }}
              >
                <span style={{ color: c.inkOnNavySoft }}>{label}</span>
                <span className="font-medium text-white" style={mono}>{val}</span>
              </div>
            ))}

            <p
              className="text-xs leading-relaxed mt-5 pt-4"
              style={{ color: c.inkOnNavySoft, borderTop: "1px dashed rgba(255,255,255,0.15)" }}
            >
              This is a starting baseline only — not a medical diagnosis. Your device fine-tunes these
              boundaries against your real exposure data over your first week.
            </p>
          </aside>
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

      {route === "landing" ? (
        <>
          <Hero go={go} />
          <SocialProof />
          <Features />
        </>
      ) : (
        <RegisterPage />
      )}

      <Footer go={go} />
    </div>
  );
}