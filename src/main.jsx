import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import ForgotPasswordPage from "./pages/forgot_password";
import HowItWorksPage from "./pages/howItWorks";
import LandingPage from "./pages/landingPage";
import "./index.css";

import AboutPage from "./pages/About";
import FeaturesPage from "./pages/Features";

function App() {
  const [currentPage, setCurrentPage] = useState("landing");

  if (currentPage === "register") {
    return (
      <RegisterPage
        onRegisterSuccess={() => setCurrentPage("login")}
        onSwitchToLogin={() => setCurrentPage("login")}
        onSwitchToAbout={() => setCurrentPage("about")}
        onSwitchToFeatures={() => setCurrentPage("features")}
      />
    );
  }

  if (currentPage === "about") {
    return (
      <AboutPage 
        onSwitchToLogin={() => setCurrentPage("login")}
        onSwitchToFeatures={() => setCurrentPage("features")}
      />
    );
  }

  if (currentPage === "features") {
    return (
      <FeaturesPage 
        onSwitchToLogin={() => setCurrentPage("login")}
        onSwitchToAbout={() => setCurrentPage("about")}
      />
    );
  }

  if (currentPage === "dashboard") {
    // Placeholder until DashboardLayout is built
    return (
      <div style={{ padding: "2rem", textAlign: "center", color: "white" }}>
        <h1>Dashboard (coming soon)</h1>
        <button onClick={() => setCurrentPage("login")}>Logout</button>
      </div>
    );
  }

  if (currentPage === "forgot-password") {
    return (
      <ForgotPasswordPage
        onResetSuccess={() => setCurrentPage("login")}
        onSwitchToLogin={() => setCurrentPage("login")}
        onSwitchToAbout={() => setCurrentPage("about")}
        onSwitchToFeatures={() => setCurrentPage("features")}
      />
    );
  }

  return (
    <LoginPage
      onLoginSuccess={() => setCurrentPage("dashboard")}
      onSwitchToRegister={() => setCurrentPage("register")}
      onSwitchToForgotPassword={() => setCurrentPage("forgot-password")}
      onSwitchToAbout={() => setCurrentPage("about")}
      onSwitchToFeatures={() => setCurrentPage("features")}
    />
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
