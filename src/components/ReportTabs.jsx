import { useState } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import DataTable from "react-data-table-component";
import {
  depositColumns,
  executedOrderColumns,
  generalColumns,
  tradOptColumns,
} from "../helper/Tablecolumns";
function ReportTabs() {
  const [key, setKey] = useState("generalReport");

  const general = [{ no: 1 }];

  return (
    <Tabs
      id="controlled-tab-example"
      activeKey={key}
      onSelect={(k) => setKey(k)}
      className="mb-3"
    >
      <Tab eventKey="generalReport" title="General report">
        <DataTable columns={generalColumns} data={general} />
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
        <DataTable columns={tradOptColumns} data={general} />
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
        <DataTable columns={depositColumns} data={general} />
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
        <DataTable columns={executedOrderColumns} data={general} />
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
