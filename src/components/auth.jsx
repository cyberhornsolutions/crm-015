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
import { getIPRange } from "../helper/helpers";
import { signOut } from "firebase/auth";
import { toastify } from "../helper/toastHelper";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import React, { useState } from "react";

export default function Auth() {
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [referralCode, setReferralCode] = useState("");
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
            <div style={{ backgroundColor: "transparent", width: "20%" }}>
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
            <span style={{ backgroundColor: "transparent", width: "80%" }}>
              Continue with Google
            </span>
          </button>
          <button
            className="d-flex align-items-center w-100"
            style={{
              backgroundColor: "#fff",
              border: "none",
              borderRadius: "5px",
              margin: "4px 0 64px 0",
              padding: "8px 0",
            }}
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            <div style={{ backgroundColor: "transparent", width: "20%" }}>
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
                width: "80%",
              }}
            >
              Continue with Apple
            </span>
          </button>
          <div className="signup_wrapper">
            <hr className="signup_text" />
            <button className="sign_up_link" onClick={() => setTab(2)}>
              Sign Up
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
        </form>
      )}
    </>
  );
}
