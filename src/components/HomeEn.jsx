import React, { useEffect, useState } from "react";
import logoIcon from "./logo.png";
import enFlagIcon from "./gb-fl.png";
import accPlaceholder from "./acc-img-placeholder.png";
import {
  InformationCircle,
  List,
  LogOut,
  PersonCircle,
  StatsChartSharp,
} from "react-ionicons";
import TradingView from "./TradingView";
import TradingWidget from "./TradingWidget";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Select from "react-select";

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

    console.log({ orderData });

    const newRow = document.createElement("tr");

    const currentDate = new Date();

    const day = currentDate.getDate().toString().padStart(2, "0"); // Get the day and pad with leading zero if necessary
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0"); // Get the month (Note: Months are zero-based, so we add 1) and pad with leading zero if necessary
    const year = currentDate.getFullYear().toString().slice(-4); // Get the last two digits of the year

    const formattedDate = `${day}/${month}/${year}`;

    newRow.innerHTML = `<td>${"ID" + Math.floor(Math.random() * 1000)}</td>
     <td>${formattedDate}</td>
     <td>${orderData?.symbol?.value}</td>
     <td>${type}</td>
     <td>${orderData.volume}</td>
     <td>${orderData.symbolValue}</td>
     <td>${orderData.sl}/${orderData.tp}</td>
     <td>Success</td>
     <td>-${orderData.volume * orderData.symbolValue}</td>`;

    let dataBody = document.getElementById("dataBody");

    //   // Append the new row to the dataBody
    dataBody.appendChild(newRow);

    //   // Clear form inputs
    form.reset();
    setOrderData({
      symbol: null,
      symbolValue: null,
      volume: null,
      sl: null,
      tp: null,
    });
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

  // const addChart = () => {
  //   var newTabId = "h" + (document.querySelectorAll(".tab-pane").length + 1);

  //   // Create a new nav item
  //   var newNavItem = document.createElement("li");
  //   newNavItem.classList.add("nav-item");

  //   // Create a new nav link
  //   var newNavLink = document.createElement("a");
  //   newNavLink.classList.add("nav-link");
  //   newNavLink.setAttribute("data-bs-toggle", "tab");
  //   newNavLink.setAttribute("href", "#" + newTabId);
  //   newNavLink.setAttribute("style", "font-size: 14px");

  //   newNavLink.textContent =
  //     "# " + document.querySelectorAll(".nav-item").length;

  //   // Append the new nav link to the new nav item
  //   newNavItem.appendChild(newNavLink);

  //   // Insert the new nav item before the "+" button
  //   var addButton = document.getElementById("addTabButton").parentNode;
  //   addButton.parentNode.insertBefore(newNavItem, addButton);

  //   // Create a new tab pane
  //   var newTabPane = document.createElement("div");
  //   newTabPane.classList.add(
  //     "tab-pane",
  //     "container",
  //     "tradingview-widget-container",
  //     "fade",
  //     "show",
  //     "active"
  //   ); // Add 'show' and 'active' classes to make it visible
  //   newTabPane.setAttribute("id", newTabId);
  //   newTabPane.style.margin = "0";
  //   newTabPane.style.padding = "0";

  //   // Create a new tradingview container for the tab
  //   var newTradingViewContainer = document.createElement("div");
  //   newTradingViewContainer.setAttribute("id", "tradingview_" + newTabId);

  //   // Append the new tradingview container to the tab pane
  //   newTabPane?.appendChild(newTradingViewContainer);

  //   // Append the new tab pane to the tab content div
  //   document.querySelector(".tab-content")?.appendChild(newTabPane);

  //   // Load the TradingView scripts for the new tab
  //   var tvScript = document.createElement("script");
  //   tvScript.type = "text/javascript";
  //   tvScript.src = "https://s3.tradingview.com/tv.js";
  //   newTradingViewContainer?.appendChild(tvScript);

  //   var customScript = document.createElement("script");
  //   customScript.type = "text/javascript";
  //   customScript.src = "tradingview.js";
  //   newTradingViewContainer?.appendChild(customScript);

  //   // Activate the new tab by triggering a click event
  //   newNavLink.click();

  //   // Update the TradingView widget for the new tab
  //   // updateWidget("BTCUSDT", "tradingview_" + newTabId);
  // };

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
              <h2 className="balance-title">Balance:</h2>
              <input
                type="number"
                className="balance-nums"
                readOnly="true"
                defaultValue={100.0}
              />
            </div>
            <div className="balance-item">
              <h2 className="balance-title" id="free-margi">
                Free margin:
              </h2>
              <h2 className="balance-title hidden" id="free-margi2">
                Free margin:
              </h2>
              <input
                type="number"
                className="balance-nums"
                readOnly="true"
                defaultValue={100.0}
              />
            </div>
            <div className="balance-item">
              <h2 className="balance-title">Profit:</h2>
              <input
                type="number"
                className="balance-nums"
                readOnly="true"
                defaultValue={0.0}
              />
            </div>
            <div
              id="balance-item-lang"
              className="balance-item"
              style={{ border: "none" }}
            >
              <img
                id="lang"
                src={enFlagIcon}
                onClick={() => {
                  const imageToChange = document.getElementById("lang");
                  const imageSources = ["ru-fl.png", "gb-fl.png"];
                  let currentImageIndex = 0;
                  function changeImage() {
                    currentImageIndex++;
                    if (currentImageIndex === imageSources.length) {
                      currentImageIndex = 0;
                    }
                    imageToChange.src = imageSources[currentImageIndex];
                    toggleLanguage();
                  }
                  changeImage();

                  function toggleLanguage() {
                    var lang = window.location.pathname?.includes("en")
                      ? "en"
                      : "ru";

                    navigate(`/${lang === "en" ? "ru" : "en"}/main`);
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <div id="body">
        <div id="sidebar">
          <div id="side-main-menu">
            <div id="side-trade">
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
                onClick={() => setTab("trade")}
              >
                Trade
              </button>
            </div>
            <div id="side-assets">
              {/* <ion-icon id="side-button-assets-icon" name="list" /> */}
              <List
                color={
                  tab === "assets" ? "rgba(0, 255, 110, 0.952)" : "#ffffff"
                }
              />
              <button
                id="side-button-assets"
                className={`side-button ${tab === "assets" && " active"}`}
                onClick={() => {
                  setTab(tab === "assets" ? "trade" : "assets");
                }}
              >
                Assets
              </button>
              <button
                id="side-button-assets-mobile"
                className={`side-button hidden ${
                  tab === "assets" && " active"
                }`}
                onClick={() => setTab(tab === "assets" ? "trade" : "assets")}
              >
                Assets
              </button>
            </div>
            <div id="side-account">
              {/* <ion-icon id="side-button-account-icon" name="person-circle" /> */}
              <PersonCircle
                color={
                  tab === "account" ? "rgba(0, 255, 110, 0.952)" : "#ffffff"
                }
              />
              <button
                id="side-button-account"
                className={`side-button ${tab === "account" && " active"}`}
                onClick={() => setTab("account")}
              >
                Account
              </button>
            </div>
          </div>
          <div id="side-out-menu">
            <div id="side-out-extra">
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
                onClick={() => setTab("help")}
              >
                Help
              </button>
            </div>
            <div id="side-logout">
              <ion-icon name="log-out" />
              <LogOut color={"#ffffff"} />
              <button
                onClick={() => navigate("/")}
                id="logout-button"
                className="side-out-button"
              >
                Exit
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
                          style={{ fontSize: "14px", cursor: "pointer" }}
                          onClick={() => setActiveTab(i + 1)}
                        >
                          # {e}
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
                          let _tabs = [...tabs, tabs?.length + 1];
                          setTabs(_tabs);
                          setActiveTab(_tabs.length);
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
                      New deal
                    </h2>
                    <form id="newOrderForm">
                      <label htmlFor="symbol-input">Symbol</label>

                      <Select
                        id="symbol-input"
                        options={symbols}
                        onChange={(e) =>
                          setOrderData({ ...orderData, symbol: e })
                        }
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
                      <label htmlFor="symbol-current-value">Price</label>
                      <input
                        type="number"
                        id="symbol-current-value"
                        name="symbolCurrentValue"
                        readOnly="true"
                        value={orderData?.symbolValue}
                        // required
                      />
                      <label htmlFor="symbol-amount">Volume</label>
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
                        Buy
                      </button>
                      <button
                        // className="newOrderButton"
                        //  id="sellButton"
                        onClick={(e) => placeOrder(e, "Sell")}
                        type="submit"
                        className="newOrderButton sellButton"
                      >
                        Sell
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
                    New order
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
                    New order
                  </button>
                  <button
                    id="ordersHistoryButton"
                    onClick={() => {
                      openOrderHistory();
                    }}
                  >
                    Orders history
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
                        <th>Date</th>
                        <th>Symbol</th>
                        <th>Type</th>
                        <th>Volume</th>
                        <th>Price</th>
                        <th>SL/TP</th>
                        <th>Status</th>
                        <th>Profit</th>
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
                    <h6>Balance (USD):</h6>
                    <h6>100.00</h6>
                  </div>
                  <div className="acc-profile-main-item">
                    <h6>Dept (USD):</h6>
                    <h6>00.00</h6>
                  </div>
                  <div className="acc-profile-main-item">
                    <h6>Margin lvl (%):</h6>
                    <h6>100.00</h6>
                  </div>
                  <div className="acc-profile-main-item">
                    <h6>Total (USD):</h6>
                    <h6>100.00</h6>
                  </div>
                  <div className="acc-profile-main-item">
                    <h6>Deposited (USD):</h6>
                    <h6>100.00</h6>
                  </div>
                  <div className="acc-profile-main-item">
                    <h6>Withdrawn (USD):</h6>
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
                    Verification
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
                          <h4 className="modal-title">
                            Upload your verification documents
                          </h4>
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
                                Choose file:
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
                              Upload
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
                            Close
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
                          <h4 className="modal-title">Success!</h4>
                          <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                          />
                        </div>
                        {/* Modal body */}
                        <div className="modal-body">
                          Thank you! Documents successfully sent for review!.
                        </div>
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
                  Personal information
                </h3>
                <div id="acc-info-personal">
                  <div className="acc-info-personal-item">
                    <h6>Name:</h6>
                    <input type="text" name id placeholder="TEST" disabled />
                  </div>
                  <div className="acc-info-personal-item">
                    <h6>Surname:</h6>
                    <input type="text" name id placeholder="LEAD" disabled />
                  </div>
                  <div className="acc-info-personal-item">
                    <h6>Email:</h6>
                    <input
                      type="text"
                      name
                      id="userEmail"
                      placeholder="testlead1@gmail.com"
                      disabled
                    />
                  </div>
                  <div className="acc-info-personal-item">
                    <h6>Phone:</h6>
                    <input
                      type="number"
                      name
                      id
                      placeholder={+7777038475}
                      disabled
                    />
                  </div>
                  <div className="acc-info-personal-item">
                    <h6>Country:</h6>
                    <input type="text" name id placeholder="TEST" disabled />
                  </div>
                  <div className="acc-info-personal-item">
                    <h6>City:</h6>
                    <input type="text" name id placeholder="TEST" disabled />
                  </div>
                  <div className="acc-info-personal-item">
                    <h6>Date registered:</h6>
                    <input
                      type="text"
                      name
                      id
                      placeholder="02/07/2023"
                      disabled
                    />
                  </div>
                  <div className="acc-info-personal-item">
                    <h6>Comment:</h6>
                    <input
                      type="text"
                      name
                      id="comment"
                      placeholder="..."
                      disabled="true"
                    />
                  </div>
                </div>
                <div id="acc-info-buttons">
                  <button
                    id="acc-edit-button"
                    onClick={() => {
                      const editButton =
                        document.getElementById("acc-edit-button");
                      const saveButton =
                        document.getElementById("acc-save-button");
                      const commentField = document.getElementById("comment");

                      editButton.style.display = "none";
                      commentField.removeAttribute("disabled");
                      saveButton.style.display = "inline-block";
                    }}
                  >
                    Edit
                  </button>
                  <button
                    id="acc-save-button"
                    onClick={() => {
                      const editButton =
                        document.getElementById("acc-edit-button");
                      const saveButton =
                        document.getElementById("acc-save-button");
                      const commentField = document.getElementById("comment");

                      saveButton.style.display = "none";
                      commentField.setAttribute("disabled", "true");
                      // Display the edit button
                      editButton.style.display = "inline-block";
                    }}
                    className="hidden"
                  >
                    Save
                  </button>
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
                  Transactions
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
                        <th>Type</th>
                        <th>Amount $</th>
                        <th>Method</th>
                        <th>Status</th>
                        <th>Date</th>
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
                    Deposit
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
                            <h4 className="modal-title">Deposit</h4>
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
                              style={{ height: "500px", display: "inherit" }}
                            >
                              <div className="dropdown">
                                <button
                                  type="button"
                                  className="btn btn-secondary dropdown-toggle"
                                  data-toggle="dropdown"
                                >
                                  Choose method
                                </button>
                                <ul
                                  className="dropdown-menu"
                                  style={{ "z-index": "100000" }}
                                >
                                  <li>
                                    <a className="dropdown-item" href="#">
                                      VISA/MasterCard
                                    </a>
                                  </li>
                                  <li>
                                    <a className="dropdown-item" href="#">
                                      Crypto
                                    </a>
                                  </li>
                                  <li>
                                    <a className="dropdown-item" href="#">
                                      Other
                                    </a>
                                  </li>
                                </ul>
                              </div>
                              <label htmlFor>Account number:</label>
                              <input type="text" name id />
                              <label htmlFor>Amount:</label>
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
                              Confirm
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
                            <h4 className="modal-title">Success!</h4>
                            <button
                              type="button"
                              className="btn-close"
                              data-bs-dismiss="modal"
                              onClick={() => setDepositSuccessModal(false)}
                            />
                          </div>
                          {/* Modal body */}
                          <div className="modal-body">
                            Your deposit was submitted! <br />
                            Please await your funds on the balanace within 15
                            mins.
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <button
                    id="withdraw-request-button"
                    onClick={() => setWithdrawlModal(true)}
                  >
                    Withdraw
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
                            <h4 className="modal-title">Funds withdrawal</h4>
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
                              <label htmlFor>Account number:</label>
                              <input type="text" name id />
                              <label htmlFor>Amount:</label>
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
                              Confirm
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
                            <h4 className="modal-title">Success!</h4>
                            <button
                              type="button"
                              className="btn-close"
                              data-bs-dismiss="modal"
                              onClick={() => setWithdrawlSuccessModal(false)}
                            />
                          </div>
                          {/* Modal body */}
                          <div className="modal-body">
                            Your request was successfully received! <br />
                            Please await further instructions from your manager.
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div id="account-mobile-buttons" className="hidden">
                <button>Personal Info</button>
                <button>Transactions</button>
              </div>
            </div>
          )}
          {tab === "help" && (
            <div id="faq">
              <h1>Frequently Asked Questions</h1>
              <h2>General Questions</h2>
              <dl>
                <dt>Q: What is our trading platform?</dt>
                <dd>
                  A: Our trading platform is an online system that allows you to
                  buy and sell various financial instruments such as stocks,
                  bonds, and cryptocurrencies.
                </dd>
                <dt>Q: How do I create an account?</dt>
                <dd>
                  A: To create an account, click on the "Sign Up" button on our
                  homepage and follow the registration process.
                </dd>
                {/* Add more general questions and answers here */}
              </dl>
              <h2>Account Management</h2>
              <dl>
                <dt>Q: How can I reset my password?</dt>
                <dd>
                  A: You can reset your password by clicking on the "Forgot
                  Password" link on the login page and following the
                  instructions sent to your registered email address.
                </dd>
                <dt>Q: Can I have multiple trading accounts?</dt>
                <dd>
                  A: Yes, you can have multiple trading accounts with us.
                  Contact our support team for assistance with setting up
                  additional accounts.
                </dd>
                {/* Add more account management questions and answers here */}
              </dl>
              <h2>Trading and Investments</h2>
              <dl>
                <dt>Q: How can I place a trade?</dt>
                <dd>
                  A: To place a trade, log in to your account, select the
                  financial instrument you want to trade, specify the quantity
                  and other details, and click "Place Order."
                </dd>
                <dt>Q: What are the trading hours?</dt>
                <dd>
                  A: Our trading platform operates 24/7, but specific trading
                  hours for different assets may vary. Check the asset's trading
                  hours in the platform.
                </dd>
                {/* Add more trading and investment questions and answers here */}
              </dl>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
