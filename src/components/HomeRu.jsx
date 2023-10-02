import React, { useEffect, useState } from "react";
import logoIcon from "./logo.png";
import ruFlagIcon from "./ru-fl.png";
import accPlaceholder from "./acc-img-placeholder.png";
import {
  InformationCircle,
  List,
  LogOut,
  PersonCircle,
  StatsChartSharp,
} from "react-ionicons";
import TradingView from "./TradingView.jsx";
import TradingWidget from "./TradingWidget";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Select from "react-select";
import "bootstrap/dist/css/bootstrap.min.css";

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

  return (
    <>
      <div id="header">
        <div id="logo">
          <img
            id="logo-img"
            src={logoIcon}
            style={{ width: "45%", backgroundColor: "var(--main-bgc)" }}
          />
        </div>
        <div id="header-info">
          <div id="balance">
            <div class="balance-item">
              <h2 class="balance-title">Баланс:</h2>
              <input
                type="number"
                class="balance-nums"
                readonly="true"
                value="100.00"
              />
            </div>
            <div class="balance-item">
              <h2 class="balance-title" id="free-margi">
                Свободная маржа:
              </h2>
              <h2 class="balance-title hidden" id="free-margi2">
                Св. маржа:
              </h2>
              <input
                type="number"
                class="balance-nums"
                readonly="true"
                value="100.00"
              />
            </div>
            <div class="balance-item">
              <h2 class="balance-title">Профит:</h2>
              <input
                type="number"
                class="balance-nums"
                readonly="true"
                value="00.00"
              />
            </div>
            <div
              id="balance-item-lang"
              className="balance-item"
              style={{ border: "none" }}
            >
              <img
                id="lang"
                src={ruFlagIcon}
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
                className="side-button active"
                onClick={() => setTab("trade")}
              >
                Торговля
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
                Позиции
              </button>
              <button
                id="side-button-assets-mobile"
                className={`side-button hidden ${
                  tab === "assets" && " active"
                }`}
                onClick={() => setTab(tab === "assets" ? "trade" : "assets")}
              >
                Позиции
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
                Аккаунт
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
                Помощь
              </button>
            </div>
            <div id="side-logout">
              <ion-icon name="log-out" />
              <LogOut color={"#ffffff"} />
              <button
                id="logout-button"
                onClick={() => navigate("/")}
                className="side-out-button"
              >
                Выход
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
                    {/* TradingView Widget BEGIN */}
                    {/* <div className="tradingview-widget-container">
                      <div className="tradingview-widget-container__widget" />
                    </div> */}
                    <TradingWidget locale="ru" />
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
                  <div id="newOrderData" className>
                    <h2
                      style={{
                        margin: "0",
                        width: "70%",
                        height: "5%",
                        marginLeft: "15%",
                        fontSize: "18px",
                      }}
                    >
                      Детали сделки
                    </h2>
                    <form id="newOrderForm">
                      <label htmlFor="symbol-input">Символ</label>
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
                      <label htmlFor="symbol-current-value">Цена</label>
                      <input
                        type="number"
                        id="symbol-current-value"
                        name="symbolCurrentValue"
                        readOnly="true"
                        value={orderData?.symbolValue}
                        // required
                      />
                      <label htmlFor="symbol-amount">Объём</label>
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
                        Купить
                      </button>
                      <button
                        // className="newOrderButton"
                        //  id="sellButton"
                        onClick={(e) => placeOrder(e, "Sell")}
                        type="submit"
                        className="newOrderButton sellButton"
                      >
                        Продать
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
                      // let a = document.getElementById("newOrder");
                      // // document.getElementById("chart").style.display = "none";
                      // let d = window.getComputedStyle(a).display;
                      // console.log({ d });
                      // document.getElementById("newOrder").style.display =
                      //   d === "flex" ? "none" : "flex";
                      openOrderPanel();
                    }}
                  >
                    Открыть сделку
                  </button>
                  <button
                    id="newDealButtonMobile"
                    onClick={() => {
                      // let a = document.getElementById("newOrder");
                      // // document.getElementById("chart").style.display = "none";
                      // let d = window.getComputedStyle(a).display;
                      // console.log({ d });
                      // document.getElementById("newOrder").style.display =
                      //   d === "flex" ? "none" : "flex";
                      openOrderPanel();
                    }}
                  >
                    Открыть сделку
                  </button>
                  <button
                    id="ordersHistoryButton"
                    onClick={() => {
                      openOrderHistory();
                    }}
                  >
                    История сделок
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
                        <th>Дата</th>
                        <th>Символ</th>
                        <th>Тип</th>
                        <th>Объём</th>
                        <th>Цена</th>
                        <th>SL/TP</th>
                        <th>Статус</th>
                        <th>Прибыль</th>
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
                <h4 style={{ margin: "0", marginBottom: "15px" }}>
                  Test Lead #0001
                </h4>
                <div id="acc-profile-main">
                  <div class="acc-profile-main-item">
                    <h6>Баланс (USD):</h6>
                    <h6>100.00</h6>
                  </div>
                  <div class="acc-profile-main-item">
                    <h6>Залог (USD):</h6>
                    <h6>00.00</h6>
                  </div>
                  <div class="acc-profile-main-item">
                    <h6>Уровень маржи (в %):</h6>
                    <h6>100.00</h6>
                  </div>
                  <div class="acc-profile-main-item">
                    <h6>Общая прибыль (USD):</h6>
                    <h6>100.00</h6>
                  </div>
                  <div class="acc-profile-main-item">
                    <h6>Общий депозит (USD):</h6>
                    <h6>100.00</h6>
                  </div>
                  <div class="acc-profile-main-item">
                    <h6>Всего выведено (USD):</h6>
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
                    Верификация
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
                        style={{ borderRadius: "0px", height: "50vh" }}
                      >
                        {/* Modal Header */}
                        <div className="modal-header">
                          <h4 className="modal-title">
                            Загрузите документы для верификации
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
                                Выберите файл:
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
                              Загрузить
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
                            Закрыть
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
                          <h4 className="modal-title">Успешно!</h4>
                          <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                          />
                        </div>
                        {/* Modal body */}
                        <div className="modal-body">
                          Спасибо! Ваши документы приняты на проверку!
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div id="account-info">
                <h3
                  style={{
                    marginTop: 40,
                    marginBottom: 20,
                    width: "80%",
                    fontSize: 25,
                  }}
                >
                  Личная информация
                </h3>
                <div id="acc-info-personal">
                  <div class="acc-info-personal-item">
                    <h6>Имя:</h6>
                    <input
                      type="text"
                      name=""
                      id=""
                      placeholder="ТЕСТ"
                      disabled
                    />
                  </div>
                  <div class="acc-info-personal-item">
                    <h6>Фамилия:</h6>
                    <input
                      type="text"
                      name=""
                      id=""
                      placeholder="ЛИД"
                      disabled
                    />
                  </div>
                  <div class="acc-info-personal-item">
                    <h6>Почта:</h6>
                    <input
                      type="text"
                      name=""
                      id="userEmail"
                      placeholder="testlead1@gmail.com"
                      disabled
                    />
                  </div>
                  <div class="acc-info-personal-item">
                    <h6>Телефон:</h6>
                    <input
                      type="number"
                      name=""
                      id=""
                      placeholder="+7777038475"
                      disabled
                    />
                  </div>
                  <div class="acc-info-personal-item">
                    <h6>Страна:</h6>
                    <input
                      type="text"
                      name=""
                      id=""
                      placeholder="ТЕСТ"
                      disabled
                    />
                  </div>
                  <div class="acc-info-personal-item">
                    <h6>Город:</h6>
                    <input
                      type="text"
                      name=""
                      id=""
                      placeholder="ТЕСТ"
                      disabled
                    />
                  </div>
                  <div class="acc-info-personal-item">
                    <h6>Дата регистрации:</h6>
                    <input
                      type="text"
                      name=""
                      id=""
                      placeholder="02/07/2023"
                      disabled
                    />
                  </div>
                  <div class="acc-info-personal-item">
                    <h6>Комментарий:</h6>
                    <input
                      type="text"
                      name=""
                      id="comment"
                      placeholder="..."
                      disabled
                    />
                  </div>
                </div>
                {/* <script>
            // Retrieve the email from the URL parameter
            var urlParams = new URLSearchParams(window.location.search);
            var userEmail = urlParams.get('email');

            // Display the user's email in the <h1> element
            document.getElementById('userEmail').setAttribute('placeholder', userEmail);
          </script> */}
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
                    Редактировать
                  </button>
                  <button
                    id="acc-save-button"
                    class="hidden"
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
                  >
                    Cохранить
                  </button>
                </div>
              </div>
              <div id="account-transactions">
                <h3
                  style={{
                    borderBottom: "1px solid var(--main-bgc)",
                    fontSize: "25px",
                    paddingBottom: "25px",
                    paddingTop: "0",
                    marginTop: "40px",
                    marginBottom: "30px",
                    width: "80%",
                  }}
                >
                  Транзакции
                </h3>
                <div id="trans-his">
                  <table id="transactions-his-table">
                    <thead
                      class="sticky-header"
                      style={{
                        borderRadius: "5px",
                        border: "1px solid rgb(39, 39, 23)",
                      }}
                    >
                      <tr>
                        <th>ID</th>
                        <th>Тип</th>
                        <th>Сумма $</th>
                        <th>Метод</th>
                        <th>Статус</th>
                        <th>Дата</th>
                      </tr>
                    </thead>
                    <tbody id="transactions-t-body" class="table-body">
                      <tr>
                        <th>ID001</th>
                        <th>Депозит</th>
                        <th>100</th>
                        <th>VISA</th>
                        <th>Успешно</th>
                        <th>08/08/2022</th>
                      </tr>
                      <tr>
                        <th>ID002</th>
                        <th>Вывод</th>
                        <th>100</th>
                        <th>VISA</th>
                        <th>В обработке</th>
                        <th>11/08/2022</th>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div id="transaction-request">
                  {/* <h2
                    style={{
                      padding: "20px",
                      margin: "0",
                      marginTop: "3%",
                      width: "80%",
                      borderTop: "1px solid rgb(17, 17, 23)",
                    }}
                  >
                    Запрос на вывод
                  </h2> */}
                  {/* <input
                    type="number"
                    id="withdraw-amount"
                    placeholder="Сумма (USD)"
                  />
                  <input
                    type="number"
                    id="withdraw-card"
                    placeholder="Номер карты"
                  /> */}
                  <button
                    id="deposit-button"
                    onClick={() => setDepositModal(true)}
                  >
                    Депозит
                  </button>
                  {/* The Modal  */}
                  {depositModal && (
                    <div
                      class="modal show fade"
                      id="deposit-modal"
                      style={{
                        display: "flex",
                      }}
                    >
                      <div
                        class="modal-dialog modal-lg"
                        style={{ marginTop: "10%" }}
                      >
                        <div class="modal-content">
                          {/* Modal Header  */}
                          <div class="modal-header">
                            <h4 class="modal-title">Депозит</h4>
                            <button
                              type="button"
                              class="btn-close"
                              data-bs-dismiss="modal"
                              onClick={() => {
                                setDepositModal(false);
                              }}
                            ></button>
                          </div>

                          {/* Modal body  */}
                          <div
                            class="modal-body"
                            style={{ display: "contents", height: 500 }}
                          >
                            <div
                              id="modal-contents"
                              style={{ height: "500px", display: "inherit" }}
                            >
                              <div class="dropdown">
                                <button
                                  type="button"
                                  class="btn btn-secondary dropdown-toggle"
                                  data-toggle="dropdown"
                                >
                                  Выберите способ
                                </button>
                                <ul
                                  class="dropdown-menu"
                                  style={{ zIndex: 100000 }}
                                >
                                  <li>
                                    <a class="dropdown-item" href="#">
                                      VISA/MasterCard
                                    </a>
                                  </li>
                                  <li>
                                    <a class="dropdown-item" href="#">
                                      Crypto
                                    </a>
                                  </li>
                                  <li>
                                    <a class="dropdown-item" href="#">
                                      Другое
                                    </a>
                                  </li>
                                </ul>
                              </div>
                              <label for="">Номер счета:</label>
                              <input type="text" name="" id="" />
                              <label for="">Сумма:</label>
                              <input type="text" name="" id="" />
                            </div>
                          </div>

                          {/* Modal footer  */}
                          <div
                            class="modal-footer"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <button
                              id="accept-deposit"
                              type="button"
                              class="btn btn-primary"
                              data-bs-dismiss="modal"
                              style={{ color: "aquamarine" }}
                              onClick={() => {
                                setDepositModal(false);
                                setDepositSuccessModal(true);
                              }}
                            >
                              Подтвердить
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {/* The Success Modal  */}
                  {depositSuccessModal && (
                    <div
                      class="modal show fade"
                      id="dep-successModal"
                      style={{
                        display: "flex",
                      }}
                    >
                      <div class="modal-dialog">
                        <div class="modal-content">
                          {/* Modal Header  */}
                          <div class="modal-header">
                            <h4 class="modal-title">Успешно!</h4>
                            <button
                              type="button"
                              class="btn-close"
                              data-bs-dismiss="modal"
                              onClick={() => setDepositSuccessModal(false)}
                            ></button>
                          </div>

                          {/* Modal body  */}
                          <div class="modal-body">
                            Депозит принят в обработку! <br />
                            Ожидайте поступление средств на баланс в течении 15
                            мин.
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <button
                    id="withdraw-request-button"
                    onClick={() => setWithdrawlModal(true)}
                  >
                    Вывод
                  </button>
                  {/* The Modal  */}
                  {withdrawlModal && (
                    <div
                      class="modal show fade"
                      id="withdraw-modal"
                      style={{
                        display: "flex",
                      }}
                    >
                      <div
                        class="modal-dialog modal-lg"
                        style={{ marginTop: "10%" }}
                      >
                        <div class="modal-content">
                          {/* Modal Header  */}
                          <div class="modal-header">
                            <h4 class="modal-title">Вывод средств</h4>
                            <button
                              type="button"
                              class="btn-close"
                              data-bs-dismiss="modal"
                              onClick={() => {
                                setWithdrawlModal(false);
                              }}
                            ></button>
                          </div>

                          {/* Modal body  */}
                          <div
                            class="modal-body"
                            style={{ display: "contents", height: "500px" }}
                          >
                            <div
                              id="modal-contents"
                              style={{ height: "500px", display: "inherit" }}
                            >
                              <label for="">Номер карты:</label>
                              <input type="text" name="" id="" />
                              <label for="">Сумма:</label>
                              <input type="text" name="" id="" />
                            </div>
                          </div>

                          {/* Modal footer  */}
                          <div
                            class="modal-footer"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <button
                              id="accept-withdraw"
                              type="button"
                              class="btn btn-primary"
                              data-bs-dismiss="modal"
                              style={{ color: "aquamarine" }}
                              onClick={() => {
                                setWithdrawlModal(false);
                                setWithdrawlSuccessModal(true);
                              }}
                            >
                              Подтвердить
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {/* The Success Modal  */}
                  {withdrawlSuccessModal && (
                    <div
                      class="modal show fade"
                      id="wd-successModal"
                      style={{
                        display: "flex",
                      }}
                    >
                      <div class="modal-dialog">
                        <div class="modal-content">
                          {/* Modal Header  */}
                          <div class="modal-header">
                            <h4 class="modal-title">Успешно!</h4>
                            <button
                              type="button"
                              class="btn-close"
                              data-bs-dismiss="modal"
                              onClick={() => setWithdrawlSuccessModal(false)}
                            ></button>
                          </div>

                          {/* Modal body  */}
                          <div class="modal-body">
                            Запрос на вывод принят в обработку! <br />
                            Ожидайте деталей от менеджера.
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div id="account-mobile-buttons" class="hidden">
                <button>Личная информация</button>
                <button>Транзакции</button>
              </div>
            </div>
          )}
          {tab === "help" && (
            <div id="faq">
              <h1>Часто задаваемые вопросы</h1>
              <h2>Общие вопросы</h2>
              <dl>
                <dt>В: Что такое наша торговая платформа?</dt>
                <dd>
                  Ответ: Наша торговая платформа - это онлайн-система, которая
                  позволяет вам покупать и продавать различные финансовые
                  инструменты, такие как акции, облигации и криптовалюты.
                </dd>

                <dt>В: Как создать аккаунт?</dt>
                <dd>
                  Ответ: Для создания аккаунта нажмите кнопку
                  "Зарегистрироваться" на нашей домашней странице и следуйте
                  процессу регистрации.
                </dd>
              </dl>

              <h2>Управление аккаунтом</h2>
              <dl>
                <dt>В: Могу ли я иметь несколько торговых аккаунтов?</dt>
                <dd>
                  Ответ: Да, вы можете иметь несколько торговых аккаунтов у нас.
                  Свяжитесь с нашей службой поддержки для помощи в настройке
                  дополнительных аккаунтов.
                </dd>
              </dl>

              <h2>Торговля и инвестиции</h2>
              <dl>
                <dt>В: Как сделать сделку?</dt>
                <dd>
                  Ответ: Для размещения сделки войдите в свой аккаунт, выберите
                  финансовый инструмент, который вы хотите торговать, укажите
                  количество и другие детали, и нажмите "Разместить заказ".
                </dd>

                <dt>В: Каковы часы торговли?</dt>
                <dd>
                  Ответ: Наша торговая платформа работает круглосуточно, но
                  конкретные часы торговли для разных активов могут различаться.
                  Проверьте часы торговли актива на платформе.
                </dd>
              </dl>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
