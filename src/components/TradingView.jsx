import React, { useEffect, useState } from "react";

export default function TradingView({
  locale,
  hide,
  index,
  selectedSymbol,
  theme,
}) {
  const [symbol, setSymbol] = useState(selectedSymbol);

  useEffect(() => {
    if (
      document.getElementById(`tradingview_${index}`) &&
      "TradingView" in window
    ) {
      new window.TradingView.widget({
        autosize: true,
        // enable_publishing: false,
        // hide_top_toolbar: true,
        symbol: symbol || "Gold",
        interval: "1",
        // range: "1D",
        timezone: "Etc/UTC",
        theme,
        style: "1",
        locale: locale,
        enable_publishing: false,
        withdateranges: false,
        hide_side_toolbar: false,
        hide_volume: true,
        allow_symbol_change: false,
        details: false,
        calendar: false,
        container_id: `tradingview_${index}`,
      });
    }
  }, [theme]);

  return (
    <div
      id={`tradingview_${index}`}
      className="tradingview-widget-container"
      style={{ display: hide ? "none" : "block", height: "calc(100% - 32px)" }}
    ></div>
  );
}
