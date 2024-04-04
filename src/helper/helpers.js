import moment from "moment";

export const calculateProfit = (type, currentPrice, symbolPrice, volume) => {
  let pnl = 0;
  if (type === "Sell") {
    pnl = parseFloat(symbolPrice) - parseFloat(currentPrice);
  } else if (type === "Buy") {
    pnl = parseFloat(currentPrice) - parseFloat(symbolPrice);
  }
  return pnl * parseFloat(volume);
};

export const convertTimestamptToDate = (date) => {
  if (!date) return;
  const jsDate = new Date(date.seconds * 1000 + date.nanoseconds / 1000000);
  return moment(jsDate).format("DD/MM/YYYY hh:mm:ss A");
};

export const fillArrayWithEmptyRows = (arr, size) =>
  arr?.concat(arr.length < size ? new Array(size - arr.length).fill("") : []);

export const getBidValue = (val, bid, isDirectPrice = false) =>
  !isDirectPrice ? val * (1 - bid / 100) : val - bid;

export const getAskValue = (val, ask, isDirectPrice = false) =>
  !isDirectPrice
    ? val * (1 + parseFloat(ask) / 100)
    : parseFloat(val) + parseFloat(ask);

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
  return pnl;
};

export const timezoneList = [
  "UTC",
  "Africa/Cairo",
  "Africa/Casablanca",
  "Africa/Johannesburg",
  "Africa/Lagos",
  "America/Anchorage",
  "America/Argentina/Buenos_Aires",
  "America/Bogota",
  "America/Caracas",
  "America/Chicago",
  "America/El_Salvador",
  "America/Juneau",
  "America/Lima",
  "America/Los_Angeles",
  "America/Mexico_City",
  "America/New_York",
  "America/Phoenix",
  "America/Santiago",
  "America/Sao_Paulo",
  "America/Toronto",
  "America/Vancouver",
  "Asia/Almaty",
  "Asia/Ashkhabad",
  "Asia/Bahrain",
  "Asia/Bangkok",
  "Asia/Chongqing",
  "Asia/Colombo",
  "Asia/Dhaka",
  "Asia/Dubai",
  "Asia/Ho_Chi_Minh",
  "Asia/Hong_Kong",
  "Asia/Jakarta",
  "Asia/Jerusalem",
  "Asia/Karachi",
  "Asia/Kathmandu",
  "Asia/Kolkata",
  "Asia/Kuwait",
  "Asia/Manila",
  "Asia/Muscat",
  "Asia/Nicosia",
  "Asia/Qatar",
  "Asia/Riyadh",
  "Asia/Yangon",
  "Asia/Seoul",
  "Asia/Shanghai",
  "Asia/Singapore",
  "Asia/Taipei",
  "Asia/Tehran",
  "Asia/Tokyo",
  "Atlantic/Reykjavik",
  "Australia/Adelaide",
  "Australia/Brisbane",
  "Australia/Perth",
  "Australia/Sydney",
  "Europe/Athens",
  "Europe/Belgrade",
  "Europe/Berlin",
  "Europe/Bratislava",
  "Europe/Brussels",
  "Europe/Bucharest",
  "Europe/Budapest",
  "Europe/Copenhagen",
  "Europe/Helsinki",
  "Europe/Istanbul",
  "Europe/London",
  "Europe/Luxembourg",
  "Europe/Madrid",
  "Europe/Moscow",
  "Europe/Oslo",
  "Europe/Paris",
  "Europe/Prague",
  "Europe/Riga",
  "Europe/Rome",
  "Europe/Stockholm",
  "Europe/Tallinn",
  "Europe/Vienna",
  "Europe/Vilnius",
  "Europe/Warsaw",
  "Europe/Zurich",
  "Pacific/Auckland",
  "Pacific/Chatham",
  "Pacific/Fakaofo",
  "Pacific/Honolulu",
  "Pacific/Norfolk",
  "US/Mountain",
];
