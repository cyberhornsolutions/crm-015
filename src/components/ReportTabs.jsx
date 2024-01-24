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
import moment from "moment";
import { useSelector } from "react-redux";
import { getDepositsByUser } from "../helper/firebaseHelpers";
import {
  convertTimestamptToDate,
  fillArrayWithEmptyRows,
} from "../helper/helpers";

function ReportTabs({ userId, onClose }) {
  const orders = useSelector((state) =>
    state.orders.filter(({ status }) => status != "Pending")
  );
  const [key, setKey] = useState("tradeOperations");
  const [deposits, setDeposits] = useState([]);
  const [showRecord, setShowRecord] = useState("all");

  const customStyle = {
    table: { style: { height: "70vh", backgroundColor: "#2f323d" } },
  };

  useEffect(() => {
    return getDepositsByUser(userId, setDeposits);
  }, []);
  const today = moment();

  let filteredOrders;
  if (showRecord == "all") {
    filteredOrders = orders;
  } else if (showRecord === "today") {
    const todayStart = today.startOf("day"); // Start of today
    const dataCreatedToday = orders.filter((order) => {
      return moment(order.createdAt).isSame(todayStart, "day");
    });
    filteredOrders = dataCreatedToday;
  } else if (showRecord === "lastWeek") {
    const sevenDaysAgo = today.subtract(7, "days");
    const dataCreatedToday = orders.filter((order) => {
      return moment(order.createdAt).isSameOrAfter(sevenDaysAgo);
    });
    filteredOrders = dataCreatedToday;
  } else if (showRecord === "lastMonth") {
    const lastMonth = today.subtract(30, "days");
    const dataCreatedToday = orders.filter((order) => {
      return moment(order.createdAt).isSameOrAfter(lastMonth);
    });
    filteredOrders = dataCreatedToday;
  } else if (showRecord === "last3Month") {
    const last90Days = today.subtract(90, "days");
    const dataCreatedToday = orders.filter((order) => {
      return moment(order.createdAt).isSameOrAfter(last90Days);
    });
    filteredOrders = dataCreatedToday;
  }

  let filteredDeposits;
  if (showRecord == "all") {
    filteredDeposits = deposits;
  } else if (showRecord === "today") {
    const todayStart = today.startOf("day"); // Start of today
    const dataCreatedToday = deposits.filter((dep) => {
      return convertTimestamptToDate(dep.createdAt).isSame(todayStart, "day");
    });
    filteredDeposits = dataCreatedToday;
  } else if (showRecord === "lastWeek") {
    const sevenDaysAgo = moment().subtract(7, "days");
    const dataCreatedToday = deposits.filter((dep) => {
      return convertTimestamptToDate(dep.createdAt).isSameOrAfter(sevenDaysAgo);
    });
    filteredDeposits = dataCreatedToday;
  } else if (showRecord === "lastMonth") {
    const lastMonth = moment().subtract(30, "days");
    const dataCreatedToday = deposits.filter((dep) => {
      return convertTimestamptToDate(dep.createdAt).isSameOrAfter(lastMonth);
    });
    filteredDeposits = dataCreatedToday;
  } else if (showRecord === "last3Month") {
    const last90Days = moment().subtract(90, "days");
    const dataCreatedToday = deposits.filter((dep) => {
      return convertTimestamptToDate(dep.createdAt).isSameOrAfter(last90Days);
    });
    filteredDeposits = dataCreatedToday;
  }

  const closedOrders = filteredOrders.filter(
    (order) => order.status != "Pending"
  );

  return (
    <Tabs
      id="controlled-tab-example"
      activeKey={key}
      onSelect={(k) => setKey(k)}
      className="mb-3"
    >
      <Tab
        eventKey="tradeOperations"
        title="Trade operations"
        className="reportTab"
      >
        <DataTable
          columns={generalColumns}
          data={fillArrayWithEmptyRows(filteredOrders, 5)}
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
            <button className="greenBtn" onClick={() => setShowRecord("all")}>
              show
            </button>
            <button className=" greyBtn px-4 " onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </Tab>
      <Tab eventKey="balanceOperations" title="Balance operations">
        <DataTable
          columns={depositColumns}
          data={fillArrayWithEmptyRows(filteredDeposits, 5)}
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
            <button className=" greenBtn" onClick={() => setShowRecord("all")}>
              Show
            </button>
            <button className=" greyBtn px-4 " onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </Tab>
    </Tabs>
  );
}

export default ReportTabs;
