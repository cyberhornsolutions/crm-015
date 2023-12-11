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
function ReportTabs({ orders, userId }) {
  const [key, setKey] = useState("generalReport");
  const [deposits, setDeposits] = useState([]);
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
        },
        (error) => {
          console.error("Error fetching data:", error);
        }
      );

      // Optionally returning unsubscribe function for cleanup if needed
      // return unsubscribe;
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const general = [{ no: 1 }];
  const customStyle = {
    table: { style: { height: "70vh", backgroundColor: "#2f323d" } },
  };

  useEffect(() => {
    getDeposits(userId);
  }, [userId]);
  const dep = getDeposits(userId);
  console.log(7070, dep);
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
          data={orders}
          customStyles={customStyle}
          pagination
          theme="dark"
        />
        <div
          style={{ backgroundColor: "rgba(40,40,40,255)" }}
          className="d-flex justify-content-between align-items-center w-100 mt-2"
        >
          <div className="d-flex  justify-content-center align-items-center gap-2">
            <div>Period</div>
            <div>
              <select style={{ backgroundColor: "rgba(80,80,80,255)" }}>
                <option>All Operations</option>
                <option>Today</option>
                <option>Last Week</option>
                <option>Last Month</option>
                <option>Last 3 Month</option>
              </select>
            </div>
          </div>
          <div className="d-flex gap-2">
            <button className="greenBtn">show</button>
            <button className=" greyBtn px-4 ">Close</button>
          </div>
        </div>
      </Tab>
      <Tab eventKey="tradeOperations" title="Trade operations">
        <DataTable
          columns={tradOptColumns}
          data={general}
          customStyles={customStyle}
        />
        <div className="d-flex justify-content-between align-items-center w-100 mt-2">
          <div className="d-flex  justify-content-center align-items-center gap-2">
            <div>Period</div>
            <div>
              <select>
                <option>All Operations</option>
                <option>Today</option>
                <option>Last Week</option>
                <option>Last Month</option>
                <option>Last 3 Month</option>
              </select>
            </div>
          </div>
          <div className="d-flex gap-2 ">
            <button className="greenBtn">show</button>
            <button className=" greyBtn px-4 ">Close</button>
          </div>
        </div>
      </Tab>
      <Tab eventKey="deposit" title="Deposit">
        <DataTable
          columns={depositColumns}
          data={deposits}
          customStyles={customStyle}
        />
        <div className="d-flex justify-content-between align-items-center w-100 mt-2">
          <div className="d-flex  justify-content-center align-items-center gap-2">
            <div>Period</div>
            <div>
              <select>
                <option>All Operations</option>
                <option>Today</option>
                <option>Last Week</option>
                <option>Last Month</option>
                <option>Last 3 Month</option>
              </select>
            </div>
          </div>
          <div className="d-flex gap-2">
            <button className=" greenBtn">show</button>
            <button className=" greyBtn px-4 ">Close</button>
          </div>
        </div>
      </Tab>
      <Tab eventKey="executedOrders" title="Executed orders">
        <DataTable
          columns={executedOrderColumns}
          data={general}
          customStyles={customStyle}
        />
        <div className="d-flex justify-content-between align-items-center w-100 mt-2">
          <div className="d-flex  justify-content-center align-items-center gap-2">
            <div>Period</div>
            <div>
              <select>
                <option>All Operations</option>
                <option>Today</option>
                <option>Last Week</option>
                <option>Last Month</option>
                <option>Last 3 Month</option>
              </select>
            </div>
          </div>
          <div className="d-flex gap-2">
            <button className="greenBtn">show</button>
            <button className=" greyBtn px-4 ">Close</button>
          </div>
        </div>{" "}
      </Tab>
    </Tabs>
  );
}

export default ReportTabs;
