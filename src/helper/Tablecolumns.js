import moment from "moment/moment";

const newDate = (date) => {
  const jsDate = new Date(date.seconds * 1000 + date.nanoseconds / 1000000);
  return moment(jsDate).format("MM/DD/YYYY hh:mm:ss A");
};
//Reports table columns
export const generalColumns = [
  { name: "Number", selector: (row) => row.id },
  {
    name: "Open date",
    selector: (row) =>
      row.createdTime
        ? moment(row.createdTime?.toDate()).format("MM/DD/YYYY hh:mm:ss A")
        : "",
    width: "200px",
  },
  { name: "Type", selector: (row) => row.type },
  { name: "Symbol", selector: (row) => row.symbol },
  { name: "Volume", selector: (row) => row.volume },
  {
    name: "Close date",
    selector: (row) =>
      row.closedDate
        ? moment(row?.closedDate).format("MM/DD/YYYY hh:mm:ss A")
        : "",
    width: "200px",
  },
  { name: "Open price", selector: (row) => row?.symbolValue },
  { name: "Close price", selector: (row) => row?.closedPrice },
  { name: "TP", selector: (row) => row.tp },
  { name: "SL", selector: (row) => row.sl },
  { name: "Swap", selector: (row) => <p></p> },
  { name: "profit", selector: (row) => row.profit },
  { name: "Comment", selector: (row) => <p></p> },
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
    selector: (row) => newDate(row.createdAt),

    // ? moment(row.createdAt).format("MM/DD/YYYY hh:mm:ss A")
    // : "",
  },
  { name: "Sum", selector: (row) => row.amount },
  { name: "Comment", selector: (row) => row.comment },
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
