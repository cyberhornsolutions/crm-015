import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.js";
import "./i18n.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { persistor, store } from "./redux/store.js";
import { Provider } from "react-redux";
// import { PersistGate } from "redux-persist/integration/react";
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
    <Provider store={store}>
      {/* <PersistGate loading={null} persistor={persistor}> */}
      <App />
      {/* </PersistGate> */}
    </Provider>
  </>
);
// <React.StrictMode>
// </React.StrictMode>
