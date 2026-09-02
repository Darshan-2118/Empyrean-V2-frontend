import React, { useState, useEffect, lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import ForgotPasswordPage from "./pages/forgot_password";
import HowItWorksPage from "./pages/howItWorks";
import LandingPage from "./pages/landingPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import pageStyles from "./styles/Page.module.css";
import * as EmpyreanAPI from "./api";
import { subscribeAuth, getAuthState } from "./api";

window.EmpyreanAPI = EmpyreanAPI;

import AboutPage from "./pages/About";
import FeaturesPage from "./pages/Features";
import LiveMapPage from "./pages/liveMap";

const EmpyreanDashboardLayout = lazy(() => import("./pages/dashboard"));

const ROUTES = {
  landing: "/landing_page",
  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",
  dashboard: "/dashboard",
  about: "/about",
  features: "/features",
  liveMap: "/live-map",
  howItWorks: "/how_it_works",
};

const pageFromPath = (path) =>
  Object.keys(ROUTES).find((page) => ROUTES[page] === path) ?? "landing";

function App() {
  const [currentPage, setCurrentPage] = useState(() =>
    pageFromPath(window.location.pathname),
  );
  const [auth, setAuth] = useState(getAuthState());

  useEffect(() => subscribeAuth(setAuth), []);

  useEffect(() => {
    if (window.location.pathname !== ROUTES[currentPage]) {
      window.history.replaceState({}, "", ROUTES[currentPage]);
    }
    const onPopState = () => {
      window.scrollTo(0, 0);
      setCurrentPage(pageFromPath(window.location.pathname));
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  // On the landing page, scroll to the section referenced by a URL hash
  // (e.g. /landing_page#features) when the page changes or is first loaded.
  useEffect(() => {
    const hashEl = window.location.hash
      ? document.getElementById(window.location.hash.slice(1))
      : null;
    if (hashEl) hashEl.scrollIntoView();
  }, [currentPage]);

  const goTo = (page, { replace = false } = {}) => {
    window.scrollTo(0, 0);
    setCurrentPage(page);
    const url = ROUTES[page];
    if (url && window.location.pathname !== url) {
      if (replace) window.history.replaceState({}, "", url);
      else window.history.pushState({}, "", url);
    }
  };

  const navigate = (page) => goTo(page);

  useEffect(() => {
    if (
      auth.isAuthenticated &&
      (currentPage === "login" ||
        currentPage === "register" ||
        currentPage === "forgotPassword")
    ) {
      goTo("dashboard", { replace: true });
    } else if (currentPage === "dashboard" && !auth.isAuthenticated) {
      goTo("login", { replace: true });
    }
  }, [currentPage, auth.isAuthenticated]);

  let pageEl;

  switch (currentPage) {
    case "register":
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
        <FeaturesPage
          onSwitchToLogin={() => navigate("login")}
          onSwitchToRegister={() => navigate("register")}
        />
      );
      break;

    case "liveMap":
      pageEl = (
        <LiveMapPage />
      );
      break;

    case "dashboard":
      pageEl = auth.isAuthenticated ? (
        <Suspense fallback={<div style={{ minHeight: "100vh" }} />}>
          <EmpyreanDashboardLayout
            user={auth.user}
            onSignedOut={() => navigate("landing")}
          />
        </Suspense>
      ) : (
        <LoginPage
          onLoginSuccess={() => navigate("dashboard")}
          onSwitchToRegister={() => navigate("register")}
          onSwitchToForgotPassword={() => navigate("forgotPassword")}
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

    case "forgotPassword":
      pageEl = (
        <ForgotPasswordPage
          onSwitchToLogin={() => navigate("login")}
          onResetSuccess={() => navigate("login")}
        />
      );
      break;

    case "landing":
      pageEl = (
        <LandingPage
          onSwitchToHowItWorks={() => navigate("howItWorks")}
          onSwitchToFeatures={() => navigate("features")}
          onSwitchToRegister={() => navigate("register")}
          onSwitchToLogin={() => navigate("login")}
        />
      );
      break;

    default: // login
      pageEl = auth.isAuthenticated ? (
        <Suspense fallback={<div style={{ minHeight: "100vh" }} />}>
          <EmpyreanDashboardLayout
            user={auth.user}
            onSignedOut={() => navigate("landing")}
          />
        </Suspense>
      ) : (
        <LoginPage
          onLoginSuccess={() => navigate("dashboard")}
          onSwitchToRegister={() => navigate("register")}
          onSwitchToForgotPassword={() => navigate("forgotPassword")}
        />
      );
  }


  return (
    <>
      <Navbar active={currentPage} onNavigate={navigate} auth={auth} />
      <div key={currentPage} className={pageStyles.page}>
        {pageEl}
      </div>
      <Footer onNavigate={navigate} />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
