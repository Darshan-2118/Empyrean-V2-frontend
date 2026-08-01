import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import ForgotPasswordPage from "./pages/forgot_password";
import HowItWorksPage from "./pages/howItWorks";
import LandingPage from "./pages/landingPage";
import "./index.css";

function App() {
  const [currentPage, setCurrentPage] = useState("landing");

  if (currentPage === "register") {
    return (
      <RegisterPage
        onRegisterSuccess={() => setCurrentPage("login")}
        onSwitchToLogin={() => setCurrentPage("login")}
        onSwitchToHowItWorks={() => setCurrentPage("how-it-works")}
      />
    );
  }

  if (currentPage === "dashboard") {
    // Placeholder until DashboardLayout is built
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
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
        onSwitchToHowItWorks={() => setCurrentPage("how-it-works")}
      />
    );
  }

  if (currentPage === "how-it-works") {
    return (
      <HowItWorksPage
        onBackHome={() => setCurrentPage("login")}
        onSwitchToLogin={() => setCurrentPage("login")}
        onSwitchToRegister={() => setCurrentPage("register")}
      />
    );
  }

  if (currentPage === "landing") {
    return (
      <LandingPage
        onSwitchToLogin={() => setCurrentPage("login")}
        onSwitchToHowItWorks={() => setCurrentPage("how-it-works")}
      />
    );
  }

  return (
    <LoginPage
      onLoginSuccess={() => setCurrentPage("dashboard")}
      onSwitchToRegister={() => setCurrentPage("register")}
      onSwitchToForgotPassword={() => setCurrentPage("forgot-password")}
      onSwitchToHowItWorks={() => setCurrentPage("how-it-works")}
    />
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
