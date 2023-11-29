//Reports table columns
export const generalColumns = [
  { name: "Number", selector: (row) => row.no },
  { name: "Open date" },
  { name: "Type" },
  { name: "Symbol" },
  { name: "Volume" },
  { name: "Close date" },
  { name: "Open price" },
  { name: "Close price" },
  { name: "TP" },
  { name: "SL" },
  { name: "Swap" },
  { name: "profit" },
  { name: "Comment" },
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
  { name: "Date", selector: (row) => row.no },
  { name: "Sum" },
  { name: "Comment" },
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
