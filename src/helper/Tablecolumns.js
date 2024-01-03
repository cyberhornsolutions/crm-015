import CurrentProfit from "../components/CurrentProfit";
import { convertTimestamptToDate } from "./helpers";

//Reports table columns
export const generalColumns = [
  { name: "Number", selector: (row) => row.id },
  {
    name: "Open date",
    selector: (row) => row && convertTimestamptToDate(row.createdTime),
    grow: 1.5,
  },
  { name: "Type", selector: (row) => row.type },
  { name: "Symbol", selector: (row) => row.symbol },
  { name: "Volume", selector: (row) => row.volume },
  {
    name: "Close date",
    selector: (row) =>
      row.closedDate && convertTimestamptToDate(row?.closedDate),
    grow: 1.5,
  },
  { name: "Open price", selector: (row) => row && +row?.symbolValue },
  { name: "Close price", selector: (row) => row?.closedPrice },
  { name: "TP", selector: (row) => row.tp },
  { name: "SL", selector: (row) => row.sl },
  { name: "Swap", selector: (row) => <p></p> },
  {
    name: "Profit",
    selector: (row) => (row ? <CurrentProfit orderData={row} /> : ""),
  },
  {
    name: "Status",
    selector: (row) => (
      <div
        className={`order-column ${
          row.status == "Success"
            ? "greenText"
            : row.status == "Closed"
            ? "redText"
            : "orangeText"
        } `}
      >
        {row.status}
      </div>
    ),
  },
];

export const tradOptColumns = [
  { name: "Number", selector: (row) => row.no },
  { name: "Symbol" },
  { name: "Type" },
  { name: "Volume" },
  { name: "Open date" },
  { name: "Close date" },
  { name: "Open price" },
  { name: "Close price" },
  { name: "TP" },
  { name: "SL" },
  { name: "Swap" },
  { name: "profit" },
  { name: "Balance" },
  { name: "Type of closure", width: "150px" },
];

export const depositColumns = [
  {
    name: "Date",
    selector: (row) => row && convertTimestamptToDate(row.createdAt),
  },
  { name: "Sum", selector: (row) => row.sum },
  { name: "Type", selector: (row) => row.type },
];

export const executedOrderColumns = [
  { name: "Number", selector: (row) => row.no },
  { name: "Symbol" },
  { name: "Type" },
  { name: "Volume" },
  { name: "Open date" },
  { name: "Close date" },
  { name: "Price" },
  { name: "Take profit" },
  { name: "Stop loss" },
  { name: "Type of closure", width: "150px" },
];
