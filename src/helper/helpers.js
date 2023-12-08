export const calculateProfit = (type, currentPrice, symbolPrice, volume) => {
  // console.log(9090, type, currentPrice, symbolPrice, volume);
  let pnl = 0;
  if (type === "Sell") {
    pnl = parseFloat(symbolPrice) - parseFloat(currentPrice);
  } else if (type === "Buy") {
    pnl = parseFloat(currentPrice) - parseFloat(symbolPrice);
  }
  console.log(pnl, 9090);
  return pnl * parseFloat(volume);
};

export const newFormulaForProfit = (
  sl,
  tp,
  type,
  currentPrice,
  symbolValue,
  volume
) => {
  let pnl = 0;
  console.log("symbol Price", currentPrice);
  if (type === "Buy") {
    /// profit

    if (parseFloat(tp) <= currentPrice) {
      console.log(
        "takeProfit buy is",
        parseFloat(tp),
        "Current price is:",
        currentPrice
      );
      console.log("Profit triggered buy", symbolValue);
      pnl = (parseFloat(tp) - symbolValue) * 1 * volume;
    }
    // loss
    else if (parseFloat(sl) >= currentPrice) {
      console.log(
        "stoploss buy is",
        parseFloat(sl),
        "Current price is:",
        currentPrice
      );
      console.log("loss triggered buy", symbolValue);
      pnl = (parseFloat(sl) - symbolValue) * 1 * volume;
    }
    // log("XXXXXXXXXXXX in buy", symbolExists);
  } else if (type === "Sell") {
    /// profit
    if (currentPrice >= parseFloat(tp)) {
      console.log(
        "takeProfit sell is",
        parseFloat(tp),
        "Current price is:",
        currentPrice
      );
      console.log("profit triggered sell", symbolValue);
      pnl = (symbolValue - parseFloat(tp)) * 1 * volume;
    } // loss
    else if (currentPrice <= parseFloat(sl)) {
      console.log(
        "stoploss is",
        parseFloat(sl),
        "Current price is:",
        currentPrice
      );
      console.log("loss triggered sell", symbolValue);
      pnl = (symbolValue - parseFloat(sl)) * 1 * volume;
    }
    // log("XXXXXXXXXXXX in sell", symbolExists);
  }
  console.log(pnl, 9090);
  return pnl;
};
