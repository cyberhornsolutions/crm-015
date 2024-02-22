import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    "process.env": {
      REACT_APP_API_KEY: "AIzaSyCEEyjYMCw_s229nEv33q6_5PZjAD9sbzA",
      REACT_APP_AUTH_DOMAIN: "first-dee4f.firebaseapp.com",
      REACT_APP_PROJECT_ID: "first-dee4f",
      REACT_APP_STORAGE_BUCKET: "first-dee4f.appspot.com",
      REACT_APP_MSG_SENDER_ID: "528272638551",
      REACT_APP_APP_ID: "1:528272638551:web:50ce6c1afbd838b8c29912",
    },
  },
});
