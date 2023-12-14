import { useEffect, useState } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import DataTable from "react-data-table-component";
import {
  depositColumns,
  executedOrderColumns,
  generalColumns,
  tradOptColumns,
} from "../helper/Tablecolumns";
import {
  collection,
  where,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase";
import moment from "moment";
function ReportTabs({ orders, userId, onClose }) {
  const [key, setKey] = useState("generalReport");
  const [deposits, setDeposits] = useState([]);
  const [filterDeposits, setFilterDeposits] = useState([]);
  const [showRecord, setShowRecord] = useState("all");
  const [userOrders, setUserOrders] = useState(orders);
  console.log(7070, userId);
  const getDeposits = async (userId) => {
    try {
      const depositsRef = collection(db, "deposits");
      const userDepositsQuery = query(
        depositsRef,
        orderBy("createdAt", "desc"),
        where("userId", "==", userId)
      );

      const unsubscribe = onSnapshot(
        userDepositsQuery,
        (snapshot) => {
          const depositsData = [];
          snapshot.forEach((doc) => {
            depositsData.push({ id: doc.id, ...doc.data() });
          });
          console.log(depositsData, 7070);
          setDeposits(depositsData);
          setFilterDeposits(depositsData);
        },
        (error) => {
          console.error("Error fetching data:", error);
        }
      );

      // Optionally returning unsubscribe function for cleanup if needed
      return unsubscribe;
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const general = [{ no: 1 }];
  const customStyle = {
    table: { style: { height: "70vh", backgroundColor: "#2f323d" } },
  };
  const newDate = (date) => {
    const jsDate = new Date(date.seconds * 1000 + date.nanoseconds / 1000000);
    return moment(jsDate).format("MM/DD/YYYY hh:mm:ss A");
  };
  console.log(showRecord, 9080);
  useEffect(() => {
    getDeposits(userId);
  }, []);
  const today = moment();

  const filterOrdersData = () => {
    if (showRecord == "all") {
      setUserOrders(orders);
    } else if (showRecord === "today") {
      const todayStart = today.startOf("day"); // Start of today
      const dataCreatedToday = orders.filter((order) => {
        return moment(newDate(order.createdTime)).isSame(todayStart, "day");
      });
      setUserOrders(dataCreatedToday);
    } else if (showRecord === "lastWeek") {
      const sevenDaysAgo = moment().subtract(7, "days");
      const dataCreatedToday = orders.filter((order) => {
        return moment(newDate(order.createdTime)).isSameOrAfter(sevenDaysAgo);
      });
      setUserOrders(dataCreatedToday);
    } else if (showRecord === "lastMonth") {
      const lastMonth = moment().subtract(30, "days");
      const dataCreatedToday = orders.filter((order) => {
        return moment(newDate(order.createdTime)).isSameOrAfter(lastMonth);
      });
      console.log(dataCreatedToday, 9080, "moment");
      setUserOrders(dataCreatedToday);
    } else if (showRecord === "last3Month") {
      const last90Days = moment().subtract(90, "days");
      const dataCreatedToday = orders.filter((order) => {
        return moment(newDate(order.createdTime)).isSameOrAfter(last90Days);
      });
      setUserOrders(dataCreatedToday);
    }
  };

  const filterDepositsData = () => {
    if (showRecord == "all") {
      getDeposits();
    } else if (showRecord === "today") {
      const todayStart = today.startOf("day"); // Start of today
      const dataCreatedToday = deposits.filter((dep) => {
        return moment(newDate(dep.createdAt)).isSame(todayStart, "day");
      });
      setFilterDeposits(dataCreatedToday);
    } else if (showRecord === "lastWeek") {
      const sevenDaysAgo = moment().subtract(7, "days");
      const dataCreatedToday = deposits.filter((dep) => {
        return moment(newDate(dep.createdAt)).isSameOrAfter(sevenDaysAgo);
      });
      setFilterDeposits(dataCreatedToday);
    } else if (showRecord === "lastMonth") {
      const lastMonth = moment().subtract(30, "days");
      const dataCreatedToday = deposits.filter((dep) => {
        return moment(newDate(dep.createdAt)).isSameOrAfter(lastMonth);
      });
      console.log(dataCreatedToday, 9080, "moment");
      setFilterDeposits(dataCreatedToday);
    } else if (showRecord === "last3Month") {
      const last90Days = moment().subtract(90, "days");
      const dataCreatedToday = deposits.filter((dep) => {
        return moment(newDate(dep.createdAt)).isSameOrAfter(last90Days);
      });
      setFilterDeposits(dataCreatedToday);
    }
  };

  // useEffect(() => {
  //   filterOrdersData();
  // }, [showRecord]);

  return (
    <Tabs
      id="controlled-tab-example"
      activeKey={key}
      onSelect={(k) => setKey(k)}
      className="mb-3"
    >
      <Tab
        eventKey="generalReport"
        title="General report"
        className="reportTab"
      >
        <DataTable
          columns={generalColumns}
          data={userOrders.filter((el) => el.status != "Pending")}
          customStyles={customStyle}
          pagination
          theme="dark"
          paginationRowsPerPageOptions={[5, 10, 15, 20, 50]}
        />
        <div
          style={{ backgroundColor: "rgba(40,40,40,255)" }}
          className="d-flex justify-content-between align-items-center w-100 mt-2"
        >
          <div className="d-flex  justify-content-center align-items-center gap-2">
            <div>Period</div>
            <div>
              <select
                style={{ backgroundColor: "rgba(80,80,80,255)" }}
                onChange={(e) => {
                  setShowRecord(e.target.value);
                }}
              >
                <option label="All Operations" value="all"></option>
                <option label="Today" value="today"></option>
                <option label="Last Week" value="lastWeek"></option>
                <option label="Last Month" value="lastMonth"></option>
                <option label="Last 3 Month" value="last3Month"></option>
              </select>
            </div>
          </div>
          <div className="d-flex gap-2">
            <button className="greenBtn" onClick={filterOrdersData}>
              show
            </button>
            <button className=" greyBtn px-4 " onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </Tab>
      <Tab eventKey="tradeOperations" title="Trade operations">
        <DataTable
          columns={tradOptColumns}
          data={general}
          customStyles={customStyle}
          pagination
          theme="dark"
          paginationRowsPerPageOptions={[5, 10, 15, 20, 50]}
        />
        <div className="d-flex justify-content-between align-items-center w-100 mt-2">
          <div className="d-flex  justify-content-center align-items-center gap-2">
            <div>Period</div>
            <div>
              <select
                style={{ backgroundColor: "rgba(80,80,80,255)" }}
                onChange={(e) => {
                  setShowRecord(e.target.value);
                }}
              >
                <option label="All Operations" value="all"></option>
                <option label="Today" value="today"></option>
                <option label="Last Week" value="lastWeek"></option>
                <option label="Last Month" value="lastMonth"></option>
                <option label="Last 3 Month" value="last3Month"></option>
              </select>
            </div>
          </div>
          <div className="d-flex gap-2 ">
            <button className="greenBtn">show</button>
            <button className=" greyBtn px-4 " onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </Tab>
      <Tab eventKey="deposit" title="Deposit">
        <DataTable
          columns={depositColumns}
          data={filterDeposits}
          customStyles={customStyle}
          pagination
          theme="dark"
          paginationRowsPerPageOptions={[5, 10, 15, 20, 50]}
        />
        <div className="d-flex justify-content-between align-items-center w-100 mt-2">
          <div className="d-flex  justify-content-center align-items-center gap-2">
            <div>Period</div>
            <div>
              <select
                style={{ backgroundColor: "rgba(80,80,80,255)" }}
                onChange={(e) => {
                  setShowRecord(e.target.value);
                }}
              >
                <option label="All Operations" value="all"></option>
                <option label="Today" value="today"></option>
                <option label="Last Week" value="lastWeek"></option>
                <option label="Last Month" value="lastMonth"></option>
                <option label="Last 3 Month" value="last3Month"></option>
              </select>
            </div>
          </div>
          <div className="d-flex gap-2">
            <button className=" greenBtn" onClick={filterDepositsData}>
              show
            </button>
            <button className=" greyBtn px-4 " onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </Tab>
      <Tab eventKey="executedOrders" title="Executed orders">
        <DataTable
          columns={executedOrderColumns}
          data={general}
          customStyles={customStyle}
          pagination
          theme="dark"
          paginationRowsPerPageOptions={[5, 10, 15, 20, 50]}
        />
        <div className="d-flex justify-content-between align-items-center w-100 mt-2">
          <div className="d-flex  justify-content-center align-items-center gap-2">
            <div>Period</div>
            <div>
              <select
                style={{ backgroundColor: "rgba(80,80,80,255)" }}
                onChange={(e) => {
                  setShowRecord(e.target.value);
                }}
              >
                <option label="All Operations" value="all"></option>
                <option label="Today" value="today"></option>
                <option label="Last Week" value="lastWeek"></option>
                <option label="Last Month" value="lastMonth"></option>
                <option label="Last 3 Month" value="last3Month"></option>
              </select>
            </div>
          </div>
          <div className="d-flex gap-2">
            <button className="greenBtn">show</button>
            <button className=" greyBtn px-4 " onClick={onClose}>
              Close
            </button>
          </div>
        </div>{" "}
      </Tab>
    </Tabs>
  );
}

export default ReportTabs;
