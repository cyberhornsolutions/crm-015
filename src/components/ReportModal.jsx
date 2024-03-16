// Example: EditModal.js
import { useEffect, useState, useCallback } from "react";
import { Modal } from "react-bootstrap";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import DataTable from "react-data-table-component";
import { generalColumns } from "../helper/Tablecolumns";
import depositsColumns from "./columns/depositsColumns";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { getDepositsByUser } from "../helper/firebaseHelpers";
import { fillArrayWithEmptyRows } from "../helper/helpers";
import { setDepositsState } from "../redux/slicer/transactionSlicer";

const ReportModal = ({
  onClose,
  userId,
  theme,
  balance,
  bonus,
  bonusSpent,
}) => {
  const dispatch = useDispatch();
  const orders = useSelector((state) =>
    state.orders.filter(({ status }) => status != "Pending")
  );
  const deposits = useSelector((state) => state.deposits);
  const [key, setKey] = useState("tradeOperations");
  const [showRecord, setShowRecord] = useState("all");

  const totalProfit = orders.reduce((p, v) => p + +v.profit, 0);

  const customStyle = {
    table: { style: { height: "70vh", backgroundColor: "#2f323d" } },
  };

  const setDeposits = useCallback((data) => {
    dispatch(setDepositsState(data));
  }, []);

  useEffect(() => {
    if (!deposits.length) getDepositsByUser(userId, setDeposits);
  }, []);

  let deposited = 0,
    withdrawn = 0;
  deposits.forEach(({ type, sum }) => {
    if (type === "Deposit") deposited += sum;
    else if (type === "Withdraw") withdrawn += sum;
  });
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
      return moment(dep.createdAt).isSame(todayStart, "day");
    });
    filteredDeposits = dataCreatedToday;
  } else if (showRecord === "lastWeek") {
    const sevenDaysAgo = moment().subtract(7, "days");
    const dataCreatedToday = deposits.filter((dep) => {
      return moment(dep.createdAt).isSameOrAfter(sevenDaysAgo);
    });
    filteredDeposits = dataCreatedToday;
  } else if (showRecord === "lastMonth") {
    const lastMonth = moment().subtract(30, "days");
    const dataCreatedToday = deposits.filter((dep) => {
      return moment(dep.createdAt).isSameOrAfter(lastMonth);
    });
    filteredDeposits = dataCreatedToday;
  } else if (showRecord === "last3Month") {
    const last90Days = moment().subtract(90, "days");
    const dataCreatedToday = deposits.filter((dep) => {
      return moment(dep.createdAt).isSameOrAfter(last90Days);
    });
    filteredDeposits = dataCreatedToday;
  }

  return (
    <>
      <Modal
        size="lg"
        fullscreen={true}
        show
        onHide={onClose}
        className="reports-modal"
        centered
      >
        <Modal.Header closeButton>
          <h5 className="mb-0 text-center w-100">Reports</h5>
        </Modal.Header>
        <Modal.Body className="">
          <Tabs activeKey={key} onSelect={(k) => setKey(k)}>
            <Tab eventKey="tradeOperations" title="Trade operations">
              <DataTable
                columns={generalColumns}
                data={fillArrayWithEmptyRows(filteredOrders, 5)}
                customStyles={customStyle}
                pagination
                theme={theme}
                paginationRowsPerPageOptions={[5, 10, 15, 20, 50]}
                defaultSortFieldId="close-date"
                defaultSortAsc={false}
              />
            </Tab>
            <Tab eventKey="balanceOperations" title="Balance operations">
              <DataTable
                columns={depositsColumns}
                data={fillArrayWithEmptyRows(filteredDeposits, 5)}
                customStyles={customStyle}
                pagination
                theme={theme}
                paginationRowsPerPageOptions={[5, 10, 15, 20, 50]}
              />
            </Tab>
          </Tabs>
          <div className="d-flex align-items-center justify-content-between mt-2">
            <div>
              <span className="me-2">Period</span>
              <select
                // style={{ backgroundColor: "rgba(80,80,80,255)" }}
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
            <span>Balance: {+parseFloat(balance)?.toFixed(2)}</span>
            <span>Bonus: {+parseFloat(bonus)?.toFixed(2)}</span>
            <span>Total profit: {+parseFloat(totalProfit)?.toFixed(2)}</span>
            <span>Bonus spent: {+bonusSpent?.toFixed(2)}</span>
            <span>Deposited: {deposited}</span>
            <span>Withdrawn: {withdrawn}</span>
            <span>Total deals: {orders.length}</span>
            <button
              className={`btn px-4 py-1 rounded border-0 ${
                theme === "dark" ? "btn-dark" : "btn-light"
              }`}
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ReportModal;
