import React, { useState, useEffect } from "react";
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
import EmpyreanDashboardLayout from "./pages/dashboard";
import { getSession, subscribeToAuth, logout } from "./api.js";

function App() {
  const [currentPage, setCurrentPage] = useState("landing");
  const [session, setSession] = useState(() => getSession());

  // Keep auth state in sync with the in-memory session (login/logout/failed
  // refresh all go through api.js and trigger listeners).
  useEffect(() => subscribeToAuth(setSession), []);

  // Single navigation handler shared by the navbar and in-page buttons.
  // Reset scroll to the top so a scrolled-down page never opens mid-way.
  const navigate = (path) => {
    window.scrollTo(0, 0);
    setCurrentPage(path);
  };

  // If the session expires/rejects while on the dashboard, drop back to the
  // landing page. Other pages are public so they stay reachable.
  useEffect(() => {
    if (!session.isLoggedIn && currentPage === "dashboard") {
      navigate("landing");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.isLoggedIn]);

  const handleLogout = async () => {
    await logout(); // clears the session + best-effort revoke
    navigate("landing");
  };

  // The dashboard is private — require the user to sign in to reach it.
  const isAuthProtected = currentPage === "dashboard";

  let pageEl;

  if (isAuthProtected && !session.isLoggedIn) {
    pageEl = (
      <LoginPage
        onLoginSuccess={() => navigate("dashboard")}
        onSwitchToRegister={() => navigate("register")}
        onSwitchToForgotPassword={() => navigate("forgot-password")}
      />
    );
  } else {
    switch (currentPage) {
      case "register":
        // Register auto-logs-in, so a success means straight to the dashboard.
        pageEl = (
          <RegisterPage
            onRegisterSuccess={() => navigate("dashboard")}
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
      pageEl = <EmpyreanDashboardLayout onLogout={handleLogout} />;
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