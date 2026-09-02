import React from "react";
import styles from "../styles/adminDashboard.module.css";
import { Server, Users, Activity, LogOut } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const NODE_USAGE_DATA = [
  { time: "00:00", active: 12, total: 20 },
  { time: "02:00", active: 8, total: 20 },
  { time: "04:00", active: 6, total: 20 },
  { time: "06:00", active: 10, total: 22 },
  { time: "08:00", active: 18, total: 22 },
  { time: "10:00", active: 22, total: 25 },
  { time: "12:00", active: 25, total: 25 },
  { time: "14:00", active: 24, total: 25 },
  { time: "16:00", active: 20, total: 25 },
  { time: "18:00", active: 16, total: 25 },
  { time: "20:00", active: 14, total: 25 },
  { time: "22:00", active: 11, total: 25 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "rgba(10, 31, 31, 0.95)",
        border: "1px solid rgba(255, 255, 255, 0.15)",
        borderRadius: 12,
        padding: "12px 16px",
        fontFamily: "'Gugi', sans-serif",
        fontSize: "0.85rem",
      }}
    >
      <p style={{ margin: "0 0 8px", color: "rgba(255,255,255,0.6)" }}>
        {label}
      </p>
      <p style={{ margin: "0 0 4px", color: "#4cdbaf" }}>
        Active: {payload[0]?.value}
      </p>
      <p style={{ margin: 0, color: "rgba(255,255,255,0.5)" }}>
        Total: {payload[1]?.value}
      </p>
    </div>
  );
};

export default function AdminDashboard({ onLogout }) {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.headerTitle}>Admin Dashboard</h1>
          <p className={styles.headerSubtitle}>
            System overview and node management
          </p>
        </div>
        <button className={styles.logoutBtn} onClick={onLogout}>
          <LogOut size={16} style={{ marginRight: 8, verticalAlign: "middle" }} />
          Logout
        </button>
      </div>

      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={`${styles.statCardAccent} ${styles.statCardAccentNodes}`} />
          <div className={`${styles.statIcon} ${styles.statIconNodes}`}>
            <Server size={24} />
          </div>
          <p className={styles.statLabel}>Total Nodes</p>
          <p className={`${styles.statValue} ${styles.statValueNodes}`}>25</p>
          <p className={styles.statTrend}>
            <span>+3</span> added this month
          </p>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statCardAccent} ${styles.statCardAccentUsers}`} />
          <div className={`${styles.statIcon} ${styles.statIconUsers}`}>
            <Users size={24} />
          </div>
          <p className={styles.statLabel}>Total Users</p>
          <p className={`${styles.statValue} ${styles.statValueUsers}`}>142</p>
          <p className={styles.statTrend}>
            <span>+12</span> registered this month
          </p>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statCardAccent} ${styles.statCardAccentActive}`} />
          <div className={`${styles.statIcon} ${styles.statIconActive}`}>
            <Activity size={24} />
          </div>
          <p className={styles.statLabel}>Active Users</p>
          <p className={`${styles.statValue} ${styles.statValueActive}`}>38</p>
          <p className={styles.statTrend}>Currently online</p>
        </div>
      </div>

      <div className={styles.chartSection}>
        <div className={styles.chartHeader}>
          <h3 className={styles.chartTitle}>Node Usage Over Time</h3>
          <div className={styles.chartLegend}>
            <div className={styles.chartLegendItem}>
              <span className={`${styles.legendDot} ${styles.legendDotActive}`} />
              Active Nodes
            </div>
            <div className={styles.chartLegendItem}>
              <span className={`${styles.legendDot} ${styles.legendDotTotal}`} />
              Total Nodes
            </div>
          </div>
        </div>
        <div className={styles.chartContainer}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={NODE_USAGE_DATA}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="activeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4cdbaf" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#4cdbaf" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="totalGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4cdbaf" stopOpacity={0.1} />
                  <stop offset="100%" stopColor="#4cdbaf" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.05)"
                vertical={false}
              />
              <XAxis
                dataKey="time"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 12, fontFamily: "'Gugi', sans-serif" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 12, fontFamily: "'Gugi', sans-serif" }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="active"
                stroke="#4cdbaf"
                strokeWidth={2}
                fill="url(#activeGrad)"
                dot={false}
                activeDot={{ r: 5, fill: "#4cdbaf", stroke: "#08201a", strokeWidth: 2 }}
              />
              <Area
                type="monotone"
                dataKey="total"
                stroke="rgba(76,219,175,0.3)"
                strokeWidth={1.5}
                fill="url(#totalGrad)"
                dot={false}
                activeDot={{ r: 4, fill: "rgba(76,219,175,0.5)", stroke: "#08201a", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
