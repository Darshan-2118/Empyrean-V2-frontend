import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import RegisterPage from "../pages/register.jsx";

function App() {
  return <RegisterPage />;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
