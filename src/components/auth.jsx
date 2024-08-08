import {
  addPlayerLogs,
  getBlockedIPs,
  updateOnlineStatus,
} from "../helper/firebaseHelpers";
import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { Button, Dropdown } from "react-bootstrap";
import { getIPRange } from "../helper/helpers";
import { signOut } from "firebase/auth";
import { toastify } from "../helper/toastHelper";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";
import languages from "../assets/flags/index";
import line from "../assets/images/line.svg";
import React, { useState } from "react";
import themeIcon from "../assets/images/theme-icon.svg";

export default function Auth() {
  const { i18n } = useTranslation();
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);
  const [tab, setTab] = useState(1);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

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

  const handleLogin = async (e) => {
    e.preventDefault();

    const [ip, blockedIps] = await Promise.all([
      axios.get("https://api.ipify.org").then((res) => res.data),
      getBlockedIPs(),
    ]);

    for (let { firstIp, secondIp } of blockedIps) {
      if (ip === firstIp || ip === secondIp) return toastify("Unable to login");
      const ipRange = getIPRange(firstIp, secondIp);
      if (ipRange.includes(ip)) return toastify("Unable to login");
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

  const handleSignUp = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toastify("Password does not match");
    } else {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          const userRef = doc(db, "users", user.uid);
          setDoc(userRef, {
            createdAt: serverTimestamp(),
            email: user.email,
            isUserEdited: false,
            name: userName,
            onlineStatus: false,
            refCode: generateRandomCode(8),
            role: "user",
            status: "Xsd9VUhM2geOW8w8HDsI",
            useRefCode: referralCode,
          })
            .then(() => {
              signOut(auth)
                .then(() => {
                  navigate("/");
                })
                .catch((error) => {
                  console.error("Failed to sign out: ", error);
                });
            })
            .catch((error) => {
              console.error("Failed to create user: ", error);
            });
        })
        .catch((error) => {
          let { message } = error;
          console.error(message);
          if (message.includes("email-already-in-use")) {
            toastify("Email already exists");
          } else if (message.includes("weak-password")) {
            toastify("Password must be at least 6 characters");
          } else {
            toastify(message);
          }
        });
    }
  };

  const changeLanguage = (lng) => {
    setSelectedLanguage(lng);
    i18n.changeLanguage(lng);
    localStorage.setItem("lang", lng);
  };

  return (
    <>
      {tab === 1 ? (
        <form className="login_form" id="loginForm" onSubmit={handleLogin}>
          <h1>Log in</h1>
          <div className="fields">
            <input
              className="email_input"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Username or Email"
              required
              type="email"
            />
            <input
              className="psw_input"
              name="psw"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              type="password"
            />
          </div>
          <button className="button" type="submit">
            Log in
          </button>
          <br />
          <hr className="or_text" />
          <br />
          <div className="login_other mb-10">
            <button
              className="d-flex align-items-center w-100"
              style={{
                backgroundColor: "#4285F4",
                border: "none",
                borderRadius: "5px",
                margin: "4px 0",
                padding: "8px 0",
              }}
              onClick={(e) => {
                e.preventDefault();
              }}
            >
              <div
                style={{
                  backgroundColor: "transparent",
                  left: "20%",
                  position: "absolute",
                }}
              >
                <img
                  alt=""
                  height={20}
                  src="https://storage.googleapis.com/gweb-uniblog-publish-prod/images/Search_GSA.original.png"
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: "5px",
                  }}
                />
              </div>
              <span style={{ backgroundColor: "transparent", width: "100%" }}>
                Continue with Google
              </span>
            </button>
            <button
              className="d-flex align-items-center w-100"
              style={{
                backgroundColor: "#fff",
                border: "none",
                borderRadius: "5px",
                margin: "4px 0",
                padding: "8px 0",
              }}
              onClick={(e) => {
                e.preventDefault();
              }}
            >
              <div
                style={{
                  backgroundColor: "transparent",
                  left: "20%",
                  position: "absolute",
                }}
              >
                <img
                  alt=""
                  height={20}
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/625px-Apple_logo_black.svg.png"
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: "5px",
                  }}
                  width="auto"
                />
              </div>
              <span
                style={{
                  backgroundColor: "transparent",
                  color: "#000",
                  width: "100%",
                }}
              >
                Continue with Apple
              </span>
            </button>
          </div>
          <div className="signup_wrapper">
            <hr className="signup_text" />
            <button className="sign_up_link" onClick={() => setTab(2)}>
              Sign Up
            </button>
          </div>
          <div className="flag_theme">
            <Dropdown>
              <Dropdown.Toggle className="flag_toggle" variant="">
                <img
                  alt={selectedLanguage}
                  height="auto"
                  src={languages[selectedLanguage]}
                  width={30}
                />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {Object.keys(languages)
                  .filter((lng) => lng !== selectedLanguage)
                  .map((lng, i) => (
                    <Dropdown.Item key={i} onClick={() => changeLanguage(lng)}>
                      <img
                        alt={lng}
                        height="auto"
                        src={languages[lng]}
                        width={40}
                      />
                    </Dropdown.Item>
                  ))}
              </Dropdown.Menu>
            </Dropdown>
            <img alt="" src={line} />
            <button
              className="theme_button"
              onClick={(e) => {
                e.preventDefault();
              }}
            >
              <img
                alt=""
                src={themeIcon}
                style={{ background: "transparent" }}
              />
            </button>
          </div>
        </form>
      ) : (
        <form className="signup_form" onSubmit={handleSignUp}>
          <h1 className="signup_title">Sign Up</h1>
          <div className="fields">
            <input
              className="name_input"
              name="name"
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Name"
              required
              type="text"
            />
            <input
              className="email_input"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              type="email"
            />
            <input
              className="psw_input"
              name="psw"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              type="password"
            />
            <input
              className="psw_input"
              name="psw"
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat Password"
              required
              type="password"
            />
            <input
              className="psw_input"
              name="psw"
              onChange={(e) => setReferralCode(e.target.value)}
              placeholder="Referral Code"
              type="text"
            />
          </div>
          <button className="button" type="submit">
            Sign Up
          </button>
          <div className="login_wrapper" style={{ marginTop: "64px" }}>
            <hr className="login_text" />
            <button className="login_link " onClick={() => setTab(1)}>
              Log in
            </button>
          </div>
          <div className="flag_theme">
            <Dropdown>
              <Dropdown.Toggle className="flag_toggle" variant="">
                <img
                  alt={selectedLanguage}
                  height="auto"
                  src={languages[selectedLanguage]}
                  width={30}
                />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {Object.keys(languages)
                  .filter((lng) => lng !== selectedLanguage)
                  .map((lng, i) => (
                    <Dropdown.Item key={i} onClick={() => changeLanguage(lng)}>
                      <img
                        alt={lng}
                        height="auto"
                        src={languages[lng]}
                        width={40}
                      />
                    </Dropdown.Item>
                  ))}
              </Dropdown.Menu>
            </Dropdown>
            <img alt="" src={line} />
            <button
              className="theme_button"
              onClick={(e) => {
                e.preventDefault();
              }}
            >
              <img
                alt=""
                src={themeIcon}
                style={{ background: "transparent" }}
              />
            </button>
          </div>
        </form>
      )}
    </>
  );
}
