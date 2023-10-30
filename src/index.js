import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.js";
import "./i18n.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <>
    <ToastContainer
      theme="dark"
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      pauseOnHover
      closeOnClickd
      draggable
      closeButton={false}
      icon={false}
    />
    <App />
  </>
);
// <React.StrictMode>
// </React.StrictMode>
