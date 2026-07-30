import React from "react";
import ReactDOM from "react-dom/client";
import LoginPage from "./pages/login";
import "./index.css";
import RegisterPage from "./pages/register";
import ForgotPasswordPage from "./pages/forgot_password";
import DashboardLayout from "./pages/dashboardLayout";

function App() {
  const [currentPage, setCurrentPage] = useState("login");

  if (currentPage === "register") {
    return (
      <RegisterPage
        onRegisterSuccess={() => setCurrentPage("login")}
        onSwitchToLogin={() => setCurrentPage("login")}
      />
    );
  }

  if (currentPage === "dashboard") {
    return <DashboardLayout onLogout={() => setCurrentPage("login")} />;
  }

  if (currentPage === "forgot-password") {
    return (
      <ForgotPasswordPage
        onResetSuccess={() => setCurrentPage("login")}
        onSwitchToLogin={() => setCurrentPage("login")}
      />
    );
  }

  return (
    <LoginPage
      onLoginSuccess={() => setCurrentPage("dashboard")}
      onSwitchToRegister={() => setCurrentPage("register")}
      onSwitchToForgotPassword={() => setCurrentPage("forgot-password")}
    />
  );
}