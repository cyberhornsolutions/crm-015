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
  updateUserById,
} from "../helper/firebaseHelpers.js";
import { toast } from "react-toastify";
import MyBarChart from "./BarChart.js";
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
import AccountModal from "./AccountModal.jsx";

// import rd3 from "react-d3-library";
// const BarChart = rd3.BarChart;
// const RD3Component = rd3.BarChart;

export default function HomeRu() {
  const [gameConfigs] = useState(() => {
    const obj = localStorage.getItem("GAME_CONFIGS");
    return obj
      ? JSON.parse(obj)
      : {
          showNewOrderPanel: false,
          tab: "trade",
          activeTab: "",
          tabs: [],
          isReportModalOpen: false,
          showHistoryPanel: false,
        };
  });
  const [tab, setTab] = useState(gameConfigs.tab || "trade");
  const [dealsTab, setDealsTab] = useState("activeTab");
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const dbSymbols = useSelector((state) => state.symbols);
  const [orderData, setOrderData] = useState({
    symbol: null,
    symbolValue: null,
    symbolId: null,
    symbolSettings: null,
    volume: 0,
    sl: null,
    tp: null,
    fee: null,
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
  const [activeTab, setActiveTab] = useState(gameConfigs.activeTab || "Gold");
  const [tabs, setTabs] = useState([]);

  const [showNewOrderPanel, setShowNewOrderPanel] = useState(
    gameConfigs.showNewOrderPanel || false
  );
  const [showHistoryPanel, setShowHistoryPanel] = useState(
    gameConfigs.showHistoryPanel || false
  );
  const [theme, setTheme] = useState(
    () => localStorage.getItem("THEME") || "dark"
  );
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
  const [activeAccountNo, setActiveAccountNo] = useState(null);

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
  const [isReportModalOpen, setIsReportModalOpen] = useState(
    gameConfigs.isReportModalOpen || false
  );
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
    margin: true,
    currentPrice: true,
    profit: true,
    action: true,
  });
  const [showAccountModal, setShowAccountModal] = useState(false);

  const accounts = userProfile.accounts || [];
  const defaultAccount = accounts.find((account) => account.isDefault) || {};

  const accountDeposits = deposits.filter(
    ({ account_no }) => account_no === defaultAccount?.account_no
  );

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
      } else {
        signOut(auth)
          .then(() => {
            localStorage.clear();
            window.location.href = "/";
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
  const [selectedKey, setSelectedKey] = useState(null);

  const getUserDataByUID = () => {
    try {
      const userRef = doc(db, "users", auth.currentUser.uid);
      const unsubscribe = onSnapshot(userRef, (userDoc) => {
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserProfile({ id: userDoc.id, ...userData });
          console.log(userData.accounts);
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
    if (theme !== "dark") {
      const root = document.querySelector("html");
      root.setAttribute("data-bs-theme", "light");
      root.classList.add("light");
    }

    return checkCurrentUser();
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "GAME_CONFIGS",
      JSON.stringify({
        showNewOrderPanel,
        tab,
        activeTab,
        tabs,
        showNewOrderPanel,
        showHistoryPanel,
        isReportModalOpen,
      })
    );
  }, [
    showNewOrderPanel,
    tab,
    activeTab,
    tabs,
    showNewOrderPanel,
    showHistoryPanel,
    isReportModalOpen,
  ]);

  useEffect(() => {
    if (!dbSymbols.length) return;
    if (!orderData.symbol) {
      setTabs(
        gameConfigs?.tabs?.length ? gameConfigs.tabs : [dbSymbols[0]?.symbol]
      );
      if (gameConfigs.activeTab)
        getValue({
          value: gameConfigs.activeTab,
          label: gameConfigs.activeTab,
        });
      else
        getValue({
          value: dbSymbols[0]?.symbol,
          label: dbSymbols[0]?.symbol,
        });
    } else {
      getValue(orderData.symbol);
    }
  }, [dbSymbols.length]);

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

  const hanldeLogout = async () => {
    await updateOnlineStatus(currentUserId, false);
    await signOut(auth)
      .then(async () => {
        localStorage.clear();
        // window.location.href = "/";
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
    headCells: {
      style: {
        fontSize: "0.9rem",
      },
    },
    rows: {
      style: {
        userSelect: "none",
        "*": {
          backgroundColor: "unset",
          color: "unset",
        },
        fontSize: "0.9rem",
        // minHeight: 36,
        // height: 36,
      },
    },
  };

  const customStylesOnDeals = {
    headCells: {
      style: {
        fontSize: "0.9rem",
      },
    },
    rows: {
      style: {
        "*": {
          backgroundColor: "unset",
          color: "unset",
        },
        fontSize: "0.9rem",
        // minHeight: 36,
        // height: 36,
      },
    },
    pagination: {
      // pageButtonsStyle: {
      //   border: "thin solid red",
      // },
      style: {
        fontSize: "1rem",
        minHeight: "min-content",
        height: "min-content",
        // button: {
        //   border: "thin solid blue",
        // },
      },
    },
  };

  const conditionalRowStylesOnOrders = [
    {
      when: (row) => row && row.id === selectedOrder.id,
      style: {
        backgroundColor: "var(--main-numbersc)",
        color: "#000",
      },
    },
    {
      when: (row) => !row || row.id !== selectedOrder.id,
      style: {
        backgroundColor: "inherit",
        color: "inherit",
      },
    },
  ];

  const handleRowDoubleClick = (row) => {
    if (!row) return;
    openNewChartTab(row.symbol);
    getValue({
      value: row.symbol,
      label: row.symbol,
    });
    if (!showNewOrderPanel) setShowNewOrderPanel(true);
  };

  const handleDoubleClickOnOrders = (row, e) => {
    if (!row) return;
    setSelectedOrder(row);
    openNewChartTab(row.symbol);
    getValue({
      value: row.symbol,
      label: row.symbol,
    });
  };

  const openNewChartTab = (newTab) => {
    const findTab = tabs.find((tab) => tab === newTab);
    if (!findTab) {
      const _tabs = [...tabs, newTab];
      setTabs(_tabs);
    }
    setActiveTab(newTab);
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
        const isDirectPrice = settings?.bidSpreadUnit === "$";
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
            {settings?.group === "currencies"
              ? +parseFloat(bidValue)?.toFixed(6)
              : +parseFloat(bidValue)?.toFixed(2)}
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
            {settings?.group === "currencies"
              ? +parseFloat(askValue)?.toFixed(6)
              : +parseFloat(askValue)?.toFixed(2)}
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
              className="ms-1 p-2 rounded"
              title="Delete"
              icon={faClose}
              onClick={() => handleDeleteAsset(row.id)}
            />
          </div>
        ),
      compact: true,
      // grow: 0.5,
      minWidth: "40px",
    },
  ];
  const conditionalRowStyles = [
    {
      when: (row) => row && row.symbol === orderData?.symbol?.value,
      style: {
        backgroundColor: "var(--main-numbersc)",
        color: "#000",
      },
    },
    {
      when: (row) => !row || row.symbol !== orderData?.symbol?.value,
      style: {
        backgroundColor: "inherit",
        color: theme === "dark" ? "#fff" : "unset",
      },
    },
  ];

  const openOrderHistory = () => {
    setShowHistoryPanel((p) => !p);
    if (showNewOrderPanel) setShowNewOrderPanel(false);
  };

  const openOrderPanel = () => {
    if (showHistoryPanel) setShowHistoryPanel(false);
    setShowNewOrderPanel((p) => !p);
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
      symbolId: symbol.id,
      symbolValue: symbol?.price,
      symbolSettings: symbol?.settings,
      fee: symbolFee,
    });
  };

  const calculateTotalSum = () => {
    let sum = 0.0;
    const settings = orderData?.symbolSettings || {};
    const leverage = userProfile?.settings?.leverage || 1;
    const lot = settings.group === "commodities" ? +settings.lot || 1 : 1;
    if (orderData.symbol) {
      if (orderData.volume) {
        if (enableOpenPrice) {
          sum = orderData.volume * lot * openPriceValue;
        } else {
          sum = orderData.volume * lot * orderData.symbolValue;
        }
      }
    }
    const maintenanceMargin = settings.maintenanceMargin;
    if (leverage > 1 && maintenanceMargin > 0) {
      return (sum / leverage) * (maintenanceMargin / 100);
    }
    return +parseFloat(sum)?.toFixed(6);
  };
  const calculatedSum = calculateTotalSum();

  const placeOrder = async (e, type) => {
    e.preventDefault();
    if (!defaultAccount)
      return setMessageModal({
        show: true,
        title: "Error",
        message: "You need to create an account number to start trading",
      });

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

    const {
      bidSpread,
      bidSpreadUnit,
      askSpread,
      askSpreadUnit,
      fee,
      feeUnit,
      contractSize,
      group,
      closedMarket,
      maintenanceMargin,
      lot,
    } = orderData.symbolSettings;

    const volume =
      group === "commodities" && +lot >= 1
        ? +orderData.volume * +lot
        : +orderData.volume;

    if (group === "commodities" && !closedMarket) {
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

    let closedPrice =
      type === "Buy"
        ? getBidValue(orderData.symbolValue, bidSpread, bidSpreadUnit === "$")
        : getAskValue(orderData.symbolValue, askSpread, askSpreadUnit === "$");

    closedPrice =
      group === "currencies"
        ? +parseFloat(closedPrice)?.toFixed(6)
        : +parseFloat(closedPrice)?.toFixed(2);

    if (
      type == "Buy" &&
      ((orderData.sl && orderData.sl >= closedPrice) ||
        (orderData.tp && orderData.tp <= orderData.symbolValue))
    ) {
      return toast.error(
        "To Buy SL should be less than the bid value and TP should be greater than the current value"
      );
    } else if (
      type == "Sell" &&
      ((orderData.sl && orderData.sl <= closedPrice) ||
        (orderData.tp && orderData.tp >= orderData.symbolValue))
    ) {
      return toast.error(
        "To Sell SL should be greater than the ask value and TP should be less than the current value"
      );
    }

    let spread;
    if (type === "Buy") {
      spread =
        bidSpreadUnit === "$"
          ? volume * bidSpread
          : volume * orderData.symbolValue * (bidSpread / 100);
    } else {
      spread =
        askSpreadUnit === "$"
          ? volume * askSpread
          : volume * orderData.symbolValue * (askSpread / 100);
    }

    let feeValue =
      feeUnit === "$" ? parseFloat(fee) : (calculatedSum / 100) * fee;
    feeValue = +parseFloat(feeValue)?.toFixed(6);

    let profit =
      calculateProfit(type, closedPrice, orderData.symbolValue, volume) -
      feeValue;

    const leverage = userProfile?.settings?.leverage;
    if (leverage > 1 && maintenanceMargin > 0) {
      profit = (profit / leverage) * (maintenanceMargin / 100);
    }

    const form = document.getElementById("newOrderForm");

    const user = auth.currentUser;
    const userId = user.uid;

    const ordersCollectionRef = collection(db, "orders");

    const formattedDate = new Date().toLocaleDateString("en-US");
    const dealPayload = {
      ...orderData,
      userId,
      type,
      status: "Pending",
      profit:
        group === "currencies"
          ? +parseFloat(profit).toFixed(6)
          : +parseFloat(profit).toFixed(2),
      currentPrice: closedPrice,
      currentMarketPrice: parseFloat(orderData?.symbolValue),
      symbol: orderData?.symbol.value,
      volume,
      sum: calculatedSum,
      fee: feeValue,
      swap: 0,
      account_no: defaultAccount?.account_no,
      spread,
      enableOpenPrice,
      createdAt: formattedDate,
      createdTime: serverTimestamp(),
    };
    delete dealPayload.symbolSettings;

    if (enableOpenPrice) {
      dealPayload.symbolValue = openPriceValue;
      dealPayload.profit = 0;
    }

    const userPayload = {
      accounts: userProfile.accounts?.map((ac) => {
        if (ac.account_no !== defaultAccount?.account_no) return ac;
        return {
          ...ac,
          totalBalance: parseFloat(ac.totalBalance - feeValue - spread),
          totalMargin: +totalMargin + +calculatedSum,
          activeOrdersProfit: +activeOrdersProfit + +dealPayload.profit,
        };
      }),
    };

    if (
      allowBonus &&
      calculatedSum > freeMargin - bonus &&
      userPayload.totalBalance < 0
    ) {
      const spentBonus = Math.abs(userPayload.totalBalance);
      if (bonus < spentBonus) {
        return setMessageModal({
          show: true,
          title: "Error",
          message: "Not enough bonus to cover the deal fee",
        });
      }
      userPayload.totalBalance = userPayload.totalBalance + spentBonus;
      userPayload.bonus = +parseFloat(bonus - spentBonus)?.toFixed(2);
      userPayload.bonusSpent = +parseFloat(bonusSpent + spentBonus)?.toFixed(2);
    }

    try {
      console.log("dealPayload", dealPayload);
      await addDoc(ordersCollectionRef, dealPayload);
      await updateUserById(currentUserId, userPayload);
      toastify("Order added to Database", "success");
      setOrderData({
        symbol: null,
        symbolValue: null,
        symbolId: null,
        symbolSettings: null,
        volume: 0,
        sl: null,
        tp: null,
        fee: null,
      });
      form.reset();
    } catch (error) {
      console.error("Error adding order: ", error);
    }
  };

  const handleTradingModal = () => {
    setIsTradingModal(true);
  };

  const toggleTheme = () => {
    const changedTheme = theme === "dark" ? "light" : "dark";
    const root = document.querySelector("html");
    root.setAttribute("data-bs-theme", changedTheme);
    root.classList.toggle("light");
    setTheme(changedTheme);
    localStorage.setItem("THEME", changedTheme);
  };

  const pendingOrders = orders.filter(
    (order) =>
      order.status === "Pending" &&
      order.account_no === defaultAccount?.account_no
  );

  const activeOrders = pendingOrders.filter((order) => !order.enableOpenPrice);
  const delayedOrders = pendingOrders.filter((order) => order.enableOpenPrice);

  const activeOrdersProfit =
    parseFloat(defaultAccount?.activeOrdersProfit) || 0;
  const activeOrdersSwap = parseFloat(defaultAccount?.activeOrdersSwap) || 0;

  const bonus = parseFloat(defaultAccount?.bonus);
  const bonusSpent = parseFloat(defaultAccount?.bonusSpent) || 0;
  const allowBonus = userProfile?.settings?.allowBonus;

  const calculateEquity = () => {
    let equity =
      parseFloat(defaultAccount?.totalBalance) +
      activeOrdersProfit -
      activeOrdersSwap;
    if (allowBonus) equity += bonus;
    return equity;
  };

  const equity = calculateEquity();

  const calculateFreeMargin = () => {
    const dealSum = pendingOrders.reduce((p, v) => p + +v.sum, 0);
    return equity - dealSum;
  };

  const freeMargin = calculateFreeMargin();

  const totalMargin = parseFloat(defaultAccount?.totalMargin);

  const userLevel = parseFloat(userProfile?.settings?.level) || 100;
  const level =
    totalMargin > 0 ? (equity / totalMargin) * (userLevel / 100) : 0;

  const totalBalance = freeMargin + totalMargin + bonus;

  let potentialSL = 0,
    potentialTP = 0;
  if (orderData.symbolValue) {
    const settings = orderData?.symbolSettings || {};
    const lot = settings.group === "commodities" ? +settings.lot || 1 : 1;
    if (orderData.sl)
      potentialSL = orderData.volume * lot * orderData.sl - orderData.fee;
    if (orderData.tp)
      potentialTP = orderData.volume * lot * orderData.tp - orderData.fee;
  }

  const handleAccountChange = async (e) => {
    const updatedAccounts = userProfile?.accounts?.map((account) => ({
      ...account,
      isDefault: e.value === account.account_no,
    }));

    try {
      await updateUserById(userProfile.id, { accounts: updatedAccounts });
    } catch (error) {
      console.error("Error updating user profile:", error);
    }
  };

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
                  equity < 0 ? "text-danger" : equity == 0 ? "text-muted" : ""
                }`}
                readOnly={true}
                value={+parseFloat(equity)?.toFixed(2)}
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
                value={+parseFloat(activeOrdersProfit)?.toFixed(2)}
              />
            </div>
            <div className="balance-item">
              <h2 className="balance-title">{t("freeMargin")}:</h2>
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
                value={+parseFloat(freeMargin)?.toFixed(2)}
              />
            </div>
            <div className="balance-item">
              <h2 className="balance-title">Margin:</h2>
              <input
                type="number"
                className={`balance-nums ${
                  totalMargin < 0
                    ? "text-danger"
                    : totalMargin == 0
                    ? "text-muted"
                    : ""
                }`}
                readOnly={true}
                value={+parseFloat(totalMargin)?.toFixed(2)}
              />
            </div>
            <div className="balance-item">
              <h2 className="balance-title">Level:</h2>
              <input
                type="text"
                className={`balance-nums ${
                  level < 0 ? "text-danger" : level == 0 ? "text-muted" : ""
                }`}
                readOnly={true}
                value={`${+parseFloat(level)?.toFixed(2)}%`}
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
                    width={28}
                  />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {Object.keys(languages)
                    .filter((lang) => lang !== selectedLanguage)
                    .map((lang, i) => (
                      <Dropdown.Item
                        key={i}
                        onClick={() => changeLanguage(lang)}
                      >
                        <img src={languages[lang]} alt={lang} width={40} />
                      </Dropdown.Item>
                    ))}
                </Dropdown.Menu>
              </Dropdown>
              <Form.Check
                type="switch"
                checked={theme === "dark"}
                onChange={toggleTheme}
              />
            </div>
          </div>
        </div>
      </div>
      <div id="main-container">
        <div id="sidebar">
          <div id="side-main-menu">
            <div className="side-btn" onClick={() => setTab("trade")}>
              <StatsChartSharp
                color={
                  tab === "trade"
                    ? "var(--main-numbersc)"
                    : theme === "dark"
                    ? "#fff"
                    : "#000"
                }
              />
              <button
                id="side-button-trade"
                className={`side-button ${tab === "trade" && " active"}`}
              >
                {t("trade")}
              </button>
            </div>
            <div
              className="side-btn"
              onClick={() => {
                setTab(tab === "assets" ? "trade" : "assets");
              }}
            >
              {/* <ion-icon id="side-button-assets-icon" name="list" /> */}
              <ListCircle
                color={
                  tab === "assets"
                    ? "var(--main-numbersc)"
                    : theme === "dark"
                    ? "#fff"
                    : "#000"
                }
              />
              <button
                id="side-button-assets"
                className={`side-button ${tab === "assets" && " active"}`}
              >
                {t("assets")}
              </button>
            </div>
            <div className="side-btn" onClick={() => setTab("account")}>
              {/* <ion-icon id="side-button-account-icon" name="person-circle" /> */}
              <PersonCircle
                color={
                  tab === "account"
                    ? "var(--main-numbersc)"
                    : theme === "dark"
                    ? "#fff"
                    : "#000"
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
                color={
                  tab === "help"
                    ? "var(--main-numbersc)"
                    : theme === "dark"
                    ? "#fff"
                    : "#000"
                }
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
              <LogOut color={theme === "dark" ? "#fff" : "#000"} />
              <button id="logout-button" className="side-out-button">
                {t("exit")}
              </button>
            </div>
          </div>
        </div>
        <div id="content">
          <div
            id="trade-div"
            className={`h-100 p-2  ${
              tab === "trade" || tab === "assets" ? "" : "d-none"
            }`}
          >
            <div id="trade" className={showHistoryPanel ? "d-none" : ""}>
              <div
                id="assets"
                className={`h-100 px-1 ${tab === "assets" ? "" : "d-none"}`}
              >
                <input
                  type="search"
                  placeholder="Search..."
                  className="w-100"
                  // style={{ height: 30 }}
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
                  theme={theme}
                  dense
                  // onRowDoubleClicked={handleRowDoubleClick}
                />
                <div className="text-center">
                  <button
                    className="newOrderButton btn btn-success border-0"
                    onClick={() => {
                      handleTradingModal();
                    }}
                  >
                    + Add Symbol
                  </button>
                </div>
              </div>
              <div id="chart" className="rounded">
                <ul className="nav nav-tabs">
                  {tabs?.map((tab) => (
                    <li className="nav-item" key={tab}>
                      <a
                        className={`nav-link ${activeTab === tab && "active"}`}
                        data-bs-toggle="tab"
                        style={{
                          cursor: "pointer",
                          position: "relative",
                        }}
                        onClick={() => setActiveTab(tab)}
                      >
                        {tab}
                        <CloseCircleOutline
                          onClick={(e) => {
                            e.stopPropagation();
                            const _tabs = tabs.filter((t) => t !== tab);
                            setTabs(_tabs);
                            setActiveTab(_tabs.at(-1));
                          }}
                          style={{
                            position: "absolute",
                            top: "-10px",
                          }}
                        />
                      </a>
                    </li>
                  ))}
                  <li className="nav-item">
                    <button
                      id="addTabButton"
                      className="btn border-0"
                      style={{
                        color: "inherit",
                      }}
                      // onClick={addChart}
                      onClick={() => openNewChartTab(orderData?.symbol?.value)}
                    >
                      +
                    </button>
                  </li>
                </ul>
                {tabs?.map((tab, i) => {
                  return (
                    <TradingView
                      key={tab}
                      locale="en"
                      hide={activeTab !== tab}
                      index={i}
                      selectedSymbol={tab}
                      plotLine={selectedOrder.symbolValue}
                      theme={theme}
                    />
                  );
                })}
              </div>

              <div id="newOrder" className={showNewOrderPanel ? "" : "d-none"}>
                <div id="newOrderData">
                  <h6>{t("newDeal")}</h6>
                  <form id="newOrderForm">
                    <label htmlFor="symbol-input">{t("symbol")}</label>
                    <Select
                      id="symbol-input"
                      options={dbSymbols.map((f) => ({
                        value: f.symbol,
                        label: f.symbol,
                      }))}
                      onChange={(e) => getValue(e)}
                      styles={{
                        container: (provided, state) => ({
                          ...provided,
                          minWidth: 130,
                        }),
                        dropdownIndicator: (provided, state) => ({
                          ...provided,
                          paddingBlock: 0,
                        }),
                        option: (provided, state) => ({
                          ...provided,
                          cursor: "pointer",
                          backgroundColor: state.isSelected
                            ? "var(--main-numbersc)"
                            : "unset",
                          color: state.isSelected
                            ? "black"
                            : "var(--main-input-textc)",
                          "&:hover": {
                            backgroundColor: state.isSelected
                              ? ""
                              : "var(--bs-body-bg)",
                          },
                        }),
                        singleValue: (provided) => ({
                          ...provided,
                          color: "var(--main-input-textc)",
                        }),
                        control: (provided) => ({
                          ...provided,
                          backgroundColor: "inherit",
                          minHeight: 24,
                        }),
                      }}
                      theme={(theme) => {
                        return {
                          ...theme,
                          colors: {
                            ...theme.colors,
                            primary: "var(--main-input-textc)",
                          },
                        };
                      }}
                      isSearchable={false}
                      value={orderData.symbol}
                      selectedValue={orderData.symbol}
                    />
                    <label htmlFor="symbol-current-value">Price</label>
                    <div className="position-relative">
                      <input
                        type="number"
                        id="symbol-current-value"
                        name="symbolValue"
                        readOnly={!enableOpenPrice}
                        disabled={!enableOpenPrice}
                        className={enableOpenPrice ? "" : "disabled"}
                        value={
                          enableOpenPrice
                            ? openPriceValue
                            : +orderData?.symbolValue
                        }
                        onChange={(e) => setOpenPriceValue(e.target.value)}
                      />
                      <FontAwesomeIcon
                        cursor="pointer"
                        className="position-absolute ms-2"
                        style={{ top: 3 }}
                        onClick={() => {
                          getValue(orderData?.symbol);
                          setOpenPriceValue(+orderData?.symbolValue);
                        }}
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
                    <div className="d-flex gap-3 mt-2">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          id="market"
                          checked={!enableOpenPrice}
                          onClick={(e) => setEnableOpenPrice(false)}
                        />
                        <label
                          className="form-check-label m-0"
                          htmlFor="market"
                        >
                          Market
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          id="limit"
                          checked={enableOpenPrice}
                          onClick={(e) => {
                            if (openPriceValue !== orderData.symbolValue)
                              setOpenPriceValue(
                                parseFloat(orderData.symbolValue)
                              );
                            setEnableOpenPrice(true);
                          }}
                        />
                        <label className="form-check-label m-0" htmlFor="limit">
                          Limit
                        </label>
                      </div>
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
                      className="newOrderButton btn btn-success mt-1 rounded border-0"
                      onClick={(e) => {
                        placeOrder(e, "Buy");
                      }}
                      type="submit"
                    >
                      {t("buy")}
                    </button>
                    <button
                      onClick={(e) => placeOrder(e, "Sell")}
                      type="submit"
                      className="newOrderButton btn btn-danger mt-2 rounded border-0"
                    >
                      {t("sell")}
                    </button>
                  </form>
                </div>
              </div>
            </div>
            <div
              id="history-div"
              className="pt-3"
              style={{ height: "38%", overflow: "auto" }}
            >
              <div
                id="nav-buttons"
                className="d-flex align-items-center justify-content-around"
              >
                <button
                  id="newDealButton"
                  className={showNewOrderPanel ? "active" : ""}
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
                  id="ordersHistoryButton"
                  className={showHistoryPanel ? "active" : ""}
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
              <div id="orders" className="rounded">
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
                      paginationTotalRows={activeOrders.length}
                      paginationComponentOptions={{
                        noRowsPerPage: 1,
                        // rowsPerPageText: "ok",
                        // rangeSeparatorText: "ok"
                      }}
                      paginationPerPage={5}
                      // paginationRowsPerPageOptions={[5, 10, 15, 20, 50]}
                      highlightOnHover
                      pointerOnHover
                      responsive
                      dense
                      theme={theme}
                      onRowDoubleClicked={handleDoubleClickOnOrders}
                      customStyles={customStylesOnDeals}
                      conditionalRowStyles={conditionalRowStylesOnOrders}
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
                      paginationTotalRows={delayedOrders.length}
                      paginationComponentOptions={{
                        noRowsPerPage: 1,
                      }}
                      // paginationRowsPerPageOptions={[5, 10, 15, 20, 50]}
                      highlightOnHover
                      pointerOnHover
                      responsive
                      dense
                      theme={theme}
                      // onRowDoubleClicked={handleDoubleClickOnOrders}
                      customStyles={customStylesOnDeals}
                      conditionalRowStyles={conditionalRowStylesOnOrders}
                    />
                  </Tab>
                </Tabs>
              </div>
            </div>
          </div>
          {tab === "account" && (
            <div id="account" className="h-100">
              <div id="account-profile">
                <img
                  id="acc-img-placeholder"
                  src={accPlaceholder}
                  alt="avatar"
                />
                <h4 style={{ margin: "0", "margin-bottom": "15px" }}>
                  {defaultAccount?.account_no || "Test Lead #0001"}
                </h4>
                <p
                  style={{ margin: "0", "margin-bottom": "15px", color: "red" }}
                >
                  {t("referralCode")} : {userProfile?.refCode}
                </p>
                <button
                  id="create-account-button"
                  className="btn btn-secondary"
                  onClick={() => setShowAccountModal(true)}
                >
                  Create Account
                </button>
                {userProfile?.accounts?.length > 0 && (
                  <div>
                    <label className="m-4" htmlFor="symbol-input">
                      Select Account
                    </label>
                    <Select
                      id="account-input"
                      options={accounts.map((account) => ({
                        value: account.account_no,
                        label: account.account_no,
                      }))}
                      onChange={handleAccountChange}
                      value={{
                        value: defaultAccount?.account_no,
                        label: defaultAccount?.account_no,
                      }}
                      styles={{
                        container: (provided, state) => ({
                          ...provided,
                          minWidth: 130,
                        }),
                        dropdownIndicator: (provided, state) => ({
                          ...provided,
                          paddingBlock: 0,
                        }),
                        option: (provided, state) => ({
                          ...provided,
                          cursor: "pointer",
                          backgroundColor: state.isSelected
                            ? "var(--main-numbersc)"
                            : "unset",
                          color: state.isSelected
                            ? "black"
                            : "var(--main-input-textc)",
                          "&:hover": {
                            backgroundColor: state.isSelected
                              ? ""
                              : "var(--bs-body-bg)",
                          },
                        }),
                        singleValue: (provided) => ({
                          ...provided,
                          color: "var(--main-input-textc)",
                        }),
                        control: (provided) => ({
                          ...provided,
                          backgroundColor: "inherit",
                          minHeight: 24,
                        }),
                      }}
                      theme={(theme) => {
                        return {
                          ...theme,
                          colors: {
                            ...theme.colors,
                            primary: "var(--main-input-textc)",
                          },
                        };
                      }}
                      isSearchable={false}
                    />
                    <div className="d-flex align-items-center justify-content-center gap-3 mt-2">
                      <h6>Type: </h6>
                      <h6>{defaultAccount?.account_type}</h6>
                    </div>
                  </div>
                )}
                <div id="acc-profile-main">
                  <div className="acc-profile-main-item">
                    <h6>{t("balance")} (USD):</h6>
                    <h6>{+parseFloat(totalBalance)?.toFixed(2)}</h6>
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
                      {accountDeposits
                        .filter(({ type }) => type === "Deposit")
                        .reduce((p, { sum }) => p + +sum, 0)}
                    </h6>
                  </div>
                  <div className="acc-profile-main-item">
                    <h6>{t("withdrawn")} (USD):</h6>
                    <h6>
                      {accountDeposits
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
                      )?.format("DD/MM/YYYY")}
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
                    data={fillArrayWithEmptyRows(accountDeposits, 5)}
                    customStyles={{
                      table: {
                        style: {
                          minHeight: "50vh",
                        },
                      },
                    }}
                    pagination
                    theme={theme}
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
          theme={theme}
        />
      )}
      {isDelModalOpen && (
        <DelOrderModal
          show={isDelModalOpen}
          onClose={handleCloseModal}
          selectedOrder={selectedOrder}
          symbols={dbSymbols}
          userProfile={userProfile}
          defaultAccount={defaultAccount}
        />
      )}
      {showCancelOrderModal && (
        <CancelOrderModal
          selectedOrder={selectedOrder}
          setShow={setShowCancelOrderModal}
          userProfile={userProfile}
          defaultAccount={defaultAccount}
        />
      )}
      {isReportModalOpen && (
        <ReportModal
          onClose={handleCloseReportModal}
          userId={currentUserId}
          theme={theme}
          balance={totalBalance}
          bonus={bonus}
          bonusSpent={bonusSpent}
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
      {showAccountModal && (
        <AccountModal
          onClose={() => setShowAccountModal(false)}
          currentUserId={currentUserId}
          userProfile={userProfile}
        />
      )}
    </>
  );
}
