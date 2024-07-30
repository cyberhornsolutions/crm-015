import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import axios from "axios";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { toastify } from "../helper/toastHelper";
import {
  addUserNewBalance,
  updateOnlineStatus,
  getBlockedIPs,
  addPlayerLogs,
} from "../helper/firebaseHelpers";
import { getIPRange } from "../helper/helpers";

export default function Auth() {
  const [tab, setTab] = useState(1);
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [referralCode, setReferralCode] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const [ip, blockedIps] = await Promise.all([
      axios.get("https://api.ipify.org").then((res) => res.data),
      getBlockedIPs(),
    ]);
    console.log("ip ====> ", ip);
    for (let { firstIp, secondIp } of blockedIps) {
      if (ip === firstIp || ip === secondIp)
        return toastify("You are blocked to login");
      const ipRange = getIPRange(firstIp, secondIp);
      if (ipRange.includes(ip)) return toastify("You are blocked to login");
    }

    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        await updateOnlineStatus(userCredential?.user?.uid, true);
        await addPlayerLogs("Logged in", userCredential?.user?.uid);
        localStorage.setItem("USER", JSON.stringify(userCredential));
        window.location.href = "/";
      })
      .catch((error) => {
        const { message } = error;
        console.error(message);
        if (message?.includes("invalid-login-credentials")) {
          toastify("Invalid Email or Password");
        } else if (message.includes("invalid-email")) {
          toastify("Invalid Email");
        } else {
          toastify(message);
        }
      });
  };
  function generateRandomCode(length) {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let code = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters.charAt(randomIndex);
    }
    return code;
  }
  const handleSignUp = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toastify("Passwords do not match.");
    } else {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;

          console.log("User ==>", user);

          // Create a formatted date string
          const formattedDate = new Date().toLocaleDateString("en-US");

          // Add user data to Firestore
          const userRef = doc(db, "users", user.uid);
          setDoc(userRef, {
            name: userName, // Replace with the actual user's name
            email: user.email,
            status: "New",
            createdAt: serverTimestamp(),
            refCode: generateRandomCode(8),
            useRefCode: referralCode,
            onlineStatus: false,
            role: "user",
            isUserEdited: false,
          })
            .then(() => {
              console.log("User data added to Firestore");
              signOut(auth)
                .then(() => {
                  console.log("Signout The User");
                  navigate("/");
                })
                .catch((error) => {
                  console.log("Signout The User Exception");
                });
            })
            .catch((error) => {
              console.error("Error adding user data to Firestore:", error);
            });
        })
        .catch((error) => {
          let { message } = error;
          console.error(message);
          if (message.includes("email-already-in-use")) {
            toastify("Email already exists.");
          } else if (message.includes("weak-password")) {
            toastify("Password must be at least 6 characters.");
          } else {
            toastify(message);
          }
        });
    }
  };
  return (
    <>
      {tab === 1 ? (
        <form className="login_form" id="loginForm" onSubmit={handleLogin}>
          <div id="logo_wrapper" className="logo_wrapper">
            <img
              className="logo"
              src={require("../assets/images/logo.png")}
              alt="logo"
            />
          </div>

          <div className="fields">
            <input
              className="email_input"
              type="email"
              placeholder="Электронная почта"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              className="psw_input"
              type="password"
              placeholder="Пароль"
              name="psw"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="button" type="submit">
            Войти
          </button>

          <div className="signup_wrapper">
            <p className="sign_up">Нет аккаунта?</p>
            <a
              className="sign_up_link cursor-pointer"
              onClick={() => setTab(2)}
            >
              Зарегистрироваться
            </a>
          </div>
        </form>
      ) : (
        <form className="signup_form" onSubmit={handleSignUp}>
          <div id="signup_logo_wrapper" className="logo_wrapper">
            <img
              className="signup_logo"
              src={require("../assets/images/logo.png")}
              alt="logo"
            />
            <h3 className="signup_title">Регистрация</h3>
          </div>

          <div className="fields">
            <input
              className="name_input"
              type="text"
              placeholder="Имя"
              name="name"
              onChange={(e) => setUserName(e.target.value)}
              required
            />

            <input
              className="email_input"
              type="email"
              placeholder="Электронная почта"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              className="psw_input"
              type="password"
              placeholder="Пароль"
              name="psw"
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <input
              className="psw_input"
              type="password"
              placeholder="Повторите пароль"
              name="psw"
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <input
              className="psw_input"
              type="text"
              placeholder="реферальный код"
              name="psw"
              onChange={(e) => setReferralCode(e.target.value)}
            />
          </div>

          <button className="button" type="submit">
            Зарегистрироваться
          </button>

          <div className="login_wrapper">
            <p className="login">Есть аккаунт?</p>
            <a className="login_link cursor-pointer" onClick={() => setTab(1)}>
              Войти
            </a>
          </div>
        </form>
      )}
    </>
  );
}
