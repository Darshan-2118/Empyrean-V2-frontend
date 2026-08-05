import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import ForgotPasswordPage from "./pages/forgot_password";
import HowItWorksPage from "./pages/howItWorks";
import LandingPage from "./pages/landingPage";
import Navbar from "./components/Navbar";
import "./index.css";

import AboutPage from "./pages/About";
import FeaturesPage from "./pages/Features";

function App() {
  const [currentPage, setCurrentPage] = useState("landing");

  // Single navigation handler shared by the navbar and in-page buttons.
  // Reset scroll to the top so a scrolled-down page never opens mid-way.
  const navigate = (path) => {
    window.scrollTo(0, 0);
    setCurrentPage(path);
  };

  let pageEl;

  switch (currentPage) {
    case "register":
      pageEl = (
        <RegisterPage
          onRegisterSuccess={() => navigate("login")}
          onSwitchToLogin={() => navigate("login")}
        />
      );
      break;

    case "about":
      pageEl = (
        <AboutPage onSwitchToLogin={() => navigate("login")} />
      );
      break;

    case "features":
      pageEl = (
        <FeaturesPage onSwitchToLogin={() => navigate("login")} />
      );
      break;

    case "dashboard":
      // Placeholder until DashboardLayout is built
      pageEl = (
        <div style={{ padding: "2rem", textAlign: "center", color: "white" }}>
          <h1>Dashboard (coming soon)</h1>
          <button onClick={() => navigate("login")}>Logout</button>
        </div>
      );
      break;

    case "forgot-password":
      pageEl = (
        <ForgotPasswordPage
          onResetSuccess={() => navigate("login")}
          onSwitchToLogin={() => navigate("login")}
        />
      );
      break;

    case "howItWorks":
      pageEl = (
        <HowItWorksPage
          onSwitchToLogin={() => navigate("login")}
          onSwitchToRegister={() => navigate("register")}
        />
      );
      break;

    case "landing":
      pageEl = (
        <LandingPage
          onSwitchToHowItWorks={() => navigate("howItWorks")}
        />
      );
      break;

    default: // login
      pageEl = (
        <LoginPage
          onLoginSuccess={() => navigate("dashboard")}
          onSwitchToRegister={() => navigate("register")}
          onSwitchToForgotPassword={() => navigate("forgot-password")}
        />
      );
  }

  return (
    <>
      <Navbar active={currentPage} onNavigate={navigate} />
      {pageEl}
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);