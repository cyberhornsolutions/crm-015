import React, { useEffect, useState } from "react";
import logoIcon from "../assets/images/logo.png";
import enFlagIcon from "../assets/images/gb-fl.png";
import ruFlagIcon from "../assets/images/ru-fl.png";
import accPlaceholder from "../assets/images/acc-img-placeholder.png";
import moment from "moment";
import {
  InformationCircle,
  List,
  LogOut,
  PersonCircle,
  StatsChartSharp,
  CloseCircleOutline,
} from "react-ionicons";
import TradingView from "./TradingView.jsx";
import TradingWidget from "./TradingWidget";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Select from "react-select";
import { Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc, collection, addDoc } from "firebase/firestore";
import { toastify } from "../helper/toastHelper";
import firebase from "firebase/app";

export default function HomeRu() {
  const [tab, setTab] = useState("trade");
  const navigate = useNavigate();
  const [symbols, setSymbols] = useState([]);
  const [orderData, setOrderData] = useState({
    symbol: null,
    symbolValue: null,
    volume: null,
    sl: null,
    tp: null,
  });
  const [uploadModal, setUploadModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [depositModal, setDepositModal] = useState(false);
  const [withdrawlModal, setWithdrawlModal] = useState(false);
  const [depositSuccessModal, setDepositSuccessModal] = useState(false);
  const [withdrawlSuccessModal, setWithdrawlSuccessModal] = useState(false);
  const [activeTab, setActiveTab] = useState(1);
  const [tabs, setTabs] = useState([1]);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [isEditable, setIsEditable] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: "",
    surname: "",
    email: "",
    phone: "",
    country: "",
    city: "",
    comment: "...",
  });

  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    setSelectedLanguage(lng);
    i18n.changeLanguage(lng);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUserProfile({
      ...userProfile,
      [name]: value,
    });
  };

  const handleEditClick = () => {
    setIsEditable(true);
  };

  const handleSaveClick = async () => {
    setIsEditable(false);

    // Save the updated userProfile data to Firestore
    try {
      const user = auth.currentUser;
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, userProfile);
      console.log("Data saved to Firestore");
    } catch (error) {
      console.error("Error saving data to Firestore:", error);
    }
  };
  const getUserDataByUID = async () => {
    const user = auth.currentUser;

    if (!user) {
      console.log("User is not authenticated.");
      return null;
    }

    console.log("UID:", user.uid);

    try {
      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        // User document exists, you can access the data
        const userData = userDoc.data();
        console.log("User data:", userData);
        setUserProfile(userData);
        return userData;
      } else {
        console.log("User document does not exist.");
        return null;
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is authenticated, fetch user data here
        getUserDataByUID();
      } else {
        console.log("User is not authenticated.");
      }
    });

    return () => {
      unsubscribe(); // Unsubscribe from the listener when the component unmounts
    };
  }, []);

  const hanldeLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        console.log("User signed out.");
        navigate("/");
      })
      .catch((error) => {
        console.log("Error", error);
      });
  };

  const openOrderHistory = () => {
    const ordersHistoryButton = document.getElementById("ordersHistoryButton");
    const tableOrders = document.getElementById("orders");
    const tradeToToggle = document.getElementById("trade");
    const navButtons = document.getElementById("nav-buttons");
    const sideButtonTrade = document.getElementById("side-button-trade");
    const iconTrade = document.getElementById("side-button-trade-icon");
    const sideButtonAssets = document.getElementById("side-button-assets");
    const newDealButton = document.getElementById("newDealButton");

    if (!ordersHistoryButton?.classList.contains("active")) {
      ordersHistoryButton?.classList.add("active");
      ordersHistoryButton.style.backgroundColor = "#1e222d";
      ordersHistoryButton.style.border = "1px solid rgb(0, 255, 110)";
      ordersHistoryButton.style.color = "rgb(0, 255, 110)";
      ordersHistoryButton.style.fontWeight = "bold";

      tableOrders.style.maxHeight = "630px";
      tradeToToggle.style.display = "none";
      navButtons.setAttribute("style", "margin-top: 5px;");
    } else {
      ordersHistoryButton?.classList.remove("active");
      ordersHistoryButton.removeAttribute("style");

      tableOrders.style.maxHeight = "150px";
      tradeToToggle.style.display = "flex";
      sideButtonTrade?.classList.add("active");
      iconTrade?.classList.add("active");
      navButtons.setAttribute("style", "margin-top: 0;");

      if (newDealButton?.classList.contains("active")) {
        if (sideButtonAssets?.classList.contains("active")) {
          tableOrders.style.maxHeight = "150px";
        } else {
          tableOrders.style.maxHeight = "115px";
        }
      }
    }
  };

  const openOrderPanel = () => {
    const newDealButton = document.getElementById("newDealButton");
    let a = document.getElementById("newOrder");
    const tableOrders = document.getElementById("orders");
    const sideButtonAssets = document.getElementById("side-button-assets");
    const ordersHistoryButton = document.getElementById("ordersHistoryButton");
    if (
      !newDealButton.classList.contains("active") &&
      !ordersHistoryButton.classList.contains("active")
    ) {
      a.removeAttribute("style");
      newDealButton.classList.add("active");
      newDealButton.style.backgroundColor = "#1e222d";
      newDealButton.style.border = "1px solid rgb(0, 255, 110)";
      newDealButton.style.color = "rgb(0, 255, 110)";
      newDealButton.style.fontWeight = "bold";
      tableOrders.style.maxHeight = "115px";
    } else if (!ordersHistoryButton.classList.contains("active")) {
      a.style.display = "none";
      newDealButton.classList.remove("active");
      newDealButton.removeAttribute("style");

      tableOrders.style.maxHeight = "150px";
    }
    if (sideButtonAssets.classList.contains("active")) {
      tableOrders.style.maxHeight = "150px";
    }
  };

  useEffect(() => {
    getSymbols();
  }, []);

  useEffect(() => {
    if (orderData?.symbol) {
      getValue();
    }
  }, [orderData?.symbol]);

  const getValue = async () => {
    const apiKeyFinnhub = "ck0cklhr01qtrbkm13m0ck0cklhr01qtrbkm13mg";

    // const apiUrl =
    //   `https://finnhub.io/api/v1/quote?symbol=${orderData.symbol.value}&token=` +
    // apiKeyFinnhub;

    const apiUrl =
      "https://api.binance.com/api/v3/ticker/price?symbol=" +
      orderData?.symbol?.value;

    await axios.get(apiUrl).then((e) => {
      let obj = { ...orderData, symbolValue: e.data.price };
      setOrderData(obj);
    });
  };

  const placeOrder = (e, type) => {
    e.preventDefault();
    const form = document.getElementById("newOrderForm");

    console.log({ form, orderData });

    if (!orderData?.symbol) {
      toastify("Symbol is missing.");
    } else if (!orderData?.volume) {
      toastify("Volume is missing.");
    } else {
      const user = auth.currentUser;
      const userId = user.uid;

      const ordersCollection = collection(db, "orders");

      console.log({ userId });

      addDoc(ordersCollection, {
        userId: userId,
        ...orderData,
      })
        .then((docRef) => {
          console.log("Order written with ID: ", docRef.id);
        })
        .catch((error) => {
          console.error("Error adding order: ", error);
        });

      //   const newRow = document.createElement("tr");

      //   const currentDate = new Date();

      //   const day = currentDate.getDate().toString().padStart(2, "0"); // Get the day and pad with leading zero if necessary
      //   const month = (currentDate.getMonth() + 1).toString().padStart(2, "0"); // Get the month (Note: Months are zero-based, so we add 1) and pad with leading zero if necessary
      //   const year = currentDate.getFullYear().toString().slice(-4); // Get the last two digits of the year

      //   const formattedDate = `${day}/${month}/${year}`;

      //   newRow.innerHTML = `<td>${"ID" + Math.floor(Math.random() * 1000)}</td>
      //  <td>${formattedDate}</td>
      //  <td>${orderData?.symbol?.value}</td>
      //  <td>${type}</td>
      //  <td>${orderData.volume}</td>
      //  <td>${orderData.symbolValue}</td>
      //  <td>${orderData.sl}/${orderData.tp}</td>
      //  <td>Success</td>
      //  <td>-${orderData.volume * orderData.symbolValue}</td>`;

      //   let dataBody = document.getElementById("dataBody");

      //   dataBody.appendChild(newRow);

      //   form.reset();
      //   setOrderData({
      //     symbol: null,
      //     symbolValue: null,
      //     volume: null,
      //     sl: null,
      //     tp: null,
      //   });
    }
  };

  const getSymbols = async () => {
    await axios.get(`https://api.binance.com/api/v3/exchangeInfo`).then((e) => {
      setSymbols(
        e.data.symbols?.map((f) => {
          return { value: f.symbol, label: f.symbol };
        }) || []
      );
    });
  };

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "blue" : "white",
      color: state.isSelected ? "white" : "black",
      "&:hover": {
        backgroundColor: "lightgray",
        color: "black",
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "white",
    }),
    control: (provided) => ({
      ...provided,
      backgroundColor: "white", // Change the background color to white
    }),
  };

  return (
    <>
      <div id="header">
        <div id="logo">
          <img
            id="logo-img"
            src={logoIcon}
            style={{ width: "45%", "background-color": "var(--main-bgc)" }}
          />
        </div>
        <div id="header-info">
          <div id="balance">
            <div className="balance-item">
              <h2 className="balance-title">{t("balance")}:</h2>
              <input
                type="number"
                className="balance-nums"
                readOnly={true}
                defaultValue={100.0}
              />
            </div>
            <div className="balance-item">
              <h2 className="balance-title" id="free-margi">
                {t("freeMargin")}:
              </h2>
              <h2 className="balance-title hidden" id="free-margi2">
                {t("freeMargin2")}
              </h2>
              <input
                type="number"
                className="balance-nums"
                readOnly={true}
                defaultValue={100.0}
              />
            </div>
            <div className="balance-item">
              <h2 className="balance-title">{t("profit")}:</h2>
              <input
                type="number"
                className="balance-nums"
                readOnly={true}
                defaultValue={0.0}
              />
            </div>
            <div
              id="balance-item-lang"
              className="balance-item"
              style={{ border: "none" }}
            >
              {selectedLanguage === "en" ? (
                <img
                  id="lang"
                  src={ruFlagIcon}
                  onClick={() => changeLanguage("ru")}
                />
              ) : (
                <img
                  id="lang"
                  src={enFlagIcon}
                  onClick={() => changeLanguage("en")}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <div id="body">
        <div id="sidebar">
          <div id="side-main-menu">
            <div id="side-trade" onClick={() => setTab("trade")}>
              <StatsChartSharp
                color={
                  tab === "trade" || tab === "assets"
                    ? "rgba(0, 255, 110, 0.952)"
                    : "#ffffff"
                }
              />
              <button
                id="side-button-trade"
                className={`side-button ${
                  (tab === "trade" || tab === "assets") && " active"
                }`}
              >
                {t("trade")}
              </button>
            </div>
            <div
              id="side-assets"
              onClick={() => {
                setTab(tab === "assets" ? "trade" : "assets");
              }}
            >
              {/* <ion-icon id="side-button-assets-icon" name="list" /> */}
              <List
                color={
                  tab === "assets" ? "rgba(0, 255, 110, 0.952)" : "#ffffff"
                }
              />
              <button
                id="side-button-assets"
                className={`side-button ${tab === "assets" && " active"}`}
              >
                {t("assets")}
              </button>
              <button
                id="side-button-assets-mobile"
                className={`side-button hidden ${
                  tab === "assets" && " active"
                }`}
              >
                {t("assets")}
              </button>
            </div>
            <div id="side-account" onClick={() => setTab("account")}>
              {/* <ion-icon id="side-button-account-icon" name="person-circle" /> */}
              <PersonCircle
                color={
                  tab === "account" ? "rgba(0, 255, 110, 0.952)" : "#ffffff"
                }
              />
              <button
                id="side-button-account"
                className={`side-button ${tab === "account" && " active"}`}
              >
                {t("account")}
              </button>
            </div>
          </div>
          <div id="side-out-menu">
            <div id="side-out-extra" onClick={() => setTab("help")}>
              {/* <ion-icon
                id="information-circle-icon"
                name="information-circle"
              /> */}
              <InformationCircle
                color={tab === "help" ? "rgba(0, 255, 110, 0.952)" : "#ffffff"}
              />
              <button
                id="help-button"
                className={`side-out-button ${tab === "help" && " active"}`}
              >
                {t("help")}
              </button>
            </div>
            <div id="side-logout" onClick={hanldeLogout}>
              <ion-icon name="log-out" />
              <LogOut color={"#ffffff"} />
              <button id="logout-button" className="side-out-button">
                {t("exit")}
              </button>
            </div>
          </div>
        </div>
        <div id="content">
          {(tab === "trade" || tab === "assets") && (
            <div id="trade-div">
              <div id="trade">
                {tab === "assets" && (
                  <div id="assets">
                    <TradingWidget locale="en" />
                  </div>
                )}
                <div id="chart">
                  <ul class="nav nav-tabs" id="myTabs">
                    {tabs?.map((e, i) => (
                      <li class="nav-item">
                        <a
                          class={`nav-link ${activeTab === i + 1 && "active"}`}
                          data-bs-toggle="tab"
                          style={{
                            fontSize: "14px",
                            cursor: "pointer",
                            position: "relative",
                          }}
                          onClick={() => setActiveTab(i + 1)}
                        >
                          # {e}
                          <div
                            onClick={(event) => {
                              event.stopPropagation();
                              console.log("Close", { tabs, e });
                              let _tabs = [...tabs].filter((f) => f !== e);
                              setTabs(_tabs);
                              setActiveTab(_tabs[0]);
                            }}
                          >
                            <CloseCircleOutline
                              style={{
                                marginLeft: 10,
                                height: "auto",
                                position: "absolute",
                                top: "-10px",
                                left: "30px",
                                borderRadius: "50%",
                              }}
                            />
                          </div>
                        </a>
                      </li>
                    ))}
                    <li class="nav-item">
                      <button
                        id="addTabButton"
                        class="btn btn-primary"
                        style={{ background: "transparent", border: "none" }}
                        // onClick={addChart}
                        onClick={() => {
                          let highest = tabs[0];
                          tabs.forEach((element) => {
                            if (element > highest) {
                              highest = element;
                            }
                          });
                          let _tabs = [...tabs, highest + 1];
                          setTabs(_tabs);
                          setActiveTab(_tabs.length);
                          console.log({ _tabs, length: _tabs.length });
                        }}
                      >
                        +
                      </button>
                    </li>
                  </ul>
                  {tabs?.map((e, i) => {
                    return (
                      <TradingView
                        locale="en"
                        hide={activeTab === i + 1 ? false : true}
                        index={i}
                      />
                    );
                  })}
                </div>

                <div id="newOrder" style={{ display: "none" }}>
                  <div id="newOrderData">
                    <h2
                      style={{
                        margin: "0",
                        width: "70%",
                        height: "5%",
                        marginLeft: "15%",
                        fontSize: "18px",
                      }}
                    >
                      {t("newDeal")}
                    </h2>
                    <form id="newOrderForm">
                      <label htmlFor="symbol-input">{t("symbol")}</label>

                      <Select
                        id="symbol-input"
                        options={symbols}
                        onChange={(e) =>
                          setOrderData({ ...orderData, symbol: e })
                        }
                        styles={customStyles}
                        value={orderData.symbol}
                      />
                      {/* <input
                        type="text"
                        id="symbol-input"
                        name="symbolInput"
                        placeholder="Search..."
                        style={{
                          "-webkit-text-transform": "uppercase",
                          textTransform: "uppercase",
                        }}
                        required
                      /> */}
                      {/* <div id="symbol-modal" className="modal">
                        <div id="symbol-dropdown" className="dropdown" />
                      </div> */}
                      <label htmlFor="symbol-current-value">{t("price")}</label>
                      <input
                        type="number"
                        id="symbol-current-value"
                        name="symbolCurrentValue"
                        readOnly={true}
                        value={orderData?.symbolValue}
                        // required
                      />
                      <label htmlFor="symbol-amount">{t("volume")}</label>
                      <input
                        type="number"
                        id="symbol-amount"
                        name="symbolAmount"
                        defaultValue={0.0}
                        max={100}
                        // required
                        onChange={(e) =>
                          setOrderData({ ...orderData, volume: e.target.value })
                        }
                        value={orderData?.volume}
                      />
                      <label htmlFor="stop-loss">SL</label>
                      <input
                        type="number"
                        id="stop-loss"
                        name="stopLoss"
                        // required
                        onChange={(e) =>
                          setOrderData({ ...orderData, sl: e.target.value })
                        }
                        value={orderData?.sl}
                      />
                      <label htmlFor="take-profit">TP</label>
                      <input
                        type="number"
                        id="take-profit"
                        name="takeProfit"
                        // required
                        onChange={(e) =>
                          setOrderData({ ...orderData, tp: e.target.value })
                        }
                        value={orderData?.tp}
                      />
                      <button
                        // className="newOrderButton"
                        // id="buyButton"
                        className="newOrderButton buyButton"
                        onClick={(e) => placeOrder(e, "Buy")}
                        type="submit"
                      >
                        {t("buy")}
                      </button>
                      <button
                        // className="newOrderButton"
                        //  id="sellButton"
                        onClick={(e) => placeOrder(e, "Sell")}
                        type="submit"
                        className="newOrderButton sellButton"
                      >
                        {t("sell")}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
              <div id="history-div">
                <div id="nav-buttons">
                  <button
                    id="newDealButton"
                    onClick={() => {
                      openOrderPanel();
                      // let a = document.getElementById("newOrder");
                      // let d = window.getComputedStyle(a).display;
                      // document.getElementById("newOrder").style.display =
                      //   d === "flex" ? "none" : "flex";
                    }}
                  >
                    {t("newOrder")}
                  </button>
                  <button
                    id="newDealButtonMobile"
                    onClick={() => {
                      // let a = document.getElementById("newOrder");
                      // // document.getElementById("chart").style.display = "none";
                      // let d = window.getComputedStyle(a).display;
                      // document.getElementById("newOrder").style.display =
                      //   d === "flex" ? "none" : "flex";
                      openOrderPanel();
                    }}
                  >
                    {t("newOrder")}
                  </button>
                  <button
                    id="ordersHistoryButton"
                    onClick={() => {
                      openOrderHistory();
                    }}
                  >
                    {t("ordersHistory")}
                  </button>
                </div>
                <div id="orders">
                  <table
                    id="orders-table"
                    className="table-dark table-striped table-responsive"
                  >
                    <thead className="sticky-header">
                      <tr>
                        <th>ID</th>
                        <th>{t("date")}</th>
                        <th>{t("symbol")}</th>
                        <th>{t("type")}</th>
                        <th>{t("volume")}</th>
                        <th>{t("price")}</th>
                        <th>SL/TP</th>
                        <th>{t("status")}</th>
                        <th>{t("profit")}</th>
                      </tr>
                    </thead>
                    <tbody id="dataBody" className="table-body"></tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          {tab === "account" && (
            <div id="account">
              <div id="account-profile">
                <img id="acc-img-placeholder" src={accPlaceholder} />
                <h4 style={{ margin: "0", "margin-bottom": "15px" }}>
                  Test Lead #0001
                </h4>
                <div id="acc-profile-main">
                  <div className="acc-profile-main-item">
                    <h6>{t("balance")} (USD):</h6>
                    <h6>100.00</h6>
                  </div>
                  <div className="acc-profile-main-item">
                    <h6>{t("dept")} (USD):</h6>
                    <h6>00.00</h6>
                  </div>
                  <div className="acc-profile-main-item">
                    <h6>{t("marginlvl")}:</h6>
                    <h6>100.00</h6>
                  </div>
                  <div className="acc-profile-main-item">
                    <h6>{t("total")} (USD):</h6>
                    <h6>100.00</h6>
                  </div>
                  <div className="acc-profile-main-item">
                    <h6>{t("deposited")} (USD):</h6>
                    <h6>100.00</h6>
                  </div>
                  <div className="acc-profile-main-item">
                    <h6>{t("withdrawn")} (USD):</h6>
                    <h6>00.00</h6>
                  </div>
                </div>
                <div id="verif-buttons">
                  <button
                    id="documents-button"
                    // data-bs-toggle="modal"
                    // data-bs-target="#verification-docs"
                    onClick={() => setUploadModal(true)}
                  >
                    {t("verification")}
                  </button>
                </div>
                {/* The Upload Modal */}
                {uploadModal && (
                  <div
                    className="modal fade show"
                    id="verification-docs"
                    style={{
                      display: "flex",
                    }}
                  >
                    <div
                      className="modal-dialog modal-lg"
                      style={{ display: "flex" }}
                    >
                      <div
                        className="modal-content"
                        style={{ "border-radius": "0px", height: "50vh" }}
                      >
                        {/* Modal Header */}
                        <div className="modal-header">
                          <h4 className="modal-title">{t("uploadDocs")}</h4>
                          <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            onClick={() => setUploadModal(false)}
                          />
                        </div>
                        {/* Modal body */}
                        <div className="modal-body">
                          <form encType="multipart/form-data">
                            <div className="mb-3">
                              <label
                                htmlFor="verificationFile"
                                className="form-label"
                              >
                                {t("chooseFile")}
                              </label>
                              <input
                                type="file"
                                className="form-control"
                                id="verificationFile"
                                name="verificationFile"
                                accept=".pdf, .doc, .docx"
                                style={{ height: "100%" }}
                              />
                            </div>
                            <button
                              type="submit"
                              className="btn btn-primary"
                              id="uploadButton"
                              style={{ color: "rgb(0, 255, 110)" }}
                            >
                              {t("upload")}
                            </button>
                          </form>
                        </div>
                        {/* Modal footer */}
                        <div className="modal-footer">
                          <button
                            type="button"
                            className="btn btn-danger"
                            data-bs-dismiss="modal"
                            onClick={() => setUploadModal(false)}
                          >
                            {t("close")}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {/* The Success Modal */}
                {successModal && (
                  <div className="modal" id="successModal">
                    <div className="modal-dialog">
                      <div className="modal-content">
                        {/* Modal Header */}
                        <div className="modal-header">
                          <h4 className="modal-title">{t("success")}</h4>
                          <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                          />
                        </div>
                        {/* Modal body */}
                        <div className="modal-body">{t("thankyou")}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div id="account-info">
                <h3
                  style={{
                    "margin-top": "40px",
                    "margin-bottom": "20px",
                    width: "80%",
                    "font-size": "25px",
                  }}
                >
                  {t("personalInfo")}
                </h3>
                <div id="acc-info-personal">
                  <div className="acc-info-personal-item">
                    <h6>{t("name")}</h6>
                    <input
                      type="text"
                      name="name"
                      value={userProfile?.name}
                      onChange={handleChange}
                      readOnly={!isEditable}
                    />
                  </div>
                  <div className="acc-info-personal-item">
                    <h6>{t("surname")}</h6>
                    <input
                      type="text"
                      name="surname"
                      value={userProfile?.surname}
                      placeholder=""
                      onChange={handleChange}
                      readOnly={!isEditable}
                    />
                  </div>
                  <div className="acc-info-personal-item">
                    <h6>{t("email")}</h6>
                    <input
                      type="text"
                      name="email"
                      id="userEmail"
                      value={userProfile?.email}
                      placeholder=""
                      readOnly
                    />
                  </div>
                  <div className="acc-info-personal-item">
                    <h6>{t("phone")}</h6>
                    <input
                      type="number"
                      name="phone"
                      id
                      value={userProfile?.phone}
                      placeholder={+7777038475}
                      onChange={handleChange}
                      readOnly={!isEditable}
                    />
                  </div>
                  <div className="acc-info-personal-item">
                    <h6>{t("country")}</h6>
                    <input
                      type="text"
                      value={userProfile?.country}
                      name="country"
                      id
                      placeholder=""
                      onChange={handleChange}
                      readOnly={!isEditable}
                    />
                  </div>
                  <div className="acc-info-personal-item">
                    <h6>{t("city")}</h6>
                    <input
                      type="text"
                      value={userProfile?.city}
                      name="city"
                      id
                      placeholder=""
                      onChange={handleChange}
                      readOnly={!isEditable}
                    />
                  </div>
                  <div className="acc-info-personal-item">
                    <h6>{t("dateRegister")}</h6>
                    <input
                      type="text"
                      value={userProfile?.createdAt}
                      name="dateRegister"
                      id
                      placeholder=""
                      // onChange={handleChange}
                      readOnly={true}
                    />
                  </div>
                  <div className="acc-info-personal-item">
                    <h6>{t("comment")}:</h6>
                    <input
                      type="text"
                      value={userProfile?.comment}
                      name="comment"
                      id="comment"
                      placeholder="..."
                      onChange={handleChange}
                      readOnly={!isEditable}
                    />
                  </div>
                </div>
                <div id="acc-info-buttons">
                  {isEditable ? (
                    <button id="acc-save-button" onClick={handleSaveClick}>
                      Save
                    </button>
                  ) : (
                    <button id="acc-edit-button" onClick={handleEditClick}>
                      Edit
                    </button>
                  )}
                </div>
              </div>
              <div id="account-transactions">
                <h3
                  style={{
                    "border-bottom": "1px solid var(--main-bgc)",
                    "font-size": "25px",
                    "padding-bottom": "25px",
                    "padding-top": "0",
                    "margin-top": "40px",
                    "margin-bottom": "30px",
                    width: "80%",
                  }}
                >
                  {t("transactions")}
                </h3>
                <div id="trans-his">
                  <table id="transactions-his-table">
                    <thead
                      className="sticky-header"
                      style={{
                        "border-radius": "5px",
                        border: "1px solid rgb(39, 39, 23)",
                      }}
                    >
                      <tr>
                        <th>ID</th>
                        <th>{t("type")}</th>
                        <th>{t("amount")} $</th>
                        <th>{t("method")}</th>
                        <th>{t("status")}</th>
                        <th>{t("date")}</th>
                      </tr>
                    </thead>
                    <tbody id="transactions-t-body" className="table-body">
                      <tr>
                        <th>ID001</th>
                        <th>Deposit</th>
                        <th>100</th>
                        <th>VISA</th>
                        <th>Success</th>
                        <th>08/08/2022</th>
                      </tr>
                      <tr>
                        <th>ID002</th>
                        <th>Withdraw</th>
                        <th>100</th>
                        <th>VISA</th>
                        <th>Under review</th>
                        <th>11/08/2022</th>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div id="transaction-request">
                  {/* <h2 style="padding: 20px; margin: 0; margin-top: 3%; width: 80%; border-top: 1px solid rgb(17, 17, 23);">Запрос на вывод</h2>
        <input type="number" id="withdraw-amount" placeholder="Сумма (USD)">
        <input type="number" id="withdraw-card" placeholder="Номер карты"> */}
                  <button
                    id="deposit-button"
                    onClick={() => setDepositModal(true)}
                  >
                    {t("deposit")}
                  </button>
                  {/* The Modal */}
                  {depositModal && (
                    <div
                      className="modal show fade"
                      id="deposit-modal"
                      style={{
                        display: "flex",
                      }}
                    >
                      <div
                        className="modal-dialog modal-lg"
                        style={{ "margin-top": "10%" }}
                      >
                        <div className="modal-content">
                          {/* Modal Header */}
                          <div className="modal-header">
                            <h4 className="modal-title">{t("deposit")}</h4>
                            <button
                              type="button"
                              className="btn-close"
                              data-bs-dismiss="modal"
                              onClick={() => {
                                setDepositModal(false);
                              }}
                            />
                          </div>
                          {/* Modal body */}
                          <div
                            className="modal-body"
                            style={{ display: "contents", height: "500px" }}
                          >
                            <div
                              id="modal-contents"
                              style={{
                                height: "500px",
                                display: "inherit",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                }}
                              >
                                <Form.Select style={{ width: 200 }}>
                                  <option>Choose method</option>
                                  <option value="1">VISA/MasterCard</option>
                                  <option value="2">Crypto</option>
                                  <option value="3">Other</option>
                                </Form.Select>
                              </div>
                              <label>{t("accountNumber")}</label>
                              <input type="text" className="text-center" />
                              <label>{t("amount")}</label>
                              <input type="text" className="text-center" />
                            </div>
                          </div>
                          {/* Modal footer */}
                          <div
                            className="modal-footer"
                            style={{
                              display: "flex",
                              "-webkit-align-items": "center",
                              "-webkit-box-align": "center",
                              "-ms-flex-align": "center",
                              "align-items": "center",
                              "-webkit-box-pack": "center",
                              "-webkit-justify-content": "center",
                              "-ms-flex-pack": "center",
                              "justify-content": "center",
                            }}
                          >
                            <button
                              id="accept-deposit"
                              type="button"
                              className="btn btn-primary"
                              data-bs-dismiss="modal"
                              style={{ color: "aquamarine" }}
                              onClick={() => {
                                setDepositModal(false);
                                setDepositSuccessModal(true);
                              }}
                            >
                              {t("confirm")}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {/* The Success Modal */}
                  {depositSuccessModal && (
                    <div
                      className="modal show fade"
                      id="dep-successModal"
                      style={{
                        display: "flex",
                      }}
                    >
                      <div className="modal-dialog">
                        <div className="modal-content">
                          {/* Modal Header */}
                          <div className="modal-header">
                            <h4 className="modal-title">{t("success")}</h4>
                            <button
                              type="button"
                              className="btn-close"
                              data-bs-dismiss="modal"
                              onClick={() => setDepositSuccessModal(false)}
                            />
                          </div>
                          {/* Modal body */}
                          <div className="modal-body">
                            {t("depositSubmit")} <br />
                            {t("wait")}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <button
                    id="withdraw-request-button"
                    onClick={() => setWithdrawlModal(true)}
                  >
                    {t("withdraw")}
                  </button>
                  {/* The Modal */}
                  {withdrawlModal && (
                    <div
                      className="modal show fade"
                      id="withdraw-modal"
                      style={{
                        display: "flex",
                      }}
                    >
                      <div
                        className="modal-dialog modal-lg"
                        style={{ "margin-top": "10%" }}
                      >
                        <div className="modal-content">
                          {/* Modal Header */}
                          <div className="modal-header">
                            <h4 className="modal-title">
                              {t("fundsWithdrawal")}
                            </h4>
                            <button
                              type="button"
                              className="btn-close"
                              data-bs-dismiss="modal"
                              onClick={() => {
                                setWithdrawlModal(false);
                              }}
                            />
                          </div>
                          {/* Modal body */}
                          <div
                            className="modal-body"
                            style={{ display: "contents", height: "500px" }}
                          >
                            <div
                              id="modal-contents"
                              style={{ height: "500px", display: "inherit" }}
                            >
                              <label htmlFor>{t("accountNumber")}</label>
                              <input type="text" name id />
                              <label htmlFor>{t("amount")}</label>
                              <input type="text" name id />
                            </div>
                          </div>
                          {/* Modal footer */}
                          <div
                            className="modal-footer"
                            style={{
                              display: "flex",
                              "-webkit-align-items": "center",
                              "-webkit-box-align": "center",
                              "-ms-flex-align": "center",
                              "align-items": "center",
                              "-webkit-box-pack": "center",
                              "-webkit-justify-content": "center",
                              "-ms-flex-pack": "center",
                              "justify-content": "center",
                            }}
                          >
                            <button
                              id="accept-withdraw"
                              type="button"
                              className="btn btn-primary"
                              data-bs-dismiss="modal"
                              style={{ color: "aquamarine" }}
                              onClick={() => {
                                setWithdrawlModal(false);
                                setWithdrawlSuccessModal(true);
                              }}
                            >
                              {t("confirm")}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {/* The Success Modal */}
                  {withdrawlSuccessModal && (
                    <div
                      className="modal fade show"
                      id="wd-successModal"
                      style={{
                        display: "flex",
                      }}
                    >
                      <div className="modal-dialog">
                        <div className="modal-content">
                          {/* Modal Header */}
                          <div className="modal-header">
                            <h4 className="modal-title">{t("success")}</h4>
                            <button
                              type="button"
                              className="btn-close"
                              data-bs-dismiss="modal"
                              onClick={() => setWithdrawlSuccessModal(false)}
                            />
                          </div>
                          {/* Modal body */}
                          <div className="modal-body">
                            {t("requestSuccess")} <br />
                            {t("furtherInstructions")}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div id="account-mobile-buttons" className="hidden">
                <button>{t("personalInfo")}</button>
                <button>{t("transactions")}</button>
              </div>
            </div>
          )}
          {tab === "help" && (
            <div id="faq">
              <h1>{t("FAQ")}</h1>
              <h2>{t("GQ")}</h2>
              <dl>
                <dt>{t("Q1")}</dt>
                <dd>{t("ANS1")}</dd>
                <dt>{t("Q2")}</dt>
                <dd>{t("ANS2")}</dd>
                {/* Add more general questions and answers here */}
              </dl>
              <h2>{t("accountManagement")}</h2>
              <dl>
                <dt>{t("Q3")}</dt>
                <dd>{t("ANS3")}</dd>
                <dt>{t("Q4")}</dt>
                <dd>{t("ANS4")}</dd>
                {/* Add more account management questions and answers here */}
              </dl>
              <h2>{t("tradingInvestment")}</h2>
              <dl>
                <dt>{t("Q5")}</dt>
                <dd>{t("ANS5")}</dd>
                <dt>{t("Q6")}</dt>
                <dd>{t("ANS6")}</dd>
                {/* Add more trading and investment questions and answers here */}
              </dl>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
