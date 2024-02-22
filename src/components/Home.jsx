import React, { useEffect, useState, useCallback } from "react";
import logoIcon from "../assets/images/logo.png";
import languages from "../assets/flags/index.js";
import accPlaceholder from "../assets/images/acc-img-placeholder.png";
import {
  InformationCircle,
  ListCircle,
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
import { Form, Dropdown } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase";
import { Tabs, Tab } from "react-bootstrap";
import moment from "moment";
import SelectColumnsModal from "./SelectColumnsModal.jsx";
import depositsColumns from "./columns/depositsColumns.jsx";
import dealsColumns from "./columns/dealsColumns.jsx";
import {
  doc,
  setDoc,
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  updateDoc,
  serverTimestamp,
  orderBy,
} from "firebase/firestore";
import { toastify } from "../helper/toastHelper";
import DataTable from "react-data-table-component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faClose,
  faCaretDown,
  faCaretUp,
  faRefresh,
  faAngleLeft,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import EditOrderModal from "./EditOrderModal";
import DelOrderModal from "./DelOrderModal ";
import CancelOrderModal from "./CancelOrderModal";
import ReportModal from "./ReportModal";
import MessageModal from "./MessageModal";
import {
  updateOnlineStatus,
  fetchAllOrdersByUserId,
  getAllSymbols,
  addQuotesToUser,
  getDepositsByUser,
  getColumnsById,
} from "../helper/firebaseHelpers.js";
import { toast } from "react-toastify";
import MyBarChart from "./BarChart";
import { useDispatch, useSelector } from "react-redux";
import { setSymbolsState } from "../redux/slicer/symbolSlicer.js";
import { setOrdersState } from "../redux/slicer/orderSlicer.js";
import { setDepositsState } from "../redux/slicer/transactionSlicer.js";
import AddTradingSymbolModal from "./AddTradingSymbolModal.jsx";
import {
  calculateProfit,
  fillArrayWithEmptyRows,
  getAskValue,
  getBidValue,
} from "../helper/helpers.js";

// import rd3 from "react-d3-library";
// const BarChart = rd3.BarChart;
// const RD3Component = rd3.BarChart;

export default function HomeRu() {
  const [tab, setTab] = useState("trade");
  const [dealsTab, setDealsTab] = useState("activeTab");
  const [assetsTab, setAssetsTab] = useState("cryptoTab");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const dbSymbols = useSelector((state) => state.symbols);
  const [orderData, setOrderData] = useState({
    symbol: null,
    symbolValue: null,
    volume: 0,
    sl: null,
    tp: null,
  });
  const orders = useSelector((state) => state.orders);
  const deposits = useSelector((state) => state.deposits);
  const [uploadModal, setUploadModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [depositModal, setDepositModal] = useState(false);
  const [withdrawlModal, setWithdrawlModal] = useState(false);
  const [depositSuccessModal, setDepositSuccessModal] = useState(false);
  const [withdrawlSuccessModal, setWithdrawlSuccessModal] = useState(false);
  const [passwordShown, setPasswordShown] = useState(false);
  const [activeTab, setActiveTab] = useState(1);
  const [tabs, setTabs] = useState([1]);
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);
  const [isEditable, setIsEditable] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDelModalOpen, setIsDelModalOpen] = useState(false);
  const [showCancelOrderModal, setShowCancelOrderModal] = useState(false);
  const [currentUserId, setCurrentUserId] = useState("");
  const [selectedOrder, setSelectedOrder] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [enableOpenPrice, setEnableOpenPrice] = useState(false);
  const [openPriceValue, setOpenPriceValue] = useState(null);
  const [isTradingModal, setIsTradingModal] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: "",
    surname: "",
    email: "",
    phone: "",
    country: "",
    city: "",
    comment: "...",
    isUserEdited: false,
    allowTrading: false,
  });
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [messageModal, setMessageModal] = useState({
    show: false,
    title: "",
    message: "",
  });
  const [showColumnsModal, setShowColumnsModal] = useState(false);
  const [showColumns, setShowColumns] = useState({
    id: true,
    date: true,
    symbol: true,
    type: true,
    volume: true,
    openPrice: true,
    sltp: true,
    additionalParameters: true,
    pledge: true,
    currentPrice: true,
    profit: true,
    action: true,
  });

  const handleEditModal = (row) => {
    setSelectedOrder(row);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsDelModalOpen(false);
    setIsTradingModal(false);
    setMessageModal({
      show: false,
      title: "",
      message: "",
    });
  };
  const handleCloseReportModal = () => {
    setIsReportModalOpen(false);
  };
  const handleDelModal = () => {
    setIsDelModalOpen(true);
  };

  const handleCloseBtn = (row) => {
    setSelectedOrder(row);
    row.enableOpenPrice ? setShowCancelOrderModal(true) : handleDelModal();
  };

  const changeLanguage = (lng) => {
    setSelectedLanguage(lng);
    i18n.changeLanguage(lng);
    localStorage.setItem("lang", lng);
  };

  const checkCurrentUser = () => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserId(user.uid);
        console.log("User Already Login");
        navigate("/main");
      } else {
        signOut(auth)
          .then(() => {
            navigate("/");
          })
          .catch((error) => {
            console.log("Signout The User Exception");
          });
      }
    });
    return () => unsubscribe();
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
    let newProfile = { ...userProfile, isUserEdited: true };
    setIsEditable(false);
    try {
      const user = auth.currentUser;
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, newProfile);
    } catch (error) {
      console.error("Error saving data to Firestore:", error);
    }
  };
  const getUserDataByUID = () => {
    try {
      const userRef = doc(db, "users", auth.currentUser.uid);
      const unsubscribe = onSnapshot(userRef, (userDoc) => {
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserProfile(userData);
        } else {
          console.log("User document does not exist.");
          setUserProfile(null);
        }
      });
      return unsubscribe;
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const setOrders = useCallback((data) => {
    const mappedOrders = data.map((order) => ({
      ...order,
      sltp: `${+parseFloat(order?.sl)?.toFixed(2) || ""} / ${
        +parseFloat(order?.tp)?.toFixed(2) || ""
      }`,
    }));
    dispatch(setOrdersState(mappedOrders));
  }, []);

  const setDbSymbols = useCallback((data) => {
    dispatch(setSymbolsState(data));
  }, []);

  const setDeposits = useCallback((data) => {
    dispatch(setDepositsState(data));
  }, []);

  useEffect(() => {
    return checkCurrentUser();
  }, []);

  useEffect(() => {
    if (!currentUserId) return;

    const unsubUserData = getUserDataByUID();
    const unsubOrderData = fetchAllOrdersByUserId(
      auth.currentUser.uid,
      setOrders
    );

    if (!dbSymbols.length) getAllSymbols(setDbSymbols);

    const unsubDeposits = getDepositsByUser(currentUserId, setDeposits);

    getColumnsById(currentUserId, setShowColumns);

    return () => {
      unsubUserData();
      if (unsubOrderData) unsubOrderData();
      unsubDeposits();
    };
  }, [currentUserId]);

  const hanldeLogout = () => {
    signOut(auth)
      .then(async () => {
        await updateOnlineStatus(currentUserId, false);
        console.log("User signed out.");
        navigate("/");
      })
      .catch((error) => {
        console.log("Error", error);
      });
  };

  const handleDeleteAsset = async (asset) => {
    const newAssets = userProfile?.quotes.filter((quote) => quote !== asset);
    const res = await addQuotesToUser(currentUserId, newAssets);
    if (!res) {
      toast.error("Failed to delete symbol");
    } else {
      toast.success("Symbol deleted successfully");
    }
  };

  const customStylesAssetsTable = {
    rows: {
      style: {
        userSelect: "none",
        "*": {
          backgroundColor: "unset",
          color: "unset",
        },
      },
    },
  };

  const handleRowDoubleClick = (row) => {
    if (!row) return;
    const newDealButton = document.getElementById("newDealButton");
    let a = document.getElementById("newOrder");

    a.style.display = "none";
    newDealButton.classList.remove("active");
    newDealButton.removeAttribute("style");

    // setTab("trade");
    openOrderPanel();
    let newOr = {
      ...orderData,
      symbol: {
        value: row.symbol,
        label: row.symbol,
      },
    };
    setOrderData(newOr);
  };

  const [quoteSearch, setQuoteSearch] = useState("");

  const userQuotes = userProfile?.quotes || [];
  const userQuotesSymbols = userQuotes
    .map((q) => dbSymbols.find(({ id }) => id === q))
    .filter((s) => s);
  const filteredQuotesSymbols = quoteSearch
    ? userQuotesSymbols.filter(({ symbol }) =>
        symbol.toUpperCase().includes(quoteSearch.toUpperCase())
      )
    : userQuotesSymbols;

  // const crypto = [],
  //   currencies = [],
  //   stocks = [],
  //   commodities = [];
  // filteredQuotesSymbols.forEach((s) => {
  //   if (s?.settings?.group === "crypto" || !s?.settings) crypto.push(s);
  //   else if (s?.settings?.group === "currencies") currencies.push(s);
  //   else if (s?.settings?.group === "stocks") stocks.push(s);
  //   else if (s?.settings?.group === "commodities") commodities.push(s);
  // });

  const assetsColumns = [
    {
      name: t("symbol"),
      selector: (row) => (
        <div
          title={row?.settings?.description}
          onDoubleClick={() => handleRowDoubleClick(row)}
        >
          {row.symbol}
        </div>
      ),
      sortable: true,
    },
    {
      name: "Bid",
      selector: (row) => {
        if (!row) return;
        const { settings } = row;
        const isDirectPrice = settings.bidSpreadUnit === "$";
        const bidValue = getBidValue(
          row.price,
          settings.bidSpread,
          isDirectPrice
        );
        return (
          <div
            onDoubleClick={() => handleRowDoubleClick(row)}
            title={row?.settings?.description}
          >
            {bidValue}
          </div>
        );
      },
      sortable: true,
      compact: true,
    },
    {
      name: "Ask",
      selector: (row) => {
        if (!row) return;
        const { settings } = row;
        const isDirectPrice = settings.askSpreadUnit === "$";
        const askValue = getAskValue(
          row.price,
          settings.askSpread,
          isDirectPrice
        );
        return (
          <div
            onDoubleClick={() => handleRowDoubleClick(row)}
            title={row?.settings?.description}
          >
            {askValue}
          </div>
        );
      },
      sortable: true,
      compact: true,
    },
    {
      name: "",
      selector: (row) =>
        row && (
          <div
            onDoubleClick={() => handleRowDoubleClick(row)}
            title={row?.settings?.description}
          >
            <FontAwesomeIcon
              id="assetDeleteIcon"
              title="Delete"
              icon={faClose}
              onClick={() => handleDeleteAsset(row.id)}
            />
          </div>
        ),
      compact: true,
      grow: 0.5,
    },
  ];
  const conditionalRowStyles = [
    {
      when: (row) => row && row.symbol === orderData?.symbol?.value,
      style: {
        backgroundColor: "rgba(0, 255, 110, 0.952)",
        color: "#000",
      },
    },
    {
      when: (row) => !row || row.symbol !== orderData?.symbol?.value,
      style: {
        backgroundColor: "inherit",
        color: "#fff",
      },
    },
  ];

  const openOrderHistory = () => {
    const ordersHistoryButton = document.getElementById("ordersHistoryButton");
    const tableOrders = document.getElementById("orders");
    const tradeToToggle = document.getElementById("trade");
    const navButtons = document.getElementById("nav-buttons");
    const sideButtonTrade = document.getElementById("side-button-trade");
    const iconTrade = document.getElementById("side-button-trade-icon");
    const sideButtonAssets = document.getElementById("side-button-assets");
    const newDealButton = document.getElementById("newDealButton");

    // if (!ordersHistoryButton?.classList.contains("active")) {
    ordersHistoryButton?.classList.add("active");
    ordersHistoryButton.style.backgroundColor = "#1e222d";
    ordersHistoryButton.style.border = "1px solid rgb(0, 255, 110)";
    ordersHistoryButton.style.color = "rgb(0, 255, 110)";
    ordersHistoryButton.style.fontWeight = "bold";
    newDealButton.removeAttribute("style");
    tableOrders.style.maxHeight = "350px";
    tradeToToggle.style.display = "none";
    navButtons.setAttribute("style", "margin-top: 5px;");
    // } else {
    //   ordersHistoryButton?.classList.remove("active");
    //   ordersHistoryButton.removeAttribute("style");

    // tableOrders.style.maxHeight = "150px";
    // tradeToToggle.style.display = "flex";
    // sideButtonTrade?.classList.add("active");
    // iconTrade?.classList.add("active");
    // navButtons.setAttribute("style", "margin-top: 0;");

    // if (newDealButton?.classList.contains("active")) {
    //   if (sideButtonAssets?.classList.contains("active")) {
    //     tableOrders.style.maxHeight = "150px";
    //   } else {
    //     tableOrders.style.maxHeight = "115px";
    //   }
    // }
    // }
  };

  const openOrderPanel = () => {
    const newDealButton = document.getElementById("newDealButton");
    let a = document.getElementById("newOrder");
    const tableOrders = document.getElementById("orders");
    const sideButtonAssets = document.getElementById("side-button-assets");
    const ordersHistoryButton = document.getElementById("ordersHistoryButton");
    const tradeToToggle = document.getElementById("trade");
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
      // tableOrders.style.maxHeight = "115px";
    } else if (!ordersHistoryButton.classList.contains("active")) {
      a.style.display = "none";
      newDealButton.classList.remove("active");
      newDealButton.removeAttribute("style");

      // tableOrders.style.maxHeight = "150px";
    } else {
      tradeToToggle.style.display = "flex";
      ordersHistoryButton?.classList.remove("active");
      ordersHistoryButton.removeAttribute("style");
      newDealButton?.classList.add("active");
    }
    if (sideButtonAssets.classList.contains("active")) {
      // tableOrders.style.maxHeight = "150px";
    }
  };

  const getValue = (s) => {
    if (!s) return toast.error("No symbol");
    const symbol = dbSymbols?.find((el) => el.symbol == s.value);
    if (!symbol) return;
    const { fee = 0, feeUnit } = symbol.settings;
    const symbolFee = feeUnit === "$" ? fee : (symbol?.price / 100) * fee;
    setOrderData({
      ...orderData,
      symbol: s,
      symbolValue: symbol?.price,
      fee: symbolFee,
    });
  };

  const calculateTotalSum = () => {
    let sum = 0.0;
    const leverage = userProfile?.settings?.leverage || 1;
    if (orderData.symbol) {
      if (orderData.volume) {
        if (enableOpenPrice) {
          sum = orderData.volume * openPriceValue;
        } else {
          sum = orderData.volume * orderData.symbolValue;
        }
      }
    }
    const maintenanceMargin = userProfile?.settings?.maintenanceMargin || 0;
    const margin = sum * leverage * (maintenanceMargin / 100);
    return sum + margin;
  };
  const calculatedSum = calculateTotalSum();

  const placeOrder = async (e, type) => {
    e.preventDefault();

    const minDealSum = userProfile?.settings?.minDealSum;
    const maxDeals = userProfile?.settings?.maxDeals;

    if (!userProfile?.allowTrading)
      return toast.error("Trading is disabled for you.");
    if (pendingOrders.length >= maxDeals)
      return toast.error(`You can open maximum ${maxDeals} deals`);
    if (!orderData.symbol) return toast.error("Symbol is missing.");
    if (!orderData.volume || orderData.volume <= 0)
      return toast.error("Volume should be greater than 0.");
    if (calculatedSum < minDealSum)
      return toast.error(`The minimum deal sum is ${minDealSum} USDT`);
    if (calculatedSum > freeMargin) {
      return setMessageModal({
        show: true,
        title: "Error",
        message: "Not enough money to cover the Maintenance margin",
      });
    }
    if ((orderData.sl && !orderData.tp) || (!orderData.sl && orderData.tp)) {
      return toast.error("Make sure to fill both SL & TP values");
    }

    const symbol = dbSymbols.find((el) => el.symbol == orderData?.symbol.value);
    const {
      bidSpread,
      bidSpreadUnit,
      askSpread,
      askSpreadUnit,
      contractSize,
      group,
    } = symbol.settings;

    if (group === "commodities" && !symbol.settings?.closedMarket) {
      const today = moment();
      const weekDay = today.weekday();
      const hour = today.hour();
      if (weekDay == 0 || weekDay == 6 || hour < 9 || hour >= 23) {
        return toast.error("Commodities Market open on Mon-Fri: 9AM-23PM");
      }
    }

    if (calculatedSum > contractSize) {
      return toast.error(
        `Cannot open deal greater than ${contractSize}$ for this symbol`
      );
    }

    const closedPrice =
      type === "Buy"
        ? getBidValue(orderData.symbolValue, bidSpread, bidSpreadUnit === "$")
        : getAskValue(orderData.symbolValue, askSpread, askSpreadUnit === "$");

    if (
      type == "Buy" &&
      orderData.sl &&
      (orderData.sl >= closedPrice || orderData.tp <= orderData.symbolValue)
    ) {
      return toast.error(
        "To Buy SL should be less than the bid value and TP should be greater than the current value"
      );
    } else if (
      type == "Sell" &&
      orderData.sl &&
      (orderData.sl <= closedPrice || orderData.tp >= orderData.symbolValue)
    ) {
      return toast.error(
        "To Sell SL should be greater than the ask value and TP should be less than the current value"
      );
    }

    const form = document.getElementById("newOrderForm");

    const leverage = userProfile?.settings?.leverage ?? 1;
    const user = auth.currentUser;
    const userId = user.uid;

    const ordersCollectionRef = collection(db, "orders");

    const formattedDate = new Date().toLocaleDateString("en-US");
    const payload = {
      ...orderData,
      userId,
      type,
      status: "Pending",
      profit: 0,
      symbol: orderData?.symbol.value,
      volume: orderData.volume * parseFloat(leverage),
      sum: calculatedSum,
      enableOpenPrice,
      createdAt: formattedDate,
      createdTime: serverTimestamp(),
    };
    delete payload.fee;

    if (enableOpenPrice) payload.symbolValue = openPriceValue;

    try {
      await addDoc(ordersCollectionRef, payload);
      toastify("Order added to Database", "success");
      setOrderData({
        symbol: null,
        symbolValue: null,
        volume: 0,
        sl: null,
        tp: null,
      });
      form.reset();
    } catch (error) {
      console.error("Error adding order: ", error);
    }
  };
  // const customStyles = {
  //   option: (provided, state) => ({
  //     ...provided,
  //     backgroundColor: state.isSelected ? "blue" : "white",
  //     color: state.isSelected ? "white" : "black",
  //     "&:hover": {
  //       backgroundColor: "lightgray",
  //       color: "black",
  //     },
  //   }),
  //   singleValue: (provided) => ({
  //     ...provided,
  //     color: "white",
  //   }),
  //   control: (provided) => ({
  //     ...provided,
  //     backgroundColor: "white", // Change the background color to white
  //   }),
  // };
  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "blue" : "white",
      color: state.isSelected ? "white" : "black",
      "&:hover": {
        backgroundColor: "lightgray",
        color: "black",
      },
      opacity: state.isSelected ? "0.1" : "1",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "white",
      opacity: "0.9 !important",
      visibility: "visible",
    }),
    control: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "white" : "white",
      borderColor: state.isFocused ? "blue" : "gray",
    }),
  };

  const handleTradingModal = () => {
    setIsTradingModal(true);
  };

  // const bQuotesValues = async () => {
  //   try {
  //     const encodedSymbols = JSON.stringify(userQuotes);

  //     const response = await axios.get(
  //       "https://api.binance.us/api/v3/ticker/bookTicker?symbols=" +
  //         [encodedSymbols]
  //     );

  //     console.log(response.data, 8080);
  //     return response.data;
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const toggleTheme = () => {
    const root = document.getElementById("root");
    root.classList.toggle("light");
  };

  const closedOrders = orders.filter((order) => order.status !== "Pending");

  const pendingOrders = orders
    .filter((order) => order.status === "Pending")
    .map((order) => {
      const symbol = dbSymbols.find((s) => s.symbol === order.symbol);
      if (!symbol) return order;
      const {
        bidSpread,
        bidSpreadUnit,
        askSpread,
        askSpreadUnit,
        fee,
        feeUnit,
        swapShort,
        swapShortUnit,
        swapLong,
        swapLongUnit,
      } = symbol.settings;
      let swapValue = 0;
      if (order.createdTime) {
        const swap = order.type === "Buy" ? swapShort : swapLong;
        const swapUnit = order.type === "Buy" ? swapShortUnit : swapLongUnit;
        const jsDate = new Date(order.createdTime).setHours(0, 0, 0);
        const days = swap * moment().diff(jsDate, "d");
        swapValue = swapUnit === "$" ? swap * days : (order.sum / 100) * days;
      }

      const currentPrice =
        order.type === "Buy"
          ? getBidValue(symbol.price, bidSpread, bidSpreadUnit === "$")
          : getAskValue(symbol.price, askSpread, askSpreadUnit === "$");

      let spread;
      if (order.type === "Buy") {
        spread =
          bidSpreadUnit === "$"
            ? order.volume * bidSpread
            : (order.sum / 100) * bidSpread;
      } else {
        spread =
          askSpreadUnit === "$"
            ? order.volume * askSpread
            : (order.sum / 100) * askSpread;
      }
      const feeValue = feeUnit === "$" ? fee : (order.sum / 100) * fee;
      const pledge = order.sum;
      let profit = calculateProfit(
        order.type,
        currentPrice,
        order.symbolValue,
        order.volume
      );
      profit = profit - swapValue - feeValue;

      return {
        ...order,
        currentPrice,
        currentMarketPrice: parseFloat(symbol.price),
        enableOpenPrice: order.enableOpenPrice,
        pledge: parseFloat(pledge),
        spread: parseFloat(spread),
        swap: parseFloat(swapValue),
        fee: parseFloat(feeValue),
        profit,
      };
    });

  const ordersFee = [...pendingOrders, ...closedOrders].reduce(
    (p, v) => p + parseFloat(v.spread) + parseFloat(v.swap) + parseFloat(v.fee),
    0
  );

  const activeOrders = pendingOrders.filter((order) => !order.enableOpenPrice);
  const delayedOrders = pendingOrders.filter((order) => order.enableOpenPrice);

  const activeOrdersProfit = activeOrders.reduce((p, v) => p + +v.profit, 0);
  const closedOrdersProfit = closedOrders.reduce((p, v) => p + +v.profit, 0);

  const bonus = userProfile?.bonus;
	const allowBonus = userProfile?.settings?.allowBonus

  const calculateTotalBalance = () => {
    let balance = parseFloat(userProfile?.totalBalance) - ordersFee;
    if (closedOrdersProfit) balance += closedOrdersProfit;
    if (activeOrdersProfit) balance += activeOrdersProfit;
		if (allowBonus) balance += bonus;
    return balance;
  };

  const totalBalance = calculateTotalBalance();

  const calculateFreeMargin = () => {
    let freeMarginOpened = totalBalance;
    const dealSum = pendingOrders.reduce((p, v) => p + v.sum, 0);
    freeMarginOpened -= parseFloat(dealSum);
    return freeMarginOpened;
  };

  const freeMargin = calculateFreeMargin();

  const pledge = pendingOrders.reduce((p, v) => p + v.pledge, 0);

  const userLevel = userProfile?.settings?.level || 100;
  const level = pledge && (totalBalance / pledge) * (userLevel / 100);

  let potentialSL = 0,
    potentialTP = 0;
  if (orderData.symbolValue) {
    if (orderData.sl)
      potentialSL = orderData.volume * orderData.sl - orderData.fee;
    if (orderData.tp)
      potentialTP = orderData.volume * orderData.tp - orderData.fee;
  }

  return (
    <>
      {/* <div>
        <MyBarChart />
      </div> */}

      <div id="header">
        <div id="logo">
          <img
            id="logo-img"
            src={logoIcon}
            style={{ width: "45%", backgroundColor: "var(--main-bgc)" }}
            alt="logo"
          />
        </div>
        <div id="header-info">
          <div id="balance">
            <div className="balance-item">
              <h2 className="balance-title">{t("Equity")}:</h2>
              <input
                type="number"
                className={`balance-nums ${
                  totalBalance < 0
                    ? "text-danger"
                    : totalBalance == 0
                    ? "text-muted"
                    : ""
                }`}
                readOnly={true}
                value={+totalBalance?.toFixed(2)}
              />
            </div>
            <div className="balance-item">
              <h2 className="balance-title">{t("profit")}:</h2>
              <input
                type="number"
                className={`balance-nums ${
                  activeOrdersProfit < 0
                    ? "text-danger"
                    : activeOrdersProfit == 0
                    ? "text-muted"
                    : ""
                }`}
                readOnly={true}
                value={+activeOrdersProfit?.toFixed(2)}
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
                className={`balance-nums ${
                  freeMargin < 0
                    ? "text-danger"
                    : freeMargin == 0
                    ? "text-muted"
                    : ""
                }`}
                readOnly={true}
                value={+freeMargin?.toFixed(2)}
              />
            </div>
            <div className="balance-item">
              <h2 className="balance-title" id="">
                Margin:
              </h2>
              <input
                type="number"
                className={`balance-nums ${
                  pledge < 0 ? "text-danger" : pledge == 0 ? "text-muted" : ""
                }`}
                readOnly={true}
                value={+pledge?.toFixed(2)}
              />
            </div>
            <div className="balance-item">
              <h2 className="balance-title" id="">
                Level:
              </h2>
              <input
                type="text"
                className={`balance-nums ${
                  level < 0 ? "text-danger" : level == 0 ? "text-muted" : ""
                }`}
                readOnly={true}
                value={`${+level?.toFixed(2)}%`}
              />
            </div>
            <div
              id="balance-item-lang"
              className="balance-item d-flex flex-column gap-1 align-items-center justify-content-center"
            >
              <Dropdown>
                <Dropdown.Toggle variant="" id="dropdown-basic">
                  <img
                    src={languages[selectedLanguage]}
                    alt={selectedLanguage}
                    width={40}
                  />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {Object.keys(languages)
                    .filter((lang) => lang !== selectedLanguage)
                    .map((lang, i) => (
                      <Dropdown.Item key={i} onClick={() => changeLanguage(lang)}>
                        <img src={languages[lang]} alt={lang} width={40} />
                      </Dropdown.Item>
                    ))}
                </Dropdown.Menu>
              </Dropdown>
              <Form.Check
                type="switch"
                // checked={false}
                defaultChecked={true}
                onChange={(e) => toggleTheme()}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="d-flex h-100">
        <div id="sidebar">
          <div id="side-main-menu">
            <div id="side-trade" onClick={() => setTab("trade")}>
              <StatsChartSharp
                color={tab === "trade" ? "rgba(0, 255, 110, 0.952)" : "#ffffff"}
              />
              <button
                id="side-button-trade"
                className={`side-button ${tab === "trade" && " active"}`}
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
              <ListCircle
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
          <div
            id="trade-div"
            className={`${!(tab === "trade" || tab === "assets") && "d-none"}`}
          >
            <div id="trade">
              {tab === "assets" && (
                <div id="assets">
                  <div className="tradingWidget h-100">
                    <input
                      type="search"
                      placeholder="Search..."
                      className="w-100"
                      value={quoteSearch}
                      onChange={(e) => setQuoteSearch(e.target.value)}
                    />
                    <DataTable
                      columns={assetsColumns}
                      data={fillArrayWithEmptyRows(filteredQuotesSymbols, 10)}
                      highlightOnHover
                      pointerOnHover
                      customStyles={customStylesAssetsTable}
                      conditionalRowStyles={conditionalRowStyles}
                      // onRowDoubleClicked={handleRowDoubleClick}
                    />
                    <div className="text-center">
                      <button
                        className="btn btn-success"
                        onClick={() => {
                          handleTradingModal();
                        }}
                      >
                        + Add Symbol
                      </button>
                    </div>
                  </div>
                </div>
              )}
              <div id="chart">
                <ul className="nav nav-tabs" id="myTabs">
                  {tabs?.map((e, i) => (
                    <li key={i} className="nav-item">
                      <a
                        className={`nav-link ${
                          activeTab === i + 1 && "active"
                        }`}
                        data-bs-toggle="tab"
                        style={{
                          fontSize: "14px",
                          cursor: "pointer",
                          position: "relative",
                        }}
                        onClick={() => setActiveTab(i + 1)}
                      >
                        # {i + 1}
                        <div
                          onClick={(event) => {
                            event.stopPropagation();
                            let _tabs = [...tabs].filter(
                              (f, index) => index !== i
                            );
                            setTabs(_tabs);
                            setActiveTab(_tabs.length);
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
                  <li className="nav-item">
                    <button
                      id="addTabButton"
                      className="btn btn-primary"
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
                        // console.log({ _tabs, length: _tabs.length });
                      }}
                    >
                      +
                    </button>
                  </li>
                </ul>
                {tabs?.map((e, i) => {
                  return (
                    <TradingView
											key={i}
                      locale="en"
                      hide={activeTab === i + 1 ? false : true}
                      index={i}
                      selectedSymbol={orderData?.symbol?.value}
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
                  {isLoading ? (
                    <p>Loading....</p>
                  ) : (
                    <form id="newOrderForm">
                      <label htmlFor="symbol-input">{t("symbol")}</label>
                      <Select
                        id="symbol-input"
                        options={dbSymbols.map((f) => ({
                          value: f.symbol,
                          label: f.symbol,
                        }))}
                        onChange={(e) => getValue(e)}
                        styles={customStyles}
                        value={orderData.symbol}
                        selectedValue={orderData.symbol}
                      />
                      <label htmlFor="symbol-current-value">Price</label>
                      <div className="position-relative">
                        <input
                          type="number"
                          id="symbol-current-value"
                          name="symbolValue"
                          readOnly={true}
                          value={+orderData?.symbolValue}
                        />
                        <FontAwesomeIcon
                          cursor="pointer"
                          className="position-absolute ms-2"
                          style={{ top: 3 }}
                          onClick={() => getValue(orderData?.symbol)}
                          icon={faRefresh}
                        />
                      </div>

                      <label htmlFor="symbol-amount">Volume</label>
                      <input
                        type="number"
                        step={0.1}
                        id="symbol-amount"
                        name="volume"
                        onChange={(e) => {
                          const { value } = e.target;
                          setOrderData((p) => ({
                            ...p,
                            volume: !value ? "" : parseFloat(value),
                          }));
                        }}
                        value={orderData.volume}
                      />
                      <label className="mt-1">
                        Total: {+calculatedSum?.toFixed(2)} USDT
                      </label>
                      <label htmlFor="symbol-current-value">Open Price</label>
                      <div className="position-relative">
                        <input
                          type="number"
                          readOnly={!enableOpenPrice}
                          disabled={!enableOpenPrice}
                          className={!enableOpenPrice && "disabled"}
                          value={
                            enableOpenPrice
                              ? openPriceValue
                              : +orderData?.symbolValue
                          }
                          onChange={(e) => setOpenPriceValue(e.target.value)}
                        />
                        <input
                          className="position-absolute ms-2"
                          type="checkbox"
                          checked={enableOpenPrice}
                          onChange={(e) => {
                            setOpenPriceValue(
                              parseFloat(orderData.symbolValue)
                            );
                            setEnableOpenPrice(e.target.checked);
                          }}
                        />
                      </div>

                      <label htmlFor="stop-loss">SL</label>
                      <input
                        type="number"
                        id="stop-loss"
                        name="sl"
                        // required
                        onChange={(e) =>
                          setOrderData({ ...orderData, sl: e.target.value })
                        }
                        value={orderData?.sl}
                      />
                      <label className="mt-1">
                        Potential: {+parseFloat(potentialSL)?.toFixed(2)}
                      </label>
                      <label htmlFor="take-profit">TP</label>
                      <input
                        type="number"
                        id="take-profit"
                        name="tp"
                        // required
                        onChange={(e) =>
                          setOrderData({ ...orderData, tp: e.target.value })
                        }
                        value={orderData?.tp}
                      />
                      <label className="mt-1">
                        Potential: {+parseFloat(potentialTP)?.toFixed(2)}
                      </label>
                      <button
                        // className="newOrderButton"
                        // id="buyButton"
                        className="newOrderButton buyButton"
                        onClick={(e) => {
                          placeOrder(e, "Buy");
                          // console.log("Here");
                        }}
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
                  )}
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
                <button
                  // id="ordersHistoryButton"
                  onClick={() => {
                    setIsReportModalOpen(true);
                  }}
                >
                  {t("orderReport")}
                </button>
              </div>
              <div id="orders">
                <Tabs
                  activeKey={dealsTab}
                  onSelect={(k) => setDealsTab(k)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    setShowColumnsModal(true);
                  }}
                >
                  <Tab eventKey="activeTab" title="Active">
                    <DataTable
                      columns={dealsColumns({
                        t,
                        handleEditModal,
                        handleCloseBtn,
                        showColumns,
                      })}
                      data={fillArrayWithEmptyRows(activeOrders, 3)}
                      pagination
                      paginationPerPage={5}
                      paginationRowsPerPageOptions={[5, 10, 15, 20, 50]}
                      highlightOnHover
                      pointerOnHover
                      responsive
                      theme="dark"
                      className="custom-data-table"
                    />
                  </Tab>
                  <Tab eventKey="delayedTab" title="Delayed">
                    <DataTable
                      columns={dealsColumns({
                        t,
                        handleEditModal,
                        handleCloseBtn,
                        showColumns,
                      }).filter(({ name }) => name !== "Profit")}
                      data={fillArrayWithEmptyRows(delayedOrders, 3)}
                      pagination
                      paginationPerPage={5}
                      paginationRowsPerPageOptions={[5, 10, 15, 20, 50]}
                      highlightOnHover
                      pointerOnHover
                      responsive
                      theme="dark"
                      className="custom-data-table"
                    />
                  </Tab>
                </Tabs>
              </div>
            </div>
          </div>
          {tab === "account" && (
            <div id="account">
              <div id="account-profile">
                <img
                  id="acc-img-placeholder"
                  src={accPlaceholder}
                  alt="avatar"
                />
                <h4 style={{ margin: "0", "margin-bottom": "15px" }}>
                  Test Lead #0001
                </h4>
                <p
                  style={{ margin: "0", "margin-bottom": "15px", color: "red" }}
                >
                  {t("referralCode")} : {userProfile?.refCode}
                </p>
                <div id="acc-profile-main">
                  <div className="acc-profile-main-item">
                    <h6>{t("balance")} (USD):</h6>
                    <h6>{+parseFloat(userProfile.totalBalance)?.toFixed(2)}</h6>
                  </div>
                  <div className="acc-profile-main-item">
                    <h6>{t("Free")} (USD):</h6>
                    <h6>{+parseFloat(freeMargin - bonus)?.toFixed(2)}</h6>
                  </div>
                  <div className="acc-profile-main-item">
                    <h6>{t("Bonus")} (USD):</h6>
                    <h6>{+parseFloat(bonus)?.toFixed(2)}</h6>
                  </div>
                  <div className="acc-profile-main-item">
                    <h6>{t("deposited")} (USD):</h6>
                    <h6>
                      {deposits
                        .filter(({ type }) => type === "Deposit")
                        .reduce((p, { sum }) => p + +sum, 0)}
                    </h6>
                  </div>
                  <div className="acc-profile-main-item">
                    <h6>{t("withdrawn")} (USD):</h6>
                    <h6>
                      {deposits
                        .filter(({ type }) => type === "Withdraw")
                        .reduce((p, { sum }) => p + +sum, 0)}
                    </h6>
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
                      onChange={(e) => handleChange(e)}
                      readOnly={!isEditable}
                    />
                  </div>
                  <div className="acc-info-personal-item">
                    <h6>{t("surname")}</h6>
                    <input
                      type="text"
                      name="surname"
                      value={userProfile?.surname}
                      placeholder="Surname"
                      onChange={(e) => handleChange(e)}
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
                      value={userProfile?.phone}
                      placeholder="+7777038475"
                      onChange={(e) => handleChange(e)}
                      readOnly={!isEditable}
                    />
                  </div>
                  <div className="acc-info-personal-item">
                    <h6>{t("Password")}</h6>
                    <div className="position-relative">
                      <input
                        type={passwordShown ? "text" : "password"}
                        name="password"
                        value={userProfile?.password}
                        placeholder="Password"
                        onChange={(e) => handleChange(e)}
                        readOnly={!isEditable}
                      />
                      <FontAwesomeIcon
                        cursor="pointer"
                        className="position-absolute ms-1"
                        style={{ top: 4 }}
                        icon={passwordShown ? faEyeSlash : faEye}
                        onClick={() => setPasswordShown(!passwordShown)}
                      />
                    </div>
                  </div>
                  <div className="acc-info-personal-item">
                    <h6>{t("country")}</h6>
                    <input
                      type="text"
                      value={userProfile?.country}
                      name="country"
                      placeholder="Country"
                      onChange={(e) => handleChange(e)}
                      readOnly={!isEditable}
                    />
                  </div>
                  <div className="acc-info-personal-item">
                    <h6>{t("city")}</h6>
                    <input
                      type="text"
                      value={userProfile?.city}
                      name="city"
                      placeholder="City"
                      onChange={(e) => handleChange(e)}
                      readOnly={!isEditable}
                    />
                  </div>
                  <div className="acc-info-personal-item">
                    <h6>{t("dateRegister")}</h6>
                    <input
                      type="text"
                      value={moment(
                        userProfile?.createdAt?.seconds * 1000
                      )?.format("MM/DD/YYYY")}
                      name="dateRegister"
                      placeholder=""
                      // onChange={e=> handleChange(e)}
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
                      placeholder="Comment"
                      onChange={(e) => handleChange(e)}
                      readOnly={!isEditable}
                    />
                  </div>
                </div>
                <div id="acc-info-buttons">
                  <button
                    id="acc-save-button"
                    onClick={() =>
                      isEditable ? handleSaveClick() : setIsEditable(true)
                    }
                  >
                    {isEditable ? "Save" : "Edit"}
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
                  {t("transactions")}
                </h3>
                <div className="transactions-table">
                  <DataTable
                    columns={depositsColumns}
                    data={fillArrayWithEmptyRows(deposits, 5)}
                    customStyles={{
                      table: {
                        style: {
                          minHeight: "50vh",
                        },
                      },
                    }}
                    pagination
                    theme="dark"
                    paginationRowsPerPageOptions={[5, 10, 15, 20, 50]}
                    dense
                  />
                </div>
                <div id="transaction-request">
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
      {isModalOpen && (
        <EditOrderModal
          onClose={handleCloseModal}
          selectedOrder={selectedOrder}
        />
      )}
      {isDelModalOpen && (
        <DelOrderModal
          show={isDelModalOpen}
          onClose={handleCloseModal}
          selectedOrder={selectedOrder}
          symbols={dbSymbols}
          currentUserId={currentUserId}
        />
      )}
      {showCancelOrderModal && (
        <CancelOrderModal
          selectedOrder={selectedOrder}
          setShow={setShowCancelOrderModal}
        />
      )}
      {isReportModalOpen && (
        <ReportModal
          show={isReportModalOpen}
          onClose={handleCloseReportModal}
          userId={currentUserId}
        />
      )}
      {messageModal?.show && (
        <MessageModal
          show={messageModal?.show}
          onClose={handleCloseModal}
          title={messageModal?.title}
          message={messageModal?.message}
        />
      )}

      {isTradingModal && (
        <AddTradingSymbolModal
          show={isTradingModal}
          symbols={dbSymbols}
          handleCloseModal={handleCloseModal}
          userQuotes={userQuotes}
          userId={currentUserId}
        />
      )}

      {showColumnsModal && (
        <SelectColumnsModal
          userId={currentUserId}
          setModal={setShowColumnsModal}
          columns={showColumns}
          setColumns={setShowColumns}
        />
      )}
    </>
  );
}
