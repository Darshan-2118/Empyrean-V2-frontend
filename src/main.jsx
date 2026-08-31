import React, { useState, useEffect, lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import HowItWorksPage from "./pages/howItWorks";
import LandingPage from "./pages/landingPage";
import Navbar from "./components/Navbar";
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
    if (auth.isAuthenticated && (currentPage === "login" || currentPage === "register")) {
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
        <FeaturesPage onSwitchToLogin={() => navigate("login")} />
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
