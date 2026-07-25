import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import LoginPage from "../pages/login";
import RegisterPage from "../pages/register";
import DashboardLayout from "../pages/dashboardLayout";

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

  return (
    <LoginPage
      onLoginSuccess={() => setCurrentPage("dashboard")}
      onSwitchToRegister={() => setCurrentPage("register")}
    />
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
