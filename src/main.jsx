import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import RegisterPage from "./pages/loginPage";
import DashboardLayout from "./pages/dashboardLayout";

function App() {
  const [currentPage, setCurrentPage] = useState("register");

  return currentPage === "register" ? (
    <RegisterPage onRegisterSuccess={() => setCurrentPage("dashboard")} />
  ) : (
    <DashboardLayout />
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
