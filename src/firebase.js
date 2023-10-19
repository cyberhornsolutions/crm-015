// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyChKcp8FggXXOTXHCRpqZiLTS-zLVp-IjA",
  authDomain: "gaming-platform-3c5fe.firebaseapp.com",
  projectId: "gaming-platform-3c5fe",
  storageBucket: "gaming-platform-3c5fe.appspot.com",
  messagingSenderId: "43321736851",
  appId: "1:43321736851:web:71ff6147df4d0d550ed766",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
