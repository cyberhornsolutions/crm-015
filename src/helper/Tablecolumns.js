import { convertTimestamptToDate } from "./helpers";

//Reports table columns
export const generalColumns = [
  { name: "ID", selector: (row) => row.id },
  {
    name: "Open date",
    selector: (row) => row.createdTime && row.createdTime,
    grow: 1.5,
  },
  { name: "Type", selector: (row) => row.type },
  { name: "Symbol", selector: (row) => row.symbol },
  { name: "Volume", selector: (row) => row.volume },
  {
    id: "close-date",
    name: "Close date",
    selector: (row) =>
      row.closedDate && convertTimestamptToDate(row?.closedDate),
    grow: 1.5,
  },
  { name: "Open price", selector: (row) => row && +row?.symbolValue },
  { name: "Close price", selector: (row) => row?.closedPrice },
  { name: "TP", selector: (row) => row.tp },
  { name: "SL", selector: (row) => row.sl },
  {
    name: "Spread",
    selector: (row) => row && +parseFloat(row.spread)?.toFixed(6),
  },
  {
    name: "Swap",
    selector: (row) => row && +parseFloat(row.swap)?.toFixed(4),
  },
  { name: "Fee", selector: (row) => row.fee },
  {
    name: "Profit",
    selector: (row) =>
      row && (
        <div
          className={
            row.profit < 0
              ? "text-danger"
              : row.profit > 0
              ? "text-success"
              : ""
          }
        >
          {row.profit}
        </div>
      ),
  },
  { name: "Balance", selector: (row) => row.balance },
  {
    name: "Status",
    selector: (row) => (
      <div
        className={`order-column ${
          row.status == "Success"
            ? "text-success"
            : row.status == "Closed"
            ? "text-danger"
            : "text-warning"
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
